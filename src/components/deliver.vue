<template>
  <div>
    <div class="upLoad-product">
      <div class="inputBq"><input type="text" v-model="deliveTitle" maxlength="10" class="control-put" placeholder="为你的作品添加一个标题吧(限10个字符)"/></div>
      <div class="btn"><button class="pubBtn" @click="deliverBtn">发 表</button></div>
      <div class="upImg">
        <img :src="upUserImg" alt="作品图" />
      </div>
    </div>
    <bottomBar ref="bottomBar" :curPropIdx="curBottomIdx" />

    <!--协议弹窗-->
    <!--<div v-transfer-dom>-->
      <!--<popup v-model="alertModel">-->
    <div class="pop_box" v-show="alertModel">
      <div class="popup agreeBox">
        <div class="title">发表作品即同意《品胜杯新年朋友圈摄影大赛协议》</div>
        <div class="geIcon">
          <span :class="['check', {active: selected === true}]"  @click="checkagree" ></span>
          <router-link to="/rules">《品胜杯新年朋友圈摄影大赛协议》</router-link>
        </div>
        <div class="submitBtn">
          <button class="btnRefuse conBtn" @click="btnRefuse">拒绝</button>
          <button class="btnSure conBtn" :disabled="!selected" @click="btnSure">同意</button>
        </div>
      </div>
    </div>

    <!--上传结果弹窗 成功或失败-->
    <!--<div v-transfer-dom>-->
      <!--<popup v-model="alertModelUp">-->
    <div class="pop_box" v-show="alertModelUp">
      <div class="sucessBox">
        <div class="closeBtn" @click="hide" v-show="!sucess">x</div> <!--上传失败才显示关闭按钮-->
        <div class="publishIcon" v-show="sucess">
          <img src="../assets/images/ic_7.png"/>
          <div class="title">发表成功!</div>
        </div>
        <div class="publishIcon" v-show="!sucess">
          <img src="../assets/images/ic_10.png"/>
          <div class="title">发表失败!</div>
        </div>
        <div class="btn" v-show="sucess"><button class="pubBtn" @click="jumpMyHome">查看作品</button></div>
        <div class="disappearTime" v-show="isFirstLottery">首次发图，获得一次抽奖机会 <span class="txt_red" @click="jumpLottery">去抽奖</span></div>
      </div>
    </div>
    <toast v-model="showPositionValue" :type="toastType" :time="toastTime" :width="toastWidth" is-show-mask :text="toastTxt" :position="position"></toast>
  </div>
</template>

<script>
  import { TransferDom, Popup, Toast } from 'vux'
  import bottomBar from './bottom'
  import { mapState } from 'vuex'
  import { httpAjax } from '../common/http'
  import { setStore, getStore } from '../common/util'

  export default {
    data () {
      return {
        deliveTitle: '',
//        upUserImg: require('../assets/images/detail-img.jpg'), // 用户作品图
        upUserImg: null,
        alertModel: false, // 弹窗隐藏
        selected: true,
        alertModelUp: false,
        sucess: true, // 上传成功
        isFirstLottery: false, // 首次发图，显示获得一次抽奖机会
        toastTxt: '',
        toastType: 'text',
        toastWidth: '',
        position: 'middle',
        toastTime: 2000,
        showPositionValue: false,
        errMsg: ''
      }
    },
    directives: {
      TransferDom
    },
    components: {
      Popup,
      bottomBar,
      Toast
    },
    activated () {
      this.deliveTitle = ''
      this.upUserImg = null
      this.errMsg = ''
      this.alertModelUp = ''
      this.sucess = false
      this.isFirstLottery = false
      this.upUserImg = this.upImg
      if (!this.upUserImg) {
        this.$router.push({path: '/upImg', query: {}})
      }
    },
    computed: {
      ...mapState([
        'curBottomIdx', 'upImg', 'upImgFile'
      ])
    },
    watch: {
      upImg (val) {
        this.upUserImg = val
      }
    },
    methods: {
      // 是否同意协议
      checkagree () {
        this.selected = !this.selected
      },
      // 发表按钮
      deliverBtn () {
        const upCountHandler = (type, response) => {
          if (type === 1) {
            if (response.data < 3) {
              let flag = true
              if (this.deliveTitle === '') {
                this.toastTxt = '未输入标题不能发表！'
                flag = false
              } else if (!this.upUserImg) {
                this.toastTxt = '未上传图片不能发表！'
                flag = false
              }
              if (flag) { // 非空验证
                let isAcceptProtocal = getStore('isAcceptProtocal')
                if (isAcceptProtocal === 'false' || isAcceptProtocal === null) { // 未同意过协议
                  this.alertModel = true
                } else { // 已同意直接提交
                  this.btnSure()
                }
              } else { // 报非空验证错误
                this.toastType = 'warn'
                this.toastWidth = '13em'
                this.showPositionValue = true
              }
            } else {
              this.toastTxt = '当前上传超过3张上限！'
              this.toastType = 'warn'
              this.toastWidth = '13em'
              this.showPositionValue = true
            }
          } else {
            this.toastTxt = response.message
            this.toastType = 'warn'
            this.toastWidth = '13em'
            this.showPositionValue = true
          }
        }
        httpAjax('/picture/upload/count/', {
          type: 'GET'
        }, upCountHandler)
      },
      // 拒绝协议
      btnRefuse () {
        this.alertModel = false
      },
      // 点击同意按钮 提交上传
      btnSure () {
        this.alertModel = false
        setStore('isAcceptProtocal', true)
        this.$vux.loading.show({
          text: '开始上传'
        })
        // 上传
        httpAjax('/picture/upload', {
          contentType: null,
          body: {
            title: this.deliveTitle,
            picture: this.upImgFile
          }
        }, this.deliveImgHandler)
      },
      // 上传回调
      deliveImgHandler (type, response) {
        this.$vux.loading.hide()
        if (type === 1) { // 上传成功
          this.sucess = true
          // 获取是否有抽奖机会
          httpAjax('/award/firstupload/check', {
            contentType: null,
            type: 'GET'
          }, this.isLotteryFun)
        } else { // 上传网络错误
          this.sucess = false
          this.alertModelUp = true
          this.errMsg = response.message
        }
      },
      // 获取是否有抽奖机会回调
      isLotteryFun (type, response) {
        if (type === 1) {
          if (response.data) { // 有抽奖机会
            this.isFirstLottery = true // 首次发图，显示获得一次抽奖机会
          }
          this.alertModelUp = true // 显示抽奖结果弹窗
        } else { // 判断是否有抽奖机会时出现网络错误
          this.errMsg = response.message
        }
      },
      // 弹窗关闭按钮
      hide () {
        this.alertModelUp = false
      },
      // 跳转“我的主页”
      jumpMyHome () {
        this.$router.push({path: '/myHome', query: {}})
      },
      // 跳转“抽奖”页
      jumpLottery () {
        this.$router.push({path: '/lottery', query: {}})
      }
    }
  }
</script>
