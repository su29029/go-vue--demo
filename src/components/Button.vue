<template>
    <div class="button-list">
        <button class="btn" ref="btn" @click="wave" :disabled="disable" :style="isCursor">
            <slot/>
            <div class="waves-effect" :class='wavesDiv' ref="wave" :style="wavePosition"></div>
        </button>
        
    </div> 
</template>

<script>
export default {
    name:"Button",
    props:{
        disable:Boolean,
        isCursor:Object
    },
    data(){
        return {
            wavesDiv:"waves-effect",
            wavePosition:{
                left:"10px"
            }
        }
    },
    methods:{
        wave:function(){
            this.wavesDiv = "waves-effect";
            var btn = this.$refs.btn;
            var wH = btn.offsetWidth > btn.offsetHeight ? btn.offsetWidth : btn.offsetHeight;
            var nX = event.layerX;
            var nY = event.layerY;
            this.wavePosition.width = wH;
            this.wavePosition.height = wH;
            this.wavePosition.left = nX + "px";
            this.wavePosition.top = nY + "px";
            this.wavesDiv = "waves-effect-animation";
        }
    }
}
</script>

<style lang="scss" scoped>
.links {
    padding-top: 50px;
}
.button-list {
    display: inline-flex;
}

.btn {
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
    display: inline-block;
    overflow: hidden;
    border-radius: 3px;
    outline: none;
    border:0;
    opacity: 0.9;
    margin-right: 10px;
    background-color: #27c484;
    color: #fff;
    text-decoration: none;
    padding: 10px 30px;
    position: relative;
}

.btn:hover {
    opacity: 1;
    box-shadow: 0 3px 6px 0 rgba(0,0,0,0.20),0 3px 12px 0 rgba(0,0,0,0.16);
    cursor: pointer;
}

.waves-effect {
    border-radius: 100%;
    background-color: #dfdfdf;
    transform:scale(0);
    position: absolute;
    width: 10px;
    height: 10px;
}

.waves-effect-animation {
    -moz-animation: waving 0.5s ease-out;
    animation: waving 0.5s ease-out;
}

@keyframes waving {  
        from{  
            transform: scale(0.1);  
            opacity: 1;
        }  
        
        to{  
            transform: scale(16); 
            opacity: 0;         
        } 
    } 
</style>