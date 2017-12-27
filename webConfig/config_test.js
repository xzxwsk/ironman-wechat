/**
 * Created by Administrator on 2017/12/6.
 */

// 外网访问：
// http://ironman.ngrok.pisen.com.cn
// 内网访问：
// http://192.168.31.9:9501/wechatapi

const mode = 'test'
const appUrl = 'http://ironman.ngrok.pisen.com.cn/wechat'
const baseUrl = 'http://ironman.ngrok.pisen.com.cn/api'
const wechatAuthorizeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcb65a55364c03e9b'
const redirectUri = 'http://ironman.ngrok.pisen.com.cn/api/wechat-auth-callback/'
const shareRedirectUri = 'http://ironman.ngrok.pisen.com.cn/api/wechat-share-callback/'
const routerBase = '/wechat/'

export {
  mode,
  appUrl,
  baseUrl,
  wechatAuthorizeUrl,
  routerBase,
  redirectUri,
  shareRedirectUri
}
