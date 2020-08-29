<template>
    <div class="complete-material-page-1">
        <div v-if="loading" class="app-mask">
            <van-overlay show>
                <van-loading  type="spinner" color="#ffffff"  size="30px" />
            </van-overlay>
        </div>
        <template  v-else>
            <div class="content">
                <template v-if="tableData&&tableData.length>0">
                    <div class="content-item" v-for="(item,index) in tableData" :key="index">
                        <van-cell title="就诊人" size="large" :value="item.realName"></van-cell>
                        <van-cell title="性别" :value="item.sex+''==='1'?'男':'女'"  :border=" false"></van-cell>
                        <van-cell title="年龄" :value="item.age"  :border="false"></van-cell>
                        <van-cell title="关系" :value="formatRelationship(item.relationship)" :border="false"></van-cell>
                        <div class="operating-btn">
                            <span class="app-font-color-45" @click="edit(item)">编辑</span><span @click="preview(item)" class="app-font-color-selected">查看</span>
                        </div>
                    </div>
                </template>
                <div class="no-data"  v-else>
                    没有患者
                </div>
            </div>
            <div class="footer">
                <van-button round block type="primary" @click.native="add">
                    新增患者
                </van-button>
            </div>
        </template>

    </div>
</template>

<script>
    import {getFetchPatientList} from 'src/api'
    export default {
        data() {
            return {
                loading: true,
                tableData: []
            }
        },
        computed:{},
        created(){
            this.getFetchPatientList();
        },
        methods: {
            formatRelationship(val){
                let txt=null;
                switch (val+'') {
                    case '1':
                        txt='本人';
                        break;
                    case '2':
                        txt='家人';
                        break;
                    case '3':
                        txt='亲戚';
                        break;
                    case '4':
                        txt='朋友';
                        break;
                }
                return txt
            },
            getFetchPatientList(){
                getFetchPatientList(localStorage.getItem('openId')).then(({datas})=>{
                    this.tableData=datas;
                    this.loading=false;
                }).finally(()=>{
                    this.loading=false;
                })
            },
            preview(data){
                this.$router.push({path:"/add-patient-info",query: {status: 'preview',id: data.id}});
            },
            edit(data){
                this.$router.push({path:"/add-patient-info",query: {status: 'edit',id: data.id}});
            },
            add() {
                this.$router.push("/add-patient-info");
            }
        }
    }
</script>

<style lang='scss' scoped>
    .complete-material-page-1 {
        .footer{
            padding: 0 10px;
            margin-bottom: 10px;
        }
    }
</style>