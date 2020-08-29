<template>
    <div class="free-consultation-doctors-details">
        <div v-if="loading" class="app-mask">
            <van-overlay show>
                <van-loading type="spinner" color="#ffffff" size="30px"/>
            </van-overlay>
        </div>
        <template v-else>
            <div class="avatar"><img :src="data.headMg"/></div>
            <div class="main">
                <dl>
                    <dt>【医生简介】</dt>
                    <dd>{{data.doctorInfo}}</dd>
                </dl>
                <dl>
                    <dt>【专业擅长】</dt>
                    <dd>{{data.goodAt}}</dd>
                </dl>
                <dl>
                    <dt>【医生公告】</dt>
                    <dd>{{data.latestAnnouncement}}</dd>
                </dl>
                <dl>
                    <dt>【资费解释】</dt>
                    <dd>{{data.tariffExplanation}}</dd>
                </dl>
            </div>
            <div class="footer">
                <van-button round block type="primary" @click="advisory">{{data.isPay+''==='1'?'立即免费咨询':`线上咨询费 ${data.consultingPrice||1}元 立即购买`}}</van-button>
            </div>
        </template>
    </div>
</template>

<script>
    import {getDoctorInfo} from 'src/api'

    export default {
        name: "doctors-details",
        data() {
            return {
                data: {},
                loading: true
            }
        },
        computed: {
            getId() {
                return this.$route.query.id
            }
        },
        mounted() {
            this.getDoctorInfo();
        },
        methods: {
            getDoctorInfo() {
                getDoctorInfo(this.getId, localStorage.getItem('openId')).then(({datas}) => {
                    this.data = datas;
                    this.loading=false;
                }).catch(()=>{
                    this.loading=false;
                })
            },
            advisory() {
                if(this.data.isPay+''==='1'){
                    this.$router.push({path: "/doctors-chat",
                        query: {
                            doctorId: this.data.doctorId,
                            qrCode: this.data ? this.data.headMg : null,
                            rongUserId: this.data ? this.data.rongUserId : null
                        }
                    })
                }else{
                    this.$router.push({path: "/advisory-details",
                        query: {
                            doctorId: this.data.doctorId,
                            doctorName: this.data.doctorName,
                            paymoney: this.data.consultingPrice,
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .free-consultation-doctors-details {
        .avatar {
            padding: 16px;

            img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
            }
        }

        .main {
            dl {
                background-color: #ebeaea;
                margin-bottom: 20px;
                padding: 20px;
                text-align: left;
                color: #666666;
                font-size: 14px;

                dt {
                    font-size: 16px;
                    margin-bottom: 10px;
                    font-weight: bold;
                }
            }
        }

        .footer {
            margin: 20px 16px;
        }
    }
</style>