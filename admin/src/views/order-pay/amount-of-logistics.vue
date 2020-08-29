<template>
    <div class="order-pay-amount-of-logistics">
        <div class="details-title"><span class="app-font-color-45">物流信息</span></div>
        <div class="amount-of-logistics-info">
            <p class="app-font-color-85"><span>快递公司</span><span>测试</span></p>
            <p class="app-font-color-85"><span>快递单号</span><span>测试</span></p>
        </div>
        <div class="content">
            <ul>
                <li>
                    <div class="time app-font-color-85">2019:02:13</div>
                    <div class="text app-font-color-65">阿斯顿发送到发顺丰大是大非啊飒飒的</div>
                </li>
                <li>
                    <div class="time app-font-color-85">2019:02:13</div>
                    <div class="text app-font-color-65">阿斯顿发送到发顺丰大是大非啊飒飒的</div>
                </li>
                <li>
                    <div class="time app-font-color-85">2019:02:13</div>
                    <div class="text app-font-color-65">阿斯顿发送到发顺丰大是大非啊飒飒的</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "amount-of-logistics"
    }
</script>

<style scoped lang="scss">
    .order-pay-amount-of-logistics{
        .amount-of-logistics-info{
            background-color: #ffffff;
            padding: 20px 16px;
            p{
                color: #323233;
                font-size: 14px;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 10px;
                span:first-child{
                    width: 50%;
                }
                span:last-child{
                    flex: 1;
                }
            }
        }
        .content{
            background-color: #ffffff;
            ul{
                margin:0 16px ;
                li{
                    font-size: 14px;
                    height: 60px;
                    padding-bottom:16px;
                    border-left: 1px solid #ebedf0;
                    >div{
                        padding: 0 16px;
                    }
                    .time{
                        margin-bottom: 20px;
                        font-size: 18px;
                        position: relative;
                        &:before{
                            content: '';
                            position: absolute;
                            left: -5px;
                            top: 0;
                            width: 10px;
                            height: 10px;
                            border: 1px solid #02bb00;
                            background-color: #ffffff;
                            border-radius: 50%;
                        }
                    }
                }
            }
        }
    }
</style>