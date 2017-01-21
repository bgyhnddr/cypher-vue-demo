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
      <a class="weui_cell a-li a-li-first" v-if="showModel.forzen" v-link="{path: '/teamManagement/forzenLevelList'}">
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
      <a class="weui_cell a-li-last" v-if="showModel.promote"  v-link="{path: '/teamManagement/promoteLevelList'}">
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

import agentInfoAPI from '../../api/agentInfo'

export default {
  components: {
    Group,
    Alert,
    XHeader
  },
  data() {
    return {
      showModel:{
        forzen:false,
        promote: false,
      }
    }
  },
  methods: {
    onClickBack() {
      this.$route.router.go('/homePage')
    },
    CheckUserRole() {
      var that = this
      agentInfoAPI.getBrandRoleInfo().then((result)=>{
        if (result.brand_role.level == "0" || result.brand_role.level == "-1" ) {
          that.showModel.forzen = true
        }

        if (result.brand_role.level != "4" ) {
          that.showModel.promote = true
        }
      })
    }
  },
  ready() {
    this.CheckUserRole()
  }
}
</script>
<style>
body{
  background-color:#f2f2f2!important
}

</style>
</style>
