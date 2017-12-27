<template>
  <keep-alive>
    <router-view/>
  </keep-alive>
</template>
<script>
  /* eslint-disable no-undef */

  import {httpAjax} from './common/http'
  import {appUrl} from './common/config.js'
  export default {
    name: 'app',
    mounted () {
      this.configWechat()
    },
    data () {
      return {
        retryTimes: 3
      }
    },
    methods: {
      configWechat () {
        const callback = (type, response) => {
          if (type === 1 && response.code === 0) {
            // alert(encodeURIComponent(window.location.href.split('#')[0]))
            const data = response.data
            this.wxInit(data)
          } else if (this.retryTimes > 0) {
            this.retryTimes -= 1
            this.configWechat()
          }
        }
        const url = '/wechat-js-sdk-config?url=' + encodeURIComponent(window.location.href.split('#')[0])
        httpAjax(url, {type: 'GET', dataType: true}, callback)
      },
      wxInit (sd) {
        let links = appUrl
        let image = appUrl + '/static/shareicon.jpg'
        let title = '拍照迎新年，奖金10万元'
        let desc = '品胜杯新年朋友圈手机摄影大赛'

        wx.config({
          debug: false,
          appId: sd.appId,
          timestamp: sd.timestamp,
          nonceStr: sd.nonceStr,
          signature: sd.signature,
          jsApiList: [
            'onMenuShareTimeline', 'onMenuShareAppMessage'
          ]
        })
        wx.ready(function () {
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
    }
  }
</script>
