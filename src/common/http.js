/**
 * Created by Administrator on 2017/12/6.
 */

import 'whatwg-fetch'
import Promise from 'promise-polyfill'
import store from '../store'
import {baseUrl, wechatAuthorizeUrl, redirectUri, shareRedirectUri} from './config'
import {setStore, base64, removeStore} from '../common/util'

const loginWechat = (share) => {
  const timeStamp = (new Date()).valueOf()
  setStore('state', timeStamp)
  if (share) {
    let shareArgs = ''
    for (const param in share.args) {
      shareArgs = '&' + param + '=' + share.args[param]
    }
    const args = base64.encode(JSON.stringify({path: share.path, args: shareArgs}))
    window.location.href = wechatAuthorizeUrl + '&redirect_uri=' + encodeURIComponent(shareRedirectUri + args) + '&response_type=code&state=' + timeStamp + '&scope=snsapi_userinfo#wechat_redirect'
  } else {
    window.location.href = wechatAuthorizeUrl + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&response_type=code&state=' + timeStamp + '&scope=snsapi_userinfo#wechat_redirect'
  }
}

const httpAjax = (url, params, callbackFun) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      return
    }
    let formData = {}
    if (params.dataType) {
      formData = params.body
    } else {
      formData = new FormData()
      for (let key in params.body) {
        formData.append(key, params.body[key])
      }
    }
    let headers = {
      'Accept': 'application/json',
      'openId': params.openId ? params.openId : store.state.openId
    }
    if (params.contentType) {
      headers['Content-Type'] = params.contentType
    } else if (params.contentType !== null) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    let options = {
      method: params.type ? params.type : 'POST',
      cache: 'reload',
      mode: 'cors',
      headers: headers
    }
    if (params.type !== 'GET') {
      options['body'] = formData
    }
    fetch(baseUrl + url, options)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject(new Error({
            status: response.status,
            statusText: response.statusText
          }))
        }
      })
      .then((responseJSON) => {
        if (responseJSON.code === 0) {
          if (callbackFun) {
            callbackFun(1, responseJSON)
            resolve()
          }
        } else if (responseJSON.code === 1003) {
          removeStore()
          loginWechat()
        } else {
          return Promise.reject(responseJSON.message)
        }
      })
      .catch(error => {
        console.log(error)
        if (callbackFun) {
          callbackFun(0, {message: error})
        }
      })
  })
}

export {
  loginWechat,
  httpAjax
}
