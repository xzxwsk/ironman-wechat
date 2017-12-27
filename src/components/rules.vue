<template>
  <div>
    <!--<div>-->
      <!--<p>{{count}}</p>-->
      <!--<input type="text" v-model="incrementValue">-->
      <!--<button @click="incrementWithValue">increment</button>-->
    <!--</div>-->
    <div class="rulesBox">
      <h1>品胜杯新年朋友圈摄影大赛参赛协议</h1>
      <p class="t-ind">本协议是您（以下称为“作者”）与广东品胜电子股份有限公司（以下简称“主办方”）之间在微信平台（以下简称“本平台”）就“品胜杯新年朋友圈摄影大赛”参赛各项事宜所订立的契约，请您仔细阅读本协议，本协议内容对双方均具有法律约束力。</p>
      <p>第1条 定义和解释</p>
      <p>1.1媒体是指传统媒体（报刊杂志电台电视等)和网络媒体(网站，包括论坛)。</p>
      <p>1.2作品是指作者本人以文字、图片等形式创作，在本平台上发表的全部作品。发表作品，即表示同意参与本次活动。</p>
      <p>1.3发表是指在本平台中将作品公之于众，作品上传后作者本人可自行撤销或删除，但撤销或删除即表示不参与本次活动。</p>
      <p>第2条 权利及义务</p>
      <p>2.1作者授予主办方及其作品的使用权，该使用权含义如下：</p>
      <p>2.1.1主办方在世界范围内作品受著作权保护的所有领域均享有该作品的使用权。</p>
      <p>2.1.2作品的文字方式包括中文简体字本、中文繁体字本、英文本。</p>
      <p>2.1.3 享有使用权的方式包括但不限于：通过网络向公众传播、复制、摘编、表演、播放、展览、发行、摄制电影、电视、录像制品、录制录音制品、制作数字化制品、改编、翻译、注释、编辑，以及出版、许可其他媒体、网站及单位转载、摘编、播放、录制、翻译、注释、编辑、改编、摄制。</p>
      <p>2.1.4主办方仅拥有对作品的使用权，作者保留对作品的著作权。</p>
      <p>2.2 作者保证拥有第一条授予主办方的权利，但因作者的作品违反现行法律法规而引起的一切争议、投诉、索赔、诉讼等后果，均由作者承担全部责任。</p>
      <p>2.3 作者向主办方所投之作品，必须对其真实性负责。</p>
      <p>2.4 主办方在履行本协议过程中所获得的作者个人信息，应予保密，不得披露，且仅为执行本条款的目的而使用。法律规定或相关部门要求公开的除外。</p>
      <p>2.5请您再次确认已知悉并完全接受本协议的全部内容，本协议对双方具有法律约束力。</p>
    </div>
    <div class="backUp"><button class="backUpBtn" @click="goBack">返回上一页</button></div>
  </div>
</template>

<script>
//  import { mapState, mapActions } from 'vuex'
//  import { Tabbar, TabbarItem } from 'vux'

  export default {
    data () {
      return {
//        incrementValue: 0
      }
    },
    components: {
//      Tabbar,
//      TabbarItem
    },
    computed: {
//      count () {
//        return this.$store.state.count
//      }
//      ...mapState([
//        'count'
//      ])
    },
    methods: {
//      ...mapActions(['increment', 'decrement']),
//      incrementWithValue () {
//        this.$store.dispatch('incrementWithValue', this.incrementValue)
//      }
      goBack () {
        window.history.go(-1)
      }
    }
  }
</script>

