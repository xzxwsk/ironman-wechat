<template>
  <div>
    <div v-show="showShotCutImage">
      <img :src="shotCutImage">
    </div>
    <div class="shotCut" style="background: white;width: 100%">
      <div class="posterBox cf" v-show="!showShotCutImage">
        <p class="imgLogo"><img :src="logo" alt="品胜摄影大赛"/></p>
        <div class="usrImg">
          <div class="imgSty"><img :src="base64Img" alt=""/></div>
        </div>
        <div class="txt">要么给我投票！<br/>
          要么与我一决10万摄影大奖！</div>
        <div class="qr-code"><img id="canvas" :src="qrCode"/></div>
      </div>
    </div>
    <div class="posterBtn">
      <button class="yellewBtn" @click="openModal">确 定</button>
    </div>

    <div v-transfer-dom>
      <popup v-model="modal" height="100%" is-transparent>
        <div class="poster_prompt">
          <div class="closeBtn" @click="closeModal">x</div>
          <div class="prompt_con">长按海报图片<br>保存至本地后分享</div>
        </div>
      </popup>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="showToast" class="dialog-demo" hide-on-blur>
        <span>长按此图保存至本地然后分享</span>
        <div class="img-box">
          <img :src="shotCutImage" style="max-width:100%">
        </div>
        <div @click="showToast=false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>

  </div>
</template>

<script>
  import { TransferDom, Popup, XDialog } from 'vux'
  import html2canvas from 'html2canvas'
  import {httpAjax} from '../common/http'
  import {appUrl} from '../common/config.js'

  export default {
    directives: {
      TransferDom
    },
    activated () {
      this.base64Img = ''
      this.initGetDetail()
      this.useQrcode()
    },
    components: {
      Popup,
      XDialog
    },
    watch: {
      '$route' (to, from) {
        this.showToast = false
        this.$vux.loading.hide()
      }
    },
    data () {
      return {
        showToast: false,
        shotCutImage: '',
        showShotCutImage: false,
        logo: require('../assets/images/logo-c.png'), // 品胜摄影大赛logo
        userImg: '', // 品胜摄影大赛logo
        qrCode: require('../assets/images/qr-code.jpg'), // 二维码
        modal: false,
        id: 0,
        base64Img: ''
      }
    },
    methods: {
      initGetDetail () {
        this.userImg = ''
        this.id = this.$route.query.id
        const callback = (type, response) => {
          if (type === 1 && response.code === 0) {
            if (response.data) {
              this.userImg = response.data.imageUrl + '?size=normal'
              this.tranformImgToBase64(this.userImg)
            }
          }
        }
        httpAjax('/picture/' + this.id, {
          type: 'GET'
        }, callback)
      },
      useQrcode () {
        let QRCode = require('qrcode')
        let canvas = document.createElement('canvas')
        QRCode.toCanvas(canvas, appUrl + '/#/share?id=' + this.id, function (error) {
          if (error) console.error(error)
        })
        this.qrCode = canvas.toDataURL()
      },
      screenShot () {
        scrollTo(0, 0)
        const me = this
        let page = null
        page = document.getElementsByClassName('shotCut')
        let w = window.innerWidth
        let h = page[0].clientHeight
        const canvas = document.createElement('canvas')
        canvas.width = w * 2
        canvas.height = h * 2
        canvas.style.width = w + 'px'
        canvas.style.height = h + 'px'
        const context = canvas.getContext('2d')
        context.scale(2, 2)
        html2canvas(page[0]).then(function (canvas) {
          me.shotCutImage = canvas.toDataURL()
          me.showToast = true
          me.$vux.loading.hide()
        })
      },
      openModal () {
        this.$vux.loading.show({
          text: '生成海报中…'
        })
        this.screenShot()
        // this.modal = true
      },
      closeModal () {
        this.modal = false
      },
      getBase64Image (img) {
        let canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height)
        let dataURL = canvas.toDataURL()
        return dataURL
      },
      tranformImgToBase64 (src) {
        this.$vux.loading.show({
          text: '请等待，海报加载中…'
        })
        let img = document.createElement('img')
        img.src = src
        let self = this
        img.crossOrigin = 'Anonymous'
        img.onload = function () {
          self.base64Img = self.getBase64Image(this)
          self.$vux.loading.hide()
        }
      }
    }
  }
</script>
