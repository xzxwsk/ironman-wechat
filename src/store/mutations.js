/**
 * Created by Administrator on 2017/12/6.
 */

import {setStore} from '../common/util'

const mutations = {
  SET_OPEN_ID (state, openId) {
    state.openId = openId
    setStore('openId', openId)
  },
  SET_USER_ID (state, userId) {
    state.userId = userId
    setStore('userId', userId)
  },
  SET_PLATFORM_ID (state, platformId) {
    state.platformId = platformId
    setStore('platformId', platformId)
  },
  SET_BOTTOMBAR_INDEX (state, botterbarIdx) {
    state.curBottomIdx = botterbarIdx
  },
  SET_UP_IMG (state, upImg) {
    state.upImg = upImg
  },
  SET_UP_IMG_FILE (state, upImg) {
    state.upImgFile = upImg
  }
}

export default mutations
