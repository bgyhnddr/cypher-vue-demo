<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions">冻结团队成员</x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
</div>
<group>
  <x-input class="weui_cell_primary" title='' placeholder="输入手机号码/代理姓名进行搜索" :value.sync="keyword" :show-clear=false :required="false"></x-input>
  <button @click="search">搜索</button>
</group>
<div v-if="showModel.forzenLevelListModel">
  <group v-for="level in forzenLevels">
    <cell :title="($index + 1) + '.' + level.brand_role.name" @click="goToForzenMemberPage(level.employable_brand_role_code)" is-link>
      <div slot="value">
        <span>1 人</span>
      </div>
    </cell>
  </group>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
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
import promotionAPI from '../../api/promotion'

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
      leftOptions: {
        showBack: false,
        backText: null,
        preventGoBack: false
      },
      forzenLevels: {},
      showModel: {
        forzenLevelListModel: false
      },
      alert: {
        showCatchError: false,
        catchErrorMsg: null
      }
    }
  },
  methods: {
    headerGoBack() {
      this.$route.router.go("/teamManagement")
    },
    loadFrozenLevels() {
      var that = this
      promotionAPI.getPromotionOperableLevels().then(function(result) {
        //TODO: 显示数据
        console.log(JSON.stringify(result))

      }).catch(function(err) {
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = "加载可冻结代理等级列表异常，请稍后再试"
      })
    },
    goToForzenMemberPage(brandRoleCode) {
      console.log("brandRoleCode:" + brandRoleCode)
    },
    search(){
      console.log("搜索")
    },
    errorHandled(){
      this.$route.router.go("/teamManagement")
    }
  },
  ready() {
    this.loadFrozenLevels()
  }
}
</script>
