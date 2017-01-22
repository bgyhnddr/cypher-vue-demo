<template>
  <div id="promoteLevels">
<div v-show="showPromoteLevelListPage">
  <div class="vux-demo-header-box wapmain-header" slot="header">
    <x-header :left-options="{showBack: false}">提拔团队成员</x-header>
    <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
  </div>
  <div class="promoteLevels-search">
  <group>
    <x-input class="weui_cell_primary" title='' placeholder="输入手机号码/代理姓名进行搜索" :value.sync="keyword" :show-clear=false :required="false"></x-input>
    <button @click="search"></button>
  </group>
</div>
<div class="promoteLevelsList">
  <group v-for="level in promoteLevels">
    <div class="promoteLevelsList-li">
    <cell :title="($index + 1) + '.' + level.brand_role_name" @click="goToPromoteMemberPage(level)" is-link>
        <span>{{level.number + "人"}}</span>
      <div slot="value">

      </div>
    </cell>
  </div>
  </group>
</div>
</div>

<promote-member-list :show-promote-level-list-page.sync="showPromoteLevelListPage" :keyword.sync="keyword"></promote-member-list>

<alert :show.sync="alert.showErrorNoHandled" button-text="确认">{{alert.errorMsgNoHandled}}</alert>
<alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{alert.catchErrorMsg}}</alert>
</div>
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
import promoteAPI from '../../api/promote'
import PromoteMemberList from './PromoteMemberList'

export default {
  components: {
    XHeader,
    Group,
    Cell,
    XInput,
    Alert,
    PromoteMemberList
  },
  data() {
    return {
      showPromoteLevelListPage: true,
      promoteLevels: {},
      keyword: null,
      chooseLevel: null,
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
      this.$route.router.go("/teamManagement")
    },
    loadPromoteLevels() {
      var that = this
      promoteAPI.getPromotionOperableLevels().then(function(result) {
        that.promoteLevels = result
      }).catch(function(err) {
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = "加载可提拔代理等级列表异常，请稍后再试"
      })
    },
    goToPromoteMemberPage(promoteLevelItem) {
      if (promoteLevelItem.number == 0) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "该等级暂无可提拔成员"
      } else {
        this.$broadcast('promoteMemberSearch', promoteLevelItem)
      }
    },
    search() {
      this.$broadcast('promoteMemberSearch', null)
    },
    errorHandled() {
      this.$route.router.go("/teamManagement")
    }
  },
  ready() {
    this.loadPromoteLevels()
  }
}
</script>
<style>
#promoteLevels  .weui_cell_hd{
  width: auto;
}
#promoteLevels .promoteLevels-search {
    width: 95%;
    margin: 1% auto;
    border: 1px solid #d3d1d1;
    background: #fff;
    position: relative;
}
#promoteLevels .promoteLevels-search button {
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

#promoteLevels .promoteLevels-search .weui_input {
    font-size: 4.5vw;
    font-family: "微软雅黑";
        line-height: 2.5em;
    height: auto;
    width: 100%;
    padding-left: 2%;
}
#promoteLevels .promoteLevels-search .weui_cell{
      padding: 0;
}
#promoteLevels  .promoteLevelsList{
    min-height: 438px;

}
#promoteLevels .promoteLevelsList  .promoteLevelsList-li{
  background: #fff;
    margin-top: 5px;
  font-size: 4.7vw;
  font-family: "微软雅黑";
}
#promoteLevels  .promoteLevelsList  .promoteLevelsList-li .weui_cell_ft.with_arrow span{
  font-size: 4.9vw!important;
  color: #9d9ea5
}

#promoteLevels   .weui_dialog{
    width: 92%;
}
#promoteLevels  .weui_dialog  .weui_dialog_ft{
  width: 89%;
margin: 8% auto;
background: #0bb20c;
line-height: 35px;
border-radius: 2px;
}
#promoteLevels  .weui_dialog .weui_btn_dialog.primary{
  font-size: 4.9vw;
  color: #fff;
}
</style>
