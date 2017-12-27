/**
 * Created by Administrator on 2017/12/6.
 */

// 外网访问：
// http://ironman.ngrok.pisen.com.cn
// 内网访问：
// http://192.168.31.9:9501/wechatapi

const mode = 'location'
const appUrl = 'http://192.168.21.166:8081'
const baseUrl = 'http://192.168.31.9:9501/wechatapi/api'
const wechatAuthorizeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcb65a55364c03e9b'
const redirectUri = 'http://192.168.31.9:9501/wechatapi/api/wechat-auth-callback/'
const shareRedirectUri = 'http://192.168.31.9:9501/wechatapi/api/wechat-share-callback/'
const routerBase = '/'

export {
  mode,
  appUrl,
  baseUrl,
  wechatAuthorizeUrl,
  routerBase,
  redirectUri,
  shareRedirectUri
}
