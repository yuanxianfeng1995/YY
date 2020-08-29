<template>
    <div class="order-pay-prescription-details">
        <div v-if="loading" class="app-mask">
            <van-overlay show>
                <van-loading type="spinner" color="#ffffff" size="30px"/>
            </van-overlay>
        </div>
        <div class="prescription-details-item">
            <div class="details-title"><span class="app-font-color-45">处方信息</span></div>
            <div class="prescription-info">
                <p class="app-font-color-85"><span>开方时间</span><span>{{model.createTime}}</span></p>
                <p class="app-font-color-85"><span>医生姓名</span><span>{{model.doctorName}}</span></p>
                <p class="app-font-color-85"><span>患者姓名</span><span>{{model.patientName}}</span></p>
                <p class="app-font-color-85"><span>患者病症 </span><span>{{model.diagnosticResult}}</span></p>
                <p class="app-font-color-85"><span>诊断信息</span><span>{{model.diagnosticResult}}</span></p>
                <p class="app-font-color-85"><span>医嘱事项</span><span>{{medicalAdvice}}</span></p>
<!--                <p class="app-font-color-85"><span>处方剂量（剂）</span><span>{{amount}}</span></p>-->
                <p class="app-font-color-85"><span>服用时间</span><span>{{howTotake}}</span></p>
                <p class="app-font-color-85"><span>服务方法</span><span>{{model.templateVO?model.templateVO.fuInfo:''}}</span></p>
                <p class="app-font-color-85"><span>处方类型</span><span>{{model.dosageForm+''==='1'?'颗粒':(model.dosageForm+''==='2'?'膏方':'单品')}}</span>
                </p>
                <p class="app-font-color-85"><span>注</span><span>本药品一经售出不支持退换货</span></p>
            </div>
        </div>

        <!--        <div class="prescription-details-item">-->
        <!--            <div class="details-title"><span class="app-font-color-45">处方名称</span></div>-->
        <!--            <van-cell title="测试" :border=" false"></van-cell>-->
        <!--        </div>-->

        <div class="prescription-details-item">
            <div class="details-title"><span class="app-font-color-45">订单备注</span></div>
            <van-field
                    v-model="model.remark"
                    placeholder="请输入订单备注"
                    type="textarea"
            />
        </div>


        <div class="prescription-details-item">
            <div class="details-title"><span class="app-font-color-45">处方成分</span></div>
            <div class="prescription-info">
                <p><span class="app-font-color-85">{{encryptionDetails}}</span></p>
            </div>
        </div>


        <div class="prescription-details-item">
            <div class="details-title"><span class="app-font-color-45">收货地址</span></div>
            <van-dropdown-menu>
                <van-dropdown-item v-model="model.address" :options="options"/>
            </van-dropdown-menu>
            <div class="add-address"><span @click="addAddress">添加</span></div>
        </div>

        <div class="prescription-details-item">
            <div class="details-title"><span class="app-font-color-45">费用明细</span></div>
            <div class="cost"><span class="app-font-color-85">总计</span><span class="app-font-color-85">{{'￥'+toDecimal}}</span>
            </div>
        </div>

        <div class="footer" v-if="model.status+''==='7'||model.status+''==='1'">
            <van-button round block type="primary" @click="ok(model.status+''==='7')">{{model.status+''==='7'?"立即下单":"立即支付"}}</van-button>
        </div>

    </div>
</template>

<script>
    import {userAddress, queryOrderDetail, pendingToUnpaidOrder, payOrder} from "../../api";
    import {chooseWXPay} from "../../utils/share";
    import {getTypeCode} from "../../api/dict";
    import {Notify} from "vant";

    export default {
        name: "order-details",
        data() {
            return {
                model: {
                    remark: null,
                    address: '1'
                },
                contraindicationsList: [],
                medicationTimeList: [],
                options: [],
                loading:true,
                time: null
            }
        },
        computed: {
            howTotake() {
                let txt = null;
                let templateVO = this.model.templateVO;
                if (templateVO) {
                    let arr = templateVO.fuTime?templateVO.fuTime.split(','):[];
                    let medicationTime = arr.map((item) => {
                        let data = this.medicationTimeList.find(item2 => item2.id + '' === item + '');
                        return data ? data.name : ''
                    }).filter((item=>!!item)).join(',');
                    txt = medicationTime+(medicationTime&&templateVO.customizeFuTime?',':'')+(templateVO.customizeFuTime||'')
                }
                return txt
            },
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
            amount() {
                let model = this.model;
                let txt = 0;
                model.prescriptionMedicineVOList ? model.prescriptionMedicineVOList.map((item) => {
                    txt = txt + parseInt(item.totalAmount)
                }) : null
                return txt
            },
            toDecimal() {
                let val=this.model.paymoney;
                console.log('val',this.model, val)
                let txt='';
                if (val) {
                    txt = Math.round(parseFloat(val) * 100) / 100;
                    let xsd = txt.toString().split(".");
                    if (xsd.length === 1) {
                        txt = txt.toString() + ".00";
                    }
                    if (xsd.length > 1) {
                        if (xsd[1].length < 2) {
                            txt = txt.toString() + "0";
                        }
                    }
                }
                return txt
            },
            encryptionDetails() {
                let model = this.model;
                let txt = '';
                model.prescriptionMedicineVOList ? model.prescriptionMedicineVOList.map((item) => {
                    txt = txt + (item.medicinalName)
                }) : null
                return model.encryptionDetails ? model.encryptionDetails : txt
            }
        },
        mounted() {
           this.queryOrderDetail();
            this.getTypeCode();
            this.userAddress();
            this.medicationTime();
        },
        methods: {
            getTypeCode() {
                getTypeCode('contraindications').then(({datas}) => {
                    this.contraindicationsList = datas;
                })
            },
            medicationTime() {
                getTypeCode('medicationTime').then(({datas}) => {
                    this.medicationTimeList = datas;
                })
            },
            queryOrderDetail(){
                queryOrderDetail(this.getDh).then(({datas})=>{
                    if(this.time && datas.status+''!=='1'){
                        clearInterval(this.time);
                        this.$notify({ type: 'success', message: '支付成功' });
                        this.$router.push('/order-list')
                    }else{
                        this.loading = false
                        this.model = {...this.model, ...datas};
                    }
                }).finally(() => {
                    this.loading = false
                })
            },
            ok(bon) {
                let vm=this;
                if (bon) {
                    let data = vm.options[vm.model.address];
                    if (!(data && data.address)) {
                        Notify({type: 'warning', message: '地址不能为空'});
                        return;
                    }
                    pendingToUnpaidOrder({
                        dh: vm.getDh,
                        mqTopicId: 'create_wz_order',
                        orderAddress: {
                            address: data.address,
                            addressCode: data.areaId,
                            addressName: data.provinceName + data.cityName + data.areaName + data.address,
                            buyerTel: data.mobile,
                            buyer: data.name
                        }
                    }).then(() => {
                        vm.$router.push({path: '/order-list'})
                    })
                } else {
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
                            if (data !== "get_brand_wcpay_request:ok") {
                                vm.$notify({type: 'warning', message: '支付失败'});
                                clearInterval(this.time);
                            }
                        });
                    })
                }

            },
            userAddress() {
                userAddress({userId: this.$store.getters.getUserInfo.userId}).then(({datas}) => {
                    this.options = datas.map((data, index) => {
                        return {
                            ...data,
                            text: data.provinceName + data.cityName + data.areaName + data.address + ' ' + data.name + ' ' + data.mobile,
                            value: index
                        }
                    });

                    this.model.address = datas.findIndex((item) => item.isDefault + '' === '1') || 0;
                })
            },
            addAddress() {
                this.$router.push({path: '/add-address'})
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

        .prescription-details-item {
            background-color: #ffffff;
            margin-bottom: 20px;

            .van-dropdown-menu__bar {
                box-shadow: none;
                width: 100%;
                overflow: hidden;
                border-bottom: 1px solid #ebedf0;
            }

            .van-ellipsis {
                overflow: hidden;
                white-space: initial;
                text-overflow: initial;
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