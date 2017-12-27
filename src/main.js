// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import { setStore, getStore, removeStore, formatDate } from './common/util'
import { loginWechat, httpAjax } from './common/http'
import 'lib-flexible/flexible'

import './assets/style.less'

import FastClick from 'fastclick'
// import uploader from 'vue-simple-uploader'
import { LoadingPlugin, ToastPlugin } from 'vux'
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
// Vue.use(uploader)

// Vue.config.productionTip = false

function checkIsLogin () {
  return !(!store.state.openId || store.state.openId === 'null')
}

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body)
  }, false)
}

// if (getStore('isFinalDate') !== formatDate(new Date(), 'yyyy-MM-dd')) { // 每天获取
// httpAjax('/system/isFinals', {
//   contentType: null,
//   type: 'GET'
// }, function (type, response) {
//   if (response.code === 0) {
//     // 保存是否决赛阶段
//     setStore('isFinal', response.data)
//     setStore('isFinalDate', formatDate(new Date(), 'yyyy-MM-dd'))
//     isFinal = response.data
//   }
// })
// } else { // 当天直接取
//   isFinal = getStore('isFinal') === 'true'
// }

router.beforeEach((to, from, next) => {
  if (to.path === '/index') {
    document.title = '品胜杯新年朋友圈手机摄影大赛'
    store.dispatch('setBottomBarIndex', 0)
  } else if (to.path === '/upImg') {
    document.title = '选择上传'
    store.dispatch('setBottomBarIndex', 1)
  } else if (to.path === '/deliver') {
    document.title = '上传作品-填写发表信息'
    store.dispatch('setBottomBarIndex', 1)
  } else if (to.path === '/about') {
    document.title = '规则'
    store.dispatch('setBottomBarIndex', 2)
  } else if (to.path === '/myHome') {
    document.title = '我的主页'
    store.dispatch('setBottomBarIndex', 3)
  } else if (to.path === '/myDetail') {
    document.title = '作品详情'
  } else if (to.path === '/theHome') {
    document.title = '品胜杯新年朋友圈手机摄影大赛'
    store.dispatch('setBottomBarIndex', 0)
  } else if (to.path === '/finals') {
    document.title = '品胜杯新年朋友圈手机摄影大赛'
    store.dispatch('setBottomBarIndex', 0)
  } else if (to.path === '/lottery') {
    document.title = '品胜杯新年朋友圈手机摄影大赛'
  } else if (to.path === '/share') {
    document.title = '作品详情'
  } else if (to.path === '/otherHome') {
    document.title = '品胜杯新年朋友圈手机摄影大赛'
    store.dispatch('setBottomBarIndex', 0)
  } else if (to.path === '/winmethod') {
    document.title = '品胜杯新年朋友圈手机摄影大赛'
    store.dispatch('setBottomBarIndex', 2)
  }
  if (!checkIsLogin()) {
    const openId = to.query.openId
    const userId = parseInt(to.query.userId)
    const state = parseInt(to.query.state)
    let isLogin = false
    if (userId >= 0 && openId && openId.length > 0 && state > 0) {
      const localState = parseInt(getStore('state'))
      if (localState > 0 && state === localState) {
        removeStore()
        store.dispatch('setOpenId', openId)
        store.dispatch('setUserId', userId)
        isLogin = true
      }
    }
    if (!isLogin) {
      if (to.path === '/share') {
        const share = {path: 'share', args: {id: to.query.id}}
        loginWechat(share)
      } else if (to.path === '/otherHome') {
        const share = {path: 'otherHome', args: {id: to.query.id}}
        loginWechat(share)
      } else {
        loginWechat()
      }
      return
    }
  }

  let isFinal = false
  httpAjax('/system/isFinals', {
    contentType: null,
    type: 'GET'
  }, function (type, response) {
    if (response.code === 0) {
      // 保存是否决赛阶段
      setStore('isFinal', response.data)
      setStore('isFinalDate', formatDate(new Date(), 'yyyy-MM-dd'))
      isFinal = response.data
    }
  }).then(function () {
    if (to.path === '/index' && isFinal) {
      next({ path: '/finals' }) // 决赛主页
    } else {
      next()
    }
  })
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
