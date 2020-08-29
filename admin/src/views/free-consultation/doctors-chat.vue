<template>
  <div class="chat">
    <!--header-->
    <!--        <header class="header">-->
    <!--            <span class="title">{{stat.nickname}}</span>-->
    <!--        </header>-->
    <!--header-->

    <!--chat-content-->
    <div class="chat-content" ref="content">
      <div class="more" @click="more">查看更多</div>
      <div class="message-wrapper">
        <div v-for="(item,index) in data" :key="index">
          <div class="time" v-if="item.time">{{item.time}}</div>
          <div :class="item.type===1?'wrapper-r':'wrapper-l'">
            <div
              class="wzd"
              v-if="item.extra"
              @click="item.type===1?shoWithdraw($event,index):null"
            >
              <div class="wzd-header">{{item.title}}</div>
              <div class="wzd-content">{{item.content}}</div>
              <div class="wzd-down" v-if="item.hidden">
                <a
                  :href="`/#/doctors-details?id=${doctorId||rongUserId?rongUserId.split('_')[0]:''}`"
                >{{item.link.label}}</a>
              </div>
              <div class="wzd-down" v-else>
                <a
                  :href="`/#/${item.finish?'consultation-details':'questionnaire'}?id=${item.link.url}&doctorId=${doctorId||rongUserId?rongUserId.split('_')[0]:''}&rongUserId=${rongUserId}&qrCode=${getQrCode}`"
                >{{item.link.label}}</a>
              </div>
            </div>
            <div v-else @click="item.type===1?shoWithdraw($event,index):null" class="send-self">
              <p v-if="item.imgUrl">
                <span v-if="item.text">{{item.text}}</span>
                <img :src="item.imgUrl" @click="openImg(item.imgUrl)" />
              </p>
              <p v-else>
                <span>{{item.text}}</span>
              </p>
            </div>
            <span v-if="isWithdrawId===index&&item.type===1" class="withdraw" @click="withdraw">撤回</span>
            <div class="img">
              <img :src="item.type===1?getUserImg:getQrCode" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--chat-content-->

    <!--footer-->
    <footer class="footer" :class="{'show-unfold': show}" ref="footer">
      <div class="input">
        <img class="voice" src="../../assets/voice.png" @click="()=>this.record=!this.record" />
        <div class="message-wrap">
          <van-field rows="1" type="textarea" autosize v-model="stat.sendMsgVal" maxlength="200" />
        </div>
        <span v-show="stat.sendMsgVal" @click="blurMsg">发送</span>
        <van-icon v-show="!stat.sendMsgVal" name="add-o" @click="add" />
      </div>

      <div v-if="record" class="record-panel">
        <span class="record-panel-title">{{recordMsg}}</span>
        <div
          class="record-panel-content"
          @touchstart="gtouchstart"
          @touchmove="gtouchmove"
          @touchend="gtouchend"
        >
          <div class="recording" />
        </div>
      </div>

      <div v-if="show" class="unfold">
        <div class="my-up-loader my-album-up-loader" @click="albumLoader('camera',1)">
          <van-loading size="24px" v-show="loading&&index===1" vertical>加载中...</van-loading>
          <svg
            v-show="!(loading&&index===1)"
            class="icon"
            style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2079"
          >
            <path
              d="M511.9 879.8c-115.2 0-230.4-0.1-345.6 0.1-17.7 0-34.7-2.2-50.2-10.8-33.6-18.5-51.7-47.1-51.8-85.5-0.3-150.5-0.4-301 0-451.4 0.1-42.2 29.8-80.9 75.4-89.9 7.6-1.5 15.5-2 23.3-2 29.3-0.2 58.6-0.2 87.9 0 3.9 0 5.7-1 6.9-4.8 6.4-19.9 13.1-39.6 19.7-59.4 6.6-19.8 23.2-31.9 44.1-31.9h380.6c19.8 0 38.3 13.5 44.6 32.4 6.6 19.8 13.3 39.6 19.7 59.4 1 3.2 2.5 4.3 6 4.3 32.3-0.1 64.6-0.4 96.9 0.2 42.5 0.8 79.4 31.8 88 73.4 1.7 8.2 2.6 16.6 2.6 25 0.2 147.8 0.1 295.5 0.1 443.3 0 31.2-11.2 57.5-35.8 77.2-18.4 14.8-39.8 20.4-63.2 20.4H511.9z m-0.1-47.7c116.6 0 233.2-0.3 349.9 0.2 26.8 0.1 50.8-22.5 50.8-50.9-0.3-147.5-0.1-295-0.2-442.4 0-4.2-0.5-8.5-1.3-12.7-4-19.8-23.9-38.8-48.4-38.5-41.8 0.4-83.6 0.1-125.4 0.2-2.8 0-4.2-0.5-5.2-3.5-9.6-29.3-19.5-58.4-29.1-87.7-1.3-3.9-3-5.1-7.1-5.1-83.6 0.1-167.2 0.1-250.9 0.1H327.6c-2.5 0-4.5 0-5.5 3.2-9.7 29.4-19.6 58.7-29.2 88.1-1.2 3.7-2.6 5-6.7 5-41.5-0.2-83.1 0.3-124.6-0.2-26.6-0.3-49.8 23.1-49.8 50 0.3 147.9 0.1 295.8 0.2 443.7 0 4.2 0.5 8.5 1.3 12.7 3.9 19 23.4 38.2 49.2 38.1 116.4-0.5 232.8-0.3 349.3-0.3z"
              p-id="2080"
            />
            <path
              d="M511.8 751.8c-125.5-0.2-223.8-99.3-223.5-225.1 0.3-124 99.8-222.6 224.1-222.5 121.4 0.1 223.4 95.8 223.4 224.6-0.1 124.5-99.6 223.2-224 223z m-0.1-47.7c95.6 0.4 176.2-79.6 176.4-175.3 0.3-96.3-79.6-176.5-175.9-176.8-94.7-0.3-175.3 79.2-176.4 172.8-1.2 98.2 79.9 179.4 175.9 179.3zM768.2 386.8c0-27.8 23.3-50.8 51.3-50.7 28 0.1 51.1 23.5 50.9 51.7-0.2 27.6-23.4 50.5-51.2 50.5-28.2 0-51-23.1-51-51.5z"
              p-id="2081"
            />
          </svg>
        </div>
        <div class="my-up-loader my-camera-up-loader" @click="albumLoader('album',2)">
          <van-loading size="24px" v-show="loading&&index===2" vertical>加载中...</van-loading>
          <van-icon v-show="!(loading&&index===2)" name="plus" />
        </div>
      </div>
    </footer>

    <van-overlay :show="maskShow" @click="maskShow = false" :duration="0.5">
      <div class="wrapper">
        <img :src="maskImgUrl" />
      </div>
    </van-overlay>
    <!--footer-->
  </div>
</template>

<script>
import im from "src/utils/chat";
import { chatMessage, uploadFile } from "src/api";
import { Notify } from "vant";
import {
  chooseImage,
  getLocalImgData,
  init,
  startRecord,
  stopRecord,
  uploadVoice,
  downloadVoice,
} from "src/utils/share";

export default {
  data() {
    return {
      show: false,
      isWithdrawId: null,
      urlData: null,
      fileList: [],
      instance: "",
      data: [],
      maskShow: null,
      maskImgUrl: null,
      loading: false,
      index: null,
      finish: false,
      record: false,
      recordMsg: "按住说话",
      posStart: 0,
      posEnd: 0,
      starTime: null,
      copyMessages: [],
      stat: {
        messageList: [],
        sendMsgVal: "",
      },
      sentTime: null,
    };
  },
  computed: {
    rongUserId() {
      return this.$route.query.rongUserId;
    },
    getId() {
      return this.$route.query.id;
    },
    doctorId() {
      return this.$route.query.doctorId;
    },
    getQrCode() {
      return this.$route.query.qrCode;
    },
    getUserImg() {
      return this.$store.getters.getUserInfo.headImag;
    },
  },
  mounted() {
    init();
    let url = window.location.href;
    this.finish = url.includes("finish");
    let data = this.$store.getters.getUserInfo;
    let userInfo = {
      appKey: "qd46yzrfqxgzf",
      token: data.rongToken,
    };

    let callback = {
      receive: (val) => {
        this.data = this.data.concat(this.formData(val));
      },
      status: () => {
        let vm = this;
        console.log("status", this.finish);
        //im.clearMessages(vm.rongUserId);
        im.getMessages(vm.rongUserId, 0, (val) => {
          let data = val.filter((item) => {
            return item.messageType !== "RC:RcCmd";
          });
          vm.data = this.formData(data).concat(vm.data);
          vm.setLen();
          if (this.finish) {
            this.chatMessage(
              "问诊单",
              "RC:TxtMsg",
              JSON.stringify({
                title: "提交成功",
                content: "问诊单资料提交成功",
                finish: "true",
                link: { label: "点击查看", url: this.getId },
              })
            );
            this.$router.replace({
              path: "/doctors-chat",
              query: {
                doctorId: vm.doctorId,
                qrCode: vm.getQrCode,
                rongUserId: vm.rongUserId,
              },
            });
          }
        });
      },
    };
    im.init(userInfo).then(() => {
      im.connect(
        {
          token: userInfo.token,
        },
        callback
      );
    });
  },
  methods: {
    openImg(src) {
      this.maskShow = true;
      this.maskImgUrl = src;
      console.log(src);
    },
    gtouchstart(event) {
      this.posStart = event.touches[0].pageY || 0; //获取起点坐标
      this.recordMsg = "松开 结束";
      this.starTime = new Date().valueOf();
      startRecord();
    },
    gtouchmove(event) {
      let posStart = this.posStart;
      let posMove = event.targetTouches[0].pageY; //获取滑动实时坐标
      if (posStart - posMove < 20) {
        this.recordMsg = "松开 结束";
      } else {
        this.recordMsg = "上划取消发送";
      }
    },
    gtouchend(event) {
      let vm = this;
      let posStart = vm.posStart;
      let posEnd = event.changedTouches[0].pageY || 0; //获取终点坐标
      vm.posEnd = posEnd;
      if (
        posStart - posEnd > 20 &&
        (new Date().valueOf() - this.starTime) / 1000 < 2
      ) {
        Notify({ type: "warning", message: "上划取消发送" });
      } else {
        stopRecord((val) => {
          alert(val);
          vm.uploadVoice(val);
        });
      }
    },
    uploadVoice(localId) {
      uploadVoice(localId, (res) => {
        this.downloadVoice(res.serverId);
      });
    },
    downloadVoice(serverId) {
      downloadVoice(serverId, (res) => {
        alert(JSON.stringify(res));
      });
    },
    withdraw() {
      let vm = this;
      let data = vm.data[vm.isWithdrawId];
      console.log("data", vm.isWithdrawId, data, vm.copyMessages);
      im.withdraw(data, () => {
        vm.data.splice(vm.isWithdrawId, 1);
        if (vm.isWithdrawId === 0) {
          vm.sentTime === vm.data[0].sentTime;
        }
        vm.isWithdrawId = null;
      });
    },
    shoWithdraw(e, index) {
      if (this.isWithdrawId === index) {
        this.isWithdrawId = null;
        return;
      }
      let data = this.data[index];
      if ((new Date().valueOf() - data.sentTime) / (60 * 1000) < 10) {
        console.log(e, index, data);
        this.isWithdrawId = index;
      }
    },
    albumLoader(val, index) {
      let vm = this;
      this.loading = true;
      this.index = index;
      chooseImage(
        [val],
        (res) => {
          let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          let localId = localIds.pop();
          vm.getLocalImgData(localId);
        },
        () => {
          vm.loading = false;
        }
      );
    },
    getLocalImgData(data) {
      let vm = this;
      getLocalImgData(data, (res) => {
        let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
        vm.onPhotoDataSuccess(localData);
      });
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)
          ? arr[0].match(/:(.*?);/)[1]
          : "image/png",
        bstr = atob(arr[1] ? arr[1] : arr[0]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    onPhotoDataSuccess(imageData) {
      let file = this.dataURLtoFile(
        imageData,
        new Date().valueOf() + "doctors-chat.png"
      );
      let formData = new FormData();
      formData.append("file", file);
      console.log("file", file);
      uploadFile(formData)
        .then(({ datas }) => {
          this.urlData = datas;
          console.log("onPhotoDataSuccess", datas);
          this.chatMessage(datas.url, "RC:ImgMsg", null, datas.url);
        })
        .catch(() => {});
    },
    timestampToTime(timestamp) {
      let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      let h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      let m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    isJSON(str) {
      if (typeof str == "string") {
        try {
          let obj = JSON.parse(str);
          if (typeof obj == "object" && obj) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
      }
    },
    formData(data) {
      // let myId = this.$store.getters.getUserInfo.rongUserId;
      let setData = (item, index) => {
        let val = {};
        let time = null;
        let vm = this;
        let topTime = data[index - 1 > 0 ? index - 1 : 0]
          ? data[index - 1 > 0 ? index - 1 : 0].sentTime
          : new Date().valueOf();
        if (index === 0 || (item.sentTime - topTime) / (60 * 1000) > 5) {
          time = this.timestampToTime(item.sentTime);
        }
        // let time=this.timestampToTime(item.sentTime);
        if (
          item.content &&
          item.content.extra &&
          vm.isJSON(item.content.extra)
        ) {
          let obj = JSON.parse(item.content.extra);
          val = {
            ...obj,
            extra: true,
            time: time,
            type: item.messageDirection,
          };
        } else if (
          item.messageType === "RC:ImgMsg" ||
          item.messageType === "ImgMsg"
        ) {
          val = {
            imgUrl: item.content.imageUri || item.content.content,
            type: item.messageDirection,
            time: time,
          };
        } else if (item.messageType === "RC:ImgTextMsg ") {
          val = {
            text: item.content.content,
            imgUrl: item.content.imageUri || item.content.content,
            type: item.messageDirection,
            time: time,
          };
        } else {
          val = {
            text: item.content.content,
            type: item.messageDirection,
            time: time,
          };
        }
        return {
          ...val,
          targetId: item.targetId,
          messageUId: item.messageUId,
          sentTime: item.sentTime,
        };
      };
      return !Array.isArray(data)
        ? setData(data, 0)
        : data.map((item, index) => {
            return setData(item, index);
          });
    },
    blurMsg() {
      this.sendMsg();
    },
    more() {
      let vm = this;
      if (vm.sentTime !== vm.data[0].sentTime) {
        im.getMessages(
          vm.rongUserId,
          vm.data[0].sentTime,
          (val) => {
            let data = val.filter((item) => {
              return item.messageType !== "RC:RcCmd";
            });
            console.log(data);
            vm.data = this.formData(data).concat(vm.data);
            vm.sentTime = vm.data[0].sentTime;
            this.$nextTick(() => {
              let div = this.$refs.content;
              div.scrollTop = 0;
            });
          },
          1
        );
      } else {
        Notify({ type: "warning", message: "没有更多历史消息" });
      }
    },
    add() {
      this.show = true;
      document.addEventListener("click", this.eventListener);
    },
    eventListener(e) {
      this.show = this.$refs.footer.contains(e.target);
    },
    setLen() {
      this.$nextTick(() => {
        let div = this.$refs.content;
        div.scrollTop = div.scrollHeight;
      });
    },
    chatMessage(content, objectName, extra, imgUrl) {
      let data = this.$store.getters.getUserInfo;
      let vm = this;
      chatMessage({
        senderId: vm.$store.getters.getUserInfo.rongUserId,
        targetId: vm.rongUserId,
        objectName: objectName,
        content: {
          userInfo: {
            id: data.rongUserId,
            name: data.realName,
            icon: data.headImag,
            extra: "",
          },
          content: content,
          extra: extra,
        },
      })
        .then((res) => {
          let time = null;
          let sentTimes = vm.data.filter((item) => !!item.time);
          let lastTime = sentTimes[
            sentTimes.length - 1 > 0 ? sentTimes.length - 1 : 0
          ]
            ? sentTimes[sentTimes.length - 1 > 0 ? sentTimes.length - 1 : 0]
                .time
            : null;
          let topTime = lastTime
            ? new Date(lastTime.replace(/-/g, "/")).getTime()
            : new Date().valueOf();
          if ((new Date().valueOf() - topTime) / (60 * 1000) > 5) {
            time = vm.timestampToTime(new Date().valueOf());
          }
          if (res.resp_code + "" === "200") {
            if (objectName === "RC:TxtMsg") {
              im.send(
                {
                  targetId: vm.rongUserId,
                  messageType: objectName,
                  content: content,
                  extra: extra,
                },
                (res) => {
                  if (!res.code) {
                    if (extra && typeof JSON.parse(extra) == "object") {
                      let obj = JSON.parse(extra);
                      vm.data.push({
                        ...obj,
                        extra: true,
                        finish: obj.finish,
                        type: 1,
                        time: time,
                        targetId: res.targetId,
                        messageUId: res.messageUId,
                        sentTime: res.sentTime,
                      });
                    } else {
                      vm.data.push({
                        text: content,
                        type: 1,
                        time: time,
                        targetId: res.targetId,
                        messageUId: res.messageUId,
                        sentTime: res.sentTime,
                      });
                    }
                    vm.setLen();
                  } else {
                    Notify({ type: "warning", message: "发送失败" });
                  }
                  vm.loading = false;
                }
              );
            } else {
              im.send(
                {
                  targetId: this.rongUserId,
                  messageType: objectName,
                  imgUrl: imgUrl,
                  content: content,
                },
                (res) => {
                  console.log("send", res);
                  if (!res.code) {
                    this.data.push({
                      imgUrl: imgUrl,
                      type: 1,
                      time: time,
                      targetId: res.targetId,
                      messageUId: res.messageUId,
                      sentTime: res.sentTime,
                    });
                    vm.setLen();
                  } else {
                    Notify({ type: "warning", message: "发送失败" });
                  }
                  vm.loading = false;
                }
              );
            }
          } else if (res.resp_code + "" === "201") {
            this.data.push({
              hidden: true,
              title: "温馨提示",
              content: "你当前有效/免费咨询到期",
              link: { label: "点击查看", url: this.getId },
              extra: true,
              type: 2,
              time: time,
            });
            vm.setLen();
          } else {
            Notify({ type: "warning", message: res.resp_msg });
          }
          vm.loading = false;
          this.stat.sendMsgVal = null;
        })
        .catch((res) => {
          console.log("1111", res);
          Notify({ type: "warning", message: "消息发送失败" });
        })
        .finally(() => {
          vm.loading = false;
        });
    },
    sendMsg() {
      let text = this.stat.sendMsgVal;
      if (!text) {
        return false;
      }
      this.chatMessage(text, "RC:TxtMsg");
      this.stat.sendMsgVal = null;
    },
  },
  destroyed() {
    document.removeEventListener("click", this.eventListener);
    im.disconnect();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.chat {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .more {
    width: 80px;
    text-align: center;
    font-size: 12px;
    margin: 10px auto 0 auto;
    height: 20px;
    line-height: 20px;
    border-radius: 5px;
    color: #ffffff;
    background-color: #0570db;
  }
  .header {
    height: 40px;
    line-height: 40px;
  }

  .chat-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;

    .message-wrapper {
      padding: 20px;

      > div {
        .time {
          text-align: center;
          padding: 10px 0;
        }
        .wrapper-r,
        .wrapper-l {
          position: relative;
          padding: 0 60px;
          min-height: 40px;
          margin-bottom: 20px;
        }
        .img {
          position: absolute;
          left: 0;
          top: 0;
          width: 40px;
          height: 40px;
          margin-bottom: 10px;

          img {
            height: 100%;
            width: 100%;
          }
        }

        p {
          word-wrap: break-word;
          word-break: normal;
          width: 80%;

          span {
            display: inline-block;
            border-radius: 5px;
            padding: 10px;
            color: #333;
            background-color: #ffffff;
          }
        }
      }

      .wzd {
        background-color: #ffffff;
        font-size: 14px;
        border-radius: 0 5px 5px 5px;
        flex: 1;
        overflow: hidden;

        .wzd-header {
          height: 30px;
          font-size: 16px;
          line-height: 30px;
          background-color: #0570db;
          color: #ffffff;
          padding-left: 20px;
        }

        .wzd-content {
          height: 20px;
          margin: 0 10px 5px 10px;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .wzd-down {
          height: 20px;
          padding-left: 10px;

          a {
            color: #0570db;
          }
        }
      }

      .wrapper-r {
        padding-left: 0;
        padding-right: 60px;
        display: flex;
        justify-content: flex-end;

        .wzd {
          border-radius: 5px 0 5px 5px;
        }

        .img {
          position: absolute;
          right: 0;
          top: 0;
          left: initial;
        }
        .send-self {
          position: relative;
        }
        p {
          word-wrap: break-word;
          word-break: normal;
          width: 100%;
          text-align: left;

          span {
            color: #ffffff;
            background-color: #07c160;
          }
        }
        .withdraw {
          position: absolute;
          top: -30px;
          text-align: center;
          background-color: #333;
          color: #fff;
          padding: 5px 12px;
        }
      }
    }
  }
  .record-panel {
    padding: 10px 0 20px 0;
    text-align: center;
    span {
      color: #666666;
      margin-bottom: 20px;
      display: block;
    }
    img {
      width: 50px;
    }
    .recording {
      background: url("~@/assets/record.png") no-repeat center center;
      background-size: cover;
      width: 50px;
      height: 50px;
      margin: 0 auto;
    }
  }
  img {
    max-width: 100%;
  }

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
  }

  .footer {
    transition: height 0.3s;
    min-height: 55px;
    background-color: #fff;

    .input {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        width: 35px;
      }
      .voice {
        width: 20px;
        margin-left: 12px;
      }
    }

    .van-field__control {
      overflow: hidden;
      border-radius: 8px;
      padding: 0 10px;
      min-height: 30px !important;
      border: 1px solid #e0e0e0;
    }

    .message-wrap {
      flex: 1;
      .record {
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: #323233;
        font-size: 14px;
        background-color: #fff;
        text-align: center;
      }
      textarea {
        width: 100%;
        max-height: 200px;
        -webkit-appearance: none;
        padding-top: 2px;
      }
    }

    i {
      width: 35px;
      font-size: 25px;
    }

    button {
      width: 100px;
    }

    .unfold {
      flex: 1;
      padding: 16px;
      background-color: #ffffff;
      display: flex;
    }
  }

  .show-unfold {
    height: 200px;
  }

  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter, .slide-fade-leave-to
            /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
}
</style>
