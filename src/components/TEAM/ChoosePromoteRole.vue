<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="{showBack: false}">选择提拔等级</x-header>
  <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
</div>
<x-button v-for="role in promoteRoles" type="primary" @click="chooseRole(role.brand_role.code)">
  {{role.brand_role.name}}
</x-button>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>

<alert :show.sync="alert.showErrorNoHandled" button-text="确认">{{alert.errorMsgNoHandled}}</alert>
<alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{alert.catchErrorMsg}}</alert>
</template>

<script>
import {
  XHeader,
  XButton,
  Alert,
} from 'vux'
import promoteAPI from '../../api/promote'

export default {
  components: {
    XHeader,
    XButton,
    Alert,
  },
  data() {
    return {
      promoteRoles: [],
      alert: {
        showCatchError: false,
        catchErrorMsg: null,
        showErrorNoHandled: false,
        errorMsgNoHandled: null
      }
    }
  },
  methods: {
    onClickBack() {
      this.$route.router.go("/teamManagement/promoteAgent/" + this.$route.params.account)
    },
    getPromoteRules() {
      var that = this
      promoteAPI.getLevels({
        promotee: that.$route.params.account
      }).then(function(result) {
        if (result.length == 0) {
          that.alert.showCatchError = true
          that.alert.catchErrorMsg = "此成员目前暂无可提拔等级"
        } else {
          that.promoteRoles = result
        }
      }).catch(function(err) {
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = "加载可提拔等级列表异常，请稍后重试"
      })
    },
    chooseRole(brandRoleCode){
      var that = this

      promoteAPI.createPromotion({
          promotee: this.$route.params.account,
          level: brandRoleCode
      }).then(function(result) {
          that.$route.router.go('/teamManagement/promoteShare/' + result)
      }).catch(function(err) {
          that.alert.showErrorNoHandled = true
          that.alert.errorMsgNoHandled = "该代理正在进行提拔审核，请勿再次提拔"
      })
    },
    errorHandled() {
      this.$route.router.go("/teamManagement/promoteAgent/" + this.$route.params.account)
    }
  },
  ready() {
    this.getPromoteRules()
  }
}
</script>
