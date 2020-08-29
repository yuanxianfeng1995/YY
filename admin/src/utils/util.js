export const lenValidator=(min,max,value)=>{
    let reg = new RegExp("^.{"+min+","+max+"}$");
   return value?reg.test(value):false
}

export const minMaxValidator=(min,max,value)=>{
   return value>=min&&value<=max
}

export const isTelCode=(str)=>{
    let reg= /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
    return reg.test(str);
}

export const isIosOrAndroid=()=>{
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    let isStr = ''
    if (isAndroid) {
        isStr = 'android'
    }
    if (isiOS) {
        isStr = 'ios'
    }
    return isStr
}