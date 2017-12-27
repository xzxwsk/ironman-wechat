/**
 * Created by Administrator on 2017/12/6.
 */

const setStore = (key, value) => {
  let resultVal
  if (!key) return
  if (typeof value !== 'string') {
    resultVal = JSON.stringify(value)
  } else {
    resultVal = value
  }
  window.localStorage.setItem(key, resultVal)
}
const getStore = (key, defaultValue) => {
  let resultVal
  if (key) {
    resultVal = window.localStorage.getItem(key)
  }
  return resultVal
}
const removeStore = (key) => {
  if (key) {
    window.localStorage.removeItem(key)
  } else {
    window.localStorage.clear()
  }
}

const formatDate = (_date, _format) => {
  let date = {
    'M+': _date.getMonth() + 1,
    'd+': _date.getDate(),
    'h+': _date.getHours(),
    'm+': _date.getMinutes(),
    's+': _date.getSeconds(),
    'q+': Math.floor((_date.getMonth() + 3) / 3),
    'S+': _date.getMilliseconds()
  }
  let result
  if (/(y+)/i.test(_format)) {
    result = _format.replace(RegExp.$1, (_date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in date) {
    if (new RegExp('(' + k + ')').test(_format)) {
      result = result.replace(RegExp.$1, RegExp.$1.length === 1
        ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
    }
  }
  return result
}

const base64 = require('js-base64').Base64

export {
  setStore,
  getStore,
  removeStore,
  formatDate,
  base64
}
