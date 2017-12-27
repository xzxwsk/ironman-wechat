import Vue from 'vue'
import Router from 'vue-router'

import { routerBase } from '../common/config'

import App from '../App'

import Index from '@/components/index'
import Lottery from '@/components/Lottery'  // 抽奖
import about from '@/components/about'  // 关于
// eslint-disable-next-line import/no-duplicates
import myDetail from '@/components/myDetail'  // 作品详情
// eslint-disable-next-line import/no-duplicates
import share from '@/components/myDetail'  // 作品详情
import poster from '@/components/poster'  // 生成海报
import finals from '@/components/finals'  // 决赛
import upImg from '@/components/upImg'  // 上传图片
import myHome from '@/components/myHome'  // 我的主页
// eslint-disable-next-line import/no-duplicates
import theHome from '@/components/theHome'  // 别人的主页
// eslint-disable-next-line import/no-duplicates
import otherHome from '@/components/theHome'  // 别人的主页
import deliver from '@/components/deliver'  // 发表图片
import rules from '@/components/rules'  // 协议
import LotteryRe from '@/components/LotteryRe'  // 中奖记录
// import myDetailBef from '@/components/myDetailBef'  // 前期作品详情
import aboutInfo from '@/components/aboutInfo'  // 完善信息
// import test from '@/components/test'  // 上传测试页面
import info from '@/components/info'  // 预热页面
import winMethod from '@/components/winMethod'  // 官方小贴士页面 （首页banner第二张链接）

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: routerBase,
  routes: [
    {
      path: '/',
      component: App,
      children: [
        {
          path: '',
          redirect: '/index'
        },
        {
          path: '/index',
          component: Index
        },
        {
          path: '/lottery',
          component: Lottery
        },
        {
          path: '/about',
          component: about
        },
        {
          path: '/myDetail',
          component: myDetail
        },
        {
          path: '/poster',
          component: poster
        },
        {
          path: '/upImg',
          component: upImg
        },
        {
          path: '/finals',
          component: finals
        },
        {
          path: '/myHome',
          component: myHome
        },
        {
          path: '/theHome',
          component: theHome
        },
        {
          path: '/deliver',
          component: deliver
        },
        {
          path: '/rules',
          component: rules
        },
        {
          path: '/LotteryRe',
          component: LotteryRe
        },
        {
          path: '/aboutInfo',
          component: aboutInfo
        },
        // {
        //   path: '/test',
        //   component: test
        // },
        {
          path: '/share',
          component: share
        },
        {
          path: '/info',
          component: info
        },
        {
          path: '/otherHome',
          component: otherHome
        },
        {
          path: '/winmethod',
          component: winMethod
        }
      ]
    }
  ]
})
