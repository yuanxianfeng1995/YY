import router from './router';
import store from './store';
// 截取code
function GetUrlParame(parameName) {
    /// 获取地址栏指定参数的值
    /// <param name="parameName">参数名</param>
    // 获取url中跟在问号后面的部分
    var parames = window.location.search
    // 检测参数是否存在
    if (parames.indexOf(parameName) > -1) {
        var parameValue = ''
        parameValue = parames.substring(parames.indexOf(parameName), parames.length)
        // 检测后面是否还有参数
        if (parameValue.indexOf('&') > -1) {
            // 去除后面多余的参数, 得到最终 parameName=parameValue 形式的值
            parameValue = parameValue.substring(0, parameValue.indexOf('&'))
            // 去掉参数名, 得到最终纯值字符串
            parameValue = parameValue.replace(parameName + '=', '')
            return parameValue
        }
        return ''
    }
}

function getRemainderTime(time) {
    var s1 = new Date().valueOf(),
        runTime = parseInt((s1 - time) / 1000);

    var day = Math.floor(runTime / 86400);
    var hour = day * 24 + (Math.floor(runTime / 3600));
    runTime = runTime % 3600;
    var minute = hour * 60 + (Math.floor(runTime / 60));
    runTime = runTime % 60;
    var second = minute * 60 + runTime;
    console.log(hour, minute, second);
    return {hour, minute, second};

}


const whitelist = ['/pay-for']; // 白名单

router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.title) {
        //console.info(to.meta.title)
        document.title = to.meta.title
    }
    console.log('to', to)
    if (whitelist.includes(to.path)) {
        next()
    }
    const code = GetUrlParame('code');// 截取code
    localStorage.setItem('code', code);
    let time = localStorage.getItem('time');
    if (time) {
        // let usedTime = new Date().valueOf() - time;
        let data = getRemainderTime(time);
        console.log(data.second)
        if (parseInt(data.hour) > 2 && !code) {
            localStorage.setItem('time', new Date().valueOf());
            localStorage.setItem('url', to.path);
            localStorage.setItem('query', JSON.stringify(to.query));
            localStorage.setItem('openId', 'undefined');
            localStorage.setItem('code', 'undefined');
        }
    }
    const openId = localStorage.getItem('openId');
    if (!openId || openId === 'undefined') {
        localStorage.setItem('time', new Date().valueOf());
        if (!code || code === 'undefined') {
            console.log('getCode')
            localStorage.setItem('url', to.path);
            localStorage.setItem('query', JSON.stringify(to.query));
            store.dispatch('getCode');
        } else {
            console.log('getAccessToken')
            store.dispatch('getAccessToken').then(() => {
                console.log('getFetchUserInfo')
                store.dispatch('getFetchUserInfo').then((data) => {
                    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                    console.log('3', data);
                    let url=localStorage.getItem('url');
                    let query=JSON.parse(localStorage.getItem('query'));

                    if (userInfo && userInfo.telephone) {
                        console.log('3-1');
                        if(url&&url!=='undefined'){
                            console.log('跳转 url')
                            localStorage.setItem('url','undefined');
                            next({path: url,query: query})
                        }else{
                            next()
                        }
                    } else {
                        console.log('3-2');
                        next('/registered')
                    }
                }).catch(() => {
                    console.log('3-3');
                    next('/registered')
                })
            });
        }
    } else {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.telephone) {
            console.log('1');
            if (to.path !== '/registered') {
                next()
            } else {
                next('/')
            }
        } else {
            if (to.path === '/registered') {
                next()
            } else {
                next('/registered')
            }
        }

    }
})
