<template>
  <div class="my_home_page">
    <div class="head" ref="head">
      <span class="call"><img :src="callImg"></span>
      <span><img :src="headImg" @click="goToCompleteInfo"><br/>{{name}}</span>
      <!--<span class="my_winning_record" @click="goToMyLotteryPage">我的抽奖记录</span>-->
    </div>
    <div class="perfect_info" ref="perfectInfo">
      <span>为了方便我们在决赛后联系到您，请尽快完善资料喔</span>
      <span class="go_perfect" @click="goToCompleteInfo">去完善 &gt;</span>
    </div>
    <div class="img_ls_con" :style="{height:scrollH}">
      <scroller lock-x @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :height="scrollH" :scroll-bottom-offst="0" v-if="lsData.length>0">
        <flexbox :gutter="0" wrap="wrap">
          <flexbox-item :span="1/2" v-for="(item, index) in lsData" :key="item.id">
            <div class="img_box" @click="jumpDetail(item.id)">
              <i class="isfinal_icon" v-if="item.finalSed && isFinal"><img :src="isfinal_icon"></i>
              <img :src="item.imageUrl+ '?size=small'" class="img" @click="goToMyDetail(item.id)">
            </div>
            <div class="btn_box cf">
              <span><img :src="voteImg"> {{item.likeCount}}</span>
              <span class="t_r">{{item.voteCount}}票</span>
            </div>
          </flexbox-item>
        </flexbox>
        <load-more v-if="isOver" :show-loading="hasMore" :tip="hasMore?'加载中…':'已加载完毕'"></load-more>
      </scroller>
      <div class="no_ls" v-if="lsData.length==0">
        <span><img :src="no_ls_img"><br/>您还没有发布作品哦~<br/>快来一展身手吧！</span>
        <span class="publish_btn" @click="goToUploadImagePage">我要发图</span>
      </div>
    </div>
    <bottomBar ref="bottomBar" :curPropIdx="curBottomIdx" />
  </div>
</template>

<script>
  /* eslint-disable no-undef,no-undef */

  import { Flexbox, FlexboxItem, Scroller, LoadMore } from 'vux'
  import bottomBar from './bottom'
  import { mapState } from 'vuex'
  import { httpAjax } from '../common/http'
  import { base64, getStore } from '../common/util'
  import { appUrl, baseUrl } from '../common/config.js'
  export default {
    data () {
      return {
        headImg: null,
        name: null,
        callImg: require('../assets/images/call.png'),
        voteImg: require('../assets/images/ic_4.png'),
        no_ls_img: require('../assets/images/no_ls.png'),
        isfinal_icon: require('../assets/images/js-img.png'),
        scrollH: null,
        hasMore: true,
        onFetching: true,
        time: new Date(),
        shareImg: require('../assets/images/ic_5.png'),
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
    mounted () {
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      setTimeout(() => {
        this.scrollH = (h - this.$refs.head.offsetHeight - this.$refs.perfectInfo.offsetHeight - this.$refs.bottomBar.$el.offsetHeight - 20) + 'px'
        this.onFetching = false
      }, 0)

      httpAjax('/user/info', {}, this.setUserInfo)
    },
    activated () {
      this.isFinal = getStore('isFinal') === 'true'
      // 初始获取列表
      this.$nextTick(() => {
        if (this.$refs.scrollerBottom === undefined) {

        } else {
          this.$refs.scrollerBottom.reset({top: 0})
        }
      })
      this.getMineImageList()
      setTimeout(() => {
        this.configWechat()
      }, 500)
    },
    computed: {
      ...mapState([
        'curBottomIdx'
      ])
    },
    methods: {
      dianZhanHandler (index) {
        if (!this.lsData[index].isZhan) {
          this.lsData[index].isZhan = true
          if (this.lsData[index].likeCount < 999) {
            this.lsData[index].likeCount++
          } else if (this.lsData[index].likeCount === 999) {
            this.lsData[index].likeCount = '1k'
          }
        }
      },
      touyipiaoHandler (index) {
        this.lsData[index].isToupiao = true
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
      setUserInfo (type, response) {
        var data = response.data
        if (data) {
          this.headImg = data.headImageUrl
          this.name = data.nickName
        }
      },
      goToCompleteInfo () {
        this.$router.push('/aboutInfo')
      },
      goToMyLotteryPage () {
        this.$router.push('/LotteryRe')
      },
      goToMyDetail (id) {
        this.$router.push({path: '/myDetail', query: {id: id}})
      },
      goToUploadImagePage () {
        this.$router.push('/upImg')
      },
      formatData (_data) {
        let result
        if (_data >= 10000) {
          result = parseInt(_data / 1000) / 10 + 'W'
        } else if (_data >= 1000) {
          result = parseInt(_data / 100) / 10 + 'K'
        } else {
          result = _data
        }
        return result
      },
      // 初始获取列表
      getMineImageList () {
        const callback = (type, response) => {
          this.hasMore = false
          if (type === 1) {
            this.lsData = response.data.items
            for (let i = 0, len = this.lsData.length; i < len; i++) {
              this.lsData[i].likeCount = this.formatData(this.lsData[i].likeCount)
              this.lsData[i].voteCount = this.formatData(this.lsData[i].voteCount)
            }

            this.curPage = 2
            if (response.data.totalPage < 2) {
              this.isOver = false
            }
          }
        }
        // mark here temp modify by lihanghang
        // httpAjax('/picture/hot/list?page=1&size=3', {type: 'GET'}, callback)
        httpAjax('/author/mine/picture/list?page=1&size=10', {type: 'GET', contentType: null}, callback)
      },
      // 拉到底部加载更多
      getLs () {
        httpAjax('/author/mine/picture/list?page=' + this.curPage + '&size=10', {
          type: 'GET'
        }, this.getLsHandler)
      },
      // 拉到底部加载更多回调
      getLsHandler (type, response) {
        if (type === 1) {
          let data = response.data
          this.lsData = this.lsData.concat(data.items)
          for (let i = 0, len = this.lsData.length; i < len; i++) {
            this.lsData[i].likeCount = this.formatData(this.lsData[i].likeCount)
            this.lsData[i].voteCount = this.formatData(this.lsData[i].voteCount)
          }
          this.curPage += 1
          this.onFetching = false
          this.hasMore = (this.curPage <= data.totalPage)
        }
      },
      jumpDetail (id) {
        this.$router.push({path: '/myDetail', query: {id: id}})
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
        const urlPostfix = base64.encode(JSON.stringify({path: 'otherHome', args: 'id=' + parseInt(this.$store.state.userId)}))
        let links = baseUrl + '/share/' + urlPostfix
        let image = appUrl + '/static/shareicon.jpg'
        let title = '我在参加品胜杯新年朋友圈手机摄影大赛，来为我打CALL吧'
        let desc = '要么为我投票，要么与我一决10万摄影大奖！'
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
