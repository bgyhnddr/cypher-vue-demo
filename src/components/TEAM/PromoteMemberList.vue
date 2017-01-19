<template>
<div v-show="!showPromoteLevelListPage">
  <div class="vux-demo-header-box wapmain-header" slot="header">
    <x-header :left-options="{showBack: false}">{{headerTitle}}</x-header>
    <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
  </div>
  <group>
    <x-input class="weui_cell_primary" title='' placeholder="输入手机号码/代理姓名进行搜索" :value.sync="keyword" :show-clear=false :required="false"></x-input>
    <button @click="search">搜索</button>
  </group>
  <alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{alert.catchErrorMsg}}</alert>
</div>
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
  props: {
    keyword: {
      type: String
    },
    showPromoteLevelListPage: {
      type: Boolean
    }
  },
  data() {
    return {
      headerTitle: null,
      MemberList: [],
      chooseLevel: null,
      alert: {
        showCatchError: false,
        catchErrorMsg: null
      }
    }
  },
  methods: {
    onClickBack() {
      this.showPromoteLevelListPage = true
    },
    search() {
      console.log(JSON.stringify(this.keyword))
        // this.showPromoteLevelListPage = false
    },
    loadPromoteMembers(){
      
    },
    errorHandled() {
      this.onClickBack()
    }
  },
  events: {
    promoteMemberSearch(chooseLevel) {
      if (chooseLevel == null) {
        this.chooseLevel = chooseLevel
        this.headerTitle = "提拔成员"
        this.search()
      } else {
        this.headerTitle = chooseLevel.brand_role_name
        console.log(JSON.stringify(chooseLevel))
        console.log("查询成员")
        this.showPromoteLevelListPage = false
      }
    }
  }
}
</script>
