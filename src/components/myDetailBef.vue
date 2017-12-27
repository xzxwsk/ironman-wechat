<template>
  <div>
    <div class="detail-product">
      <div class="title">{{title}}</div>
      <div class="userImg">
        <img :src="userImg" alt="作品图" />
        <div class="loveNum"><img :src="loveImg" alt="" />{{voteNum}}</div>
      </div>
    </div>
    <div class="fix-bottom">
      <div class="cf">
        <div class="avatar">
          <img :src="avatarImg" alt="" class="avatarImg" />
          <span class="avatarName">{{avatarName}}</span>
        </div>
        <div class="love" @click="loveBtn">
          <img :src="loveBefor" alt="" class="loveImg" v-show="!love"/>
          <img :src="loveAfter" alt="" class="loveImg" v-show="love" />
          <span>{{loveNum}}</span>
        </div>
        <div class="voteBox">
          <span class="voteBtn" :class="{dis: voted}" @click="voteHandler">投一票</span>
        </div>
        <div class="shareBox" @click="shareCon">
          <img src="../assets/images/ic_5.png" class="shareBtn"/>
        </div>
      </div>
    </div>
    <!--弹窗-->
    <div :class="['shareSelect', {curr: isCurrent === true}]">
      <div :class="['item', {curr: itemCurr === 1}]" @click="shareTips(1)">
        <router-link to="/poster">生成海报</router-link>
      </div>
      <div :class="['item', {curr: itemCurr === 2}]" @click="shareTips(2)"><span>分享链接</span></div>
    </div>
    <div class="albg" v-show="alBg" @click="close"></div>
    <div class="shareExplain" v-show="shareExp">
      <img :src="shareArrow" alt="" class="shareArrImg" />
      <div class="txt">点击右上角<br/>发送给微信好友或分享到朋友圈</div>
    </div>
  </div>
</template>

<script>
  import { httpAjax } from '../common/http'
  export default {
    components: {
    },
    data () {
      return {
        title: '生活',
        userImg: require('../assets/images/detail-img.jpg'), // 用户作品图
        loveImg: require('../assets/images/ic_3.png'), // 投票icon
        voteNum: '333',
        playIng: false,
        avatarImg: require('../assets/images/avatar.jpg'), // 用户微信头像
        avatarName: '李小二',
        loveBefor: require('../assets/images/ic_6.png'), // 喜爱前
        loveAfter: require('../assets/images/ic_4.png'), // 喜爱后
        love: false,
        loveNum: '155',
        voted: false,
        isCurrent: false,
        alBg: false,
        shareArrow: require('../assets/images/ic_9.png'), // 分享icon
        shareExp: false,
        itemCurr: 0,
        id: 8
      }
    },
    mounted () {
      //this.id = this.$route.query.id
      httpAjax('/picture/'+ this.id, {
        type:'GET'
      }, this.picDetail)
    },
    methods: {
      picDetail (type, response)  {
        this.$vux.loading.hide()
        if (response.code === 0) {
          this.title = response.data.title
          this.userImg = response.data.imageUrl 
          this.voteNum = response.data.voteCount
          this.avatarImg = response.data.avatar
          this.avatarName = response.data.userName
          this.loveNum = response.data.likeCount 
        } 
      },
      loveBtn () {
        if (!this.love) {
          httpAjax('/picture/'+ this.id, {
            type:'GET'
          }, this.picDetail)
          this.love = true
          this.loveNum++
        } else {
          this.love = false
          this.loveNum--
        }
      },
      voteHandler () {
        if (!this.voted) {
          this.voted = true
          this.voteNum++
        }
      },
      shareCon () {
        this.isCurrent = !this.isCurrent
        if (this.isCurrent === true) {
          this.alBg = true
        }
      },
      shareTips (isCur) {
        this.itemCurr = isCur
        this.shareExp = isCur === 2
      },
      close () {
        this.alBg = false
        this.isCurrent = false
        this.shareExp = false
      }
    }
  }
</script>

