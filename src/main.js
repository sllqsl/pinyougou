// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// 引入的是默认的完整版
import App from './App'
// 引入根组件
import router from './router'
// 引入路由
// 导入公共样式
import '@/assets/common.css'
// 引入并使用element ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.config.productionTip = false

Vue.use(ElementUI) // 引入element,需要三步

// 公共优化开始
// 1.优化axios
Vue.prototype.axios = axios
// 2设置axios全局默认的baseUrl
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 设置拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 添加响应拦截器
axios.interceptors.response.use(
  function(res) {
    // 对响应数据做点什么
    return res.data
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
