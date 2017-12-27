/**
 * Created by Administrator on 2017/12/6.
 */
import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'

import { getStore } from '../common/util'

Vue.use(Vuex)

const state = {
  userId: getStore('userId', 'null'),
  openId: getStore('openId', 'null'),
  curBottomIdx: 0,
  upImg: '', // 预览图片
  upImgFile: null // 用于上传图片文件
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
