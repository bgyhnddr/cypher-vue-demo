<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="{showBack: false}">{{pageTitle}}</x-header>
  <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
</div >
<div id="frozenMember">

<div class="frozenMember-search"><search-frozen :show-search.sync="showSearch" :page-title.sync="pageTitle"></search-frozen></div>
<div v-show = "!showSearch" class="frozenMember-list">
  <group v-for="member in MemberList">
    <div class="frozenMember-li">
    <cell @click="goToForzenAgent(member.user_account)" is-link>
      <span v-if="member.frozen_agent">已冻结</span>
      <div slot="icon">
        <span>{{member.agent_detail.name}}</span>
      </div>
    </cell>
  </div>
  </group>
</div>
<div>
<alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{alert.catchErrorMsg}}</alert>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
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
        console.log(result)
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
<style>
#frozenMember  .weui_cell_hd{
  width: auto;
}
#frozenMember .frozenMember-search {
    width: 95%;
    margin: 1% auto;
    border: 1px solid #d3d1d1;
    background: #fff;
    position: relative;
}
#frozenMember .frozenMember-search button {
    position: absolute;
    top: 11%;
    right: -6%;
    background: url(/static/TestIMG/search.png);
    background-repeat: no-repeat;
    border: 0;
    background-size: 57%;
    color: #fff;
    width: 16%;
    min-height: 30px;
    z-index: 1000;
}

#frozenMember .frozenMember-search .weui_input {
    font-size: 4.5vw;
    font-family: "微软雅黑";
        line-height: 2.5em;
    height: auto;
    width: 100%;
    padding-left: 2%;
}
#frozenMember .frozenMember-search .weui_cell{
      padding: 0;
}
#frozenMember .frozenMember-list {
min-height: 438px;
  margin-top: 5px;
  border-top: 1px solid #d3d1d1;

}
#frozenMember .frozenMember-list .frozenMember-li{
  background: #fff;
  border-bottom: 1px solid #d3d1d1;

  font-size: 4.5vw;
  font-family: "微软雅黑";
}
#frozenMember .frozenMember-list  .weui_cell{
      padding: 11px 15px;
}
</style>
