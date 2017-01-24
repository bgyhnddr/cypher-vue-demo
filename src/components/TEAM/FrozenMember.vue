<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="{showBack: false}">{{pageTitle}}</x-header>
  <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
</div>
<div id="frozenMember">
  <div class="frozenMember-search ">
    <group>

      <x-input class="weui_cell_primary" title='' placeholder="输入手机号码/代理姓名进行搜索" :value.sync="keyword" :show-clear=false :required="false"></x-input>
      <button @click="search"></button>
    </group>
  </div>
  <div class="frozenMember-list">
    <group v-for="member in MemberList">
      <div class="frozenMember-li">
        <cell @click="goToForzenAgent(member.user_account)" is-link>
          <span v-if="member.frozen_agent" style="color:red">已冻结</span>
          <div slot="icon">
            <span>{{member.agent_detail.name}}</span>
          </div>
        </cell>
      </div>
    </group>
  </div>

</div>
<div class="frozenMember-dialog">
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
      var that = this
      if (that.keyword == "") {
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = "请输入需要搜索的关键词"
      } else {
        that.loadFrozenMembers(that.keyword)
      }
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
      this.$route.router.go("/teamManagement/frozenAgent/" + account + "/Frozenmembers")
    },
    errorHandled() {

    }
  },
  ready() {
    this.loadFrozenMembers()
    document.body.style.background = '#f2f2f2'
  }
}
</script>
<style>
#frozenMember .weui_cell_hd {
  width: auto;
}

#frozenMember .frozenMember-search {
  width: 95%;
  margin: 51px auto 1% auto;
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

#frozenMember .frozenMember-search .weui_cell {
  padding: 0;
}

#frozenMember .frozenMember-list {
  min-height: 436px;
  margin-top: 5px;
  border-top: 1px solid #d3d1d1;
}

#frozenMember .frozenMember-list .frozenMember-li {
  background: #fff;
  border-bottom: 1px solid #d3d1d1;
  font-size: 4.5vw;
  font-family: "微软雅黑";
}

.weui_tab.frozenMember-list .weui_cell {
  padding: 11px 15px;
}

.frozenMember-dialog .weui_dialog {
  width: 92%;
}

.frozenMember-dialog .weui_dialog .weui_dialog_ft {
  width: 89%;
  margin: 8% auto;
  background: #0bb20c;
  line-height: 35px;
  border-radius: 2px;
}

.frozenMember-dialog .weui_dialog .weui_btn_dialog.primary {
  font-size: 4.9vw;
  color: #fff;
}
</style>
