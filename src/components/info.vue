<template>
  <div class="aboutUs" style="padding-bottom: 0">
    <p><img :src="adImg" alt="预热广告" /></p>
  </div>
</template>

<script>
  import bottomBar from './bottom'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        adImg: require('../assets/images/info.jpg') // 预热页面
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

