<template>
  <div class="aboutUs">
    <p><img :src="adImg" alt="广告图" /></p>
    <p><img :src="activePromptImg" alt="活动规则" /></p>
    <p><img :src="activePeoImg" alt="活动评委" /></p>
    <!--<div class="txt">-->
      <!--<p>2018将近，是时候来一场年末盛大“对决”啦，晒出精彩照片，就是你的最终目标！我们可是准备了丰厚的年终奖，囊括了时下最新潮的科技产品，更有重磅现金大奖等你来拿喔~</p>-->
      <!--<h2>【比赛流程】</h2>-->
      <!--<p>①初赛：2017年12月23日—12月31日 </p>-->
      <!--<p>②决赛：2018年1月1日—1月3日</p>-->
      <!--<p>评选方式：网络投票+评委打分</p>-->
      <!--<h2>【奖项设置】</h2>-->
      <!--<p>特等奖1名<span>现金10万元</span></p>-->
      <!--<p>一等奖2名<span>iPhoneX</span></p>-->
      <!--<p>二等奖5名<span>华为P10</span></p>-->
      <!--<p>三等奖100名<span>品胜带电青年大礼包（圈铁耳机+color box+爱充中国红</span></p>-->
      <!--<h2>【评委展示】</h2>-->
      <!--<p>（暂未定）</p>-->
    <!--</div>-->
    <!--<div class="t_c col_f">本活动最终解释权归主办方所有</div>-->
    <bottomBar ref="bottomBar" :curPropIdx="curBottomIdx" />
  </div>
</template>

<script>
  import bottomBar from './bottom'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        adImg: require('../assets/images/index_banner_03.jpg'), // 广告图
        activePromptImg: require('../assets/images/about_02.jpg'), // 活动描述图
        activePeoImg: require('../assets/images/about_03.jpg') // 活动评委
      }
    },
    components: {
      bottomBar
    },
    computed: {
      ...mapState([
        'curBottomIdx'
      ])
    }
  }
</script>

