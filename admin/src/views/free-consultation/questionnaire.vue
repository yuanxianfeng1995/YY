<template>
    <div class="free-consultation-questionnaire">
        <div class="header app-font-color-65">
            请务必认真填写问诊单，资料提供尽可能详细，可以提高问诊效率和准确性，您的资料仅医生可见，醴陵慈诊方将充分保证您的隐私。
        </div>
        <div class="main">
            <van-form @submit="submit">
                <div class="visiting-person">
                    <div class="visiting-person-top">
                        <span class="app-font-color-65">就诊人</span>
                        <van-button type="primary" size="small" @click="addVisitingPerson">添加</van-button>
                    </div>
                    <div class="visiting-person-content">
                        <van-dropdown-menu>
                            <van-dropdown-item v-model="model.name" :options="nameData"/>
                        </van-dropdown-menu>
                    </div>
                </div>
                <div class="uploader-img">
                    <van-field
                            v-model="model.description"
                            type="textarea"
                            placeholder="请输入补充说明"
                            maxlength="5000"
                    />
                    <div class="uploader-img-title">舌苔，病灶，检验报告等图片，至少一张</div>
<!--                    <van-uploader-->
<!--                            use-before-read-->
<!--                            max-count="4"-->
<!--                            multiple-->
<!--                            accept="image"-->
<!--                            upload-icon="plus"-->
<!--                            :max-size="3 * 1024 * 1024"-->
<!--                            :before-delete="fillDelete"-->
<!--                            :after-read="afterRead"-->
<!--                    />-->
                    <div class="questionnaire-item-uploader">
                        <div class="my-up-loader my-camera-up-loader" :class="{'select-img':item}"
                             v-for="(item,index) in fileList" :key="index" @click="albumLoader(['album'],index)">
                            <img v-show="item" :src="item"/>
                            <van-icon v-show="!item" name="plus"/>
                            <span class="close-img" v-if="item" @click.stop="fillDelete(index)">
                            <van-icon name="plus"/>
                        </span>
                        </div>
                    </div>
                </div>
                <div class="problem">
                    <div class="problem-title">补充问题</div>
                    <div class="problem-item" v-for="(item,index) in data" :key="index">
                        <template v-if="item.questionType+''==='0'">
                            <div class="problem-item-title app-font-color-65">{{item.title+'（问答题）'}}</div>
                            <van-field
                                    v-model="supplementData['supplemen'+index]"
                                    type="textarea"
                                    placeholder="请输入"
                                    maxlength="5000"
                            />
                        </template>

                        <template v-if="item.questionType+''==='1'">
                            <div class="problem-item-title app-font-color-65">{{item.title+'（单选题）'}}</div>
                            <van-radio-group v-model="supplementData[('supplemen'+index)]" class="page-checkbox-group">
                                <van-radio :name="item" v-for="(item,index) in formData(item.content)"
                                           :key="index+'sweatingList'" checked-color="#07c160">{{item}}
                                </van-radio>
                            </van-radio-group>
                        </template>

                        <template v-if="item.questionType+''==='2'">
                            <div class="problem-item-title app-font-color-65">{{item.title+'（多选题）'}}</div>
                            <van-checkbox-group v-model="supplementData['supplemen'+index]" class="page-checkbox-group">
                                <van-checkbox shape="square" checked-color="#07c160" :name="index"
                                              v-for="(item,index) in formData(item.content)"
                                              :key="index+'sweatingList2'">{{item}}
                                </van-checkbox>
                            </van-checkbox-group>
                        </template>

                    </div>

                </div>
                <div class="footer">
                    <van-button round block type="primary" native-type="submit">提交</van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<script>
    import {feedback, getFetchPatientList, uploadFile, interfaceDoctor} from 'src/api'
    import {chooseImage, getLocalImgData, init} from "../../utils/share";

    export default {
        name: "questionnaire",
        data() {
            return {
                urlData: [],
                model: {
                    patientId: null,
                    patientName: null,
                    gender: null,
                    description: null,
                    images: null,
                    doctorId: null,
                    inquiryId: '1',
                    inquiryTitle: '',
                    inquiryType: '1',
                    feel: [],
                    sweating: [],
                    disease: []
                },
                interfaceData: null,
                fileList: [null, null, null],
                nameData: [],
                supplementData: {},
                data: [],
            }
        },
        created() {
            init();
            if (this.getId) this.interfaceDoctor();
            this.getFetchPatientList();
        },
        computed: {
            getDoctorId() {
                return this.$route.query.doctorId
            },
            getId() {
                return this.$route.query.id
            },
            rongUserId() {
                return this.$route.query.rongUserId
            },
            getQrCode() {
                return this.$route.query.qrCode
            },
            getInquiryTitle() {
                return this.$route.query.inquiryTitle
            }
        },
        methods: {
            afterRead(data){
              console.log('afterRead',data);
                let formData = new FormData;
                formData.append('file', data.file);
                uploadFile(formData).then(({datas}) => {
                    this.$set(this.fileList, 1, datas.url)
                    console.log('this.fileList[index]', this.fileList)
                }).catch(() => {
                })
            },
            albumLoader(val, index) {
                let vm = this;
                chooseImage(val, (res) => {
                    let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    let localId = localIds.pop();
                    vm.getLocalImgData(localId, index);
                })
            },
            getLocalImgData(data, index) {
                let vm = this;
                getLocalImgData(data, (res) => {
                    let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                    vm.onPhotoDataSuccess(localData, index);
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
            onPhotoDataSuccess(imageData, index) {
                let file = this.dataURLtoFile(imageData, (new Date()).valueOf()+'add-take'+index+'.png');
                let formData = new FormData;
                formData.append('file', file);
                console.log('file', file)
                uploadFile(formData).then(({datas}) => {
                    this.$set(this.fileList, index, datas.url)
                    console.log('this.fileList[index]', index, this.fileList)
                }).catch(() => {
                })
            },
            formData(val) {
                return val.split('|').filter((item) => {
                    return !!item
                });
            },
            interfaceDoctor() {
                let vm = this;
                let data = {};
                interfaceDoctor({id: vm.getId}).then(({datas}) => {
                    datas.items.forEach((item, index) => {
                        data['supplemen' + index] = item.questionType + '' === '2' ? [] : null;
                    });
                    vm.supplementData = data;
                    vm.interfaceData = datas;
                    vm.data = datas.items;
                })
            },
            onChange(val, type) {
                this.model[type] = val
            },
            addVisitingPerson() {
                this.$router.push({path: '/add-patient-info'})
            },
            fillDelete(index) {
                this.$set(this.fileList, index, null)
            },
            getFetchPatientList() {
                getFetchPatientList(localStorage.getItem('openId')).then(({datas}) => {
                    this.nameData = datas ? datas.map((item) => {
                        return {
                            text: item.realName,
                            value: item.id,
                        }
                    }) : [];
                })
            },
            submit() {
                if (!this.model.name) {
                    this.$notify({type: 'warning', message: '数据不能为空，请补全数据'});
                    return false;
                }
                for (let i in this.supplementData) {
                    if (typeof (this.supplementData[i]) === 'string' ? !this.supplementData[i] : this.supplementData[i].length === 0) {
                        this.$notify({type: 'warning', message: '数据不能为空，请补全数据'});
                        return false;
                    }
                }
                if(!this.interfaceData){
                    this.$notify({type: 'warning', message: '当前问诊单以失效'});
                    return;
                }

                let vm = this;
                let nameData = vm.nameData.find((item) => item.value === vm.model.name);
                feedback({
                    images: this.fileList.filter((item)=>!!item).join(','),
                    description: vm.model.description,
                    patientId: nameData.value,
                    patientName: nameData.name,
                    doctorId: vm.getDoctorId,
                    inquiryId: vm.interfaceData.id,
                    inquiryTitle: vm.interfaceData.inquiryTitle,
                    inquiryType: 1,
                    gender: vm.$store.getters.getUserInfo.sex,
                    userId: vm.$store.getters.getUserInfo.userId,
                    items: vm.data.map((item, index) => {
                        return {
                            questionType: item.questionType,
                            title: item.title,
                            content: item.content,
                            result: typeof (vm.supplementData['supplemen' + index]) === 'string' ?
                                vm.supplementData['supplemen' + index] : vm.supplementData['supplemen' + index].join(','),
                            sort: item.sort,
                        }
                    })
                }).then(({datas}) => {
                    this.$notify({type: 'success', message: '添加成功'});
                    this.$router.push({
                        path: '/doctors-chat', query: {
                            qrCode: vm.getQrCode,
                            rongUserId: vm.rongUserId,
                            id: datas,
                            doctorId: vm.getDoctorId,
                            finish: true
                        }
                    })
                })
            }
        }
    }
</script>

<style lang="scss">
    .free-consultation-questionnaire {
        .main {
            background-color: #f2f2f2;
        }

        .visiting-person {
            background-color: #fff;
            margin-bottom: 20px;

            .visiting-person-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0 16px;
                padding: 10px 0;

                > span {
                    font-size: 14px;
                }
            }
        }

        .header {
            padding: 10px;
            font-size: 14px;
            height: 50px;
            background-color: #faf8ff;
        }

        .van-uploader {
            padding: 0 16px;
        }

        .uploader-img {
            background-color: #fff;
            margin-bottom: 20px;

            .uploader-img-title {
                padding: 10px 16px;
            }
        }

        .problem-title {
            background-color: #ffffff;
            margin-bottom: 20px;
            padding: 10px 16px;
        }

        .problem-item {
            background-color: #ffffff;
            margin-bottom: 20px;
            padding: 20px 16px;

            .problem-item-title {
                text-align: center;
                margin-bottom: 10px;
            }
        }

        .questionnaire-item-uploader{
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
            @media screen and (max-width: 350px) {
                .my-up-loader {
                    width: 65px;
                    height: 65px;
                }
            }

        }
        
        .footer {
            margin: 20px 16px;
        }
    }
</style>