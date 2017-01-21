<template>
<div id="teamManagement">
  <div>
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="{showBack: false}">我的团队</x-header>
      <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
    </div>
    <div style="min-height:471px">
      <group v-if="showModel.funcModel">
        <!--冻结团队成员-->
        <cell v-if="showModel.forzen" title="冻结团队成员" link="/teamManagement/forzenLevelList">
          <img slot="icon" src="/static/TestIMG/freeze.png">
        </cell>
        <!--提拔团队成员-->
        <cell v-if="showModel.promote" title="提拔团队成员" link="/teamManagement/promoteLevelList">
          <img slot="icon" src="/static/TestIMG/To_promote.png">
        </cell>
      </group>
    </div>
  </div>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
<alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{alert.catchErrorMsg}}</alert>
</template>

<script>
import {
  Group,
  Cell,
  Alert,
  XHeader
} from 'vux'

import agentInfoAPI from '../../api/agentInfo'

export default {
  components: {
    Group,
    Cell,
    Alert,
    XHeader
  },
  data() {
    return {
      showModel: {
        funcModel: false,
        forzen: false,
        promote: true,
      },
      alert: {
        showCatchError: false,
        catchErrorMsg: null
      }
    }
  },
  methods: {
    onClickBack() {
      this.$route.router.go('/homePage')
    },
    CheckUserRole() {
      var that = this
      agentInfoAPI.getBrandRoleInfo().then((result) => {
        if (result.brand_role.level == "-1" || result.brand_role.level == "0") {
          that.showModel.forzen = true
        }

        if (result.brand_role.level == "3" || result.brand_role.level == "4") {
          that.showModel.promote = false
        }

        that.showModel.funcModel = true
      }).catch(function(err) {
        that.showRemindMsg = true
        that.remindMsg = err
      })
    },
    errorHandled() {
      this.$route.router.go('/homePage')
    },
  },
  ready() {
    this.CheckUserRole()
  }
}
</script>
<style>
body {
  background-color: #f2f2f2!important
}
</style>
</style>
