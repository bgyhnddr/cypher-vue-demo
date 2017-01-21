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
  <div v-if="showModel.membersModel">
    <group v-for="member in memberData.getMembers.list">
      <cell :title="getMemberName(member)" @click="goToPromoteAgentPage(member)" is-link></cell>
    </group>
    <x-button v-show="showModel.loadMoreBtn" @click="loadMember" class="more">点击可加载更多内容</x-button>
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
  XButton,
  Alert
} from 'vux'
import promoteAPI from '../../api/promote'

export default {
  components: {
    XHeader,
    Group,
    Cell,
    XInput,
    XButton,
    Alert
  },
  watch: {
    'keyword' () {
      this.showModel.membersModel = false
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
      memberData: {
        page: 0,
        getMembers: {
          end: null,
          list: []
        }
      },
      showModel:{
        membersModel: false,
        loadMoreBtn : false
      },
      chooseLevel: null,

      firstSearchFlag: false,
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
    getMemberName(member) {
      var name = null
      member.user.agent.agent_details.forEach((detailItem) => {
        if (detailItem.key == "name") {
          name = detailItem.value
        }
      })
      return name
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
      var searchArgs = {
        page:0
      }

      if (this.chooseLevel) {
        searchArgs.level = this.chooseLevel.brand_role_code
      }

      if (this.keyword) {
        searchArgs.filterKey = this.keyword.trim()
      }

      promoteAPI.getPromotionOperableStaffs(searchArgs).then((result) => {

        if (that.firstSearchFlag && result.list.length == 0) {
          that.alert.showCatchError = true
          that.alert.catchErrorMsg = "无此提拔团队成员"
        } else if (result.list.length == 0) {
          that.alert.showErrorNoHandled = true
          that.alert.errorMsgNoHandled = "无此提拔团队成员"
        } else {
          that.firstSearchFlag = false
          that.memberData.getMembers.end = result.end
          that.memberData.getMembers.list = result.list
          that.memberData.page = 1

          if (result.end) {
            that.showModel.loadMoreBtn = false
          } else {
            that.showModel.loadMoreBtn = true
          }

          that.showModel.membersModel = true
          that.showPromoteLevelListPage = false
        }
      }).catch((err) => {
        that.showCatchError = true
        that.catchErrorMsg = "加载可提拔团队成员异常，请稍后再试"
      })
    },
    loadMember(){
      var that = this
      var searchArgs = {
        page:this.memberData.page
      }

      if (this.chooseLevel) {
        searchArgs.level = this.chooseLevel.brand_role_code
      }

      if (this.keyword) {
        searchArgs.filterKey = this.keyword.trim()
      }

      promoteAPI.getPromotionOperableStaffs(searchArgs).then(function(result) {
        result.list.map((o) => {
          that.memberData.getMembers.list.push(o)
        })
        that.memberData.getMembers.end = result.end

        if (result.end) {
          that.showModel.loadMoreBtn = false
        } else {
          that.memberData.page += 1
          that.showModel.loadMoreBtn = true
        }

      }).catch(function(err) {
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = "加载可提拔团队成员异常，请稍后再试"
      })
    },
    goToPromoteAgentPage(member) {
      this.$route.router.go("/teamManagement/promoteAgent/" + member.user.account)
    },
    errorHandled() {
      this.onClickBack()
    }
  },
  events: {
    promoteMemberSearch(chooseLevel) {
      if (chooseLevel == null) {
        this.chooseLevel = chooseLevel
        this.headerTitle = "搜索提拔团队成员"
        this.search()
        this.firstSearchFlag = true
      } else {
        this.headerTitle = chooseLevel.brand_role_name
        this.chooseLevel = chooseLevel
        this.keyword = null
        this.loadPromoteMembers()
      }
    }
  }
}
</script>
