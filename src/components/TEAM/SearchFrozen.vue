<template>
<group>
  <x-input class="weui_cell_primary" title='' placeholder="输入手机号码/代理姓名进行搜索" :value.sync="keyword" :show-clear=false :required="false"></x-input>
  <button @click="search"></button>
</group>
<div v-show="showSearch">
  <group v-for="members in searchResult">
    <cell :title="members.agent.agent_detail.name" @click="goToForzenAgent(members.agent.user_account)" is-link>
    </cell>
  </group>
</div>
<alert :show.sync="alert.showCatchError" button-text="确认">{{alert.catchErrorMsg}}</alert>
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
    showSearch: {
      type: Boolean
    },
    pageTitle: {
      type: String
    }
  },
  data() {
    return {
      keyword: "",
      searchResult:[],
      alert: {
        showCatchError: false,
        catchErrorMsg: null
      }
    }
  },
  methods: {
    search() {
      var that = this
      var keyword = that.keyword
      FrozenAPI.getFrozenMember({account:keyword}).then((result)=>{
        if(result.length>0){
          that.searchResult = result
          that.pageTitle = result[0].agent.agent_brand_role.brand_role.name
          that.showSearch = true
        }else{
          that.alert.showCatchError = true
          that.alert.catchErrorMsg = "查无此成员"
        }
      })
    },
    goToForzenAgent(account) {
      this.$route.router.go("/teamManagement/frozenAgent/"+account+"/Frozenlist")
    }
  },
  ready() {

  }
}
</script>
