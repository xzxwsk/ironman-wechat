<template>
  <div class="finals_page">
    <p ref="title"><button @click="clearLocalStore" v-show="false">清除缓存</button></p>
    <img :src="img" ref="topImg" @load="imageLoaded">
    <!--<div class="title" ref="title">搬个小板凳，来听故事吧~</div>-->
    <scroller lock-x @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :height="scrollH" :scroll-bottom-offst="60">
      <ul class="ls">
        <li class="cf" v-for="(item, index) in lsData" :key="item.id">
          <div class="left" :id="'leftDom'+index">
            <div class="img_box" @click="jumpDetail(item.id)">
              <img :src="item.imageUrl+'?size=small'">
              <div class="start">{{item.likeCount}}</div>
              <div :class="['toupiao_success', {show:item.toupiaoShow}]"><span><img :src="startImg"><br/>投票成功！</span></div>
            </div>
            <div class="btn_box cf">
              <input type="button" :class="['zhan', {sel:item.like}]" @click="dianZhanHandler(index)">
              <span :class="['touyipiao', {dis:item.vote}]" @click="touyipiaoClick(index)">投一票</span>
            </div>
          </div>
          <div class="right" :style="{height: lsRightHeight[index]+'px'}">
            <!--<div class="audio">
              <audio controls="controls" :id="'audio'+index" class="audioFile">
                <source :src="item.userAudio" type="audio/mpeg">
              </audio>
              <button class="playBtn" @click="playListen(index)" v-show="!item.playIng"><img src="../assets/images/ic_1.png"/></button>
              <button class="playBtn" @click="stopListen(index)" v-show="item.playIng"><img src="../assets/images/ic_2.png"/></button>
              <span class="tit-story">听照片背后的故事</span>
            </div>-->
            <div class="ls_title">{{item.title}}</div>
            <div class="remarkSt">
              <span>评委点评：</span>{{item.comment}}
            </div>
          </div>
        </li>
      </ul>
      <load-more :show-loading="hasMore" :tip="hasMore?'加载中…':'已加载完毕'"></load-more>
    </scroller>
    <bottomBar ref="bottomBar" :curPropIdx="curBottomIdx" />
  </div>
</template>

<script>
  /* eslint-disable no-undef */
  import { Scroller, LoadMore } from 'vux'
  import bottomBar from './bottom'
  import { mapState } from 'vuex'
  import { removeStore } from '../common/util'
  import { httpAjax } from '../common/http'
  import {appUrl} from '../common/config.js'
  export default {
    data () {
      return {
        img: require('../assets/images/img_02.jpg'),
        startImg: require('../assets/images/index_start_icon_03.png'),
        scrollH: null,
        tempScrollH: 0, // 用于计算出来之前缓存
        hasMore: true,
        onFetching: true,
        curPage: 1,
        time: new Date(),
        lsRightHeight: [],
        lsData: [ ],
        isImgLoader: false,
        retryTimes: 3,
        isMounted: false
      }
    },
    components: {
      bottomBar,
      Scroller,
      LoadMore
    },
    computed: {
      ...mapState([
        'curBottomIdx'
      ])
    },
    mounted () {
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      setTimeout(() => {
        for (let i = 0, len = this.lsData.length; i < len; i++) {
          let left = document.getElementById('leftDom' + i)
          this.lsRightHeight[i] = left.offsetHeight
        }

        if (this.isImgLoader) { // img loaded先执行
          this.scrollH = (h - this.tempScrollH - this.$refs.bottomBar.$el.offsetHeight - 10) + 'px'
        } else {
          this.tempScrollH = h - this.$refs.bottomBar.$el.offsetHeight - 10
          this.isMounted = true
        }

        this.onFetching = false
      }, 0)
    },
    activated () {
      this.lsData = []
      this.curPage = 1
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset({top: 0})
      })
      this.getLs()
      this.configWechat()
    },
    methods: {
      // 全局清除缓存
      clearLocalStore () {
        removeStore()
      },
      // 获取决赛列表
      getLs () {
        const getLsHandler = (type, response) => {
          if (response.code === 0) {
            this.lsData = this.lsData.concat(response.data.items)
            this.curPage += 1
            this.onFetching = false
            this.hasMore = (this.curPage <= response.data.totalPage)
          }
        }
        httpAjax('/picture/normal/list?page=' + this.curPage + '&size=10', {
          body: {
            justFinals: true
          }
        }, getLsHandler)
      },
      imageLoaded (event) {
        if (this.isMounted) { // imgload先执行
          this.scrollH = (this.tempScrollH - event.target.offsetHeight) + 'px'
        } else {
          this.tempScrollH = event.target.offsetHeight
          this.isImgLoader = true
        }
      },
      dianZhanHandler (index) {
        const likeHandler = (type, response) => {
          this.$vux.loading.hide()
          if (type === 0) {
            this.$vux.toast.show({text: response.message, width: '13em'})
          }
        }
        if (!this.lsData[index].like) {
          httpAjax('/picture/' + this.lsData[index].id + '/like', {
            contentType: null,
            type: 'GET'
          }, likeHandler)
          .then(() => {
            this.lsData[index].like = true
            this.lsData[index].likeCount++
          })
        } else {
          httpAjax('/picture/' + this.lsData[index].id + '/unlike', {
            contentType: null,
            type: 'GET'
          }, likeHandler)
          .then(() => {
            this.lsData[index].like = false
            this.lsData[index].likeCount--
          })
        }
      },
      touyipiaoClick (index) {
        const touyipiaoHandler = (type, response) => {
          this.$vux.loading.hide()
          if (type === 0) {
            this.$vux.toast.show({text: response.message, width: '13em'})
          }
        }
        httpAjax('/picture/' + this.lsData[index].id + '/vote', {
          contentType: null,
          type: 'GET'
        }, touyipiaoHandler)
        .then(() => {
          this.lsData[index].vote = true
          this.lsData[index].toupiaoShow = true
        })
      },
      resetAllAudio () {
        for (let i = 0, len = this.lsData.length; i < len; i++) {
          if (this.lsData[i].playIng) {
            let audio = document.querySelector('#audio' + i)
            audio.pause()
            audio.currentTime = 0
            this.lsData[i].playIng = false
          }
        }
      },
      playListen (index) {
        this.resetAllAudio()
        let audio = document.querySelector('#audio' + index)
        if (!this.lsData[index].playIng) {
          audio.play()
          this.lsData[index].playIng = true
        }
      },
      stopListen (index) {
        let audio = document.querySelector('#audio' + index)
        if (this.lsData[index].playIng) {
          audio.pause()
          audio.currentTime = 0
          this.lsData[index].playIng = false
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
