<template>
<div>
  <x-header :left-options="leftOptions">添加品类</x-header>
  <div @click="headerGoBack">&lt; 返回</div>
  <div @click="headerGoBack">完成</div>
</div>
<div>
  <flexbox :gutter="0">
    <flexbox-item :span="1/2">
      <x-input class="weui_cell_primary" title="" :value.sync="inputDate.inputLabel" placeholder="请输入标签" :show-clear=false :required="false"></x-input>
    </flexbox-item>
    <flexbox-item :span="1/4">
      <div class="flex-demo">
        <x-button type="primary" @click="add">添加</x-button>
      </div>
    </flexbox-item>
    <flexbox-item :span="1/4">
      <div class="flex-demo">
        <x-button type="primary" @click="edit">编辑</x-button>
      </div>
    </flexbox-item>
  </flexbox>
  <div>
    <checker :value.sync="inputDate.chooseCheckItem" type="checkbox" default-item-class="checker-item" selected-item-class="checker-item-selected">
      <checker-item v-for="labelItem in historyLabels" :value="labelItem.name">{{labelItem.name}}</checker-item>
    </checker>
  </div>
  <div>
    <p>历史标签</p>
    <button v-for="labelItem in historyLabels" @click="chooseHistoryLabel(labelItem)">{{labelItem.name}}</button>
  </div>
</div>

<div>
  <alert :show.sync="alert.showErrorNoHandled" button-text="确认">{{alert.errorMsgNoHandled}}</alert>
</div>
</template>
<script>
import {
  XHeader,
  Flexbox,
  FlexboxItem,
  XInput,
  XButton,
  Checker,
  CheckerItem,
  Alert,
} from 'vux'
import pmpProductAPI from '../../api/pmp_product'

export default {
  components: {
    XHeader,
    Flexbox,
    FlexboxItem,
    XInput,
    XButton,
    Checker,
    CheckerItem,
    Alert
  },
  data() {
    return {
      leftOptions: {
        showBack: false,
        backText: null,
        preventGoBack: false
      },
      inputDate: {
        label: null,
        chooseCheckItem: [],
      },
      historyLabels: null,
      alert: {
        showErrorNoHandled: false,
        errorMsgNoHandled: null
      }
    }
  },
  methods: {
    headerGoBack() {
      console.log("返回编辑商品首页")
    },
    getHistoryLabels() {
      var that = this
      pmpProductAPI.getLabels().then(function(result) {
        console.log(JSON.stringify(result))
        that.historyLabels = result
      })
    },
    add() {
      console.log("添加")
      if (this.inputDate.inputLabel == null || this.inputDate.inputLabel.trim() == "") {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "请输入标签"
      } else if (this.inputDate.inputLabel.trim().length > 15) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "您所输入的标签超过15个字符，请再次编辑"
      } else {
        var inputLabel = this.inputDate.inputLabel.trim()
        console.log(inputLabel)
      }
    },
    edit() {
      console.log("编辑")
    },
    chooseHistoryLabel(historyLabelItem){
      console.log("选择" + historyLabelItem.name)


    }
  },
  ready() {
    this.getHistoryLabels()
  }
}
</script>
<style lang="less">
.checker-item {
    border: 1px solid #ececec;
    padding: 5px 15px;
}
.checker-item-selected {
    border: 1px solid green;
}
</style>
