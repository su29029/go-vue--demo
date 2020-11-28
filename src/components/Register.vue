<template>
    <div id="content">
        <img id="logo" src="../assets/logo.png" />
        <p id="title">注册</p>
        <div class="input">
            <input type="text" id="username" @keyup.enter="register" class="input-text" v-model="username" required>
            <label class="label label1">
                <span>用户名</span>
            </label>
        </div>
        <div class="input">
            <input type="password" id="password" @keyup.enter="register" class="input-text" v-model="password" required>
            <label class="label label2">
                <span>密码</span>
            </label>
        </div>
        <div class="input">
            <input type="password" id="re-password" @keyup.enter="register" class="input-text" v-model="rePassword" required>
            <label class="label label3">
                <span>确认密码</span>
            </label>
        </div>
        <p :style="msgStyle" class="msg">{{message}}</p>
        <button id="submit" @click="register">注册</button>
        <span id="login" @click="goLogin">使用已有账号登录</span>
    </div>
</template>

<script>
export default {
    name:"Register",
    data(){
        return{
            username:"",
            password:"",
            rePassword:"",
            message:"",
            msgStyle:{
                fontSize:"16px",
                color:"blue"
            }
        }
    },
    methods:{
        register:function(){
            var that = this;
            that.msgStyle.color = "blue";
            if (that.username == ""){
                that.msgStyle.color = "red";
                that.message = "请输入用户名";
                return;
            }
            if (that.password == ""){
                that.msgStyle.color = "red";
                that.message = "请输入密码";
                return;
            }
            if (that.password != that.rePassword){
                that.msgStyle.color = "red";
                that.message = "两次密码输入不一致";
                return;
            }
            
            that.message = "正在注册...";
            this.$request.post('/register',{params:{"username":that.username,"password":that.password}}).then( ret => {
                if (ret.data.msg === "success"){
                    that.message = "注册成功！即将转到登录界面...";
                    setTimeout(() => {
                        that.$router.push('/login').catch(err => {console.log(err)})
                    },1500); 
                } else if (ret.data.msg === "username is existed"){
                    that.msgStyle.color = "darkgreen";
                    that.message = "用户名已存在";
                } else {
                    console.log(ret.data);
                }
            }).catch(err => {
                console.log(err);
                that.msgStyle.color = "red";
                that.message = "服务器错误，请稍后再试";
            })
        },
        goLogin:function(){
            this.$router.push('/login').catch(err => {console.log(err)});
        }
    }
}
</script>

<style lang="scss" scoped>
    html{
        font-family: Arial, Helvetica, sans-serif;
        font-size: 20px;
    }
    #content{
        position: absolute;
        border: 0.5px solid rgba(0,0,0,0.2);
        border-radius: 4px;
        margin: 0 auto;
        left: 0;
        right: 0;
        top: 18%;
        height: 65%;
        width: 450px;
        display: inline-flex;
        flex-direction: column;
        #logo {
            position: relative;
            margin: 0 auto;
            left: 0;
            right: 0;
            top: 20px;
            height: 15%;
            width: 50%;
        }
        #title {
            position: relative;
            padding-top: 20px;
            font-weight: 500;
            font-size: 24px;
            margin: 0;
        }
        .input {
            position: relative;
            padding-top: 5%;
            #username,#password,#re-password{
                font-size: 18px;
                position: relative;
                padding-top: 20px;
                margin: 0 auto;
                left: 0;
                right: 0;
                height: 25px;
                width: 80%;
                border:none;
                border-bottom: 1.5px solid black;
                outline: none;
            }
            .label span{
                position: absolute;
                color: rgba(0, 0, 0, 0.6);
                bottom: 0px;
                font-size: 18px;
                /* left: 10%; */
                width: max-content;
                transition: all 0.15s ease;
            }
            /* .label3 span{
                width: fit-content;
            } */
            .label1,.label2,.label3{
                position: absolute;
                bottom: 0;
                left: 10%;
                pointer-events: none;
                font-size: 18px;
            }
            .input-text:focus + .label span,
            .input-text:valid + .label span {
                transform: translateY(-150%);
                font-size: 14px;
                color:#3ac0be;
            }
        }
        #submit{
            position: relative;
            width: 20%;
            top: 13%;
            height: 9.2%;
            left: 70%;
            font-size: 16px;
            background-color: rgb(40,122,230);
            border: none;
            border-radius: 4px;
            color: white;
        }
        #submit:hover{
            cursor: pointer;
            box-shadow: 1px inset #5087ff;
            background-color: #2e70ff;
        }
        #submit:active{
            background-color: #0049e7;
        }
        #login{
            position: relative;
            left: 10%;
            top: 6.5%;
            width: fit-content;
            color: rgb(26, 115, 232);
        }
        #login:hover{
            cursor: pointer;
        }
        #login:active{
            background-color: rgb(255, 255, 255);
        }
        /* #register + #submit {
            display: inline-flex;
            flex-direction: row;
        } */
        .msg{
            position: absolute;
            top: 70%;
            margin: 0 auto;
            left: 0;
            right: 0;
        }
    }
    
    
    
    
    
    
    

</style>