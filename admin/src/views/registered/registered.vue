<template>
    <div class="complete-material-page">
        <van-form @submit="login">
            <div class="operate-div">
                <van-field
                        v-model="model.telephone"
                        label="手机号"
                        center
                        clearable
                        type="tel"
                        maxlength="11"
                        placeholder="请输入手机号"
                        :rules="[{ required: true,validator: ()=>lenValidator(11,11,model.telephone),message: ' ' }]">
                    <template #button>
                        <span class="app-font-color-selected" @click="smsSend(model.telephone)">发送验证码</span>
                    </template>
                </van-field>
                <van-field
                        v-model="model.captcha"
                        label="验证码"
                        maxlength="10"
                        type="digit"
                        placeholder="必填"
                        :rules="[{ validator: ()=>lenValidator(4,10,model.captcha), message: '长度为4-10位数字' }]"
                />
                <van-field
                        v-model="model.name"
                        label="姓名"
                        placeholder="至少两个字，真实姓名"
                        :rules="[{ validator: ()=>lenValidator(2,50,model.name), message: ' ' }]"
                />
                <div class="form-item">
                    <div class="title">性别</div>
                    <van-radio-group v-model="model.sex" direction="horizontal">
                        <van-radio name="1" checked-color="#02bb00">男</van-radio>
                        <van-radio name="2" checked-color="#02bb00">女</van-radio>
                    </van-radio-group>
                </div>


                <van-field
                        v-model="model.age"
                        label="年龄"
                        placeholder="必填，数字"
                        type="digit"
                        :rules="[{ required: true, message: ' ' }]"
                />
                <div class="sign-protocol"><a>同意<span>《醴陵慈诊方用户服务协议》</span></a>
                    <van-switch v-model="agreement" active-color="#02bb00" size="18px"></van-switch>
                </div>
            </div>
            <div class="footer">
                <van-button round block type="primary" native-type="submit">
                    确定
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
    import {lenValidator, isTelCode} from 'src/utils/util';
    import {bindUserInfo,smsSend} from 'src/api';
    import {Notify} from "vant";

    export default {
        data() {
            return {
                model: {
                    telephone: null,
                    captcha: null,
                    deviceId: null,
                    name: null,
                    sex: '1',
                    age: null,
                },
                agreement: null
            }
        },
        mounted() {
            let data=this.$store.getters.getUserInfo;
            console.log('data',data)
        },
        methods: {
            smsSend(data){
                smsSend({phone: data,type: "login"}).then((val)=>{
                    this.model.deviceId=val.datas.key;
                    Notify({ type: 'success', message: val.resp_msg});
                })
            },
            isTelCode(str) {
                return isTelCode(str);
            },
            lenValidator(min, max, value) {
                return lenValidator(min, max, value)
            },
            login() {
                let model=this.model;
                let vm=this;
                // let data = {
                //     telephone:model.telephone,
                //     captcha:model.captcha,
                //     name:model.name,
                //     deviceId: model.deviceId,
                //     sex:model.sex,
                //     age:model.age
                // };
                if (!model.telephone||!model.captcha||!model.name||!model.sex||!model.age) {
                    Notify({ type: 'warning', message: '数据不能为空'});
                    return;
                }
                if(!this.agreement){
                    Notify({ type: 'warning', message: '请同意喜之郎用户服务协议'});
                    return;
                }
                if(!this.agreement){
                    Notify({ type: 'warning', message: '请同意喜之郎用户服务协议'});
                    return;
                }
                // telephone:model.telephone,
                //     captcha:model.captcha,
                //     name:model.name,
                //     deviceId: model.deviceId,
                //     sex:model.sex,
                //     age:model.age
                const formdata=new FormData();
                formdata.append("telephone",model.telephone);
                formdata.append("captcha",model.captcha);
                formdata.append("name",model.name);
                formdata.append("deviceId",model.deviceId);
                formdata.append("sex",model.sex);
                formdata.append("age",model.age);
                let  openid=localStorage.getItem('openId');
                bindUserInfo(openid,formdata).then((res)=>{
                    if(res.resp_code+''==='200'){
                        let data=vm.$store.getters.getUserInfo;
                        data.telephone=model.telephone;
                        console.log('data',data)
                        localStorage.setItem('userInfo',JSON.stringify(data));
                        this.$router.go(-1)
                    }else{
                        Notify({ type: 'warning', message: res.resp_msg});
                    }
                })
            }
        }
    }
</script>

<style lang='scss' scoped>
    .complete-material-page {
        .getCode {
            cursor: pointer;
        }

        .operate-div{
            background-color: #ffffff;
        }
        .sign-protocol {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 48px;
            font-size: 14px;
            padding: 10px;

            a {
                cursor: pointer;

                span {
                    color: #666666;
                }
            }
        }

        .my-input, .my-radio {
            border-bottom: 1px solid #f2efef;
        }

        .footer {
            margin: 20px 16px;
        }
    }
</style>