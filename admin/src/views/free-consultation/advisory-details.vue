<template>
    <div class="advisory-details">
        <div class="advisory-details-item">
            <div class="details-title"><span class="app-font-color-45">问诊信息</span></div>
            <van-cell title="单号" :value="model.dh||''" :border=" false"></van-cell>
            <van-cell title="咨询费" :value="(model.paymoney||'')+'￥'" :border=" false"></van-cell>
            <van-cell title="医生" :value="query.doctorName" :border=" false"></van-cell>
            <van-cell title="有效期" value="24小时" :border=" false"></van-cell>
        </div>
        <div class="advisory-details-item">
            <div class="details-title"><span class="app-font-color-45">问诊信息</span></div>
            <p>
                本服务仅适用于常见病及慢性病的复诊患者，危急重症患者及新症、首诊患者为进一步明确诊断仍需到医院就诊。
                本服务可提供在线开具处方，使用本服务应提供包含诊断的合法实体医疗机构的病历资料。
                本服务的有效期为购买后的48小时内，如医生在48小时内未回复视为无效咨询，并退款到您支付的账户。
                您可以通过图片、文字的形式与医生进行交流。
                医生会根据您的实际情况进行解答和开具处方，必要的情况下有可能对处方进行优化和修改。
                如代人咨询请与医生详细说明，以避免医生对患者的情况判断错误，如没有说明情况责任将由您自行承担。
                使用本服务的过程中，医生在开具处方前有责任和义务告知您所开具处方中可能遇到的风险和隐患，如不同意可不接受处方，如支付该处方则视为您知情并接受使用该处方。
                如有疑问可以拨打客服热线：{{phone}}
                客服工作时间：周一至周五（09:00-18:00）
            </p>
        </div>
        <div class="footer">
            <van-button round block type="primary" @click="ok">立即支付</van-button>
        </div>
    </div>
</template>

<script>
    import {createAdvisoryOrder, getDoctorInfo, payOrder} from "../../api";
    import {chooseWXPay} from "../../utils/share";
    import {getTypeCode} from "../../api/dict";

    export default {
        data(){
            return{
                model: {},
                phone: null,
                time: null,
                toast: null
            }
        },
        computed:{
            query(){
                return this.$route.query
            }
        },
        mounted() {
            this.getTypeCode();
            this.createAdvisoryOrder()
        },
        methods:{
            getTypeCode(){
                getTypeCode('phone').then(({datas})=>{
                    this.phone=datas[0]?datas[0].name:'';
                });
            },
            getDoctorInfo() {
                getDoctorInfo(this.query.doctorId, localStorage.getItem('openId')).then(({datas}) => {
                    if(datas.isPay+''==='1'){
                        clearInterval(this.time);
                        this.toast.clear();
                    }
                })
            },
            createAdvisoryOrder(){
                createAdvisoryOrder({
                    userId: this.$store.getters.getUserInfo.userId,
                    doctorId: this.query.doctorId,
                    paymoney: this.query.paymoney,
                    moneyType: 0,
                    hospitalId: 1,
                    openId: localStorage.getItem('openId')
                }).then(({datas})=>{
                    this.model=datas;
                })
            },
            ok(){
                let formData=new FormData();
                let vm=this;
                formData.append('dh',this.model.dh);
                formData.append('payType','WXPAY');
                formData.append('tradeType','JSAPI');
                formData.append('openId',localStorage.getItem('openId'));
                payOrder(formData).then(({datas})=>{
                    vm.toast = this.$toast.loading({
                        duration: 0, // 持续展示 toast
                        forbidClick: true,
                        message: '查询订单状态中...',
                    });
                    vm.time=setInterval(()=>{
                        vm.getDoctorInfo()
                    },3000);
                    chooseWXPay(datas.wxJsapiPackage,(data)=>{
                        if (data !== "get_brand_wcpay_request:ok") {
                            vm.$notify({ type: 'warning', message: '支付失败' });
                            clearInterval(vm.time);
                            vm.toast.clear();
                        }
                    });
                });
            }
        },
        beforeDestroy() {
            if(this.toast) this.toast.clear();
            clearInterval(this.time);
        }
    }
</script>

<style scoped lang="scss">
    .advisory-details{
        .advisory-details-item{
            p{
                padding: 16px;
                background-color: #ffffff;
                font-size: 14px;
                line-height: 25px;
            }
        }
        .footer{
            margin: 20px 16px;
        }
    }

</style>