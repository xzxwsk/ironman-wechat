<template>
  <div class="index_page">
    <div class="banner" ref="banner">
      <button @click="clearLocalStore" v-show="false">清除缓存</button>
      <!--<img :src="banner_list[0]">-->
      <swiper :aspect-ratio="289/749" auto loop :list="banner_list" :index="banner_index" @on-index-change="banner_onIndexChange">
        <!--<swiper-item v-for="(item, index) in banner_list" :key="index"><img :src="item" @click="bannerJump(index)"></swiper-item>-->
      </swiper>
    </div>
    <div class="img_ls_head" ref="head">
      <tab :animate="false" v-model="indexTab" prevent-default @on-before-index-change="switchTabItem">
        <tab-item selected>推荐</tab-item>
        <tab-item>排行</tab-item>
        <tab-item>最新</tab-item>
      </tab>
    </div>
    <div class="img_ls_con">
      <scroller lock-x @on-scroll-bottom="onScrollBottom" :ref="'scrollerBottom'+imgLsIndex" :height="scrollH" :scroll-bottom-offst="60" v-for="(imgLsItem, imgLsIndex) in imgLs" :key="imgLsIndex" v-if="imgLsIndex==indexTab">
        <flexbox :gutter="0" wrap="wrap">
          <flexbox-item :span="1/2" v-for="(item, index) in imgLsItem.data" :key="item.id">
            <div class="img_box" @click="jumpDetail(item.id)">
              <img :src="item.imageUrl+'?size=small'">
              <div class="start">{{item.voteCount}}</div>
              <div :class="['toupiao_success', {show:item.toupiaoShow}]"><span><img :src="startImg"><br/>投票成功！</span></div>
            </div>
            <div class="btn_box cf">
              <input type="button" :class="['zhan', {sel:item.like}]" @click="dianZhanHandler(index)">
              <span :class="['touyipiao', {dis:item.vote}]" @click="touyipiaoClick(index)">投一票</span>
            </div>
          </flexbox-item>
        </flexbox>
        <load-more :show-loading="imgLsItem.hasMore" :tip="imgLsItem.hasMore?'加载中…':' '"></load-more>
      </scroller>
    </div>
    <bottomBar ref="bottomBar" :curPropIdx="curBottomIdx" />
  </div>
</template>

<script>
  /* eslint-disable no-undef */
  import { Swiper, SwiperItem, Tab, TabItem, Scroller, LoadMore, Flexbox, FlexboxItem } from 'vux'
  import bottomBar from './bottom'
  import { mapState } from 'vuex'
  import { httpAjax } from '../common/http'
  import { removeStore } from '../common/util'
  import { appUrl } from '../common/config'

  export default {
    data () {
      return {
        banner_index: 0,
        retryTimes: 3,
        banner_list: [
          {
            url: appUrl + '/#/about',
            img: require('../assets/images/index_banner_02.jpg')
          },
          {
            url: appUrl + '/#/winmethod',
            img: require('../assets/images/index_banner.jpg')
          }
        ],
        scrollH: null,
        startImg: require('../assets/images/index_start_icon_03.png'),
        time: new Date(),
        indexTab: 0,
        imgLs: [
          {
            curPage: 1,
            hasMore: false,
            onFetching: true,
            data: []
          },
          {
            curPage: 1,
            hasMore: false,
            onFetching: true,
            data: []
          },
          {
            curPage: 1,
            hasMore: false,
            onFetching: true,
            data: []
          }
        ]
      }
    },
    components: {
      bottomBar,
      Swiper,
      SwiperItem,
      Tab,
      TabItem,
      Scroller,
      LoadMore,
      Flexbox,
      FlexboxItem
    },
    mounted () {
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

      this.$nextTick(() => {
        this.$refs.scrollerBottom0[0].reset({top: 0})
      })
      setTimeout(() => {
        this.scrollH = (h - this.$refs.banner.offsetHeight - this.$refs.head.offsetHeight - this.$refs.bottomBar.$el.offsetHeight - 2) + 'px'
      }, 0)
    },
    activated () {
      // 获取是否进入决赛阶段
//      if (getStore('isFinalDate') !== formatDate(new Date(), 'yyyy-MM-dd')) { // 每天获取
//        httpAjax('/system/isFinals', {
//          contentType: null,
//          type: 'GET'
//        }, this.isFinalHandler)
//      } else { // 当天直接取
//        this.isFinal = !!getStore('isFinal')
//      }

      // 返回时重置页面
      this.$nextTick(() => {
        switch (this.indexTab) {
          case 0:
            this.$refs.scrollerBottom0[0].reset({top: 0})
            break
          case 1:
            this.$refs.scrollerBottom1[0].reset({top: 0})
            break
          case 2:
            this.$refs.scrollerBottom2[0].reset({top: 0})
            break
        }
      })
      this.resetLs()
      this.getLs()
      // 判断用户是否有抽奖机会
//      httpAjax('/award/firstlogin/check', {
//        contentType: null,
//        type: 'GET'
//      }, this.isLotteryFun)
      this.configWechat()
    },
    computed: {
      ...mapState([
        'curBottomIdx'
      ])
    },
    methods: {
      // 全局清除缓存
      clearLocalStore () {
        removeStore()
      },
      // 判断是否进入决赛回调
//      isFinalHandler (type, response) {
//        if (type === 1) {
//          // 保存是否决赛阶段
//          setStore('isFinal', response.data)
//          setStore('isFinalDate', formatDate(new Date(), 'yyyy-MM-dd'))
//          this.isFinal = response.data
//        }
//      },

      // 判断用户是否有抽奖机会回调
      isLotteryFun (type, response) {
        if (type === 1) {
          if (response.data) { // 有抽奖机会
            this.$router.replace({path: '/lottery', query: {firstLogin: 1}})
          } else { // 没抽奖机会
            this.getLs()
          }
        }
      },
      // 重置页面
      resetLs () {
        this.imgLs = [
          {
            curPage: 1,
            hasMore: false,
            onFetching: true,
            data: []
          },
          {
            curPage: 1,
            hasMore: false,
            onFetching: true,
            data: []
          },
          {
            curPage: 1,
            hasMore: false,
            onFetching: true,
            data: []
          }
        ]
      },
      // 切换tab
      switchTabItem (index) {
        this.$vux.loading.show({
          text: '加载中…'
        })
        this.indexTab = index
        this.getLs()
      },
      // 点赞
      dianZhanHandler (index) {
        if (!this.imgLs[this.indexTab].data[index].like) {
          httpAjax('/picture/' + this.imgLs[this.indexTab].data[index].id + '/like', {
            contentType: null,
            type: 'GET'
          }, this.likeHandler)
          .then(() => {
            this.imgLs[this.indexTab].data[index].like = true
            this.imgLs[this.indexTab].data[index].likeCount++
          })
        } else {
          httpAjax('/picture/' + this.imgLs[this.indexTab].data[index].id + '/unlike', {
            contentType: null,
            type: 'GET'
          }, this.likeHandler)
          .then(() => {
            this.imgLs[this.indexTab].data[index].like = false
            this.imgLs[this.indexTab].data[index].likeCount--
          })
        }
      },
      // 投票
      touyipiaoClick (index) {
        httpAjax('/picture/' + this.imgLs[this.indexTab].data[index].id + '/vote', {
          contentType: null,
          type: 'GET'
        }, this.touyipiaoHandler)
        .then(() => {
          this.imgLs[this.indexTab].data[index].voteCount += 1
          this.imgLs[this.indexTab].data[index].vote = true
          this.imgLs[this.indexTab].data[index].toupiaoShow = true
        })
      },
      // 拉动列表到底部
      onScrollBottom () {
        if ((new Date() - this.time) > 2000) {
          this.time = new Date()
          if (!this.imgLs[this.indexTab].onFetching && this.imgLs[this.indexTab].hasMore) {
            this.imgLs[this.indexTab].onFetching = true
            setTimeout(() => {
              this.getLs()
            }, 1000)
          }
        }
      },
      // 获取图片列表
      getLs () {
        let path = 'hot'
        switch (this.indexTab) {
          case 0:
            path = 'recommend'
            break
          case 1:
            path = 'hot'
            break
          case 2:
            path = 'normal'
            break
          default:
            path = 'normal'
        }

        this.$vux.loading.show({
          text: '正在加载'
        })
//        if (this.isFinal) {
//          path = 'normal'
//        }
        let url = '/picture/' + path + '/list?page=' + this.imgLs[this.indexTab].curPage + '&size=10'
        httpAjax(url, {
          contentType: null,
          type: 'GET'
        }, this.getListHandler)
      },
      // 设置图片列表
      getListHandler (type, response) {
        this.$vux.loading.hide()
        if (response.code === 0) {
          let data = response.data
          this.imgLs[this.indexTab].data = this.imgLs[this.indexTab].data.concat(data.items)
          this.imgLs[this.indexTab].curPage += 1
          this.imgLs[this.indexTab].onFetching = false
          this.imgLs[this.indexTab].hasMore = (this.imgLs[this.indexTab].curPage <= data.totalPage)
        }
        this.$nextTick(() => {
          let refObj = null
          switch (this.indexTab) {
            case 0:
              refObj = this.$refs.scrollerBottom0
              break
            case 1:
              refObj = this.$refs.scrollerBottom1
              break
            case 2:
              refObj = this.$refs.scrollerBottom2
              break
          }
          refObj[0].reset()
        })
      },
      // 点赞成功隐藏loading
      likeHandler (type, response) {
        this.$vux.loading.hide()
      },
      // 投票成功隐藏loading
      touyipiaoHandler (type, response) {
        this.$vux.loading.hide()
        if (type === 0) {
          this.$vux.toast.show({text: response.message, type: 'warn', width: '13em'})
        }
      },
      // 跳转详情
      jumpDetail (id) {
        this.$router.push({path: '/myDetail', query: {id: id}})
      },
      // banner链接
      bannerJump (index) {
        if (index === 0) {
          this.$router.push({path: '/about', query: {}})
        } else if (index === 1) {
          window.location.href = 'https://h5.youzan.com/v2/showcase/homepage?alias=1edmdw6ct&sf=wx_menu'
        }
      },
      banner_onIndexChange (index) {
        this.banner_index = index
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
