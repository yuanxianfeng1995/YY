<template>
    <div class="take-a-photo">
        <div class="take-a-photo-item">
            <div class="details-title"><span class="app-font-color-45">拍照须知</span></div>
            <div class="text-content">
                <p class="app-font-color-85">须知明细</p>
                <p class="app-font-color-45">1、接受机打或手写处方</p>
                <p class="app-font-color-45">2、上传处方须包含：医院或诊所名称、贴数、服药方法、处方开具时间、医生签名。如确实以上任一内容，将无法......</p>
                <p class="app-font-color-45">3、仅支持对近30天内开出的处方进行转方</p>
            </div>
        </div>

        <div class="take-a-photo-item">
            <div class="details-title"><span class="app-font-color-45">图片实例（手写或机打）</span></div>
            <div class="img-content">
                <img src=""/>
                <img src=""/>
            </div>
        </div>

        <div class="footer">
            <van-button round block type="primary" @click="ok">马上拍照抓方</van-button>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
            }
        },
        methods:{
            ok(){
                this.$router.push('/add-take')
            }
        }
    }
</script>

<style scoped lang="scss">
.take-a-photo{
    .take-a-photo-item{
        background-color: #ffffff;
        margin-bottom: 20px;
        .text-content{
            padding: 10px 16px;
            p{
                margin-bottom: 10px;
            }
            p:first-child{
                font-size: 18px;
            }
        }
    }
    .footer{
        margin: 0 16px;
    }
}
</style>