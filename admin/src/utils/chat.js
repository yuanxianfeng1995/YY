import RongIMLib from 'RongIMLib'

let im = null;
export default {
    async init(userInfo) {
        im = RongIMLib.init({
            debug: true,
            appkey: userInfo.appKey
        });
        console.log('初始化', userInfo.appKey);
        // let user = {
        //   token: userInfo.token
        // };
    },
    connect(user, callback) {
        im.connect(user).then(function (user) {
            console.log('链接成功, 链接用户 id 为: ', user.id);
            callback.status(status);
            let conversationList = []; // 当前已存在的会话列表
            im.watch({
                conversation: function (event) {
                    var updatedConversationList = event.updatedConversationList; // 更新的会话列表
                    console.log('最新会话列表:', im.Conversation.merge({
                        conversationList,
                        updatedConversationList
                    }));

                },
                message: function (event) {
                    let message = event.message;
                    callback.receive(message);
                },
                status: function (event) {
                    let status = event.status;

                    console.log('status', status)
                }
            })
        });
    },
    reconnect() { // 此方法建议主动断开连接后，再次链接时调用。
        im.reconnect().then(function (user) {
            console.log('重新链接成功, 链接用户 id 为: ', user.id);
        }).catch(function (error) {
            console.log('链接失败: ', error.code, error.msg);
        });
    },
    disconnect() {
        return im.disconnect()
    },
    getList(option) {
        return im.Conversation.getList(option).then(function (conversationList) {
            console.log('获取会话列表成功', conversationList);
        });
    },
    getMessages(id, timestrap, callback, order = 0) {
        let conversation = im.Conversation.get({
            targetId: id, //接收方的 userId
            type: RongIMLib.CONVERSATION_TYPE.PRIVATE
        });
        let option = {
            timestrap: timestrap,
            count: 20,
            order: order
        };
        conversation.getMessages(option).then(function ({ list, hasMore }) {
            console.log('获取历史消息成功', list, hasMore);
            callback(list)
        });
    },
    withdraw(params, callback) {
        let conversation = im.Conversation.get({
            targetId: params.targetId, //接收方的 userId
            type: RongIMLib.CONVERSATION_TYPE.PRIVATE
        });

        conversation.recall({
            messageUId: params.messageUId,
            sentTime: params.sentTime
        }).then(function (message) {
            console.log('撤回消息成功', message);
            callback(message)
        });
    },
    send({ targetId, messageType, content, imgUrl, extra }, callback) {
        let conversation = im.Conversation.get({
            targetId: targetId,
            type: RongIMLib.CONVERSATION_TYPE.PRIVATE
        });
        content = messageType === 'RC:TxtMsg' ? { content: content, extra: extra } : {
            content: "iVBORw0KGgoAAAANSUhEUgAAAA8AAAARCAIAAACNaGH2AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACg0lEQVQokQXBS2+UZRQA4HPe23cfOkNn2grShmmpBMMCMRoSFv4C1+re6MKFf8XEJf+jbtiTuNGFaQSkpWl1mDKl813fy3mPz4NnS1+NegdUaNlyAjQkmHrwgJKl1rbxyhQsOyExOpGNfDD5WOU9aIUkdZEKRJmMpFTnLrABkfRsK3KAoP47e2ttaPp1AJD1ek0sAtVD75v60eMvt3fujWJo2DeqaNypevbrL9F7RAGI3jnmyIAcWTC+ev3XTz/+3G1uSeuEdKt1UPP5/OTNCccoAbbu3s1kyjKqTJpI7QDnXXsr1JTNEtcebu6pL55+9eb1MwaAGB9+9vjzJwcmmbr2fVpOUhhpgA/QZeR7qWRktfvgweZs8/Ld0iP++fuLadr6fLe9XIhMOVLGDtOD+e7OtknyAQiXFP54fvTb0RFRZOBSZV4gSJR+sCyctYcP73/97Xf11ZpiJSLT/SdPhVTMLIWsqUffeTu4CMBhNKlWy0VuaTr7aDzWSsXBpOV8f358fGwA8py/+eH70WRPKefWC13eJiYSqTB+659KFCzl4Lf3trUQlqFrpKmmG0YZsZFN9ot03IY6SMx9cvVJEB+Qg6Zbn97TKBA4xPD29GWtCkE2QiJ9O8tvCxBWgbmwQusSIx3ODiAzMTIgtv92uq9tUiq0jZAWqABlADGAWF+8HISIIEZlkRZJVpjr99dqqDWI7O+FDCKhwBBrCt0dgxfXFzfTaq3y66tL3a+suVHKVbqxf746DX5jZzY2SB71DXIdEC6pEWw49p5UmuY5vDqjSXK5UOOPdQxsSuNarzOJ0rtOSDYxdizkcFI774f+ZgXVbHJHqUSnJTKRziDKDCmcw//w3WEJ8Go/SwAAAABJRU5ErkJggg==", // 图片压缩后的 base64 略缩图, 用来快速展示图片
            imageUri: imgUrl, // 上传到服务器的
        };
        conversation.send({
            messageType: messageType, //'RC:TxtMsg|RC:ImgMsg'
            content: content
        }).then(function (res) {
            console.log('消息发送成功', content)
            callback(res)
        })
    },
    clearMessages(targetId) {
        let conversation = im.Conversation.get({
            targetId: targetId,
            type: RongIMLib.CONVERSATION_TYPE.PRIVATE
        });
        conversation.clearMessages({
            timestrap: +new Date()
        }).then(function () {
            console.log('清除历史消息成功');
        });
    }
}
