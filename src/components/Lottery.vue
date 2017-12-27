<template>
  <div>
  	<!--开始抽奖-->
    <div class="lottery">
      <img src="../assets/images/prize-bg.jpg" class="bg"/>
      <div class="info" v-show="lotStar">
        <h1><img src="../assets/images/logo-img.png"/></h1>
        <div class="btnLot" @click="lottery"><img src="../assets/images/btn-c.png"/></div>
        <div class="pisenLogo"><img src="../assets/images/pisen-logo.png"/></div>
      </div>
      <!--抽奖结果(中奖)-->
      <div v-transfer-dom>
        <popup v-model="alertModel" height="100%" is-transparent>
          <div class="lottPrize">
            <div class="closeBtn" @click="hide" v-show="false">x</div>
            <div class="title">恭喜您</div>
            <div class="prizeName">抽中（奖品名{{prizeName}}1个）</div>
            <div class="controlForm record">
              <input type="" name="" v-model="receiverName" maxlength="10" id="name" value="" placeholder="姓名"
                     class="control-put"/>
            </div>
            <div class="controlForm">
              <input type="" name="" v-model="receiverPhone" maxlength="11" id="phone" value="" placeholder="联系方式"
                     class="control-put"/>
            </div>
            <div class="controlForm">
              <x-address title="" v-model="receiverAddress" :list="addressData" placeholder="所在地区" raw-value value-text-align="left" :popup-style="{zIndex: 9999}"></x-address>
            </div>
            <div class="controlForm">
             <input type="" name="" v-model="receiverAddressDetail" maxlength="50" id="adress" value=""
                    placeholder="详细地址" class="control-put"/>
            </div>
            <div class="submitBtn">
              <button class="btnSure" @click="saveAddress">确 定</button>
            </div>
          </div>
        </popup>
      </div>
      <!--抽奖结果(没中奖)-->
      <div v-transfer-dom>
        <popup v-model="resultStyle" class="noWin" height="100%" is-transparent>
          <img src="../assets/images/prize-no.jpg" class="bg"/>
          <div class="txt"><img src="../assets/images/prize-no-t.png" alt="没中奖"/></div>
          <div class="tip-t">点击下方按钮参与活动，<br/>还可获得一次抽奖机会哟~</div>
          <div class="info">
            <span class="btnStyle" @click="canyuClick">立即参赛</span>
          </div>
        </popup>
      </div>
    </div>
  </div>
</template>

<script>
  import {TransferDom, Popup, XButton, XSwitch, Group, XAddress, ChinaAddressData, ChinaAddressV4Data, Value2nameFilter as value2name} from 'vux'
  import { httpAjax } from '../common/http'

  export default {
    directives: {
      TransferDom
    },
    components: {
      Popup,
      XSwitch,
      XButton,
      Group,
      XAddress,
      ChinaAddressData,
      ChinaAddressV4Data
    },
    data () {
      return {
        lotStar: true,
        alertModel: false, // 中奖弹窗隐藏
        resultStyle: false, // 未中奖弹窗
        addressData: ChinaAddressData,
        prizeName: '',
        chooseAddress: [],
        userName: '',
        userPhone: '',
        userAdressDest: '',
        id: 0,
        receiverName: '',
        receiverPhone: '',
        receiverAddress: ['北京市', '市辖区', '东城区'],
        receiverAddressDetail: '',
        isFistLogin: true
      }
    },
    activated () {
      this.lotStar = true
      this.alertModel = false
      this.resultStyle = false
      this.prizeName = ''
      this.chooseAddress = []
      this.userName = ''
      this.userPhone = ''
      this.userAdressDest = ''
      this.id = 0
      this.receiverName = ''
      this.receiverPhone = ''
      this.receiverAddressDetail = ''
      if (this.$route.query.firstLogin) {
        this.isFistLogin = true
      } else {
        this.isFistLogin = false
      }
    },
    methods: {
      lottery () {
        this.$vux.loading.show({
          text: '正在加载'
        })
        if (this.isFistLogin) {
          httpAjax('/award/firstlogin', {
          }, this.lotteryResult)
        } else {
          httpAjax('/award/firstupload', {
          }, this.lotteryResult)
        }
      },
      lotteryResult (type, response) {
        this.$vux.loading.hide()
        if (response.code === 0) {
          let flag = response.data.win
          this.alertModel = flag // 中奖
          this.id = response.data.id
          this.resultStyle = !flag // 无中奖
          this.prizeName = response.data.awardName
        } else {
          this.$vux.toast.show({text: response.message, width: '13em'})
          setTimeout(() => {
            this.$router.replace({path: '/index', query: {}})
          }, 1500)
        }
      },
      hide () {
        this.alertModel = false
      },
      saveAddress () {
        const address = value2name(this.receiverAddress, ChinaAddressV4Data)
        const params = {
          body: {
            name: this.receiverName,
            address: address,
            detail: this.receiverAddressDetail,
            phone: this.receiverPhone
          },
          contentType: null
        }
        // 完善信息回调
        const callback = (type, response) => {
          this.hide()
          if (type === 1 && response.code === 0) {
            if (response.data) {
              this.$vux.toast.show({text: '保存成功！', width: '13em'})
              this.canyuClick() // 跳转
            } else {
              this.$vux.toast.show({text: '保存失败！', type: 'warn', width: '13em'})
            }
          }
        }
        if (this.isAnyStringEmpty(this.receiverName, this.receiverPhone, address, this.receiverAddressDetail)) {
          this.$vux.toast.show({text: '以上不能为空！', type: 'warn', width: '13em'})
        } else { // 完善信息
          httpAjax('/award/record/' + this.id + '/receiver', params, callback)
        }
      },
      isAnyStringEmpty () {
        for (let i = 0; i < arguments.length; i++) {
          if (arguments[i]) {
            if (arguments[i].length === 0) {
              return true
            }
          } else {
            return true
          }
        }
        return false
      },
      isHaveAddressInfo (item) {
        if (item === null) {
          return false
        }
        return !(this.isAnyStringEmpty(item.receiverName, item.receiverPhone, item.receiverAddress, item.receiverAddressDetail))
      },
      // 未中奖 立即参与按钮
      canyuClick () {
        if (this.isFistLogin) { // 首次登录抽奖 跳转首页
          this.$router.replace({path: '/index', query: {}})
        } else {
          this.$router.replace({path: '/myHome', query: {}})
        }
      }
    }
  }
</script>

