<template>
  <div class="aboutInfo">
    <div class="control-from">
      <div class="title">您的名字</div>
      <input type="" v-model="userName" name="" id="name" value="" maxlength="10" placeholder="请填写您的名字"
             class="control-put"/>
    </div>
    <div class="control-from">
      <div class="title">您的电话</div>
      <input type="" v-model="userNum" name="" id="number" value="" maxlength="11" placeholder="请填写您的电话"
             class="control-put"/>
    </div>
    <div class="controlBtn">
      <button class="yellewBtn" @click="setUserInfo">确 定</button>
    </div>
  </div>
</template>

<script>
  import {httpAjax} from '../common/http'

  export default {
    data () {
      return {
        userName: '',
        userNum: ''
      }
    },
    activated () {
      this.getUserInfo()
    },
    components: {},
    methods: {
      getUserInfo () {
        const callback = (type, response) => {
          if (type === 1 && response.code === 0) {
            let data = response.data
            if (data) {
              this.userName = data.realName
              this.userNum = data.phone
            }
          }
        }
        httpAjax('/user/info', {}, callback)
      },
      setUserInfo () {
        if (this.userName.length === 0 || this.userNum.length === 0) {
          this.$vux.toast.show({text: '以上不能为空！', type: 'warn', width: '13em'})
          return
        }
        const callback = (type, response) => {
          if (type === 1 && response.code === 0) {
            if (response.data) {
              this.$vux.toast.show({text: '保存成功！', width: '13em'})
              this.$router.go(-1)
            }
          }
        }
        httpAjax('/user/completion', {body: {name: this.userName, phone: this.userNum}, contentType: null}, callback)
      }
    }
  }
</script>

