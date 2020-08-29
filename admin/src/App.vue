<template>
    <div id="app">
        <layout>
            <router-view/>
        </layout>
    </div>
</template>

<script>
    import layout from './views/layout';
    import {setConfig} from "./api";
    import store from "./store";

    export default {
        components: {layout},
        created() {
            store.dispatch('getFetchUserInfo');
            if(localStorage.getItem('userInfo')){
                this.$store.commit('setUserInfo',JSON.parse(localStorage.getItem('userInfo')));
            }
            let url = window.location.href.split('#')[0];
            setConfig({url: url}).then((data) => {
                console.log('setConfig', url)
                localStorage.setItem('sdkConfig', JSON.stringify(data));
            })
        },
        methods: {
        }
    }
</script>

<style lang="scss">
    @import "../css/reset.css";

    #app {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        min-height: 100%;
        display: flex;
        flex: 1;
        /*#02bb00*/
        background-color: #f2f2f2;

        .app-font-color-selected {
            color: #02bb00;
        }

        .app-font-color-85 {
            color: #333333;
        }

        .app-font-color-65 {
            color: #666666;
        }

        .app-font-color-45 {
            color: #999999;
        }

        .van-cell {
            .van-cell__title {
                flex: none;
                width: 100px;
            }
        }
        .wrapper{
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width: 100%;
                display: block;
            }
        }
        .app-mask {
            .van-overlay {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        .van-dropdown-menu {
            .van-dropdown-menu__title {
                padding-left: 16px;
            }
        }

        .details-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 16px;
            font-size: 12px;
            border-bottom: 1px solid #ebedf0;
            background-color: #ffffff;
        }

        .no-data {
            padding: 20px 16px;
            text-align: center
        }

        .operating-btn {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 48px;
            border-top: 1px solid #f2efef;
            border-bottom: 1px solid #f2efef;
            margin-bottom: 20px;
            background-color: #ffffff;

            span {
                display: block;
                flex: 1;
                height: 100%;
                line-height: 48px;
                text-align: center;

                &:first-child {
                    border-right: 1px solid #f2efef;
                }
            }
        }

        .form-item {
            padding: 0 16px;

            .title {
                padding: 10px 0;
                overflow: hidden;
                color: #323233;
                font-size: 14px;
                line-height: 24px;
            }
        }

        .van-dropdown-menu__title {
            width: 100%;

            &:after {
                position: absolute;
                top: 50%;
                right: 16px;
            }
        }

        .van-dropdown-menu__item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }

        .page-checkbox-group {
            display: flex;
            flex-wrap: wrap;

            > div {
                margin: 5px 0;
                width: 50% !important;
            }

        }

        .help {
            padding: 16px;
            background-color: #ffffff;

            h2 {
                text-align: center;
                font-size: 16px;
                margin-bottom: 10px;
                color: #333333;
                font-weight: initial;
            }

            .time {
                color: #666666;
                margin-bottom: 10px;
            }

            .title {
                text-indent: 20px;
                font-size: 14px;
                line-height: 20px;
                margin-bottom: 10px;
            }

            img {
                width: 100%;
                margin-bottom: 20px;
            }
        }


        .select-top {
            position: absolute;
        }

        .select-top:before, .select-top:after {
            position: absolute;
            content: '';
            border-top: 10px transparent dashed;
            border-left: 10px transparent dashed;
            border-right: 10px transparent dashed;
            border-bottom: 10px #fff solid;
        }

        .select-top:before {
            border-bottom: 10px #fff solid;
        }

        .select-top:after {
            top: 1px; /*覆盖并错开1px*/
            border-bottom: 10px #434343 solid;
        }
    }
</style>