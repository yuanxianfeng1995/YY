<template>
    <div class="app-layout">
<!--        <mt-header>-->
<!--            <router-link to="/" slot="left">-->
<!--                <mt-button icon="back"></mt-button>-->
<!--            </router-link>-->
<!--            <mt-button icon="more" slot="right"></mt-button>-->
<!--        </mt-header>-->
        <div class="app-layout-main"><slot></slot></div>
<!--        <div class="bottom-nav-bar">-->
<!--            <router-link :to="{ path: '/' }">外卖</router-link>-->
<!--            <router-link :to="{ path: '/' }">订单</router-link>-->
<!--            <router-link :to="{ path: '/' }">发现</router-link>-->
<!--        </div>-->
    </div>
</template>

<script>
    export default {
        data(){
            return {
                selected: null
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-layout{
        flex: 1;
        /*padding-bottom: 48px;*/
        background-color: #f2f2f2;
        .bottom-nav-bar{
            position: fixed;
            bottom: 0;
            left: 0;
            height: 48px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #ffffff;
            border-top: 1px solid #f2f2f2;
            a{
                display: inline-block;
                flex: 1;
                text-align: center;
            }
        }
        .mint-tab-item{
            padding: 0;
            height: 48px;
            line-height: 48px;
            .mint-tab-item-label{
                height: 100%;
            }
            a{
                display: block;
                height: 100%;
                line-height: 48px;
                width: 100%;
            }
        }
    }
</style>