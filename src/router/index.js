import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '@/view/login/login'
import shouye from '@/view/shouye/shouye'
import datamenu from '@/view/shouye/datamenu'
import datamain from '@/view/shouye/datamain'
import system from '@/view/shouye/system'
import user from '@/view/shouye/user'
import role from '@/view/shouye/role'
import menus from '@/view/shouye/menus'
import pass from '@/view/login/password'
import repassword from '@/view/login/repassword'

Vue.use(Vuex)
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
      },
      children:[
        {
          path: "/datamain",
          component: datamain,
          children: [
            {path:'/system',component:system,meta:{require:true}},
            {path:'/touser',component:user,meta:{require:true}},
            {path:'/torole',component:role,meta:{require:true}},
            {path:'/tomenu',component:menus,meta:{require:true}}
          ]
        }
      ]
    },
    {
      path:"/datamenu",
      component:datamenu,
      meta:{require:true}
    },
    {
      path:"/pass",
      component:pass,
      meta:{require:false}
    },
    {
      path:"/repass",
      component:repassword,
      meta:{require:false}
    }
  ]
})
