<template>
<div>
  <div class="vux-demo-header-box wapmain-header" slot="header">
    <x-header :left-options="leftOptions">添加品类</x-header>
    <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
  </div>
  <div @click="confirm">完成</div>
</div>
<div>
  <div v-if="showModel.showInputModel">
    <flexbox :gutter="0">
      <flexbox-item :span="1/2">
        <x-input class="weui_cell_primary" title="" :value.sync="inputData.inputLabel" placeholder="请输入标签" :show-clear=false :required="false"></x-input>
      </flexbox-item>
      <flexbox-item :span="1/4">
        <div>
          <x-button type="primary" @click="add">添加</x-button>
        </div>
      </flexbox-item>
      <flexbox-item :span="1/4">
        <div>
          <x-button type="primary" @click="edit">编辑</x-button>
        </div>
      </flexbox-item>
    </flexbox>
  </div>
  <div v-else>
    <flexbox :gutter="0">
      <flexbox-item :span="1/4">
        <div>
          <x-button type="primary" @click="remove">删除</x-button>
        </div>
      </flexbox-item>
      <flexbox-item :span="1/4">
        <div>
          <x-button type="primary" @click="cancel">取消</x-button>
        </div>
      </flexbox-item>
    </flexbox>
  </div>
  <div v-if="showModel.showStaticCheckerModel">
    <div v-for="productLabelItem in inputData.inputLabelItems">{{productLabelItem}}</div>
  </div>
  <div v-if="!showModel.showStaticCheckerModel">
    <checker :value.sync="inputData.chooseLabelItems" type="checkbox" default-item-class="checker-item" selected-item-class="checker-item-selected">
      <checker-item v-for="productLabelItem in inputData.inputLabelItems" :value="productLabelItem">{{productLabelItem}}</checker-item>
    </checker>
  </div>
  <div>
    <p>历史品类</p>
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
  Alert
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
  props: {
    ProductInfo: {
      type: Object
    },
    currentActive: {
      type: String
    }
  },
  data() {
    return {
      leftOptions: {
        showBack: false,
        backText: null,
        preventGoBack: false
      },
      showModel: {
        showStaticCheckerModel: true,
        showInputModel: true,
      },
      inputData: {
        inputLabel: null,
        inputLabelItems: [],
        chooseLabelItems: [],
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
      this.inputData.chooseLabelItems = []
      this.inputData.inputLabel = null
      this.showModel.showInputModel = true
      this.currentActive = "MainPage"
    },
    confirm() {
      this.ProductInfo.pmp_product_labels = this.inputData.inputLabelItems

      this.inputData.chooseLabelItems = []
      this.inputData.inputLabel = null
      this.showModel.showInputModel = true
      this.currentActive = "MainPage"
    },
    getLabels() {
      var labels = []

      if (this.ProductInfo.pmp_product_labels.length > 0) {
        this.ProductInfo.pmp_product_labels.map((item) => {
          labels.push(item)
        })
      }

      return labels
    },
    getHistoryLabels() {
      var that = this
      pmpProductAPI.getLabels().then(function(result) {
        that.historyLabels = result
      }).catch(function(err) {
        that.alert.showErrorNoHandled = true
        that.alert.errorMsgNoHandled = "读取我的所有品类标签异常"
      })
    },
    add() {
      var that = this
      var addOperationFlag = false

      if (this.inputData.inputLabel == null || this.inputData.inputLabel.trim() == "") {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "请输入品类标签名"
      } else if (this.inputData.inputLabel.trim().length > 15) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "您所输入的品类标签超过15个字符"
      } else {
        if (this.checkLabelItemLength()) {
          that.alert.showErrorNoHandled = true
          that.alert.errorMsgNoHandled = "标签最多可以设置5个"
        } else {
          var inputLabel = this.inputData.inputLabel.trim()

          this.inputData.inputLabelItems.map((item) => {
            if (item == inputLabel) {
              that.inputData.inputLabel = null

              that.alert.showErrorNoHandled = true
              that.alert.errorMsgNoHandled = "已添加此品类标签"

              addOperationFlag = true
            }
          })

          if (!addOperationFlag) {
            that.inputData.inputLabel = null
            that.inputData.inputLabelItems.push(inputLabel)
          }
        }
      }
    },
    edit() {
      if (this.inputData.inputLabelItems.length == 0) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "暂无可编辑品类标签，请添加标签"
      } else {
        this.showModel.showStaticCheckerModel = false
        this.showModel.showInputModel = false
      }
    },
    remove() {
      var that = this
      var removeItems = []

      this.inputData.chooseLabelItems.map((addItem) => {
        this.inputData.inputLabelItems.map((productItem) => {
          if (addItem == productItem) {
            removeItems.push(addItem)
          }
        })
      })

      removeItems.map((removeItem) => {
        this.inputData.inputLabelItems.$remove(removeItem)
      })

      this.inputData.chooseLabelItems = []
      this.showModel.showStaticCheckerModel = true
      this.showModel.showInputModel = true

    },
    cancel() {
      this.showModel.showStaticCheckerModel = true
      this.showModel.showInputModel = true
      this.inputData.chooseLabelItems = []
    },
    checkLabelItemLength() {
      if (this.inputData.inputLabelItems.length >= 5) {
        return true
      } else {
        return false
      }
    },
    chooseHistoryLabel(historyLabelItem) {
      var that = this
      var chooseHistoryLabel = historyLabelItem
      var addOperationFlag = false

      if (this.checkLabelItemLength()) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "标签最多可以设置5个"
      } else {
        this.inputData.inputLabelItems.map((item) => {
          if (item == chooseHistoryLabel.name) {
            that.historyLabels.$remove(historyLabelItem)

            that.alert.showErrorNoHandled = true
            that.alert.errorMsgNoHandled = "已添加此品类标签"

            addOperationFlag = true
          }
        })

        if (!addOperationFlag) {
          this.historyLabels.$remove(historyLabelItem)
          this.inputData.inputLabelItems.push(chooseHistoryLabel.name)
        }
      }
    }

  },
  ready() {
    this.inputData.inputLabelItems = this.getLabels()
    this.getHistoryLabels()
  }
}
</script>
<style lang="less">
.checker-item {
    width: 100px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin-right: 6px;
}
.checker-item-selected {
    background: #ffffff url("/static/TestIMG/checker-active.png") no-repeat right bottom;
    border-color: #ff4a00;
}
</style>
