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

Vue.config.productionTip = false

Vue.use(ElementUI) // 引入element,需要三步

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
