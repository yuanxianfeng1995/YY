<template>
    <div class="take-a-photo-inquiry-details">
        <div class="inquiry-details-item">
            <div class="details-title"><span class="app-font-color-45">问诊信息</span></div>
            <div class="inquiry-info">
                <p class="app-font-color-85"><span>状态</span><span>测试</span></p>
                <p class="app-font-color-85"><span>时间 </span><span>测试</span></p>
                <p class="app-font-color-85"><span>医生</span><span>测试</span></p>
            </div>
        </div>
        <div class="inquiry-details-item">
            <div class="details-title"><span class="app-font-color-45">基本体征</span></div>
            <div class="inquiry-info">
                <p class="app-font-color-85"><span>病症补充说明</span><span>测试</span></p>
            </div>
        </div>

        <div class="inquiry-details-item">
            <div class="details-title"><span class="app-font-color-45">上传的药方</span></div>
            <img/>
        </div>

        <div class="footer">
            <van-button round block type="primary" @click="ok">提交</van-button>
        </div>

        <van-dialog
                use-slot
                v-model="show"
                ref="dialog"
                :show-confirm-button="false"
                :close="onClose"
        >
            <van-radio-group v-model="payMethod">
                <van-radio name="1" checked-color="#02bb00">微信支付</van-radio>
                <van-radio name="2" checked-color="#02bb00">他人支付</van-radio>
            </van-radio-group>
        </van-dialog>
    </div>
</template>

<script>
    export default {
        name: "order-details",
        data(){
            return{
                model:{
                    remark: null,
                    address: '1'
                },
                options:  [
                    {text: 'Albert男22岁Albert男22岁Albert男22岁', value: '1'},
                    {text: 'Albert男23岁', value: '2'},
                    {text: 'Albert男24岁', value: '3'}
                ],
                payMethod: null,
                show: false
            }
        },
        watch:{
            payMethod(val){
                if(val){
                    this.onClose()
                }
            }
        },
        methods:{
            onChange(val){
                console.log('val',val)
            },
            onClose(){
                this.show=false;
            },
            ok(){
                this.payMethod=null;
                this.show=true;
            },
            addAddress(){
                this.$router.push({path: '/add-address'})
            }
        }
    }
</script>

<style lang="scss">
    .take-a-photo-inquiry-details{
        .inquiry-info{
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
        .van-dialog{
            padding: 20px;
            .van-radio:first-child{
                margin-bottom: 10px;
            }
        }
        .inquiry-details-item{
            background-color: #ffffff;
            margin-bottom: 20px;
            .van-dropdown-menu__bar{
                box-shadow: none;
                border-bottom: 1px solid #ebedf0;
            }
            .add-address{
                padding: 10px 16px;
                color: #8e96bb;
            }
            .cost{
                margin-top: 20px;
                padding: 20px 16px;
                font-size: 16px;
                display: flex;
                justify-content: space-between;
                border-top: 1px solid #ebedf0;
                border-bottom: 1px solid #ebedf0;
            }
        }
        .footer{
            overflow: hidden;
            margin: 20px 16px;
        }
    }
</style>