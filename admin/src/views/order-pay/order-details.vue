<template>
    <div class="order-pay-prescription-details">
        <div v-if="loading" class="app-mask">
            <van-overlay show>
                <van-loading type="spinner" color="#ffffff" size="30px"/>
            </van-overlay>
        </div>
        <template v-else>
            <div class="prescription-details-item">
                <div class="details-title"><span class="app-font-color-45">订单信息</span></div>
                <div class="prescription-info">
                    <p class="app-font-color-85"><span>订单号</span><span>{{model.dh}}</span></p>
                    <p class="app-font-color-85"><span>状态</span><span>{{formStatus(model.status)}}</span></p>
                    <p class="app-font-color-85"><span>付款金额</span><span>{{model.paymoney}}</span></p>
                    <p class="app-font-color-85"><span>下单时间 </span><span>{{model.createTime}}</span></p>
                    <p class="app-font-color-85"><span>备注</span><span></span></p>
                </div>
            </div>
            <div class="prescription-details-item">
                <div class="details-title">
                    <span class="app-font-color-45">收货地址</span>
                    <van-button v-if="!(model.status+''==='2'||model.status+''==='5'||model.status+''==='8')"
                                style="width: 120px" round block type="primary" size="small" @click="addAddress">申请更换
                    </van-button>
                </div>
                <div class="prescription-info">
                    <p class="app-font-color-85"><span>收货人</span><span>{{model.orderAddress?model.orderAddress.buyer:null}}</span>
                    </p>
                    <p class="app-font-color-85"><span>电话</span><span>{{model.orderAddress?model.orderAddress.buyerTel:null}}</span>
                    </p>
                    <p class="app-font-color-85"><span>地址</span><span>{{model.orderAddress?model.orderAddress.addressName:null}}</span>
                    </p>
                </div>
            </div>

            <div class="prescription-details-item">
                <div class="details-title"><span class="app-font-color-45">医生说明</span></div>
                <div class="prescription-info">
                    <p class="app-font-color-85"><span>诊断信息</span><span>{{model.diagnosticResult}}</span></p>
                    <p class="app-font-color-85"><span>医嘱事项</span><span>{{medicalAdvice}}</span></p>
                    <p class="app-font-color-85"><span>服用时间</span><span>{{howTotake}}</span></p>
                    <p class="app-font-color-85"><span>服务方法</span><span>{{model.templateVO?model.templateVO.fuInfo:''}}</span></p>
                </div>
            </div>

            <div class="prescription-details-item">
                <div class="details-title"><span class="app-font-color-45">类型说明</span></div>
                <div class="prescription-info">
                    <p class="app-font-color-85"><span>类型</span><span>{{model.dosageForm+''==='1'?'颗粒':(model.dosageForm+''==='2'?'膏方':'单品')}}</span>
                    </p>
                    <p class="app-font-color-85" v-if="model.dosageForm+''==='2'"><span>说明</span><span>加工时间需要3-5天</span>
                    </p>
                </div>
            </div>

            <div class="prescription-details-item">
                <div class="details-title"><span class="app-font-color-45">处方成分</span></div>
                <div class="prescription-info">
                    <p class="app-font-color-85"><span>药味</span><span>{{prescriptionMedicineVOList}}</span></p>
                </div>
            </div>

            <div class="prescription-details-item">
                <div class="details-title"><span class="app-font-color-45">订单费用</span></div>
                <div class="prescription-info">
                    <p class="app-font-color-85"><span>数量</span><span>{{amount}}</span></p>
                    <p class="app-font-color-85"><span>总金额</span><span>{{model.paymoney}}</span></p>
                    <p class="app-font-color-85"><span>注</span><span>本药品一经售出不支持退换货</span></p>
                </div>
            </div>

            <div class="prescription-details-item" v-if="model.status+''==='1'">
                <div class="details-title"><span class="app-font-color-45">支付列表</span></div>
            </div>


            <div class="footer">
                <van-button v-if="model.status+''==='1'" round block type="primary" @click="ok">立即支付</van-button>
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
        </template>

    </div>
</template>

<script>
    import {queryOrderDetail, payOrder} from 'src/api';
    import {chooseWXPay} from "src/utils/share";
    import {getTypeCode} from "../../api/dict";

    export default {
        name: "order-details",
        data() {
            return {
                model: {
                    remark: null,
                    address: '1'
                },
                chronicMedicalHistoryList: [],
                contraindicationsList: [],
                medicationTimeList: null,
                loading: true,
                payMethod: null,
                show: false,
                time: null,
            }
        },
        computed: {
            getDh() {
                return this.$route.query.dh
            },
            medicalAdvice() {
                let templateVO = this.model.templateVO;
                let txt = '';
                if (templateVO) {
                    let arr = templateVO.contraindications.split(',');
                    let contraindications = arr.map((item) => {
                        let data = this.contraindicationsList.find(item2 => item2.id + '' === item + '');
                        return data ? data.name : ''
                    }).join(',');
                    txt = (templateVO.supplementaryExplanation ? templateVO.supplementaryExplanation + (contraindications||templateVO.customizeCtds?',':'') : '') + (contraindications ? contraindications + (templateVO.customizeCtds?',':'') : '') + (templateVO.customizeCtds || '')
                }
                return txt
            },
            howTotake() {
                let txt = null;
                let templateVO = this.model.templateVO;
                if (templateVO) {
                    let arr = templateVO.fuTime ? templateVO.fuTime.split(',') : [];
                    let medicationTime = arr.map((item) => {
                        let data = this.medicationTimeList.find(item2 => item2.id + '' === item + '');
                        return data ? data.name : ''
                    }).filter(item=>!!item).join(',');
                    txt = medicationTime + (medicationTime&&templateVO.customizeFuTime ? ',' : '') + (templateVO.customizeFuTime || '')
                }
                return txt
            },
            amount() {
                let model = this.model;
                let txt = 0;
                model.prescriptionMedicineVOList ? model.prescriptionMedicineVOList.map((item) => {
                    txt = txt + parseInt(item.totalAmount)
                }) : null
                return txt
            },
            prescriptionMedicineVOList() {
                return this.model && this.model.prescriptionMedicineVOList ? this.model.prescriptionMedicineVOList.map((item) => {
                    return item.medicinalName
                }).filter(item=>!!item).join(',') : null
            },
        },
        watch: {
            getTypeCode() {
                getTypeCode('contraindications').then(({datas}) => {
                    this.contraindicationsList = datas;
                })
            },
            payMethod(val) {
                let vm = this;
                if (val + '' === '1') {
                    let formData = new FormData();
                    formData.append('dh', this.model.dh);
                    formData.append('payType', 'WXPAY');
                    formData.append('tradeType', 'JSAPI');
                    formData.append('openId', localStorage.getItem('openId'));
                    payOrder(formData).then(({datas}) => {
                        vm.time = setInterval(() => {
                            vm.queryOrderDetail()
                        }, 3000);
                        chooseWXPay(datas.wxJsapiPackage, (data) => {
                            console.log('data',data)
                            if (data !== "get_brand_wcpay_request:ok") {
                                vm.$notify({type: 'warning', message: '支付失败'});
                                clearInterval(this.vm);
                            }
                        });
                    })
                    this.onClose()
                } else {
                    let model = this.model;
                    vm.$router.push({
                        path: "/pay-for", query: {
                            dh: model.dh,
                            paymoney: this.model.paymoney,
                            buyer: model.orderAddress ? model.orderAddress.buyer : null,
                        }
                    });
                }
            }
        },
        created() {
            this.getTypeCode();
            this.queryOrderDetail();
            this.medicationTime();
        },
        methods: {
            medicationTime() {
                getTypeCode('medicationTime').then(({datas}) => {
                    this.medicationTimeList = datas;
                })
            },
            queryOrderDetail() {
                queryOrderDetail(this.getDh).then(({datas}) => {
                    if (this.time && datas.status + '' !== '1') {
                        clearInterval(this.time);
                        this.$notify({type: 'success', message: '支付成功'});
                        this.$router.push('/order-list')
                    }else{
                        this.model = datas;
                        this.loading = false
                    }
                }).finally(() => {
                    this.loading = false
                })
            },
            getTypeCode() {
                getTypeCode('chronicIllness').then(({datas}) => {
                    this.chronicMedicalHistoryList = datas;
                });
                getTypeCode('contraindications').then(({datas}) => {
                    this.contraindicationsList = datas;
                })
            },
            formStatus(val) {
                let txt = null;
                //1,"未支付"  2,"已支付,代发货"  3,"待收货"  4,"退款" 5,"交易已过期(自动取消/手动取消/已退款/作废 都视为交易已过期)" 6,"交易成功" 7,"代下单状态" 8,"医生编辑生成失效订单"
                switch (val + '') {
                    case '1':
                        txt = "未支付"
                        break;
                    case '2':
                        txt = "已支付,待发货"
                        break;
                    case '3':
                        txt = "待收货"
                        break;
                    case '4':
                        txt = "退款"
                        break;
                    case '5':
                        txt = "交易已过期"
                        break;
                    case '6':
                        txt = "交易成功"
                        break;
                    case '7':
                        txt = "待下单状态"
                        break;
                    case '8':
                        txt = "医生编辑生成失效订单"
                        break;
                }
                return txt;
            },
            onChange(val) {
                console.log('val', val)
            },
            onClose() {
                this.show = false;
            },
            ok() {
                this.payMethod = null;
                this.show = true;
            },
            addAddress() {
                this.$router.push({path: '/add-address', query: {status: 'replace', dh: this.getDh}})
            }
        },
        beforeDestroy() {
            clearInterval(this.time);
        }
    }
</script>

<style lang="scss">
    .order-pay-prescription-details {
        .prescription-info {
            background-color: #ffffff;
            padding: 20px 16px;

            p {
                color: #323233;
                font-size: 14px;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 10px;

                span:first-child {
                    width: 50%;
                }

                span:last-child {
                    flex: 1;
                }
            }
        }

        .van-dialog {
            padding: 20px;

            .van-radio:first-child {
                margin-bottom: 10px;
            }
        }

        .prescription-details-item {
            background-color: #ffffff;
            margin-bottom: 20px;

            .van-dropdown-menu__bar {
                box-shadow: none;
                border-bottom: 1px solid #ebedf0;
            }

            .add-address {
                padding: 10px 16px;
                color: #8e96bb;
            }

            .cost {
                margin-top: 20px;
                padding: 20px 16px;
                font-size: 16px;
                display: flex;
                justify-content: space-between;
                border-top: 1px solid #ebedf0;
                border-bottom: 1px solid #ebedf0;
            }
        }

        .footer {
            overflow: hidden;
            margin: 20px 16px;
        }
    }
</style>