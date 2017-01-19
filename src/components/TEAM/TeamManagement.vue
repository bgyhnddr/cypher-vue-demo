<template>
<div id="teamManagement"  >
  <div>
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="{showBack: false}">我的团队</x-header>
      <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
    </div>
    <div style="min-height:471px">
    <group>
      <!--冻结团队成员-->
      <a class="weui_cell a-li a-li-first" v-link="{path: '/teamManagement/forzenLevelList'}">
        <div class="weui_cell_hd">
          <img src="/static/TestIMG/freeze.png">
        </div>
        <div class="weui_cell_bd weui_cell_primary">
          <p>冻结团队成员</p>
        </div>
        <div class="weui_cell_ft" :class="{'with_arrow': true}">
          <slot name="value"></slot>
          <slot></slot>
        </div>
      </a>
      <!--提拔团队成员-->
      <a class="weui_cell a-li-last"  v-link="{path: ''}">
        <div class="weui_cell_hd">
            <img src="/static/TestIMG/To_promote.png">
        </div>
        <div class="weui_cell_bd weui_cell_primary">
          <p>提拔团队成员</p>
        </div>
        <div class="weui_cell_ft" :class="{'with_arrow': true}">
          <slot name="value"></slot>
          <slot></slot>
        </div>
      </a>
    </group>
  </div>
  </div>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
import {
  Group,
  Alert,
  XHeader
} from 'vux'
import authAPI from '../../api/auth'

export default {
  components: {
    Group,
    Alert,
    XHeader
  },
  data() {
    return {
      user: {
        user_info: {}
      }
    }
  },
  methods: {
    onClickBack() {
      this.$route.router.go('/homePage')
    },
    getPersonalInfo() {
      var that = this
      authAPI.getUser().then(function(result) {
        that.user.user_info = result
      })
    }
  },
  ready() {
    this.getPersonalInfo()
  }
}
</script>
<style>
body{
  background-color:#f2f2f2!important
}

</style>
</style>
