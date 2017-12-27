<template>
  <div class="the_home_page">
    <div class="head" ref="head">
      <i class="prompt"><img :src="promptImg"></i>
      <span><img :src="headImg"><br/>{{name}}</span>
    </div>
    <div class="img_ls_con">
      <scroller lock-x @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :height="scrollH" :scroll-bottom-offst="60">
        <flexbox :gutter="0" wrap="wrap">
          <flexbox-item :span="1/2" v-for="(item, index) in lsData" :key="item.id">
            <div class="img_box" @click="jumpDetail(item.id)">
              <i class="isfinal_icon" v-if="item.finalSed"><img :src="isfinal_icon"></i>
              <img :src="item.imageUrl+'?size=small'">
              <div class="start">{{item.voteCount}}</div>
              <div :class="['toupiao_success', {show:item.toupiaoShow}]"><span><img :src="startImg"><br/>投票成功！</span></div>
            </div>
            <div class="btn_box cf">
              <span class="like">
                <input type="button" :class="['zhan', {sel:item.like}]" @click="dianZhanHandler(index)">{{item.likeCount}}
              </span>
              <span :class="['touyipiao', {dis:item.vote}]" @click="touyipiaoClick(index)">投一票</span>
            </div>
          </flexbox-item>
        </flexbox>
        <load-more v-if="isOver" :show-loading="hasMore" :tip="hasMore?'加载中…':'已加载完毕'"></load-more>
      </scroller>
    </div>
    <bottomBar ref="bottomBar" :curPropIdx="curBottomIdx" />
  </div>
</template>

<script>
  /* eslint-disable no-undef */

  import { Flexbox, FlexboxItem, Scroller, LoadMore } from 'vux'
  import bottomBar from './bottom'
  import { mapState } from 'vuex'
  import { httpAjax } from '../common/http'
  import { base64 } from '../common/util'
  import { appUrl, baseUrl } from '../common/config.js'
  export default {
    data () {
      return {
        promptImg: require('../assets/images/thehome_prompt2.png'),
        headImg: null,
        name: '',
        scrollH: null,
        hasMore: true,
        userId: 0,
        onFetching: true,
        isfinal_icon: require('../assets/images/js-img.png'),
        startImg: require('../assets/images/index_start_icon_03.png'),
        time: new Date(),
        lsData: [],
        curPage: 1,
        retryTimes: 3,
        isOver: true // 加载完不再显示"加载更多"按钮
      }
    },
    components: {
      bottomBar,
      Flexbox,
      FlexboxItem,
      Scroller,
      LoadMore
    },
    activated () {
      this.curPage = 1
      this.headImg = null
      this.name = ''
      this.userId = parseInt(this.$route.query.id)
      this.lsData = []
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset({top: 0})
      })
      if (parseInt(this.$store.state.userId) === this.userId) {
        this.$router.push('/myHome')
        return
      }
      setTimeout(() => {
        this.configWechat()
      }, 500)
      // 获取用户信息回调
      const getUserInfoHandler = (type, response) => {
        if (type === 1) {
          let data = response.data
          this.headImg = data.headImageUrl
          this.name = data.nickName
        } else {
          this.$vux.toast.show({text: response.message, width: '13em'})
        }
      }
      // 获取用户信息
      httpAjax('/user/' + this.userId + '/info', {
        type: 'GET'
      }, getUserInfoHandler)
      this.getLs()
    },
    mounted () {
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      setTimeout(() => {
        this.scrollH = (h - this.$refs.head.offsetHeight - this.$refs.bottomBar.$el.offsetHeight - 20) + 'px'
        this.onFetching = false
      }, 0)
    },
    computed: {
      ...mapState([
        'curBottomIdx'
      ])
    },
    methods: {
      getLs () {
        httpAjax('/author/' + this.userId + '/picture/list?page=' + this.curPage + '&size=10', {
          type: 'GET'
        }, this.getLsHandler)
      },
      getLsHandler (type, response) {
        if (type === 1) {
          let data = response.data
          this.lsData = this.lsData.concat(data.items)
          this.curPage += 1
          this.onFetching = false
          this.hasMore = (this.curPage <= data.totalPage)
          if (response.data.totalPage < 2) {
            this.isOver = false
          }
        }
      },
      touyipiaoClick (index) {
        httpAjax('/picture/' + this.lsData[index].id + '/vote', {
          contentType: null,
          type: 'GET'
        }, this.touyipiaoHandler)
        .then(() => {
          this.lsData[index].voteCount += 1
          this.lsData[index].vote = true
          this.lsData[index].toupiaoShow = true
        })
      },
      dianZhanHandler (index) {
        if (!this.lsData[index].like) {
          httpAjax('/picture/' + this.lsData[index].id + '/like', {
            contentType: null,
            type: 'GET'
          }, this.likeHandler)
          .then(() => {
            this.lsData[index].like = true
            this.lsData[index].likeCount++
          })
        } else {
          httpAjax('/picture/' + this.lsData[index].id + '/unlike', {
            contentType: null,
            type: 'GET'
          }, this.likeHandler)
          .then(() => {
            this.lsData[index].like = false
            this.lsData[index].likeCount--
          })
        }
      },
      onScrollBottom () {
        if ((new Date() - this.time) > 2000) {
          this.time = new Date()
          if (!this.onFetching && this.hasMore) {
            this.onFetching = true
            setTimeout(() => {
              this.getLs()
            }, 1000)
          }
        }
      },
      jumpDetail (id) {
        this.$router.push({path: '/myDetail', query: {id: id}})
      },
      touyipiaoHandler (type, response) {
        this.$vux.loading.hide()
        if (type === 0) {
          this.$vux.toast.show({text: response.message, width: '13em'})
        }
      },
      likeHandler (type, response) {
        this.$vux.loading.hide()
        if (type === 0) {
          this.$vux.toast.show({text: response.message, width: '13em'})
        }
      },
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
        const urlPostfix = base64.encode(JSON.stringify({path: 'otherHome', args: 'id=' + this.userId}))
        let links = baseUrl + '/share/' + urlPostfix
        let image = appUrl + '/static/shareicon.jpg'
        let title = '拍照迎新年，奖金10万元'
        let desc = '品胜杯新年朋友圈手机摄影大赛'
        //  let a = base64.decode(base64.encode(JSON.stringify({path: '/myDetail', para: 'id=3'})))

        wx.config({
          debug: false,
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
          // alert("error")E
        })
      }
    }
  }
</script>
