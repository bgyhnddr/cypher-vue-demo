<template>
<group>
  <x-input class="weui_cell_primary" title='' placeholder="输入手机号码/代理姓名进行搜索" :value.sync="keyword" :show-clear=false :required="false"></x-input>
  <button @click="search"></button>
</group>
<div v-show="showSearch">
  <group v-for="member in searchResult">
    <cell :title="member.agent_detail.name" @click="goToForzenAgent(member.user_account)" is-link>
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
      if(keyword==""){
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = "请输入需要搜索的关键字"
      }else{
        FrozenAPI.getFrozenMembers({filterKey:keyword}).then((result)=>{
          that.searchResult = result
          that.showSearch = true
        }).catch(function(err) {
          that.alert.showCatchError = true
          that.alert.catchErrorMsg = err
        })
      }
    },
    goToForzenAgent(account) {
      this.$route.router.go("/teamManagement/frozenAgent/"+account+"/Frozenlist")
    }
  },
  ready() {
    document.body.style.background = '#f2f2f2'

  }
}
</script>
