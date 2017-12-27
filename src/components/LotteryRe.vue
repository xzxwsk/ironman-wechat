<template>
  <div>
  	<!--抽奖列表-->
    <div class="lottery noBg" v-show="itList">
      <div class="listRecord">
        <div :class="['item', {'no_lottery_item':!item.win}]" v-for="item, index in itemList" :key="index"  v-if="itemList.length > 0">
          <div v-if="item.win === 1"><!--中奖-->
            <span class="reImg"><img :src="recordPro" alt="" /></span>
            <h2>奖品：{{item.awardName}}</h2>
            <p class="prizeWhat" v-if="item.awardDescription">({{item.awardDescription}})</p>
            <!--有地址信息-->
            <div class="adMess" v-if="item.receiverAddress !== null">
              <p class="span">{{item.receiverName}}<span>{{item.receiverPhone}}</span></p>
              <p v-show="getAddress(item) !== ' '">{{getAddress(item)}}</p>
              <div class="btnRight">
                <button class="whiteBtn" @click="addressShow(item)"  v-show="isHaveAddressInfo(item)">修改收货地址</button>
              </div>
            </div>
            <!--无地址信息-->
            <div class="btnRight" v-if="item.receiverAddress === null">
              <button class="yellewBtn-s" @click="addressShow(item)"  v-show="!isHaveAddressInfo(item)">填写收货地址</button>
            </div>
          </div>
          <div v-if="item.win === 0"><img :src="item.type === 200 ? noLotteryPubImg : noLotteryImg"></div><!--未中奖-->
        </div>
      </div>

      <!--地址填写-->
      <popup v-model="alertModel" height="100%" is-transparent>
        <div v-if="currentItem" class="lottPrize">
          <div class="closeBtn" @click="hide">x</div>
          <div class="controlForm record">
            <input type="" name="" v-model="currentItem.receiverName" maxlength="10" id="name" value=""
                   placeholder="姓名" class="control-put"/>
          </div>
          <div class="controlForm">
            <input type="" name="" v-model="currentItem.receiverPhone" maxlength="11" id="phone" value=""
                   placeholder="联系方式" class="control-put"/>
          </div>
          <div class="controlForm">
            <x-address title="" v-model="currentItem.receiverAddress" :list="addressData" placeholder="所在地区" raw-value value-text-align="left" :popup-style="{zIndex: 9999}"></x-address>
          </div>
          <div class="controlForm">
           <input type="" name="" v-model="currentItem.receiverAddressDetail" maxlength="50" id="adress" value=""
                  placeholder="详细地址" class="control-put"/>
          </div>
          <div class="submitBtn">
            <button class="btnSure" @click="saveAddress">确 定</button>
          </div>
        </div>
      </popup>
    </div>
    <!--没有中奖列表-->
    <div class="noPrize" v-show="itemList.length === 0">
      <img src="../assets/images/no-prize.png" alt="没中奖icon"/>
      <div class="txt">对不起，您没有中奖信息!</div>
    </div>
  </div>
</template>

<script>
  import {Popup, XButton, XSwitch, Group, XAddress, ChinaAddressData, ChinaAddressV4Data, Value2nameFilter as value2name} from 'vux'
  import {httpAjax} from '../common/http'

  export default {
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
        noLotteryImg: require('../assets/images/no_lottery.jpg'),
        noLotteryPubImg: require('../assets/images/no_lottery_publish.jpg'), // 首次发图未中奖
        lotStar: false,
        alertModel: false, // 弹窗隐藏
        addressData: ChinaAddressV4Data,
        itList: true,
        currentItem: {id: 0, receiverName: '', receiverPhone: '', receiverAddress: [], receiverAddressDetail: ''},
        recordPro: require('../assets/images/record-icon.jpg'),
        itemList: []
      }
    },
    activated () {
      this.itemList = []
      this.getLotteryInfo()
    },
    methods: {
      hide () {
        this.alertModel = false
      },
      addressShow (item) {
        this.currentItem.id = item.id
        this.currentItem.receiverName = item.receiverName
        this.currentItem.receiverPhone = item.receiverPhone
        if (item.receiverAddress) {
          const addressArr = item.receiverAddress.split(' ')
          if (addressArr.length >= 3) {
            this.currentItem.receiverAddress = addressArr.slice(0, 3)
          }
        } else {
          this.currentItem.receiverAddress = ['北京市', '市辖区', '东城区']
        }
        this.currentItem.receiverAddressDetail = item.receiverAddressDetail
        this.alertModel = true
      },
      saveAddress () {
        const address = value2name(this.currentItem.receiverAddress, ChinaAddressV4Data)
        const params = {body: {name: this.currentItem.receiverName, address: address, detail: this.currentItem.receiverAddressDetail, phone: this.currentItem.receiverPhone},
          contentType: null}

        const callback = (type, response) => {
          this.hide()
          if (type === 1 && response.code === 0) {
            if (response.data) {
              this.$vux.toast.show({text: '保存成功！', width: '13em'})
              this.getLotteryInfo()
            } else {
              this.$vux.toast.show({text: '保存失败！', type: 'warn', width: '13em'})
            }
          }
        }
        console.log(this.currentItem.receiverName + this.currentItem.receiverPhone + address + this.currentItem.receiverAddressDetail)
        if (this.isAnyStringEmpty(this.currentItem.receiverName, this.currentItem.receiverPhone, address, this.currentItem.receiverAddressDetail)) {
          this.$vux.toast.show({text: '以上不能为空！', type: 'warn', width: '13em'})
        } else {
          httpAjax('/award/record/' + this.currentItem.id + '/receiver', params, callback)
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
      isAnyStringNotEmpty () {
        for (let i = 0; i < arguments.length; i++) {
          if (arguments[i]) {
            if (arguments[i].length > 0) {
              return true
            }
          }
        }
        return false
      },
      isHaveAddressInfo (item) {
        if (item === null) {
          return false
        }
        return this.isAnyStringNotEmpty(item.receiverName, item.receiverPhone, item.receiverAddress, item.receiverAddressDetail)
      },
      getLotteryInfo () {
        this.itemList = []
        const callback = (type, response) => {
          if (type === 1) {
            let data = response.data
            this.itemList = data
//            if (data) {
//              if (data.length === 0) {
//                this.itList = false
//              }
//              for (let i = 0; i < data.length; i++) {
//                if (data[i].win === 1) {
//                  let newList = this.itemList.concat(data[i])
//                  this.itemList = newList
//                }
//              }
//              if (this.itemList.length === 0) {
//                this.itList = false
//              }
//              console.log(this.itemList)
//            }
          }
        }
        httpAjax('/award/record/list', {}, callback)
      },
      getAddress (item) {
        let address = !item.receiverAddress ? '' : item.receiverAddress
        let detail = !item.receiverAddressDetail ? '' : item.receiverAddressDetail
        return address + ' ' + detail
      }
    }
  }
</script>

