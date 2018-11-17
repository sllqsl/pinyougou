import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
// 导入登录组件
import Home from '@/components/Home.vue'
// 导入home组件
import Users from '@/components/Users.vue'
// 导入用户组件
import Rights from '@/components/Rights.vue'
// 导入权限组件
import Roles from '@/components/Roles.vue'
// 引入分类组件
import Goods from '@/components/Goods.vue'
// 引入商品组件
import Add from '@/components/Add.vue'
import Categories from '@/components/Categories.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      // 组件嵌套：1.通过children属性在父组件中添加子组件
      //          2.给子组件设置出口
      children: [
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goods-add',
          component: Add
        }
      ]
    }
  ]
})
// 给路由设置守卫
// from 从哪里来
// to 到哪里去
// next()代表放行 next(false) next('/home')
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // 获取token
  console.log(to.path)
  if (to.path === '/login' || token) {
    // 如果token或者去login页的话就放行
    next()
    // 满足条件放行
  } else {
    next('/login')
    // 不然就重回登录页登录
  }
})
export default router
