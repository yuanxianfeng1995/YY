import wx from 'wx';

let sdkConfig = JSON.parse(`${localStorage.getItem('sdkConfig')}`);

// wx.config({
//     debug: true,
//     appId: 'wxf8b4f85f3a794e77',
//     timestamp: 1590130281,
//     nonceStr: 'Vq8ZYid1Rx8juAXg',
//     signature: 'b20fb070e85de633879836f5ddfce9d0f493dc5a',
//     jsApiList: [
//         'checkJsApi',
//         'onMenuShareTimeline',
//         'onMenuShareAppMessage',
//         'onMenuShareQQ',
//         'onMenuShareWeibo',
//         'onMenuShareQZone',
//         'hideMenuItems',
//         'showMenuItems',
//         'hideAllNonBaseMenuItem',
//         'showAllNonBaseMenuItem',
//         'translateVoice',
//         'startRecord',
//         'stopRecord',
//         'onVoiceRecordEnd',
//         'playVoice',
//         'onVoicePlayEnd',
//         'pauseVoice',
//         'stopVoice',
//         'uploadVoice',
//         'downloadVoice',
//         'chooseImage',
//         'previewImage',
//         'uploadImage',
//         'downloadImage',
//         'getNetworkType',
//         'openLocation',
//         'getLocation',
//         'hideOptionMenu',
//         'showOptionMenu',
//         'closeWindow',
//         'scanQRCode',
//         'chooseWXPay',
//         'openProductSpecificView',
//         'addCard',
//         'chooseCard',
//         'openCard'
//     ]
// });


export const init = () => {
    wx.config({
        debug: false,
        appId: sdkConfig.appId, // 必填，公众号的唯一标识
        timestamp: sdkConfig.timestamp, // 必填，生成签名的时间戳
        nonceStr: sdkConfig.nonceStr, // 必填，生成签名的随机串
        signature: sdkConfig.signature,// 必填，签名
        jsApiList: ['getLocation', 'chooseImage', 'getLocalImgData', 'closeWindow', 'updateAppMessageShareData', 'translateVoice', 'chooseWXPay', 'startRecor', 'stopRecord', 'uploadVoice', 'downloadVoice'], // 必填，需要使用的JS接口列表
    });
    wx.error((e) => {
        alert(JSON.stringify(e))
    })
}
export const getLocation = (callback) => {
    wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
            let latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            let longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            callback(longitude + ',' + latitude)
        }
    });
}

export const chooseImage = (val, callback, cancel) => {
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: val, // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            console.log('chooseImage success', res)
            callback(res)
        },
        cancel: function (res) {
            cancel(res)
        }
    });
}
export const closeWindow = () => { wx.closeWindow() }

export const getLocalImgData = (val, callback) => {
    wx.getLocalImgData({
        localId: val, // 图片的localID
        success: function (res) {
            callback(res)
        }
    });
}

export const chooseWXPay = (data, callback) => {
    // const mes = {
    //     'get_brand_wcpay_request:ok': '支付成功',
    //     'get_brand_wcpay_request:cancel': '支付取消',
    //     'get_brand_wcpay_request:fail': '支付失败',
    // };
    const onBridgeReady = () => {
        /*eslint-disable */
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
            appId: data.appId,
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.infoPackage,
            signType: 'MD5',
            paySign: data.paySign
        },
            (res) => {
                callback(res.err_msg)
            });
    };
    if (typeof WeixinJSBridge == 'undefined') {
        if (document.addEventListener)
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
    } else onBridgeReady();
}

export const startRecord = () => {
    wx.startRecord();
}
export const stopRecord = (callback) => {
    wx.stopRecord({
        success: function (res) {
            callback(res.localId);
        }
    })
}
export const uploadVoice = (localId, callback) => {
    return wx.uploadVoice({
        localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
            callback(res); // 返回音频的服务器端ID
        }
    });
}
export const downloadVoice = (serverId, callback) => {
    wx.downloadVoice({
        serverId: serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
            // var localId = res.localId; // 返回音频的本地ID
            callback(res)
        }
    });
}

export default wx