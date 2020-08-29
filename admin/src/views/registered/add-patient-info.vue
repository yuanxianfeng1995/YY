<template>
    <div class="registered-add-patient-info">
        <div v-if="this.getId&&loading" class="app-mask">
            <van-overlay show>
                <van-loading  type="spinner" color="#ffffff"  size="30px" />
            </van-overlay>
        </div>
        <template>
            <template v-if="status!=='preview'">
                <div class="header app-font-color-65">
                    请确保正确无误，健康档案保存后；此信息仅医生可见，醴陵慈诊方将充分保证您的隐私。
                </div>

                <van-form @submit="add">
                    <div class="content">
                        <van-field
                                v-model="model.realName"
                                :disabled="this.status === 'edit'"
                                label="姓名"
                                maxlength="10"
                                placeholder="至少两个字，真实姓名"
                                :rules="[{ validator: ()=>lenValidator(2,50,model.realName), message: ' ' }]"
                        />
                        <van-field
                                v-model="model.telephone"
                                label="手机号"
                                center
                                clearable
                                type="tel"
                                maxlength="11"
                                placeholder="请输入手机号"
                                :rules="[{ required: true,validator: ()=>lenValidator(11,11,model.telephone),message: ' ' }]">
                        </van-field>
                        <div class="form-item">
                            <div class="title">患者关系</div>
                            <van-radio-group v-model="model.relationship" direction="horizontal"  :disabled="this.status === 'edit'">
                                <van-radio :name="item.value" checked-color="#02bb00" v-for="(item,index) in relationshipList" :key="index">
                                    {{item.label}}</van-radio>
                            </van-radio-group>
                        </div>
                        <div class="form-item">
                            <div class="title">性别</div>
                            <van-radio-group v-model="model.sex" direction="horizontal">
                                <van-radio name="1" checked-color="#02bb00">男</van-radio>
                                <van-radio name="2" checked-color="#02bb00">女</van-radio>
                            </van-radio-group>
                        </div>
                        <van-field
                                v-model="model.age"
                                label="年龄（岁）"
                                placeholder="必填，数字"
                                maxlength="10"
                                type="digit"
                                :rules="[{  required: true ,validator: ()=>minMaxValidator(1,100,model.age), message: ' ' }]"
                        />
                        <van-field
                                v-model="model.height"
                                label="身高（CM）"
                                placeholder="必填，数字"
                                type="digit"
                                :rules="[{  required: true ,validator: ()=>minMaxValidator(1,200,model.height), message: ' ' }]"
                        />
                        <van-field
                                v-model="model.weight"
                                label="体重（KG）"
                                placeholder="必填，数字"
                                type="digit"
                                :rules="[{  required: true ,validator: ()=>minMaxValidator(1,300,model.weight), message: ' ' }]"
                        />
                        <van-field
                                v-model="model.drugAllergyHistory"
                                type="textarea"
                                maxlength="100"
                                :rules="[{ required: true, message: ' ' }]"
                                placeholder="对什么药物过敏？如没有，请填写无"
                        />
                        <van-field
                                v-model="model.previousMedicalHistory"
                                type="textarea"
                                maxlength="100"
                                :rules="[{ required: true, message: ' ' }]"
                                placeholder="以前得过什么病？是否手术？有无痊愈？如没有，请填写无"
                        />
                        <div class="form-item">
                            <div class="title">其它慢性病史</div>
                            <van-checkbox-group class="page-checkbox-group" v-model="model.chronicMedicalHistory">
                                <van-checkbox  shape="square" checked-color="#02bb00" v-for="(item,index) in chronicMedicalHistoryList"
                                           :key="index" :name="item.id">
                                    {{item.name}}
                                </van-checkbox>
                            </van-checkbox-group>
                        </div>
                    </div>
                    <div class="footer">
                        <van-button round block type="primary" native-type="submit">保存</van-button>
                    </div>
                </van-form>


            </template>

            <template v-else>
                <van-cell title="患者信息" value=" " size="large"></van-cell>
                <van-cell title="姓名" :value="model.realName" :border=" false"></van-cell>
                <van-cell title="关系" :value="getInfo('relationshipList','relationship')" :border=" false"></van-cell>
                <van-cell title="性别" :value="model.sex+''==='1'?'男':'女'" :border=" false"></van-cell>
                <van-cell title="年龄（岁）" :value="model.age" :border=" false"></van-cell>
                <van-cell title="体重（KG）" :value="model.weight" :border=" false"></van-cell>
                <van-cell title="身高（CM）" :value="model.height" :border=" false"></van-cell>
                <van-cell title="药物过敏史" :value="model.drugAllergyHistory" :border=" false"></van-cell>
                <van-cell title="既往病史" :value="model.previousMedicalHistory" :border=" false"></van-cell>
                <van-cell title="慢性病史" :value="getInfoArr('chronicMedicalHistoryList','chronicMedicalHistory')" :border=" false"></van-cell>
            </template>
        </template>

    </div>
</template>

<script>
    import {lenValidator, isTelCode,minMaxValidator} from 'src/utils/util';
    import {getTypeCode} from 'src/api/dict';
    import {savePatient, queryPatientById, updatePatient} from 'src/api';
    import {Notify} from "vant";

    export default {
        data() {
            return {
                loading: true,
                model: {
                    realName: null,
                    relationship: '1',
                    telephone: null,
                    sex: '1',
                    height: null,
                    weight: null,
                    drugAllergyHistory: null,
                    previousMedicalHistory: null,
                    chronicMedicalHistory: [],
                },
                relationshipList:[
                    {
                        label: '本人',
                        value: '1',
                    },{
                        label: '家人',
                        value: '2',
                    },{
                        label: '亲戚',
                        value: '3',
                    },{
                        label: '朋友',
                        value: '4',
                    },
                ],
                chronicMedicalHistoryList: []
            }
        },
        computed: {
            getId() {
                return this.$route.query.id
            },
            status() {
                return this.$route.query.status
            }
        },
        watch:{
            $route(to){
                if (to.meta && to.meta.title) {
                    //console.info(to.meta.title)
                    document.title = this.status==='preview'?'健康档案详情':'新增健康档案'
                }
            },
        },
        mounted() {
            if(this.getId) this.queryPatientById();
            this.getTypeCode();
        },
        methods: {
            getTypeCode(){
                getTypeCode('chronicIllness').then(({datas})=>{
                    this.chronicMedicalHistoryList=datas;
                })
            },
            getInfo(data,str){
                return this[data].find(item=>item.value===this.model[str])?this[data].find(item=>item.value===this.model[str]).label:null
            },
            getInfoArr(data,str){
                let arr=typeof(this.model[str])==='string'?this.model[str].split(','):this.model[str];
                return arr.map((val)=>{
                    return this[data].find(item=>item.id===val)?this[data].find(item=>item.id===val).name:null
                }).join(',')
                
            },
            queryPatientById() {
                queryPatientById(this.getId).then(({datas}) => {
                    this.model = datas;
                    this.model.relationship = this.model.relationship + '';
                    this.model.sex = this.model.sex + '';
                    this.model.chronicMedicalHistory = this.model.chronicMedicalHistory.split(',');
                    this.loading=false;
                }).catch(()=>{
                    this.loading=false;
                })
            },
            isTelCode(str) {
                return isTelCode(str);
            },
            lenValidator(min, max, value) {
                return lenValidator(min, max, value)
            },
             minMaxValidator(min, max, value) {
                return minMaxValidator(min, max, value)
            },
            add() {
                if(this.status==='preview'){
                    return;
                }
                let data=JSON.parse(JSON.stringify(this.model)) ;
                data.relationship = parseInt(data.relationship);
                data.sex = parseInt(data.sex);
                data.chronicMedicalHistory=data.chronicMedicalHistory.join(',')
                let fn = savePatient;
                if(this.status === 'edit'){
                    fn= updatePatient;
                    delete  data.userId;
                    delete  data.relationship;
                    delete  data.realName;
                }
                fn(localStorage.getItem('openId'), data).then((data) => {
                    Notify({type: 'success', message: data.resp_msg});
                    this.$router.go(-1)
                })
            }
        }
    }
</script>

<style lang="scss">
    .registered-add-patient-info {
        .my-input, .my-radio {
            border-bottom: 1px solid #f2efef;
        }

        .header {
            padding: 10px;
            font-size: 14px;
            height: 50px;
            background-color: #faf8ff;
        }

        .footer {
            margin: 20px 16px;
        }

        .content {
            margin-bottom: 20px;
            background-color: #ffffff;
            padding-bottom: 20px;
        }
    }
</style>