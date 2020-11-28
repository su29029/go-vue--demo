<template>
    <div>
        <p id="user">{{message}}</p>
        <router-link @click.native="run(isLogin)" :to="login">{{btn}}</router-link>
    </div>
</template>

<script>
export default {
    name:"Profile",
    props:{
        
    },
    data(){
        return {
            message:"你好，请先登录！",
            btn:"登录",
            login:"/login",
            isLogin:0
        }
    },
    created:function(){
        var that = this;
        if (this.$store.state.user) {
            this.message = "欢迎你，" + this.$store.state.user;
            this.isLogin = 1;
            this.btn = "退出登录";
            this.login = "";
        } else {
            this.$request.get('/islogin').then(ret => {
                if (ret.data.msg === "login first"){
                    that.btn = "登录";
                    that.isLogin = 0;
                    that.login = "/login";
                } else if (ret.data.msg === "session on"){
                    that.btn = "退出登录";
                    that.isLogin = 1;
                    that.login = "/login";
                    that.message = "欢迎你，" + ret.data.user;
                    that.$store.state.user = ret.data.user;
                }
            })
        }
    },
    methods: {
        run:function(isLogin){
            var that = this;
            this.login = "";
            if (isLogin){
                this.$request.post('/logout',{params:{username:this.$store.state.user}}).then(ret => {
                    if (ret.data.msg === "success"){
                        that.$parent.ws.close();
                        alert("您已成功退出！");
                        that.login = "/login";
                        that.$store.state.user = "";
                        that.btn = "登录";
                        that.message = "你好，请先登录！";
                        that.isLogin = 0;
                        that.$router.push('/login').catch(err => {console.log(err)});
                    } else {
                        alert("退出失败");
                    }
                }).catch( err => {console.log(err)})
            }
        }
    },
}
</script>

<style>
#user {
    margin: 0;
    padding-top: 6px;
    padding-bottom: 4px;
}
</style>