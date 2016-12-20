<template>
<div>
  <x-header :left-options="leftOptions">添加品类</x-header>
  <div @click="headerGoBack">&lt; 返回</div>
  <div @click="headerGoBack">完成</div>
</div>
<div>
  <div v-if="showInputModel">
    <flexbox :gutter="0">
      <flexbox-item :span="1/2">
        <x-input class="weui_cell_primary" title="" :value.sync="inputDate.inputLabel" placeholder="请输入标签" :show-clear=false :required="false"></x-input>
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
  <div>
    <checker :value.sync="inputDate.chooseLabelItems" type="checkbox" default-item-class="checker-item" selected-item-class="checker-item-selected">
      <checker-item v-for="productLabelItem in productInfo.pmp_product_labels" :value="productLabelItem">{{productLabelItem}}</checker-item>
    </checker>
  </div>
  <div>
    <p>历史标签</p>
    <button :id.sync="labelItem.id" v-for="labelItem in historyLabels" @click="chooseHistoryLabel(labelItem)">{{labelItem.name}}</button>
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
  props: {
    productInfo: {
      id: {
        type: String
      },
      pmp_brand_id: {
        type: String
      },
      name: {
        type: String
      },
      on_sell: {
        type: Boolean
      },
      description: {
        type: String
      },
      pmp_variants: {
        type: Array
      },
      pmp_product_labels: {
        type: Array
      },
      pmp_product_prices: {
        type: Array
      }
    },
    showMainPage: {
      type: Boolean
    },
    showEditProductLabelModel: {
      type: Boolean
    }
  },
  data() {
    return {
      leftOptions: {
        showBack: false,
        backText: null,
        preventGoBack: false
      },
      showInputModel: true,
      inputDate: {
        inputLabel: null,
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
      this.showInputModel = true
      this.showMainPage = true
      this.showEditProductLabelModel = false
    },
    getHistoryLabels() {
      var that = this
      pmpProductAPI.getLabels().then(function(result) {
        that.historyLabels = result
      }).catch(function(err) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "读取我的所有品类标签异常"
      })
    },
    add() {
      var that = this
      var addOperationFlag = false

      if (this.inputDate.inputLabel == null || this.inputDate.inputLabel.trim() == "") {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "请输入品类标签名"
      } else if (this.inputDate.inputLabel.trim().length > 15) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "您所输入的品类标签超过15个字符"
      } else {
        if (this.checkLabelItemLength()) {
          that.alert.showErrorNoHandled = true
          that.alert.errorMsgNoHandled = "标签最多可以设置5个"
        } else {
          var inputLabel = this.inputDate.inputLabel.trim()

          this.productInfo.pmp_product_labels.map((item) => {
            if (item == inputLabel) {
              that.inputDate.inputLabel = null

              that.alert.showErrorNoHandled = true
              that.alert.errorMsgNoHandled = "已添加此品类标签"

              addOperationFlag = true
            }
          })

          if (!addOperationFlag) {
            that.inputDate.inputLabel = null
            this.productInfo.pmp_product_labels.push(inputLabel)
          }
        }
      }
    },
    edit() {
      if (this.productInfo.pmp_product_labels.length == 0) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "暂无可编辑品类标签，请添加标签"
      } else {
        this.showInputModel = false
      }
    },
    remove() {
      var that = this
      var removeItems = []
      var newProductLabels = []

      this.inputDate.chooseLabelItems.map((addItem) => {
        that.productInfo.pmp_product_labels.map((productItem) => {
          if (addItem == productItem) {
            removeItems.push(addItem)
          }
        })
      })

      this.productInfo.pmp_product_labels.map((productItem) => {
        var findSameItemFlag = false
        var retentionItem = null
        removeItems.map((removeItem) => {
          if (removeItem == productItem) {
            findSameItemFlag = true
          }
        })
        if (!findSameItemFlag) {
          newProductLabels.push(productItem)
        }
      })

      this.productInfo.pmp_product_labels = newProductLabels
      this.showInputModel = true
    },
    cancel() {
      this.showInputModel = true
    },
    checkLabelItemLength() {
      if (this.productInfo.pmp_product_labels.length >= 5) {
        return true
      } else {
        return false
      }
    },
    chooseHistoryLabel(historyLabelItem) {
      var chooseHistoryLabel = historyLabelItem
      var addOperationFlag = false

      if (this.checkLabelItemLength()) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "标签最多可以设置5个"
      } else {
        this.productInfo.pmp_product_labels.map((item) => {
          if (item == chooseHistoryLabel.name) {
            document.getElementById(chooseHistoryLabel.id).style.display = "none"

            that.alert.showErrorNoHandled = true
            that.alert.errorMsgNoHandled = "已添加此品类标签"

            addOperationFlag = true
          }
        })

        if (!addOperationFlag) {
          document.getElementById(chooseHistoryLabel.id).style.display = "none"
          this.productInfo.pmp_product_labels.push(chooseHistoryLabel.name)
        }
      }
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
