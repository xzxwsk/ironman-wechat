<template>
  <div class="upimg_page">
    <div class="upImg-product">
      <img src="../assets/images/upimg.jpg" alt="" class="sb-c"/>
      <div class="upImg">
        <button class="upCick" @click="upImgAlert">
          <img src="../assets/images/ic_8.png" alt="" class=""/>
          <input type="file" v-if="isIphoneUpFile" class="file-button" ref="inputer" @change="previewHandler($event)" accept="image/jpeg,image/jpg,image/png">
        </button>
        <p>点击上传你的摄影作品</p>
      </div>
    </div>
    <bottomBar ref="bottomBar" :curPropIdx="curBottomIdx" />
    <!--弹窗-->
    <div>
      <popup v-model="alertModel" @click="hide">
        <uploader class="upStyle" :options="options" ref="uploader"
                  @upload-start="uploadStart"
                  @file-complete="fileComplete"
                  @file-added="fileAdded"
                  @files-added="filesAdded"
                  @file-error="fileError"
                  @file-success="fileSuccess"
                  @complete="complete">
          <!--<uploader-btn :attrs="attrs" class="upPhoto comBtn"><img src="../assets/images/up-icon1.png" alt="" /><br>从相册选择</uploader-btn>-->
          <button class="upPhoto comBtn">
            <img src="../assets/images/up-icon1.png" alt="" /><br>从相册选择
            <input type="file" class="file-button" ref="inputer2" @change="previewHandler($event)" accept="image/jpeg,image/jpg,image/png">
          </button>
          <uploader-btn :attrs="attrs2" class="upCanmer comBtn"><img src="../assets/images/up-icon2.png" alt=""/><br>拍照上传</uploader-btn>
        </uploader>
      </popup>
    </div>
    <toast v-model="showPositionValue" :type="toastType" :time="toastTime" :width="toastWidth" is-show-mask :text="toastTxt" :position="position"></toast>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Popup, Toast } from 'vux'
  import bottomBar from './bottom'
  import { mapState, mapActions } from 'vuex'
//  import { httpAjax } from '../common/http'
//  import { baseUrl } from '../common/config'
  import store from '../store'
  import uploader from 'vue-simple-uploader'
//  import {EXIF} from 'exif-js'
  Vue.use(uploader)

  export default {
    data () {
      return {
        alertModel: false, // 弹窗隐藏
        options: {
//          target: baseUrl + '/file/image/upload',
          testChunks: false,
          singleFile: true,
          headers: {
            'openId': store.state.openId
          }
        },
        attrs: {
          accept: 'image/*'
        },
        attrs2: {
          accept: 'image/*',
          capture: 'camera'
        },
        upImg: null,
        toastTxt: '',
        toastType: 'text',
        toastWidth: '',
        position: 'middle',
        toastTime: 2000,
        showPositionValue: false,
        isIphoneUpFile: false
      }
    },
    components: {
      Popup,
      bottomBar,
      Toast
    },
    computed: {
      ...mapState([
        'curBottomIdx'
      ])
    },
    activated () {
      this.isIphoneUpFile = this.isIPhone()
    },
    methods: {
      ...mapActions(['setUpImg', 'setUpImgFile']),
      hide () {
        this.alertModel = false
      },
      // 获取当日上传次数
      upImgAlert () {
//        httpAjax('/picture/upload/count/', {
//          type: 'GET'
//        }, this.selectFileUp)
        if (!this.isIPhone()) { // android弹窗
          this.alertModel = true
        }
      },
      getFileUrl (obj) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const src = e.target.result
            return resolve(src)
          }
          reader.readAsDataURL(obj)
        })
      },
      uploadStart () {
        console.log('uploadStart')
//        this.$vux.loading.show({
//          text: '开始上传'
//        })
      },
      fileSuccess (rootFile, file, message, chunk) {
        console.log('fileSuccess')
//        this.$vux.loading.hide()
//        let res = JSON.parse(message)
//        if (res.code === 0) {
//          this.setUpImg(res.data)
//          this.$router.push({path: '/deliver', query: {}})
//        }
      },
      complete () {
//        alert('complete')
        console.log('complete', arguments)
      },
      fileComplete (rootFile) {
//        alert(rootFile)
        console.log('file complete', arguments)
      },
      fileError (rootFile, file, message, chunk) {
//        alert(rootFile)
        console.log('file error', arguments)
      },
      fileAdded (file, event) {
        let me = this
        if (file.size > 15728640) {
          this.toastTxt = '不能上传超过15M的图片！'
          this.toastType = 'warn'
          this.showPositionValue = true
//          this.toastTime = 500000
          this.toastWidth = '13em'
          return false
        }
        this.setUpImgFile(file.file)
        this.$vux.loading.show({
          text: '正在加载'
        })
        this.getFileUrl(file.file)
        .then(function (src) {
          me.upImg = src
          me.setUpImg(src)
          this.$vux.loading.hide()
          me.$router.push({path: '/deliver', query: {}})
//          httpAjax('/file/image/upload', {
//            body: {
//              file: src
//            }
//          }, me.upImgHandler)
        })
      },
      filesAdded (files, fileList, event) {
        console.log('files add', arguments)
      },
      isAndroidPhone () {
        var u = window.navigator.userAgent.toLowerCase()
        if (u.indexOf('android') > -1) {
          return true
        } else if (u.indexOf('iphone') > -1) {
          return false
        }
      },
      isIPhone () {
        var u = window.navigator.userAgent.toLowerCase()
        if (u.indexOf('iphone') > -1) {
          return true
        } else {
          return false
        }
      },
      previewHandler (event) { // 上传改变背景图iview Upload 上传
        let inputDOM = event.currentTarget
        let file = inputDOM.files[0]
        if (file.type === 'image/gif') {
          this.toastTxt = '不能上传gif格式的图片！'
          this.toastType = 'warn'
          this.showPositionValue = true
          this.toastWidth = '13em'
          return false
        }
        let reader = new FileReader()
        reader.readAsDataURL(file)
        let me = this

        this.$vux.loading.show({
          text: '正在加载'
        })
        reader.onloadend = function (event) {
          let rotateBase64 = event.target.result
          me.setUpImg(rotateBase64)
          me.$router.push({path: '/deliver', query: {}})
        }
        this.setUpImgFile(file)
        inputDOM.value = null
        this.$vux.loading.hide()
        this.onChange && this.onChange(file, inputDOM.value)
      },
      // 获取当日上传次数回调
      selectFileUp (type, response) {
        let data = response.data
        if (type === 1) {
          if (data < 3) { // 未超过3张上限
            if (!this.isIPhone()) { // android弹窗
              this.alertModel = true
            } else { // ios选择文件
//              let event = document.createEvent('Events')
              let el = this.$refs.inputer
//              event.initEvent('touchstart', true, true)
//              alert(event)
//              alert(el)
//              el.dispatchEvent(event)
              el.dispatchEvent(new MouseEvent('click'))
            }
          } else { // 超过当日上传上限
            this.toastTxt = '您今天已上传3张相片，已不能再上传！'
            this.toastType = 'warn'
            this.showPositionValue = true
            this.toastWidth = '13em'
          }
        } else {
          this.toastTxt = response.message
          this.toastType = 'warn'
          this.showPositionValue = true
          this.toastWidth = '13em'
        }
      },
      upImgHandler (type, response) {
        var data = response.data
        if (data === 0) {

        } else {
          this.toastTxt = '上传失败！'
          this.toastType = 'warn'
          this.showPositionValue = true
          this.toastWidth = '13em'
        }
      }
    }
  }
</script>

