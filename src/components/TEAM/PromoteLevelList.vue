<template>
<div v-show="showPromoteLevelListPage">
  <div class="vux-demo-header-box wapmain-header" slot="header">
    <x-header :left-options="{showBack: false}">提拔团队成员</x-header>
    <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
  </div>
  <group>
    <x-input class="weui_cell_primary" title='' placeholder="输入手机号码/代理姓名进行搜索" :value.sync="keyword" :show-clear=false :required="false"></x-input>
    <button @click="search">搜索</button>
  </group>
  <group v-for="level in promoteLevels">
    <cell :title="($index + 1) + '.' + level.brand_role_name" @click="goToPromoteMemberPage(level)" is-link>
      <div slot="value">
        <span>{{level.number + "人"}}</span>
      </div>
    </cell>
  </group>
</div>

<promote-member-list :show-promote-level-list-page.sync="showPromoteLevelListPage" :keyword.sync="keyword"></promote-member-list>

<alert :show.sync="alert.showErrorNoHandled" button-text="确认">{{alert.errorMsgNoHandled}}</alert>
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
