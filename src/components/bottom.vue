<template>
  <div class="bottom_bar">
    <tabbar v-model="curIdx">
      <tabbar-item @on-item-click="clickTabItemHandler(0)">
        <span slot="label" class="guangchang" @click="">赛场</span>
      </tabbar-item>
      <tabbar-item @on-item-click="clickTabItemHandler(1)">
        <span slot="label" class="upload">上传</span>
      </tabbar-item>
      <tabbar-item @on-item-click="clickTabItemHandler(2)">
        <span slot="label" class="about">规则</span>
      </tabbar-item>
      <tabbar-item @on-item-click="clickTabItemHandler(3)">
        <span slot="label" class="my">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import { Tabbar, TabbarItem } from 'vux'

  export default {
    name: 'bottomBar',
    props: {
      curPropIdx: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        curIdx: this.curPropIdx
      }
    },
    components: {
      Tabbar,
      TabbarItem
    },
    computed: {
      getCurPropIdx () {
        return this.curPropIdx
      }
    },
    watch: {
      getCurPropIdx (val) {
        this.curIdx = val
      }
    },
    methods: {
      clickTabItemHandler (idx, oldIdx) {
        switch (idx) {
          case 0:
//            if (oldIdx) {
            this.$router.push({path: '/'})
//            }
            break
          case 1:
            this.$router.push({path: '/upImg', query: {}})
            break
          case 2:
            this.$router.push({path: '/about', query: {}})
            break
          case 3:
            this.$router.push('/myHome')
            break
        }
      }
    }
  }
</script>
