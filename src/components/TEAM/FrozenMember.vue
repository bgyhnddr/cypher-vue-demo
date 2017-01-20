<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="{showBack: false}">{{pageTitle}}</x-header>
  <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
</div>
<group>
  <x-input class="weui_cell_primary" title='' placeholder="输入手机号码/代理姓名进行搜索" :value.sync="keyword" :show-clear=false :required="false"></x-input>
  <button @click="search">搜索</button>
</group>
<div>
  <group v-for="member in MemberList">
    <cell @click="goToForzenAgent(member.user_account)" is-link>
      <span v-if="member.frozen_agent">已冻结</span>
      <div slot="icon">
        <span>{{member.agent_detail.name}}</span>
      </div>
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

export default {
  components: {
    XHeader,
    Group,
    Cell,
    XInput,
    Alert
  },
  data() {
    return {
      pageTitle: "",
      keyword: "",
      MemberList: [],
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
    search() {
      this.loadFrozenMembers(this.keyword)
    },
    loadFrozenMembers(filterKey) {
      var that = this
      var BrandRoleCode = that.$route.params.code
      FrozenAPI.getFrozenMembers({
        roleCode: BrandRoleCode,
        filterKey: that.keyword
      }).then(function(result) {
        that.MemberList = result
        that.pageTitle = result[0].agent_brand_role.brand_role.name
      }).catch(function(err) {
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = err
      })
    },
    goToForzenAgent(account) {
      this.$route.router.go("/teamManagement/frozenAgent/" + account)
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
