import {appId, baseUrl,scope,state} from 'src/global-var'
import {getFetchUserInfo,getAccessToken} from '../api'

export default {
  state: {
    userInfo: {
      headImag: null,
      realName: null,
      telephone: null,
      userId: null
    },
    code: null,
    vxInfo:{
      access_token: null,
      openid: null,
      refresh_token: null
    }
  },
  mutations: {
    setUserInfo(state, value) {
      console.log('setUserInfo',value)
      state.userInfo = value;
    },
    setCode(state, value){
      state.code = value;
    },
    setVxInfo(state, value){
      state.setVxInfo = value;
    }
  },
  actions: {
    getCode() {
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appId=${appId}&redirect_uri=${baseUrl}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
    },
    async getAccessToken({commit}) {  //得到授权token后，获取用于信息
      const code=localStorage.getItem('code');
      console.log('code',code,commit)
      await getAccessToken(code).then(({datas})=>{
        commit('setVxInfo',{
          openid:  datas,
        })
        localStorage.setItem('openId', datas);
      })

      //let url = `/admin/sns/oauth2/access_token?appId=${appId}&secret=${secret}&code=${code}&grant_type=authorization_code`
      // await axios.get(url).then(({data}) => {

        //  axios.get(`/admin/sns/userinfo?access_token=${data.access_token}&openid=${data.openid}&lang=zh_CN`).then(({data}) => {
        //   commit('setUserInfo',data);
        //   ls.set('userInfo', JSON.stringify(data));
        //   return data
        // })
      //})
    },
    // 得到用户信息
    async getFetchUserInfo({commit}){
      if(localStorage.getItem('openId')&&localStorage.getItem('openId')!=='undefined'){
        await getFetchUserInfo(localStorage.getItem('openId')).then(({datas})=>{
          commit('setUserInfo',datas);
          localStorage.setItem('userInfo', JSON.stringify(datas));
          return datas;
        })
      }

    }
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo;
    },
    getVxInfo(state) {
      return state.vxInfo;
    },
    getCode(state) {
      return state.code;
    },
  }
};
