<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="{showBack: false}">{{pageTitle}}</x-header>
  <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
</div>
<search-frozen :show-search.sync="showSearch" :page-title.sync="pageTitle"></search-frozen>
<div v-show = "!showSearch">
  <group v-for="member in MemberList">
    <cell :title="member.agent_detail.name" @click="goToForzenAgent(member.user_account)" is-link>
    </cell>
  </group>
</div>
<alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{alert.catchErrorMsg}}</alert>
</template>

<script>
import {
  XHeader,
  Group,
  Cell,
  XInput,
  Alert
} from 'vux'
import FrozenAPI from '../../api/frozen'
import SearchFrozen from './SearchFrozen'

export default {
  components: {
    XHeader,
    Group,
    Cell,
    XInput,
    Alert,
    SearchFrozen
  },
  data() {
    return {
      pageTitle: "",
      MemberList: [],
      showSearch:false,
      alert: {
        showCatchError: false,
        catchErrorMsg: null
      }
    }
  },
  methods: {
    onClickBack() {
      this.$route.router.go("/teamManagement/forzenLevelList")
    },
    loadFrozenMembers() {
      var that = this
      var BrandRoleCode = that.$route.params.code
      FrozenAPI.getFrozenMembers({
        roleCode: BrandRoleCode
      }).then(function(result) {
        if(result.length>0){
          that.MemberList = result
          that.pageTitle = result[0].agent_brand_role.brand_role.name
        }else{
          that.alert.showCatchError = true
          that.alert.catchErrorMsg = "暂无可冻结成员"
        }
      }).catch(function(err) {
        console.log(err)
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = "加载可冻结代理成员列表异常，请稍后再试"
      })
    },
    goToForzenAgent(account) {
      this.$route.router.go("/teamManagement/frozenAgent/"+account)
    },
    errorHandled() {
      this.onClickBack()
    }
  },
  ready() {
    this.loadFrozenMembers()
  }
}
</script>
