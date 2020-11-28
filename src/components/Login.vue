<template>
    <div id="content">
        <img id="logo" src="../assets/logo.png" />
        <p id="title">登录</p>
        <div class="input">
            <input type="text" id="username" @keyup.enter="login" class="input-text" v-model="username" required>
            <label class="label label1">
                <span>用户名</span>
            </label>
        </div>
        <div class="input">
            <input type="password" id="password" class="input-text" @keyup.enter="login" v-model="password" required>
            <label class="label label2">
                <span>密码</span>
            </label>
        </div>     
        <p :style="msgStyle" class="msg">{{message}}</p>
        <Button id="submit" @click="login">登录</Button>
        <span id="register" @click="goRegister">创建账号</span>
    </div> 
</template>

<script>
import Button from './Button'
export default {
    name:"Login",
    component:{
        Button
    },
    data(){
        return{
            username:"",
            password:"",
            message:"",
            msgStyle:{
                color:"blue",
                fontSize:"16px",
                border:"none"
            }
        }
    },
    methods:{
        login:function(){
            var that = this;
            if (that.username == ""){
                that.msgStyle.color = "red";
                that.message = "请输入用户名";
                return
            }
            if (that.password == ""){
                that.msgStyle.color = "red";
                that.message = "请输入密码";
                return
            }
            that.color = "blue";
            that.message = "正在登录...";
            this.$request.post('/login',{params:{"username":that.username,"password":that.password}}).then( ret => {
                if (ret.data.msg === "success"){
                    that.msgStyle.color = "blue";
                    that.$store.state.user = that.username;
                    that.message = "登录成功！即将跳转...";
                    setTimeout(() => {
                        that.$router.push('./index').catch(err => {console.log(err)});
                    },1500);   
                } else if (ret.data.msg === "username invalid"){
                    that.msgStyle.color = "red";
                    that.message = "用户名不存在！";
                } else if (ret.data.msg === "password wrong"){
                    that.msgStyle.color = "red";
                    that.message = "密码错误！";
                } else if (ret.data.msg === "session on") {
                    that.msgStyle.color = "blue";
                    that.$store.state.user = ret.data.username;
                    that.message = "登录成功！即将跳转...";
                    setTimeout(() => {
                        that.$router.push('./index').catch(err => {console.log(err)});
                    },2500);
                    console.log("[login]ret.data:",ret.data);
                }
            }).catch(err => {
                console.log("[login]err:",err);
                that.msgStyle.color = "red";
                that.message = "服务器错误，请稍后再试。";
            })
        },
        goRegister:function(){
            this.$router.push('/register').catch(err => {console.log(err)});
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
        border: 0.5px solid rgba(0,0,0,0.2);;
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
        }
        .input {
            position: relative;
            padding-top: 5%;
            #username,#password{
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
                width: max-content;
                transition: all 0.15s ease;
            }
            .label1,.label2{
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
            top: 17%;
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
        #register{
            position: relative;
            left: 10%;
            top: 10%;
            width: fit-content;
            color: rgb(26, 115, 232);
        }
        #register:hover{
            cursor: pointer;
        }
        #register:active{
            background-color: rgb(255, 255, 255);
        }
        .msg{
            position: absolute;
            margin: 0 auto;
            left: 0;
            right: 0;
            top: 65%;
        }
    }
</style>