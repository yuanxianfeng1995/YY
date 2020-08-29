<template>
    <div class="registered-harvest-address">
        <div v-if="loading" class="app-mask">
            <van-overlay show>
                <van-loading  type="spinner" color="#ffffff"  size="30px" />
            </van-overlay>
        </div>
        <template v-else>
            <div class="content">
                <template v-if="tableData&&tableData.length>0">
                    <div class="content-item" v-for="(item,index) in tableData" :key="index">
                        <van-cell title="收货人" :value="item.name"></van-cell>
                        <van-cell title="手机号码" :value="item.mobile" :border=" false"></van-cell>
                        <van-cell title="地址" :value="item.provinceName+item.cityName+item.areaName+item.address"
                                  :border=" false"></van-cell>
                        <div class="operating-btn">
                            <span class="app-font-color-selected" @click="edit(index)">编辑</span>
                        </div>
                    </div>
                </template>
                <div class="no-data"  v-else>
                    没有收货地址
                </div>

            </div>
            <div class="footer">
                <van-button round block type="primary" @click.native="add">新增</van-button>
            </div>
        </template>

    </div>
</template>

<script>
    import {userAddress} from 'src/api'

    export default {
        data() {
            return {
                loading: true,
                tableData: []
            }
        },
        created() {
            this.userAddress();
        },
        methods: {
            userAddress() {
                userAddress({userId: this.$store.getters.getUserInfo.userId}).then(({datas}) => {
                    this.tableData = datas;
                    this.loading=false;
                }).catch(()=>{
                    this.loading=false;
                })
            },
            edit(index) {
                this.$router.push({path: "/add-address", query: {status: 'edit',index: index}});
            },
            add() {
                this.$router.push("/add-address");
            }
        }
    }
</script>

<style lang='scss' scoped>
    .registered-harvest-address {
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
            }
        }

        .footer {
            padding: 0 10px;
        }
    }
</style>