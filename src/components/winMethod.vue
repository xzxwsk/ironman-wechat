<template>
  <div class="aboutUs" style="padding-bottom: 0">
    <p><img :src="adImg" alt="官方小贴士" /></p>
    <p><img :src="adImg2" alt="官方小贴士" /></p>
    <bottomBar ref="bottomBar" :curPropIdx="curBottomIdx" />
  </div>
</template>

<script>
  import bottomBar from './bottom'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        adImg: require('../assets/images/win_method_02.jpg'), // 第一张文字描述
        adImg2: require('../assets/images/win_method_03.jpg') // 活动描述图
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

