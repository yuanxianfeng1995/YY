<template>
    <div class="registered-add-address-info">
        <div v-if="getIndex&&loading" class="app-mask">
            <van-overlay show>
                <van-loading  type="spinner" color="#ffffff"  size="30px" />
            </van-overlay>
        </div>
        <template v-else>
            <div class="content">
                <van-form @submit="add">
                    <van-field
                            v-model="model.name"
                            label="收货人"
                            maxlength="10"
                            placeholder="至少两个字，真实姓名"
                            :rules="[{ validator: ()=>lenValidator(2,50,model.name), message: ' ' }]"
                    />
                    <van-field
                            v-model="model.mobile"
                            label="手机号"
                            center
                            clearable
                            type="tel"
                            placeholder="请输入手机号"
                            maxlength="11"
                            :rules="[{ required: true,validator: ()=>lenValidator(11,11,model.mobile),message: ' ' }]">
                    </van-field>

                    <van-field
                            v-model="region"
                            label="区域"
                            center
                            readonly
                            @click="openArea"
                            clearable
                            placeholder="请选择区域"
                            :rules="[{ required: true,message: ' ' }]">
                        <template #button>
                            <span class="app-font-color-85" @click.stop="getAddress">获取</span>
                        </template>
                    </van-field>

                    <van-field
                            v-model="model.address"
                            label="详细地址"
                            clearable
                            maxlength="50"
                            placeholder="必填，至少5个字"
                            :rules="[{ required: true,validator: ()=>lenValidator(5,50,model.address), message: ' ' }]"
                    />
                    <div class="sign-protocol">
                        <span>是否默认</span>
                        <van-switch size="20px" v-model="model.isDefault" active-color="#02bb00"></van-switch>
                    </div>


                    <div class="footer">
                        <van-button round block type="primary" native-type="submit">保存</van-button>
                        <van-button v-if="status==='edit'" round block type="default" @click="deleteList">删除</van-button>
                    </div>
                </van-form>
            </div>
        </template>


        <van-popup
                v-model="show"
                position="bottom">
        <van-area overlay refs="area" :area-list="areaList"   :columns-placeholder="['请选择', '请选择', '请选择']"  @confirm="confirm" @cancel="cancel"/>
        </van-popup>

    </div>
</template>

<script>
    import {lenValidator, isTelCode} from 'src/utils/util';
    import {getLocation,init} from 'src/utils/share';
    import area from 'src/utils/area';
    import {Notify} from "vant";
    import {addAddress, userAddress,updateAddress,deleteAddress,replaceOrderAddress,parameters} from 'src/api'
    export default {
        data() {
            let vm=this;
            return {
                loading: true,
                show:false,
                areaList: area,
                model: {
                    userId: vm.$store.getters.getUserInfo.userId,
                    name: null,
                    mobile: null,
                    provinceId: null,
                    provinceName: null,
                    cityId: null,
                    cityName: null,
                    areaId: null,
                    areaName: null,
                    address: null,
                    isDefault: false
                },
                region: null,
            }
        },
        computed: {
            getDh() {
                return this.$route.query.dh
            },
            getIndex() {
                return this.$route.query.index
            },
            status() {
                return this.$route.query.status
            }
        },
        watch:{
            $route(to){
                if (to.meta && to.meta.title) {
                    //console.info(to.meta.title)
                    document.title = this.status==='edit'?'收货地址编辑':'收货地址新增'
                }
            },
        },
        mounted() {
            init();
            if(this.getIndex+''==='0'||this.getIndex) this.userAddress();
        },
        methods: {
            openArea(){
                this.show=true;
            },
            userAddress() {
                userAddress({userId: this.$store.getters.getUserInfo.userId}).then(({datas}) => {
                    let data = datas[this.getIndex];
                    this.region=data.provinceName+data.cityName+data.areaName;
                    data.isDefault=!!data.isDefault;
                    this.model=data;
                    this.loading=false;
                }).catch(()=>{
                    this.loading=false;
                })
            },
            confirm(val){
                if(!(val[2]&&val[2].code)) {
                    Notify({ type: 'warning', message: '请补全地址'})
                    return;
                }
                this.region=val.map(item=>item.name).join('');

                this.model={
                    ...this.model,
                    provinceId: val[0].code,
                    provinceName: val[0].name,
                    cityId:  val[1]?val[1].code:null,
                    cityName: val[1]?val[1].name:null,
                    areaId:  val[2]?val[2].code:null,
                    areaName: val[2]?val[2].name:null,
                }
                this.show=false;
            },
            cancel(){
                this.show=false;
            },
            getAddress() {
                getLocation((data)=>{
                    parameters({
                        key: '2151877f3627caae591734e8091161c5',
                        location: data,
                        extensions: 'base'
                    }).then(({regeocode})=>{
                        let data=regeocode.addressComponent;
                        let arr=regeocode.formatted_address.split(data.township);
                        this.model={
                            ...this.model,
                            provinceId: data.adcode,
                            provinceName: data.province,
                            cityId:  data.citycode,
                            cityName: data.city,
                            areaId:  data.adcode,
                            areaName: data.district,
                        }
                        this.region=arr[0];
                    })
                })
            },
            isTelCode(str) {
                return isTelCode(str);
            },
            lenValidator(min, max, value) {
                return lenValidator(min, max, value)
            },
            deleteList() {
                deleteAddress(this.model.addressId).then(()=>{
                    this.$router.push("/harvest-address")
                })
            },
            add() {
                let model=this.model;
                let data={
                    addressId:  model.addressId,
                    userId: model.userId,
                    name: model.name,
                    mobile: model.mobile,
                    provinceId: model.provinceId,
                    provinceName: model.provinceName,
                    cityId: model.cityId,
                    cityName: model.cityName,
                    areaId: model.areaId,
                    areaName: model.areaName,
                    address: model.address,
                    isDefault: model.isDefault?1:0
                }
                let fn=this.status==='edit'?updateAddress:(this.status==='replace'?replaceOrderAddress:addAddress);
                if(this.status==='replace'){
                    data={
                        buyer: data.name,
                        buyerTel: data.mobile,
                        addressName: this.region,
                        addressCode: data.areaId,
                        address: data.address,
                        dh: this.getDh
                    }
                }
                fn(data).then((data)=>{
                    Notify({ type: data.resp_code+''==='200'?'success':'warning', message: data.resp_msg });
                    this.$router.go(-1);
                })
            }
        }
    }
</script>

<style lang="scss">
    .registered-add-address-info {
        padding-bottom: 20px;

        .my-input, .my-radio {
            border-bottom: 1px solid #f2efef;
        }

        .header {
            padding: 10px;
            font-size: 14px;
            height: 50px;
            background-color: #faf8ff;
        }

        .chronic-medical-history {
            .mint-radiolist {
                .mint-cell {
                    width: 50% !important;
                }
            }

        }

        .sign-protocol{
            background-color: #ffffff;
            height: 40px;
            padding: 0 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .content {
            margin-bottom: 20px;
        }

        .footer {
            margin: 20px 16px;
             button {
                margin-bottom: 10px;
            }
        }
    }
</style>