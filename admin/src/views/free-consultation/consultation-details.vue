<template>
    <div class="free-consultation-consultation-details">
        <div class="consultation-details-item">
            <div class="details-title"><span class="app-font-color-45">问诊信息</span></div>
            <van-cell title="状态" :value="model.inquiryStatus||model.inquiryStatus===0?(model.inquiryStatus+'0'?'待诊断': '已诊断'):null" :border=" false"></van-cell>
            <van-cell title="时间" :value="model.createTime" :border=" false"></van-cell>
            <van-cell title="医生" :value="model.doctorName" :border=" false"></van-cell>
        </div>

        <div class="consultation-details-item">
            <div class="details-title"><span class="app-font-color-45">基本体征</span></div>
            <van-cell v-for="(item,index) in model.items" :title="item.title" :value="signs(item)" :key="index" :border=" false"></van-cell>
            <van-cell title="症状补充说明" :value="model.description"></van-cell>
        </div>

        <div class="consultation-details-item">
            <div class="details-title"><span class="app-font-color-45">图片（舌苔，病灶，检验报告等）</span></div>
            <div class="img-list" v-if="model.images">
                <img v-for="(item,index) in model.images.split(',')" :key="index+'img'" :src="item" @click="openImg(item)"/>
            </div>
        </div>

        <van-overlay :show="show" @click="show = false" :duration="0.5">
            <div class="wrapper">
                <img :src="imgUrl"/>
            </div>
        </van-overlay>
    </div>
</template>

<script>
    import {interfaceDetail} from 'src/api'
    export default {
        data(){
            return{
                model: {},
                show: false,
                imgUrl:null
            }
        },
        computed: {
            getId() {
                return this.$route.query.id || '1261717424684490753'
            }
        },
        created() {
            this.interfaceDetail();
        },
        methods:{
            openImg(src){
                this.show=true;
                this.imgUrl=src;
                console.log(src)
            },
            signs(data){
              if(data.questionType+''==='1'||data.questionType+''==='2'){
                  let arr=data.content.split('|');
                  let arr1=data.result.split(',').map((item,index)=>{
                      return arr[index]
                  });
                  return arr1.join(',')
              }else{
                  return data.result
              }
            },
            interfaceDetail(){
                interfaceDetail(this.getId).then(({datas})=>{
                    this.model=datas;
                })
            }
        }
    }
</script>

<style scoped lang="scss">
.free-consultation-consultation-details{
    background-color: #f2f2f2;
    >div{
        margin-bottom: 20px;
    }
    .consultation-details-item{
        .img-list{
            width: 90%;
            margin: 10px auto 10px auto;
            img{
                width: 46%;
                margin-right: 4%;
                vertical-align: top;
            }
        }
        .content{
            background-color: #ffffff;
            padding: 10px 16px;
            font-size: 14px;
        }
    }

}
</style>