<template>
<div id="forzenLevelList">
  <div class="vux-demo-header-box wapmain-header" slot="header">
    <x-header :left-options="{showBack: false}">冻结团队成员</x-header>
    <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
  </div>
  <div class="forzenLevelList-search"><search-frozen :show-search.sync="showSearch"></search-frozen></div>
  <div v-show="!showSearch" class="forzenLevelList">
    <group v-for="level in forzenLevels">
      <div class="forzenLevelList-li">
      <cell @click="goToForzenMemberPage(level.brand_role_code)" is-link>
        <span>{{level.number}}人</span>
        <div slot="icon">
          <span>{{($index + 1) + '.' + level.brand_role_name}}</span>
        </div>
      </cell>
    </div>
    </group>
  </div>
</div>
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
      forzenLevels: {},
      showSearch: false,
      alert: {
        showCatchError: false,
        catchErrorMsg: null
      }
    }
  },
  methods: {
    onClickBack() {
      this.$route.router.go("/teamManagement")
    },
    loadFrozenLevels() {
      var that = this
      FrozenAPI.getFrozenLevels().then(function(result) {
        if (result) {
          that.forzenLevels = result
        }
      }).catch(function(err) {
        console.log(err)
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = "加载可冻结代理等级列表异常，请稍后再试"
      })
    },
    goToForzenMemberPage(brandRoleCode) {
      console.log("brandRoleCode:" + brandRoleCode)
      this.$route.router.go("/teamManagement/frozenMember/" + brandRoleCode)
    },
    search() {
      console.log("搜索")
    },
    errorHandled() {
      this.$route.router.go("/teamManagement")
    }
  },
  ready() {
    this.loadFrozenLevels()
      document.body.style.background = '#f2f2f2'
  }
}
</script>
<style>
#forzenLevelList {
      min-height: 528px;
}
#forzenLevelList  .weui_cell_hd{
  width: auto;
}
#forzenLevelList .forzenLevelList-search {
    width: 95%;
    margin: 1% auto;
    border: 1px solid #d3d1d1;
    background: #fff;
    position: relative;
}
#forzenLevelList .forzenLevelList-search button {
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

#forzenLevelList .forzenLevelList-search .weui_input {
    font-size: 4.5vw;
    font-family: "微软雅黑";
        line-height: 2.5em;
    height: auto;
    width: 100%;
    padding-left: 2%;
}
#forzenLevelList .forzenLevelList-search .weui_cell{
      padding: 0;
}
#forzenLevelList  .forzenLevelList{
    min-height: 438px;

}
#forzenLevelList  .forzenLevelList  .forzenLevelList-li{
  background: #fff;
    margin-top: 5px;
  font-size: 4.7vw;
  font-family: "微软雅黑";
}
#forzenLevelList  .forzenLevelList  .forzenLevelList-li .weui_cell_ft.with_arrow span{
  font-size: 4.9vw!important;
  color: #9d9ea5
}
#forzenLevelList  .weui_dialog{
    width: 92%;
}
#forzenLevelList  .weui_dialog  .weui_dialog_ft{
  width: 89%;
margin: 8% auto;
background: #0bb20c;
line-height: 35px;
border-radius: 2px;
}
#forzenLevelList  .weui_dialog .weui_btn_dialog.primary{
  font-size: 4.9vw;
  color: #fff;
}
</style>
