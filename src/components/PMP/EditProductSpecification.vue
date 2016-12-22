<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions">添加商品规格</x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
</div>
<div>
  <div>
    <x-input title='规格' placeholder="如颜色、款式" :value.sync="inputDate.variant" :show-clear=false :required="false"></x-input>
  </div>
  <div>
    <img alt="款式图片" />
  </div>
  <!-- <employment-headimg-upload :file-id.sync="inputDate.variant"></employment-headimg-upload> -->
  <div>
    <p>尺寸（可多选）</p>
    <flexbox :gutter="0" wrap="wrap">
      <flexbox-item :span="1/3" v-for="specificationItem in specificationOptions">
        <checker :value.sync="inputDate.chooseSpecificationItems" type="checkbox" default-item-class="checker-item" selected-item-class="checker-item-selected">
          <div class="flex-demo">
            <checker-item :value="specificationItem.name">{{specificationItem.name}}</checker-item>
          </div>
        </checker>
      </flexbox-item>
    </flexbox>
  </div>
  <div v-if="showAddButtonModel">
    <x-button @click="confirm">确定添加</x-button>
  </div>
  <div v-else>
    <flexbox>
      <flexbox-item>
        <x-button type="warn" @click="">{{onSellText}}</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button type="primary" @click="">修改</x-button>
      </flexbox-item>
    </flexbox>
  </div>

</div>
<div>
  <alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{alert.catchErrorMsg}}</alert>
  <alert :show.sync="alert.showErrorNoHandled" button-text="好的">{{alert.errorMsgNoHandled}}</alert>
</div>
</template>

<script>
import {
  XHeader,
  XInput,
  XButton,
  Checker,
  CheckerItem,
  Flexbox,
  FlexboxItem,
  Alert
} from 'vux'
import pmpProductAPI from '../../api/pmp_product'
// import EmploymentHeadimgUpload from '../extend/employment-headimg-upload'

export default {
  components: {
    XHeader,
    XInput,
    XButton,
    Checker,
    CheckerItem,
    Flexbox,
    FlexboxItem,
    Alert,
    // EmploymentHeadimgUpload
  },
  props: {
    ProductInfo: {
      type: Object
    },
    currentActive: {
      type: String
    },
    chooseSpecification: {
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
      inputDate: {
        variant: null,
        chooseSpecificationItems: []
      },
      showAddButtonModel: false,
      specificationOptions: [],
      onSellText: null,
      alert: {
        showCatchError: false,
        catchErrorMsg: null,
        showErrorNoHandled: false,
        errorMsgNoHandled: null
      }
    }
  },
  methods: {
    headerGoBack() {
      console.log("返回编辑商品首页")
      console.log(JSON.stringify(this.ProductInfo.pmp_variants))
      this.currentActive = "MainPage"
    },
    isFirstTimeAddSpecification() {
      if (this.ProductInfo.pmp_variants.length == 0) {
        return true
      } else {
        return false
      }
    },
    isOnSell() {
      this.ProductInfo.pmp_variants.map((o) => {
        if (o.name == this.chooseSpecification) {
          return o.on_sell
        }
      })
    },
    getSpecificationOptions() {
      var that = this
      pmpProductAPI.getSpecificationOptions().then(function(result) {
        that.specificationOptions = result[0].pmp_option_items
      }).catch(function(err) {
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = "读取商品尺寸异常"
      })
    },
    getProductSpecifications() {
      this.ProductInfo.pmp_variants.map((o) => {
        if (o.name == this.chooseSpecification) {
          var pmp_specifications = []
          o.pmp_specifications.map((productSpecification) => {
            pmp_specifications.push(productSpecification.name)
          })
          this.inputDate.chooseSpecificationItems = pmp_specifications
        }
      })

    },
    confirm() {
      console.log("确定添加")
      if (this.inputDate.variant == null || this.inputDate.variant.trim() == "") {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "请输入商品规格"
      } else if (this.inputDate.chooseSpecificationItems.length == 0) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "请选择商品尺寸"
          //TODO: 商品图片不能为空
      } else {
        this.ProductInfo.pmp_variants = this.inputDate.chooseSpecificationItems
      }
    },
    errorHandled() {
      this.currentActive = "MainPage"
    }
  },
  ready() {
    this.getSpecificationOptions()

    if (this.isFirstTimeAddSpecification()) {
      this.showAddButtonModel = true
    } else {
      this.showAddButtonModel = false
      this.getProductSpecifications()
      this.inputDate.variant = this.chooseSpecification
      if (this.isOnSell()) {
        this.onSellText = "下架"
      }else{
        this.onSellText = "上架"
      }

    }
  }
}
</script>
