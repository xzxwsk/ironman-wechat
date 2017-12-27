import { httpAjax } from '../common/http'
import { appUrl } from '../common/config'

let retryTimes = 3
const configWechat = (para) => {
  const callback = (type, response) => {
    alert(JSON.stringify(response))
    if (type === 1 && response.code === 0) {
      alert('type')
      const data = response.data
// eslint-disable-next-line no-undef
      wxInit(wx, data, para)
    } else if (retryTimes > 0) {
      alert('else =' + retryTimes)
      retryTimes -= 1
      configWechat()
    }
  }
  const url = '/wechat-js-sdk-config?url=' + encodeURIComponent(window.location.href.split('#')[0])
  httpAjax(url, {type: 'GET', dataType: true}, callback)
}
const wxInit = (wx, sd, para) => {
  let links = appUrl
  let image = appUrl + '/static/shareicon.jpg'
  let title = '拍照迎新年 奖金10万元测试'
  let desc = '品胜杯新年朋友圈手机摄影大赛'
  if (!(typeof para === 'undefined')) {
    links = !para && !para.links ? para.links : appUrl
    image = !para && !para.image ? para.image : appUrl + '/static/shareicon.jpg'
    title = !para && !para.title ? para.title : '拍照迎新年 奖金10万元'
    desc = !para && !para.desc ? para.desc : '我正在参与品胜杯朋友圈手机摄影大赛，快来帮我投一票吧'
    alert('entry')
  }
  wx.config({
    debug: true,
    appId: sd.appId,
    timestamp: sd.timestamp,
    nonceStr: sd.nonceStr,
    signature: sd.signature,
    jsApiList: [
      'onMenuShareTimeline', 'onMenuShareAppMessage', 'hideAllNonBaseMenuItem', 'showMenuItems'
    ]
  })
  wx.ready(function () {
    wx.hideAllNonBaseMenuItem()
    wx.showMenuItems({
      menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'] // 要显示的菜单项，所有menu项见附录3
    })
    wx.onMenuShareTimeline({
      title: title, // 分享标题
      link: links, // 分享链接'
      imgUrl: image, // 分享图标
      success: function () {
      },
      cancel: function () {
      }
    })
    // 微信分享菜单测试
    wx.onMenuShareAppMessage({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: links, // 分享链接
      imgUrl: image, // 分享图标
      success: function () {
      },
      cancel: function () {
      }
    })
  })
  wx.error(function (res) {
    // alert("error")
  })
}
export {
  configWechat
}
