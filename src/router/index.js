import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '@/view/login/login'
import shouye from '@/view/shouye/shouye'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      meta:{
        require:false
      }
    },
    {
      path: '/view/shouye/shouye',
      name: 'shouye',
      component: shouye,
      meta:{
        require:true//该路径的访问需要登录
      }
    },
  ]
})
