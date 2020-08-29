<template>
    <div class="order-pay-order-list">
        <div class="order-list-header">
            <ul>
                <li @click="formData(0)" :class="{active: active===0}">全部</li>
                <li @click="formData(1)" :class="{active: active===1}">未支付</li>
                <li @click="formData(2)" :class="{active: active===2}">已完成</li>
                <li @click="formData(5)" :class="{active: active===5}">已过期</li>
            </ul>
        </div>
        <div v-if="loading" class="app-mask">
            <van-overlay show>
                <van-loading type="spinner" color="#ffffff" size="30px"/>
            </van-overlay>
        </div>
        <template v-else>
            <div class="order-list-main" v-if="tableData.length>0">
                <template>
                    <div class="order-list-main-item" v-for="(item,index) in tableData" :key="index">
                        <div class="item-header">
                            <span>处方金额</span>
                            <span class="app-color-font-85">{{item.paymoney}}</span>
                        </div>
                        <div class="item-content">
                            <van-cell title="订单号" :value="item.dh" :border="false"></van-cell>
                            <van-cell title="就诊人" :value="item.patientName" :border="false"></van-cell>
                            <van-cell title="主治医生" :value="item.doctorName" :border="false"></van-cell>
                            <van-cell title="开方时间" :value="item.createTime" :border="false"></van-cell>
                        </div>
                        <div class="operating-btn">
                            <span @click="preview(item.dh)" class="app-font-color-selected">{{item.status+''==='1'?'支付':'查看'}}</span>
                        </div>
                    </div>
                </template>
            </div>
            <div class="no-data" v-else>
                <van-empty description="没有数据" />
            </div>
        </template>

    </div>
</template>

<script>
    import {getFetchOrderList} from 'src/api'

    export default {
        name: "order-list",
        data() {
            return {
                active: 0,
                loading: true,
                tableData: [],
                copyTableData: []
            }
        },
        created() {
            this.getList(0);
        },
        methods: {
            getList(val) {
                this.loading = true;
                getFetchOrderList(this.$store.getters.getUserInfo.userId, val).then(({datas}) => {
                    this.tableData = datas;
                    this.copyTableData = JSON.parse(JSON.stringify(datas));
                    this.loading = false;
                }).finally(() => {
                    this.loading = false;
                })
            },
            preview(data) {
                this.$router.push({path: "/order-details", query: {dh: data}});
            },
            formData(val) {
                //0.全部 1.未支付 2.已完成 5.已过期
                this.getList(val)
                this.active = val;
            }
        }
    }
</script>

<style lang="scss">
    .order-pay-order-list {
        padding-top: 42px;
        position: relative;

        .van-cell {
            color: #969799;
        }

        .order-list-header {
            background-color: #ffffff;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 42px;
            z-index: 2;

            ul {
                border: 1px solid #dcd9d9;
                display: flex;
                justify-content: center;
                width: 100%;
                height: 40px;
            }

            li {
                border-right: 1px solid #dcd9d9;
                flex: 1;
                height: 100%;
                line-height: 40px;
                text-align: center;
                cursor: pointer;
                color: #666666;

                &:last-child {
                    border-right: none;
                }
            }

            .active {
                color: red;
            }
        }

        .order-list-main {
            margin-bottom: 20px;
            background-color: #ecebeb;

            .item-header {
                padding: 10px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #ebedf0;

                span {
                    font-size: 16px;

                    &:last-child {
                        font-size: 20px;
                        font-weight: 600;
                    }
                }
            }
        }

        .order-list-main-item {
            background-color: #ffffff;
        }
    }
</style>