//引入VUEX
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

const  store = new Vuex.Store({
  state:{
    token:"",
    userInfo:{}
  },
  mutations:{
    set_token(state, token) {
      state.token = token
      sessionStorage.token = token
    },
    del_token(state) {
      state.token = ''
      sessionStorage.removeItem('token')
    },
    set_userinfo(state,userinfo){
      state.userinfo=userinfo
    },
    del_userinfo(){
      sessionStorage.removeItem('userinfo')
    }
  }
})

export  default store
