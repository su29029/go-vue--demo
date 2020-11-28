<template>
  <div>
      <center id="err">404</center>
      <center>哎呀，找不到了嘤嘤嘤~~~</center>
      <p @click="backToIndex">回主页看看吧</p>
  </div>
</template>

<script>
export default {
    name:"Err",
    data () {
        return {

        }
    },
    methods:{
        backToIndex:function(){
            this.$router.push('/index',err => {
                console.log(err);
            })
        }
    }
}
</script>

<style scoped>
    p {
        color: darkgreen;
    }
    p:hover {
        cursor: pointer;
    }
    #err {
        position: absolute;
        top: 2.5%;
        font-size: 28px;
        margin: 0 auto;
        left: 0;
        right: 0;
    }
</style>