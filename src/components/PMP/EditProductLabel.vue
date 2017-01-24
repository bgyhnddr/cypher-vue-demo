<template>
<div>
  <div class="vux-demo-header-box wapmain-header" slot="header">
    <x-header :left-options="leftOptions">添加关键字</x-header>
    <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
  </div>
  <div v-if="showModel.showStaticCheckerModel" @click="confirm" class="EditProductLabel-complete">完成</div>
</div>
<div id="EditProductLabel">
  <div>
  <div v-if="showModel.showInputModel">
    <div class="EditProductLabel-label ">
    <flexbox :gutter="0">
      <flexbox-item :span="1/2">
        <x-input class="weui_cell_primary" title="" :value.sync="inputData.inputLabel" placeholder="请输入关键字" :show-clear=false :required="false"></x-input>
      </flexbox-item>
      <flexbox-item :span="1/4">
        <div>
          <x-button type="primary" @click="add" class="EditProductLabel-add">添加</x-button>
        </div>
      </flexbox-item>
        </div>
      <flexbox-item :span="1/4">
        <div>
          <x-button type="primary" @click="edit" class="EditProductLabel-editor ">编辑</x-button>
        </div>

      </flexbox-item>
    </flexbox>
<div class="clean"></div>
  </div>
  <div v-else class="EditProductLabel-editor-button">
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
  <div v-if="showModel.showStaticCheckerModel"class="EditProductLabel-new ">
    <p>新增关键字</p>
    <div v-for="productLabelItem in inputData.inputLabelItems">{{productLabelItem}}</div>

  </div>
    <div class="clean"></div>
  <div v-if="!showModel.showStaticCheckerModel" class="EditProductLabel-new-editor">
      <p>新增关键字</p>
    <checker :value.sync="inputData.chooseLabelItems" type="checkbox" default-item-class="checker-item" selected-item-class="checker-item-selected">
      <checker-item v-for="productLabelItem in inputData.inputLabelItems" :value="productLabelItem">{{productLabelItem}}</checker-item>
    </checker>
  </div>
    <div class="clean"></div>
  <div v-if="showModel.showStaticCheckerModel" class="EditProductLabel-history ">
    <p>可选关键字</p>
    <button v-for="labelItem in historyLabels" @click="chooseHistoryLabel(labelItem)">{{labelItem.name}}</button>
  </div>
</div>
<div>
  <alert :show.sync="alert.showErrorNoHandled" button-text="确认">{{alert.errorMsgNoHandled}}</alert>
</div>
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
    getHistoryLabels(hasLabelItems) {
      var that = this
      pmpProductAPI.getLabels().then(function(result) {
        hasLabelItems.map((o) => {
          result.map((historyLabel) => {
            if (historyLabel.name == o) {
              result.$remove(historyLabel)
            }
          })
        })

        that.historyLabels = result
      }).catch(function(err) {
        that.alert.showErrorNoHandled = true
        that.alert.errorMsgNoHandled = "读取我的关键字异常"
      })
    },
    add() {
      var that = this
      var addOperationFlag = false

      if (this.inputData.inputLabel == null || this.inputData.inputLabel.trim() == "") {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "请输入关键字"
      } else if (this.inputData.inputLabel.trim().length > 15) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "您所输入的关键字超过15个字符"
      } else {
        if (this.checkLabelItemLength()) {
          that.alert.showErrorNoHandled = true
          that.alert.errorMsgNoHandled = "关键字最多可以设置5个"
        } else {
          var inputLabel = this.inputData.inputLabel.trim()

          this.inputData.inputLabelItems.map((item) => {
            if (item == inputLabel) {
              that.inputData.inputLabel = null

              that.alert.showErrorNoHandled = true
              that.alert.errorMsgNoHandled = "已添加此关键字"

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
      this.inputData.inputLabel = null
      if (this.inputData.inputLabelItems.length == 0) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "暂无可编辑关键字，请添加关键字"
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
        this.alert.errorMsgNoHandled = "关键字最多可以设置5个"
      } else {
        this.inputData.inputLabelItems.map((item) => {
          if (item == chooseHistoryLabel.name) {
            that.historyLabels.$remove(historyLabelItem)

            that.alert.showErrorNoHandled = true
            that.alert.errorMsgNoHandled = "已添加此关键字"

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
    this.getHistoryLabels(this.inputData.inputLabelItems)
      document.body.style.background = '#f2f2f2'
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
.EditProductLabel-complete{
  position: absolute;
    right: 6%;
z-index: 1000;
color: #fff;
top: 2%;
font-size: 4.5vw}
#EditProductLabel .EditProductLabel-label{
background: #fff;
border-bottom: 1px solid #999;

}
#EditProductLabel .EditProductLabel-label .vux-flexbox-item:first-child{
  flex: 0 0 70% !important;
}
#EditProductLabel .EditProductLabel-label .vux-flexbox-item:nth-child(2){
flex: 0 0 27% !important;
}
#EditProductLabel .EditProductLabel-label .vux-flexbox-item:first-child input.weui_input{
  font-size: 4.5vw;
color: #aeaeae;
font-family: "微软雅黑";
}
#EditProductLabel .weui_cell_hd{
  width: auto;
}

#EditProductLabel button.weui_btn.EditProductLabel-add.weui_btn_primary {
    border-radius: 2px;
    font-size: 4.5vw;
  margin-right: 8%;}
  #EditProductLabel    .weui_btn:after{
    border: 0
  }
  #EditProductLabel  button.weui_btn.EditProductLabel-editor.weui_btn_primary {
    width: 24%;

        float: right;
      margin-right: 5%;
        border-radius: 2px;
        font-size: 4.5vw;
            margin-top: 3%;
            background: #5091d5
  }
  #EditProductLabel .EditProductLabel-new,  #EditProductLabel .EditProductLabel-history {
      padding: 0 5%;
  }

  #EditProductLabel .EditProductLabel-new > div,  #EditProductLabel .EditProductLabel-history button {
      float: left;
      margin: 2% 1%;
      border: 1px solid #d3d1d1;
      background: #fff;
        padding: 1% 5%;
      font-size: 4.5vw;
      border-radius: 5px;
          font-family: "微软雅黑";
  }

#EditProductLabel   .EditProductLabel-new  p,#EditProductLabel .EditProductLabel-history p
{
  font-size: 4.5vw;
  color: #595959
}
#EditProductLabel  .EditProductLabel-editor-button{
  position: fixed;
  bottom: 0;
  width: 100%
}
#EditProductLabel  .EditProductLabel-editor-button .vux-flexbox-item{
      flex: 0 0 50%!important;
}
#EditProductLabel  .EditProductLabel-editor-button button.weui_btn.weui_btn_primary{
  width: 100%;
  border-radius: 0;
      background: #9b9b9b;
      font-size: 5.2vw
}
#EditProductLabel  .EditProductLabel-editor-button .vux-flexbox-item:first-child button.weui_btn.weui_btn_primary{
  background: #fd5e5e
}
#EditProductLabel .EditProductLabel-new-editor {
  width: 90%;
  margin: 2% auto;

}
#EditProductLabel .EditProductLabel-new-editor p{
  font-size: 4.5vw;
  color: #595959;
  margin-bottom: 1%;
      font-family: "微软雅黑";
}
#EditProductLabel .checker-item-selected{
  border-color: #21c36d;
}
#EditProductLabel .EditProductLabel-new-editor .vux-checker-item.vux-tap-active.checker-item{
  font-size: 4.5vw;
  border-radius: 5px;
    padding: 1% 5%;
    width: auto;
    margin: 2% 1%;
}
  .clean{ clear: both;}
</style>
