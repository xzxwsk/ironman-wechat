/**
 * Created by Administrator on 2017/12/6.
 */

const mode = 'product'
const appUrl = 'http://fw.pisen.cn/ironman/wechat'
const baseUrl = 'http://fw.pisen.cn/ironman/api'
const wechatAuthorizeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx96508594bd2246a9'
const redirectUri = 'http://fw.pisen.cn/ironman/api/wechat-auth-callback/'
const shareRedirectUri = 'http://fw.pisen.cn/ironman/api/wechat-share-callback/'
const routerBase = '/ironman/wechat/'

export {
  mode,
  appUrl,
  baseUrl,
  wechatAuthorizeUrl,
  routerBase,
  redirectUri,
  shareRedirectUri
}
