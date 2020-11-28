<template>
    <div>
        <Profile id="profile" style="position:absolute;"></Profile>
        <textarea id="some-information" style="resize:none;" v-model="message">
        </textarea>
        <div class="container">
            <div>
                <img id="logo" src="../assets/logo.png" />
                <h1 class="title">
                    制作视频专用连麦页面
                </h1>
                <h2 class="subtitle">
                    来快乐吧~
                </h2>
                <transition 
                appear 
                appear-active-class="custom-appear-active">
                    <div class="links">
                        <Button :disable="Disabled.isStartDisabled" class="start" @click.native="startRecording" :isCursor="Cursor.isStartCursor">
                            开始录音
                        </Button>
                        <Button :disable="Disabled.isPauseDisabled" class="pause" @click.native="pauseRecording" :isCursor="Cursor.isPauseCursor">
                            暂停录音
                        </Button> 
                        <Button :disable="Disabled.isResumeDisabled" class="resume" @click.native="resumeRecording" :isCursor="Cursor.isResumeCursor">
                            继续录音
                        </Button>
                        <Button :disable="Disabled.isStopDisabled" class="stop" @click.native="stopRecording" :isCursor="Cursor.isStopCursor">
                            停止录音
                        </Button>
                        <Button :disable="Disabled.isDownloadDisabled" class="download" @click.native="downloadRecording" :isCursor="Cursor.isDownloadCursor">
                            下载录音
                        </Button>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import Button from './Button'
import Profile from './Profile'
export default {
    name: 'Index',
    components:{
        Button,
        Profile
    },
    data () {
        return {
            Disabled:{
                isStartDisabled:false,
                isPauseDisabled:true,
                isResumeDisabled:true,
                isStopDisabled:true,
                isDownloadDisabled:true
            },
            Cursor:{
                isStartCursor:{
                    cursor:"pointer"
                },
                isPauseCursor:{
                    cursor:"default"
                },
                isResumeCursor:{
                    cursor:"default"
                },
                isStopCursor:{
                    cursor:"default"
                },
                isDownloadCursor:{
                    cursor:"default"
                }
            },
            userID:'',
            message:'',
            isPaused:{ isPaused:0 },
            ws:{},
            record:null,
            host:'wss://su29029.xyz/ws/audio/start/',
        }
    },
    methods:{
        checkLogin:function(){
            if (this.$store.state.user) {
                this.userID = this.$store.state.user;
                return 1;
            }
            this.$request.get('/isLogin').then(ret => {
                if (ret.data.msg == "session on") {
                    this.userID = ret.data.user;
                    
                    return 1;
                }
                else return 0;
            }).catch(err => {console.log("network error:",err,err.data)});
        },
        startRecording:function(){
            this.changeCursorAndDisabled("disall");
            if (this.checkLogin()){
                var that = this;
                this.$request.post('/saveuser',{params:{"username":this.userID}}).then( ret => {
                    if (ret.data.msg === "success"){
                        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
                        if (!navigator.getUserMedia) {
                            alert('浏览器不支持音频输入');
                            this.changeCursorAndDisabled("origin");
                        } else {
                            navigator.getUserMedia(
                                {audio: true},
                                function(mediaStream) {
                                    that.useWebSocket(mediaStream);
                                    that.isPaused.isPaused = 0;
                                },
                                function(error) {
                                    console.log(error);
                                    switch (error.message || error.name) {
                                        case 'PERMISSION_DENIED':
                                        case 'PermissionDeniedError':
                                            console.info('用户拒绝提供信息。');
                                            break;
                                        case 'NOT_SUPPORTED_ERROR':
                                        case 'NotSupportedError':
                                            console.info('浏览器不支持硬件设备。');
                                            break;
                                        case 'MANDATORY_UNSATISFIED_ERROR':
                                        case 'MandatoryUnsatisfiedError':
                                            console.info('无法发现指定的硬件设备。');
                                            break;
                                        default:
                                            console.info('无法打开麦克风。异常信息:' + (error.code || error.name));
                                            break;
                                    }
                                }
                            )
                        }
                    } else {
                        this.message += "服务器错误，请稍后再试\n";
                        this.changeCursorAndDisabled("origin");
                    }
                }).catch(err => {console.log("network error:",err,err.data)});    
            } else {
                alert("请先登录！");
                this.$router.push('/login').catch( err => {console.log(err)});
            }
        },

        pauseRecording:function(){
            if (this.checkLogin()){
                this.isPaused.isPaused = 1;
                this.message += "已暂停\n";
                this.changeCursorAndDisabled("pause");
            } else {
                alert("请先登录！");
                this.$router.push('/login').catch( err => {console.log(err)});
            }
        },

        resumeRecording:function(){
            this.changeCursorAndDisabled("resume");
            if (this.checkLogin()){
                this.isPaused.isPaused = 0;
                this.message += "继续连麦\n";
                this.changeCursorAndDisabled("resume");
            } else {
                alert("请先登录！");
                this.$router.push('/login').catch( err => {console.log(err)});
            }
        },

        stopRecording:function(){
            this.changeCursorAndDisabled("disall");
            if (this.checkLogin()){
                // this.ws.close();
                this.ws.send(JSON.stringify({"cmd":"close","userID":this.userID,"msg":""}))
            } else {
                alert("请先登录！");
                this.$router.push('/login').catch( err => {console.log(err)});
            }
        },

        downloadRecording:function(){
            this.changeCursorAndDisabled("download");
            if (this.checkLogin()){
                // TODO:download the audio.
                return 0;
            } else {
                alert("请先登录！");
                this.$router.push('/login').catch( err => {console.log(err)});
            }
        },
        init:function(rec){
            var that = this;
            that.record = rec;
        },
        useWebSocket:function(mediaStream) {
            var that = this;
            that.ws = new WebSocket(that.host);
            // console.log(that.host);
            this.init(new this.Recorder(that.ws,that.userID,mediaStream,that.isPaused));
            console.log('开始对讲');
            // that.ws.binaryType = 'arraybuffer' // 传输的是 ArrayBuffer 类型的数据
            that.ws.onopen = function() {
                console.log('握手成功')
                that.message += "websocket连接成功\n";
                if (that.ws.readyState === 1) { // ws进入连接状态，则每隔500毫秒发送一包数据
                    that.changeCursorAndDisabled("start");
                    that.ws.send(JSON.stringify({"cmd":"start","userID":that.userID,"msg":""}))
                }
            }
            that.ws.onmessage = function(msg) {
                var data = JSON.parse(msg.data)
                if (data.cmd == "start") {
                    if (data.msg == "OK"){
                        if (data.userID == that.userID){
                            that.message += "开始连麦\n";
                            that.record.start();
                        } else {
                            that.message += data.userID + "已加入连麦\n";
                        }
                    } else if (data.msg == "repeated"){
                        that.message += data.userID + "已连接，请勿重复连接\n";
                    }
                    
                } else if (data.cmd == "close" && data.msg == "stop"){
                    if (data.userID == that.userID) {
                        that.message += "您已退出连麦\n";
                        that.ws.close();
                        that.changeCursorAndDisabled("origin");
                    } else {
                        that.message += data.userID + "已退出连麦\n";
                    }
                } else if (data.cmd == "record") {
                    if (data.userID != that.userID) {
                        // decode the audio.
                        that.decode(data.msg);
                    } else {
                        that.decode(data.msg);
                        // console.log("got it");
                    }
                }
            }

            that.ws.onerror = function(err) {
                err = JSON.parse(err.data)
                that.message += "未知错误\n";
                console.info(err)
            }

            that.ws.onclose = function(msg){
                console.log(msg)
                that.changeCursorAndDisabled("origin");
                that.message += "websocket已关闭\n";
            }
        },
        changeCursorAndDisabled:function(cmd){
            var that = this;
            var changeCmdArr;
            switch (cmd) {
                case "start":
                case "resume":
                    changeCmdArr = [true,false,true,false,true,"default","pointer","default","pointer","default"];
                    break;
                case "pause":
                    changeCmdArr = [false,true,false,false,true,"default","default","pointer","pointer","default"];
                    break;
                case "stop":
                    changeCmdArr = [false,true,true,true,false,"pointer","default","default","default","pointer"];
                    break;
                case "origin":
                    changeCmdArr = [false,true,true,true,true,"pointer","default","default","default","default"];
                    break;
                case "disall":
                    changeCmdArr = [true,true,true,true,true,"default","default","default","default","default"];
                    break;
                default:
                    break;
            }
            that.doCursorAndDisabledChange(changeCmdArr);
        },
        doCursorAndDisabledChange:function(changeCmdArr){
            // true is disabled and false is enabled.
            this.Disabled.isStartDisabled = changeCmdArr[0];
            this.Disabled.isPauseDisabled = changeCmdArr[1];
            this.Disabled.isResumeDisabled = changeCmdArr[2];
            this.Disabled.isStopDisabled = changeCmdArr[3];
            this.Disabled.isDownloadDisabled = changeCmdArr[4];
            this.Cursor.isStartCursor.cursor = changeCmdArr[5];
            this.Cursor.isPauseCursor.cursor = changeCmdArr[6];
            this.Cursor.isResumeCursor.cursor = changeCmdArr[7];
            this.Cursor.isStopCursor.cursor = changeCmdArr[8];
            this.Cursor.isDownloadCursor.cursor = changeCmdArr[9];
        },
        decode:function(data){
            // string->ArrayBuffer
            // new AudioContext
            // decodeAudioData
            // connect and play
            var audioContext = new AudioContext();
            var audioNode = audioContext.createBufferSource();
            var dataArr = data.split(',');
            var tmp = new Int8Array(dataArr.length);
            for (var i = 0; i < dataArr.length; i++){
                tmp[i] = parseInt(dataArr[i]);
            }
            // console.log(tmp);
            audioContext.decodeAudioData(tmp.buffer).then(decoded => {
                audioNode.buffer = decoded;
                audioNode.connect(audioContext.destination);
                audioNode.start(0);
                console.log("got it:",dataArr.length);
            }).catch(err => {err;});
        },
        Recorder:function(ws,userID,stream,isPaused){
            var sampleBits = 16 // 输出采样数位 8, 16
            var sampleRate = 44100 / 6 // 输出采样率
            var context = new AudioContext()
            var audioInput = context.createMediaStreamSource(stream)
            var recorder = context.createScriptProcessor(4096, 1, 1)
            var audioData = {
                size: 0, // 录音文件长度
                buffer: [], // 录音缓存
                inputSampleRate: 44100 / 6, // 输入采样率
                inputSampleBits: 16, // 输入采样数位 8, 16
                outputSampleRate: sampleRate, // 输出采样数位
                oututSampleBits: sampleBits, // 输出采样率
                clear: function() {
                    this.buffer = []
                    this.size = 0
                },
                input: function(data) {
                    this.buffer.push(new Float32Array(data))
                    this.size += data.length
                },
                compress: function() { // 合并压缩
                    // 合并
                    var data = new Float32Array(this.size)
                    var offset = 0
                    for (var i = 0; i < this.buffer.length; i++) {
                        data.set(this.buffer[i], offset)
                        offset += this.buffer[i].length
                    }
                    // // 压缩
                    // var compression = parseInt(this.inputSampleRate / this.outputSampleRate)
                    // var length = data.length / compression
                    // var result = new Float32Array(length)
                    // var index = 0,
                    //     j = 0
                    // while (index < length) {
                    //     result[index] = data[j]
                    //     j += compression
                    //     index++
                    // }
                    return data;
                },
                encodePCM: function() { // 这里不对采集到的数据进行其他格式处理，如有需要均交给服务器端处理。
                    // var sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate)
                    // decodeAudioData => 需要设置文件头数据[相当于每个包都要有文件头数据]
                    var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits)
                    var bytes = this.compress()
                    var dataLength = bytes.length * (sampleBits / 8)
                    var buffer = new ArrayBuffer(44 + dataLength)
                    var data = new DataView(buffer)
                    var channelCount = 1;
                    var offset = 0;
                    var writeString = function(str){
                        for (var i = 0; i < str.length; i++){
                            data.setUint8(offset + i,str.charCodeAt(i));
                        }
                    };
                    
                    writeString('RIFF'); offset += 4;
                    data.setUint32(offset, 36 + dataLength, true); offset += 4;
                    writeString('WAVE'); offset += 4;
                    writeString('fmt '); offset += 4;
                    data.setUint32(offset, 16, true); offset += 4;
                    data.setUint16(offset, 1, true); offset += 2;
                    data.setUint16(offset, channelCount, true); offset += 2;
                    data.setUint32(offset, sampleRate, true); offset += 4;
                    data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true); offset += 4;
                    data.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
                    data.setUint16(offset, sampleBits, true); offset += 2;
                    writeString('data'); offset += 4;
                    data.setUint32(offset, dataLength, true); offset += 4;
                    if (sampleBits === 8) {
                        for (let i = 0; i < bytes.length; i++, offset++) {
                            let s = Math.max(-1, Math.min(1, bytes[i]));
                            let val = s < 0 ? s * 0x8000 : s * 0x7FFF;
                            val = parseInt(255 / (65535 / (val + 32768)));
                            data.setInt8(offset, val, true);
                        }
                    } else {
                        for (let i = 0; i < bytes.length; i++ , offset += 2) {
                            let s = Math.max(-1, Math.min(1, bytes[i]));
                            data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                        }
                    }

                    return new Blob([data])
                }
            }
            var sendData = function() { // 对以获取的数据进行处理(分包)
                var reader = new FileReader()
                reader.onload = e => {
                    var outbuffer = e.target.result
                    var arr = new Int8Array(outbuffer)
                    if (arr.length > 0) {
                        var tmparr = new Int8Array(4096 + 44)
                        var j = 0
                        for (var i = 0; i < arr.byteLength; i++) {
                            tmparr[j++] = arr[i]
                            if (((i + 1) % (4096 + 44)) === 0) { //4096 + 44的tmparr已装满
                                // console.log(tmparr.toString());
                                ws.send(JSON.stringify({"cmd":"record","userID":userID,"msg":tmparr.toString()}))
                                if (arr.byteLength - i - 1 >= (4096 + 44)) {
                                    tmparr = new Int8Array(4096 + 44)
                                } else {
                                    tmparr = new Int8Array(arr.byteLength - i - 1)
                                }
                                j = 0
                            }
                            else if ((i + 1 === arr.byteLength) && ((i + 1) % (4096 + 44)) !== 0) { //4096 + 44的tmparr未装满，但arr内的东西已经空了
                                ws.send(JSON.stringify({"cmd":"record","userID":userID,"msg":tmparr.toString()}))
                            }
                        }
                    }
                }
                reader.readAsArrayBuffer(audioData.encodePCM())
                audioData.clear() // 每次发送完成则清理掉旧数据
            }

            this.start = function() {
                audioInput.connect(recorder)
                recorder.connect(context.destination)
            }

            this.stop = function() {
                recorder.disconnect()
            }

            this.getBlob = function() {
                return audioData.encodePCM()
            }

            this.clear = function() {
                audioData.clear()
            }
            
            recorder.onaudioprocess = function(e) {
                var inputBuffer = e.inputBuffer.getChannelData(0)
                audioData.input(inputBuffer)
                if (ws.readyState == 1 && isPaused.isPaused == 0){
                    sendData()
                }
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
html {
    font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
}

*,
*:before,
*:after {
    box-sizing: border-box;
    margin: 0;
}

#profile {
    top: 0;
}

#some-information {
    position: absolute;
    right: 7%;
    height: 40%;
    width: 17%;
    top: 30%;
    border-color: #346100;
    border-width: 1px;
    border-radius: 3px;
}

.container {
    position: relative;
    margin: 0 auto;
    display: flex;
    top: 80px;
    justify-content: center;
    align-items: center;
    text-align: center;
    #logo {
        width: 40%;
        height: 40%;
    }
    .title {
        font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        display: block;
        font-weight: 300;
        font-size: 50px;
        color: #35495e;
        letter-spacing: 1px;
    }

    .subtitle {
        font-weight: 300;
        font-size: 42px;
        color: #526488;
        word-spacing: 5px;
        padding-bottom: 15px;
    }
    .custom-appear-active {
        opacity: 1;
        animation: button-in 1.2s;
    }
    @keyframes button-in {
        0% {
            opacity: 0;
            padding-top: 80px;
        }
        100% {
            opacity: 1;
            padding-top: 40px;
        }
    }
    .links {
        padding-top: 40px;
    }
}

</style>
