/**
 * Created by Administrator on 2017/12/6.
 */

const actions = {
  setOpenId ({commit}, openId) {
    commit('SET_OPEN_ID', openId)
  },
  setUserId ({commit}, userId) {
    commit('SET_USER_ID', userId)
  },
  setPlatformId ({commit}) {
    commit('SET_PLATFORM_ID')
  },
  setBottomBarIndex ({commit}, botterbarIdx) {
    commit('SET_BOTTOMBAR_INDEX', botterbarIdx)
  },
  setUpImg ({commit}, upImg) {
    commit('SET_UP_IMG', upImg)
  },
  setUpImgFile ({commit}, upImg) {
    commit('SET_UP_IMG_FILE', upImg)
  }
}

export default actions
