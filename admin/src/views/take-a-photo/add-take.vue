<template>
    <div class="take-a-photo-add-take">
        <van-form @submit="add">
            <div class="take-a-photo-add-take-item">
                <div class="add-take-top">
                    <span class="app-font-color-65">就诊人</span>
                    <van-button type="primary" size="small" @click="addVisitingPerson">添加</van-button>
                </div>
                <div class="add-take-select">
<!--                    <span>选择就诊人</span>-->
                    <van-field
                            v-model="name"
                            placeholder="请输入"
                            onmousedown="javascript:return false;"
                            @click="showPopup('appSelect')"
                    />
                    <appSelect
                            ref="appSelect"
                            :data="nameData"
                            @change="changeName"
                            :close="onClose"
                    >
                    </appSelect>
                </div>
            </div>

<!--            <div class="take-a-photo-add-take-item">-->
<!--                <div class="details-title"><span class="app-font-color-45">添加年龄</span></div>-->
<!--                <van-field-->
<!--                        v-model="amount"-->
<!--                        placeholder="请输入年龄"-->
<!--                        type="digit"-->
<!--                        :rules="[{ required: true,validator: ()=>lenValidator(1,10000,amount), message: ' ' }]"-->
<!--                />-->
<!--            </div>-->

            <div class="take-a-photo-add-take-item">
                <div class="details-title"><span class="app-font-color-45">我的医生</span></div>
                <div class="add-take-select">
                    <van-field
                            v-model="doctors"
                            placeholder="请输入"
                            onmousedown="javascript:return false;"
                            @click="showPopup('doctorsSelect')"
                    />
                    <appSelect
                            ref="doctorsSelect"
                            :data="doctorsData"
                            @change="changeDoctors"
                    >
                    </appSelect>
                </div>
            </div>

            <div class="take-a-photo-add-take-item">
                <div class="details-title"><span class="app-font-color-45">至少一张</span></div>
                <div class="add-take-item-uploader">
                    <div class="my-up-loader my-camera-up-loader" :class="{'select-img':item}" v-for="(item,index) in fileList" :key="index" @click="albumLoader(['album'],index)">
                        <img v-show="item" :src="item"/>
                        <van-icon v-show="!item" name="plus"/>
                        <span class="close-img" v-if="item" @click.stop="fillDelete(index)">
                            <van-icon  name="plus"/>
                        </span>
                    </div>
                </div>
            </div>

            <div class="take-a-photo-add-take-item">
                <div class="details-title"><span class="app-font-color-45">选择剂型</span></div>
                <van-dropdown-menu>
                    <van-dropdown-item v-model="drugType" :options="options"/>
                </van-dropdown-menu>
            </div>

            <div class="take-a-photo-add-take-item">
                <div class="details-title"><span class="app-font-color-45">添加付数（必填）</span></div>
                <van-field
                        v-model="amount"
                        placeholder="请输入付数"
                        type="digit"
                        :rules="[{ required: true,validator: ()=>lenValidator(1,999,amount), message: ' ' }]"
                />
            </div>

            <div class="take-a-photo-add-take-item">
                <div class="details-title"><span class="app-font-color-45">备注（必填）</span></div>
                <van-field
                        v-model="remark"
                        placeholder="必填"
                        type="textarea"
                        maxlength="200"
                        :rules="[{ required: true,validator: ()=>lenValidator(1,2000,remark), message: ' ' }]"
                />
            </div>

            <div class="footer">
                <van-button round block type="primary" native-type="submit">保存</van-button>
                <van-button v-if="status==='edit'" round block type="default" onclick="deleteList">删除</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
    import appSelect from 'src/components/app-select'
    import {lenValidator, isTelCode} from 'src/utils/util';
    import {getFetchPatientList, getDoctor, uploadFile, feedback} from 'src/api';
    import {Notify} from "vant";
    import {chooseImage, getLocalImgData, init,closeWindow} from "../../utils/share";
    export default {
        data() {
            return {
                show: true,
                name: null,
                value: null,
                nameData: [],
                doctors: null,
                doctorsData: [],
                fileList: [null,null,null],
                drugType: null,
                amount: null,
                remark: null,
                doctorsId: null,
                options: [
                    {text: '颗粒', value: 1},
                    {text: '膏方', value: 2},
                    {text: '单品', value: 3},
                ]
            }
        },
        computed: {
            status() {
                return this.$route.query.status
            }
        },
        components: {appSelect},
        mounted() {
            init();
            this.getFetchPatientList();
            this.getDoctor();
        },
        methods: {
            albumLoader(val,index) {
                let vm = this;
                chooseImage(val, (res) => {
                    let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    let localId = localIds.pop();
                    vm.getLocalImgData(localId,index);
                })
            },
            getLocalImgData(data,index) {
                let vm = this;
                getLocalImgData(data, (res) => {
                    let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                    vm.onPhotoDataSuccess(localData,index);
                })
            },
            dataURLtoFile(dataurl, filename) {
                var arr = dataurl.split(","),
                    mime = arr[0].match(/:(.*?);/)?arr[0].match(/:(.*?);/)[1]:'image/png',
                    bstr = atob(arr[1]?arr[1]:arr[0]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], filename, {type: mime});
            },
            onPhotoDataSuccess(imageData,index) {
                try {
                    let file = this.dataURLtoFile(imageData, (new Date()).valueOf()+'add-take'+index+'.png');
                    let formData = new FormData;
                    formData.append('file', file);
                    console.log('file', file)
                    uploadFile(formData).then(({datas}) => {
                        this.$set(this.fileList,index,datas.url)
                        console.log('this.fileList[index]',index, this.fileList)
                    }).catch(() => {
                    })
                }catch (e) {
                    alert(e)
                }

            },
            changeName(val){
                this.value=val.value;
                this.name=val.name;
            },
            changeDoctors(val){
                this.doctors=val.name;
                this.doctorsId=val.value
            },
            rest() {
                this.show = true;
                this.name = null;
                this.nameData = [];
                this.doctors = null;
                this.doctorsData = [];
                this.fileList = [];
                this.drugType = null;
                this.amount = null;
                this.remark = null;
                this.urlData = {};
            },
            getFetchPatientList() {
                getFetchPatientList(localStorage.getItem('openId')).then(({datas}) => {
                    this.nameData = datas ? datas.map((item) => {
                        return {
                            name: item.realName,
                            value: item.id,
                        }
                    }) : [];
                })
            },
            getDoctor() {
                getDoctor(localStorage.getItem('openId')).then(({datas}) => {
                    this.doctorsData = datas ? datas.map((item) => {
                        return {
                            name: item.doctorName,
                            value: item.doctorId,
                        }
                    }) : [];
                })
            },
            isTelCode(str) {
                return isTelCode(str);
            },
            lenValidator(min, max, value) {
                return lenValidator(min, max, value)
            },
            add() {
                if (!this.name || !this.doctors) {
                    this.$notify({type: 'warning', message: '数据不能为空，请补全数据'});
                    return false;
                }
                let images=this.fileList.filter((item)=>!!item);
                if(images.length===0){
                    this.$notify({type: 'warning', message: '至少选择一张图片'});
                    return false;
                }
                let data = {
                    patientId: this.value,
                    patientName: this.name,
                    doctorId: this.doctorsId,
                    drugType: this.drugType,
                    inquiryType: 2,
                    images: images.join(','),
                    description: this.remark,
                    amount: this.amount,
                    gender: this.$store.getters.getUserInfo.sex,
                    userId: this.$store.getters.getUserInfo.userId
                }
                console.log(data);
                feedback(data).then(() => {
                    Notify({ type: 'success', message: '添加成功'});
                    closeWindow();
                })
            },
            fillDelete(index) {
                this.$set(this.fileList,index,null)
            },
            showPopup(val) {
                this.$refs[val].open();
            },
            onClose() {
                this.show = false;
            },
            addVisitingPerson() {
                this.$router.push({path: '/add-patient-info'})
            },
        }
    }
</script>

<style scoped lang="scss">
    .take-a-photo-add-take {
        .take-a-photo-add-take-item {
            background-color: #ffffff;
            margin-bottom: 20px;

            .add-take-select {
                span {
                    margin-right: 80px;
                }

                select {
                    width: 120px;
                    height: 25px;
                    border-radius: 5px;
                    padding-left: 16px;
                }
            }

            .add-take-item-uploader {
                padding: 10px 16px;
                display: flex;

                .my-up-loader {
                    width: 80px;
                    height: 80px;
                    margin: 0 8px 8px 0;
                    background-color: #f7f8fa;
                    border-radius: 8px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 34px;
                    color: #eae7e7;
                    position: relative;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                    .close-img{
                        position: absolute;
                        right: -4px;
                        top: -4px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 50%;
                        transform: rotate(45deg);
                        font-size: 16px;
                        background-color: #afa3a3;
                        color: #eae7e7;
                    }
                }

            }

            .add-take-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 16px;
                border-bottom: 1px solid #ebedf0;

                > span {
                    font-size: 14px;
                }
            }
        }

        .footer {
            margin: 10px 16px;
        }
    }
</style>