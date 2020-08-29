<template>
    <div class="order-pay-pay-for">
        <div class="header">我在醴陵慈诊方在线购买的处方，快帮我付个款</div>
        <div class="order-pay-pay-for-item">
            <div class="details-title pay-for-amount">
                <span class="app-font-color-45">付款金额</span>
                <span class="app-font-color-85">￥{{query.paymoney}}</span>
            </div>
            <van-cell title="商品" value="处方订单"  :border=" false"></van-cell>
            <van-cell title="收货人" :value="query.buyer"  :border=" false"></van-cell>
        </div>

        <div class="order-pay-pay-for-item">
            <div class="details-title">
                <span class="app-font-color-45">说明</span>
            </div>
            <p>1、付款前务必和好友再次确认，避免死诈骗行为。</p>
            <p>2、如果发生退款，钱将退回到你的微信账号里。</p>
        </div>

        <div class="footer">
            <van-button round block type="primary" @click="ok">立即支付</van-button>
        </div>
    </div>
</template>

<script>
    import {payOrder, queryOrderDetail} from "src/api";
    import {chooseWXPay} from "../../utils/share";
    export default {
        data(){
            return{
                time: null,
            }
        },
        computed: {
            query(){
                return this.$route.query
            }
        },
        methods:{
            queryOrderDetail(){
                queryOrderDetail(this.query.dh).then(({datas})=>{
                    if(this.time&&datas.status+''!=='1'){
                        clearInterval(this.time);
                        this.$notify({ type: 'success', message: '支付成功,快告诉好友吧' });
                    }
                })
            },
            ok(){
                let vm=this;
                let formData=new FormData();
                formData.append('dh',this.query.dh);
                formData.append('payType','WXPAY');
                formData.append('tradeType','JSAPI');
                formData.append('openId',localStorage.getItem('openId'));
                payOrder(formData).then(({datas}) => {
                    vm.time = setInterval(() => {
                        vm.queryOrderDetail()
                    }, 3000);
                    chooseWXPay(datas.wxJsapiPackage, (data) => {
                        if (data !== "get_brand_wcpay_request:ok") {
                            vm.$notify({type: 'warning', message: '支付失败'});
                            clearInterval(this.time);
                        }
                    });
                })
            }
        },
        beforeDestroy() {
            clearInterval(this.time);
        }
    }
</script>

<style scoped lang="scss">
.order-pay-pay-for{
    .header {
        padding: 20px 16px;
        font-size: 14px;
        background-color: #faf8ff;
    }
    .pay-for-amount{
        font-size: 16px!important;
        padding: 20px 16px!important;
        span:last-child{
            font-size: 20px;
        }
    }
    .order-pay-pay-for-item{
        background-color: #ffffff;
        >p{
            color: #969799;
            padding: 10px 16px;
        }
    }
    .van-cell__title{
        color: #969799;
    }
    .footer{
        margin: 20px 16px;
    }
}
</style>