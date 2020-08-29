import fetch from 'src/utils/fetch';
export const  openId=localStorage.getItem('openId');
import {interfaceUrl} from 'src/global-var.js';
//查询用户关注医生
export const getDoctor=(openId)=>fetch(`${interfaceUrl}/api-app/user/${openId}/doctor`)
//创建咨询订单
export const createAdvisoryOrder=(params)=>fetch.post(`${interfaceUrl}/api-app/user/createAdvisoryOrder`,params)

//查询用户关注医生详情
export const getDoctorInfo=(doctorId,openId)=>fetch(`${interfaceUrl}/api-app/user/doctor/${doctorId}/${openId}`)
//就诊人列表-健康档案
export const getFetchPatientList=(openId)=>fetch(`${interfaceUrl}/api-app/user/fetchPatientList/${openId}`)
//就诊人列表-健康档案
export const queryPatientById=(id)=>fetch(`${interfaceUrl}/api-app/user/queryPatientById/${id}`)

//逆地理编码

export const parameters=(params)=>fetch(`https://restapi.amap.com/v3/geocode/regeo?parameters`, {params})

//获取用户信息根据openid
export const getFetchUserInfo=(openId)=>fetch(`${interfaceUrl}/api-app/user/fetchUserInfo/${openId}`)
//就诊人新增-健康档案
export const savePatient=(openId,params)=>fetch.post(`${interfaceUrl}/api-app/user/savePatient/${openId}`,params)
//就诊人修改-健康档案
export const updatePatient=(openId,params)=>fetch.put(`${interfaceUrl}/api-app/user/updatePatient`,params)
//查询收货地址列表-wxmp
export const userAddress=(params)=>fetch(`${interfaceUrl}/api-app/userAddress/findAll`, {params})
//新增收货地址列表-wxmp
export const addAddress=(params)=>fetch.post(`${interfaceUrl}/api-app/userAddress/save`, params)
//修改收货地址列表-wxmp
export const updateAddress=(params)=>fetch.put(`${interfaceUrl}/api-app/userAddress/update`, params)
//删除收货地址列表-wxmp
export const deleteAddress=(addressId)=>fetch.delete(`${interfaceUrl}/api-app/userAddress/delete/${addressId}`)
//替换收货地址
export const replaceOrderAddress=(params)=>fetch.put(`${interfaceUrl}/api-app/user/replaceOrderAddress`, params)
//绑定用户手机号码
export const bindUserInfo=(openid,params)=>fetch.post(`${interfaceUrl}/api-app/user/bindUserInfo/${openid}`,params,{
    headers: {
        'Content-Type': 'multipart/form-data'
    },
})
export const getAccessToken=(code)=>fetch(`${interfaceUrl}/api-app/user/fetchToken/${code}`)

//绑定用户手机号码
export const smsSend=(params)=>fetch.post(`${interfaceUrl}/api-auth/sms/send`,params)

//校验签名
export const setConfig=(params)=>fetch(`${interfaceUrl}/api-app/user/config`, {params})
//校验签名
export const payOrder=(params)=>fetch.post(`${interfaceUrl}/api-app/user/payOrder`, params)

export const uploadFile=(params)=>fetch.post(`${interfaceUrl}/api-file/file/uploadFile`, params,{
    headers: {
        'Content-Type': 'multipart/form-data'
    },
})
//发送文本消息-wx
export const chatMessage=(params)=>fetch.post(`${interfaceUrl}/api-app/user/chat/message`,params)

//问诊单填写和照方抓方--微信
export const feedback=(params)=>fetch.post(`${interfaceUrl}/api-app/user/inquiry/feedback`,params)
//查询医生问诊单详情
export const interfaceDoctor=(params)=>fetch(`${interfaceUrl}/api-app/user/inquiry/doctor`, {params})
//查询用户关注医生
export const getFetchOrderList=(userId,val)=>fetch(`${interfaceUrl}/api-app/user/fetchOrderList/${userId}?status=${val}`)
export const queryOrderDetail=(dh)=>fetch(`${interfaceUrl}/api-app/user/queryOrderDetail/${dh}`)

// 待下单状态转未支付状态
export const pendingToUnpaidOrder=(params)=>fetch.put(`${interfaceUrl}/api-app/user/order/pendingToUnpaidOrder`,params)

//用户填写完成的问诊单查询
export const interfaceDetail=(id,params)=>fetch(`${interfaceUrl}/api-app/user/inquiry/feedback/${id}`, {params})