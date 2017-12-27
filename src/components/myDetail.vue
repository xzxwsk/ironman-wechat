<template>
  <div>
    <div class="detail-product">
      <div class="title">{{title}}</div>
      <div class="userImg">
        <img :src="userImg+'?size=normal'" alt="作品图" />
        <!--<div class="loveNum"><img :src="loveImg" alt="" />{{voteNum}}</div>-->
      </div>
      <div class="audio" v-show="isFinal">
        <span class="tit-story">评委点评</span>
      </div>
      <div class="remarkSt" v-show="isFinal">
        {{remarkCenter}}
      </div>
    </div>
    <div class="fix-bottom">
      <div class="cf">
        <div class="avatar" v-show="!usrMine" @click="userHome"> <!--别人发的 头像区域-->
          <img :src="returnImg" class="return_btn">
          <img :src="avatarImg" alt="" class="avatarImg" />
          <!--<span class="avatarName">{{avatarName}}</span>-->
        </div>
        <div class="avatar" v-show="usrMine && isFinal" @click="myHome"> <!--自己发的，进入决赛阶段 头像区域-->
          <img :src="returnImg" class="return_btn">
          <img :src="avatarImg" alt="" class="avatarImg" />
          <!--<span class="avatarName">{{avatarName}}</span>-->
        </div>
        <div class="delBox" v-show="usrMine && !isFinal"> <!--自己发的，未进入决赛阶段 删除-->
          <img :src="returnImg" class="return_btn" @click="myHome">
          <button class="delBtn" @click="delBtnPop">删除</button>
        </div>
        <div class="love" @click="loveBtn">
          <img :src="loveBefor" alt="" class="loveImg" v-show="!love"/> <!--未点赞-->
          <img :src="loveAfter" alt="" class="loveImg" v-show="love" /> <!--已点赞-->
          <span>{{loveNum}}</span>
        </div>
        <div class="voteBox">
          {{voteNum}}票
          <span class="voteBtn" :class="{dis: voted}" @click="voteHandler">投一票</span>
        </div>
        <div class="shareBox" @click="shareCon">
          <img src="../assets/images/ic_5.png" class="shareBtn"/>拉票
        </div>
      </div>
    </div>
    <!--弹窗-->
    <div :class="['shareSelect', {curr: isCurrent === true}]">
      <div :class="['item', {curr: itemCurr === 1}]" @click="shareTips(1)">
        <span>生成海报</span>
      </div>
      <div :class="['item', {curr: itemCurr === 2}]" @click="shareTips(2)"><span>分享链接</span></div>
    </div>
    <div class="albg" v-show="alBg" @click="close"></div>
    <div class="shareExplain" v-show="shareExp">
      <img :src="shareArrow" alt="" class="shareArrImg" />
      <div class="txt">点击右上角<br/>发送给微信好友或分享到朋友圈</div>
    </div>
    <!--弹窗-->
    <div class="delSure" v-show="delShow">
      <div class="delCon">
        <button @click="delBtnPic" class="delSty">删除</button>
        <button @click="canBtnPic" class="delSty">取消</button>
      </div>
      <div class="albg"></div>
    </div>
    <!--提示-->
    <toast v-model="showPositionValue" :type="toastType" :time="toastTime" :width="toastWidth" is-show-mask :text="toastTxt" :position="position"></toast>
  </div>
</template>

<script>
  /* eslint-disable no-undef */

  import { httpAjax } from '../common/http'
  import { mapState } from 'vuex'
  import { Toast } from 'vux'
  import { getStore, base64 } from '../common/util'
  import {appUrl, baseUrl} from '../common/config.js'

  export default {
    components: {
      Toast
    },
    data () {
      return {
        title: '生活',
        returnImg: require('../assets/images/return_icon.png'), // 返回按钮
        userImg: null, // 用户作品图
        loveImg: null, // 投票icon
        voteNum: '',
        playIng: false,
        audioTitle: '',
        remarkCenter: '',
        avatarImg: null, // 用户微信头像
        avatarName: '',
        loveBefor: require('../assets/images/ic_6.png'), // 喜爱前
        loveAfter: require('../assets/images/ic_4.png'), // 喜爱后
        love: false,
        loveNum: '',
        voted: false,
        isCurrent: false,
        alBg: false,
        shareArrow: require('../assets/images/ic_9.png'), // 分享icon
        shareExp: false,
        itemCurr: 0,
        id: 8,
        usrMine: false, // 是否自己发表的
        toastTxt: '',
        toastType: 'text',
        toastWidth: '',
        position: 'middle',
        toastTime: 2000,
        showPositionValue: false,
        isFinal: false, // 是否决赛阶段
        proUserId: null,
        delShow: false,
        retryTimes: 3
      }
    },
    computed: {
      ...mapState([
        'userId'
      ])
    },
//    watch: {
//      $route () {
//        this.initGetDetail()
//      }
//    },
    activated () {
      this.userImg = null
      setTimeout(() => {
        this.configWechat()
      }, 500)
      this.initGetDetail()
      this.alBg = false
      this.isCurrent = false
      this.delShow = false
    },
    methods: {
      // 获取作品详情
      initGetDetail () {
        this.id = this.$route.query.id
        httpAjax('/picture/' + this.id, {
          type: 'GET'
        }, this.picDetail)
      },
      // 获取作品详情回调
      picDetail (type, response) {
        this.$vux.loading.hide()
        if (type === 1) {
          this.title = response.data.title
          this.userImg = response.data.imageUrl
          this.voteNum = response.data.voteCount
          this.avatarImg = response.data.avatar
          this.avatarName = response.data.userName
          this.loveNum = response.data.likeCount
          this.love = response.data.like
          this.voted = response.data.vote
          this.remarkCenter = response.data.comment
          this.proUserId = response.data.userId
          if (parseInt(response.data.userId) === parseInt(this.userId)) { // 当前用户自己
            this.usrMine = true
          } else { // 别人的作品
            this.usrMine = false
          }
          // 判断是否进入决赛显示评语
          this.isFinal = getStore('isFinal') === 'true'
        }
      },
      // 查看 “他的作品”
      userHome () {
        this.$router.push({path: '/theHome', query: {id: this.proUserId}})
      },
      // 进入 "我的主页"
      myHome () {
        this.$router.push({path: '/myHome', query: {}})
      },
      // 点赞
      loveBtn () {
        if (!this.love) { // 未点赞
          httpAjax('/picture/' + this.id + '/like', {
            type: 'GET'
          }, this.picLike)
        } else { // 取消点赞
          httpAjax('/picture/' + this.id + '/unlike', {
            type: 'GET'
          }, this.picUnlike)
        }
      },
      // 点赞回调
      picLike (type, response) {
        if (response.code === 0) {
          // 点赞数加1，设为已点赞状态
          this.love = true
          this.loveNum++
        }
      },
      // 取消点赞加高
      picUnlike (type, response) {
        if (response.code === 0) {
          // 点赞数减1，设为未点赞状态
          this.love = false
          this.loveNum--
        }
      },
      // 投票
      voteHandler () {
//        if (!this.voted) {
        httpAjax('/picture/' + this.id + '/vote', {
          type: 'GET'
        }, this.picVote)
//        }
      },
      // 投票回调
      picVote (type, response) {
        if (type === 1) {
          // 投票数加1，设为已投票状态
          this.voted = true
          this.voteNum++
          this.toastTxt = '投票成功'
        } else {
          // 显示错误信息
          this.toastTxt = response.message
        }
        this.toastType = 'warn'
        this.toastWidth = '10em'
        this.showPositionValue = true
      },
      // 确认删除按钮
      delBtnPic () {
        httpAjax('/picture/' + this.id + '/delete', {
          type: 'GET'
        }, this.picDel)
      },
      // 删除回调
      picDel (type, response) {
        if (response.code === 0) {
          this.toastTxt = '作品删除成功!'
          this.toastType = 'success'
          this.$router.go(-1)
//          this.$router.push({path: '/index', query: {}})
        } else {
          this.toastTxt = response.message
          this.toastType = 'warn'
        }
        this.toastWidth = '13em'
        this.showPositionValue = true
      },
      // 分享
      shareCon () {
        this.isCurrent = !this.isCurrent
        if (this.isCurrent === true) {
          this.alBg = true
        }
      },
      // 弹出"生成海报"或"分享"选择弹窗
      shareTips (isCur) {
        this.itemCurr = isCur
        this.shareExp = isCur === 2
        if (isCur === 1) { // 生成海报 跳转到生成海报页
          this.$router.push({path: '/poster', query: {id: this.id}})
        }
      },
      // 点击蒙层隐藏弹窗
      close () {
        this.alBg = false
        this.isCurrent = false
        this.shareExp = false
      },
      // 删除 弹出确认删除弹窗
      delBtnPop () {
        this.delShow = true
      },
      // 取消 隐藏确认删除弹窗
      canBtnPic () {
        this.delShow = false
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
        const urlPostfix = base64.encode(JSON.stringify({path: 'share', args: 'id=' + this.id}))
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

