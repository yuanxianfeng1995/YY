<template>
    <van-popup
            v-model="show"
            position="bottom"
            :close="onClose"
    >
        <div class="app-select">
            <div class="app-select-header">
                <div class="app-select-header-l">
                    <span @click="pro"><i class="select-top"></i></span>
                    <span  style="transform: rotateX(180deg);top: 1px" @click="next"><i class="select-top"></i></span>
                </div>
                <span class="app-select-header-r" @click="selectItem()">完成</span>
            </div>
            <div class="content">
                <ul :style="{transform: 'translateY('+(selectIndex*40)+'px)'}">
                    <li v-for="(item,index) in data" :key="index">{{item.name}}</li>
                </ul>
                <div class="line"></div>
            </div>
        </div>
    </van-popup>
</template>

<script>
    export default {
        data() {
            return {
                show: false,
                selectIndex:0
            }
        },
        props: {
            value: String,
            data: Array,
        },
        methods: {
            pro(){
                this.selectIndex=-(this.selectIndex)>0?this.selectIndex+1:this.selectIndex;
            },
            next(){
                this.selectIndex=this.data&&Math.abs(this.selectIndex)<=this.data.length-2?this.selectIndex-1:this.selectIndex;
            },
            selectItem(){
                this.$emit('change', this.data[Math.abs(this.selectIndex)]);
                this.onClose();
            },
            open() {
                this.show = true;
            },
            onClose() {
                this.show = false;
            },
        }
    }
</script>

<style lang="scss">
.app-select{
    display: flex;
    flex-direction: column;
    height: 160px;
    overflow: auto;
    background-color: #585757;
    .app-select-header{
        height: 40px;
        background-color: #434343;
        display: flex;
        padding: 0 16px;
        justify-content: space-between;
        align-items: center;
        span{
            position: relative;
            display: inline-block;
            width: 30px;
            height: 10px;
            color: #ffffff;
            margin-right: 20px;
        }
        .app-select-header-l{
            span{
                height: 30px;
            }
        }
    }
    .content{
        flex: 1;
        overflow: hidden;
        position: relative;
        ul{
            transition: all 0.3s;
            padding-top: 40px;
            li{
                text-align: center;
                font-size: 16px;
                color: #ffffff;
                height: 40px;
                line-height: 40px;
            }
        }
        .line{
            position: absolute;
            left: 0;
            top: 40px;
            border-top: 1px solid #ebedf0;
            border-bottom: 1px solid #ebedf0;
            width: 100%;
            height: 40px;
        }
    }
}
</style>