<template>
    <div class="free-consultation-my-doctors">
        <div v-if="loading" class="app-mask">
            <van-overlay show>
                <van-loading type="spinner" color="#ffffff" size="30px"/>
            </van-overlay>
        </div>
        <template v-else>
            <template v-if="doctorsData.length>0">
                <div class="free-consultation-my-doctors-item" v-for="(item,index) in doctorsData"
                     :key="index">
                    <div class="main">
                        <div class="my-doctors-item-l">
                            <img :src="item.headMg"/>
                        </div>
                        <div class="my-doctors-item-r">
                            <div class="title app-font-color-85">{{item.doctorName}}</div>
                            <p class="app-font-color-45">{{item.postTitle+'|'+item.hospitalName}}</p>
                            <p class="app-font-color-45">{{item.latestAnnouncement}}</p>
                        </div>
                    </div>
                    <div class="operating-btn">
                        <span class="app-font-color-45" @click="details(item)">查看</span>
                        <span @click="preview(item)" class="app-font-color-selected">{{`咨询（${item.consultingPrice}元/次）`}}</span>
                    </div>
                </div>
            </template>
            <div class="no-data" v-else>
                <van-empty description="没有数据" />
            </div>

        </template>
    </div>
</template>

<script>
    import {getDoctor, getDoctorInfo} from 'src/api'

    export default {
        name: "my-doctors",
        data() {
            return {
                doctorsData: [],
                loading: true
            }
        },
        mounted() {
            console.log('my-doctors')
            this.getDoctor();
        },
        methods: {
            getDoctor() {
                console.log('getDoctor')
                getDoctor(localStorage.getItem('openId')).then(({datas}) => {
                    this.doctorsData = datas || [];
                    this.loading=false;
                }).catch(()=>{
                    this.loading=false;
                })
            },
            details(data) {
                this.$router.push({path: '/doctors-details', query: {id: data.doctorId}});
            },
            preview(data) {
                getDoctorInfo(data.doctorId, localStorage.getItem('openId')).then(({datas}) => {
                    this.$router.push({path: "/doctors-chat",
                        query: {
                            doctorId: data.doctorId,
                            qrCode: datas.headMg,
                            rongUserId: datas.rongUserId
                        }
                    })
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .free-consultation-my-doctors {
        .main {
            display: flex;
            padding: 10px 10px 10px 40px;
            font-size: 14px;

            .my-doctors-item-l {
                width: 60px;
                margin-right: 20px;

                img {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                }
            }

            .title {
                font-size: 16px;
            }
        }

        .my-doctors-item-r{
            padding-top: 5px;
        }
        .free-consultation-my-doctors-item {
            background-color: #ffffff;
        }

        .operating-btn {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 48px;
            border-top: 1px solid #f2efef;
            border-bottom: 1px solid #f2efef;
            margin-bottom: 20px;

            span {
                display: block;
                flex: 1;
                height: 100%;
                line-height: 48px;
                text-align: center;

                &:first-child {
                    border-right: 1px solid #f2efef;
                }
            }
        }
    }
</style>