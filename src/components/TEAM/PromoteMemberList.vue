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
  <div v-if="showMembersModel">
    <group v-for="member in getMembers.list">
      <cell :title="getMemberName(member)" @click="goToPromoteAgentPage(member)" is-link>
      </cell>
    </group>
  </div>
</div>
<alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{alert.catchErrorMsg}}</alert>
<alert :show.sync="alert.showErrorNoHandled" button-text="确认">{{alert.errorMsgNoHandled}}</alert>
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

export default {
  components: {
    XHeader,
    Group,
    Cell,
    XInput,
    Alert
  },
  watch: {
    'keyword' () {
      this.showMembersModel = false
    },
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
      getMembers: {
        end: null,
        list: []
      },
      chooseLevel: null,
      showMembersModel: false,
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
      this.keyword = null

      this.showPromoteLevelListPage = true
    },
    search() {
      var that = this
      var nameReg = /^[\u4e00-\u9fa5]*$/
      var phoneReg = /^(\+?0?86\-?)?1[345789]\d{9}$/

      if (this.keyword == null || this.keyword.trim() == "") {
        this.keyword = null
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "请输入需要搜索的关键字"
      } else if (nameReg.test(this.keyword.trim()) || phoneReg.test(this.keyword.trim())) {
        this.loadPromoteMembers()
      } else {
        this.keyword = null
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "请输入手机号或代理姓名"
      }

    },
    loadPromoteMembers() {
      var that = this
      var searchArgs = {}

      console.log(JSON.stringify(this.chooseLevel))
      console.log(this.keyword)
      if (this.chooseLevel) {
        searchArgs.level = this.chooseLevel.brand_role_code
      }

      if (this.keyword) {
        searchArgs.filterKey = this.keyword.trim()
      }
      console.log(JSON.stringify(searchArgs))

      promoteAPI.getPromotionOperableStaffs(searchArgs).then((result) => {
        console.log(JSON.stringify(result))
        that.getMembers.end = result.end
        that.getMembers.list = result.list

        that.showMembersModel = true
        that.showPromoteLevelListPage = false
      }).catch((err) => {
        that.showCatchError = true
        that.catchErrorMsg = err
      })
    },
    getMemberName(member) {
      var name = null
      member.user.agent.agent_details.forEach((detailItem) => {
        if (detailItem.key == "name") {
          name = detailItem.value
        }
      })
      return name
    },
    goToPromoteAgentPage(member) {
      console.log(JSON.stringify(member))
      console.log(member.user.account)
        // this.$route.router.go("/teamManagement/promoteAgent/" + member.user.account)
    },
    errorHandled() {
      this.onClickBack()
    }
  },
  events: {
    promoteMemberSearch(chooseLevel) {
      if (chooseLevel == null) {
        this.chooseLevel = chooseLevel
        this.headerTitle = "提拔团队成员"
        this.search()
      } else {
        this.headerTitle = chooseLevel.brand_role_name
        this.chooseLevel = chooseLevel
        this.loadPromoteMembers()
      }
    }
  }
}
</script>
