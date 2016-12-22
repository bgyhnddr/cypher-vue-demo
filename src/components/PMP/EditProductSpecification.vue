<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions">添加商品规格</x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
</div>
<div v-if="showModel.showEditSpecificationModel">
  <div>
    <x-input title='规格' placeholder="如颜色、款式" :value.sync="inputDate.variant" :show-clear=false :required="false"></x-input>
  </div>
  <div>
    <img v-for="image in inputDate.variantImages" :src="getSpecificationImgHref(image)" track-by="$index" width="50px" height="50px" alt="款式图片" />
    <flexbox>
      <flexbox-item>
        <employment-headimg-upload :file-id.sync="inputDate.addImageFileId"></employment-headimg-upload>
      </flexbox-item>
      <flexbox-item>
        <x-button type="primary" @click="addImage">添加</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button type="primary" @click="editImage">编辑</x-button>
      </flexbox-item>
    </flexbox>
  </div>
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
  <div v-if="showModel.showAddButtonModel">
    <x-button @click="confirm">确定添加</x-button>
  </div>
  <div v-else>
    <flexbox>
      <flexbox-item>
        <x-button type="warn" @click="showCheckConfirm('onSell')">{{onSellText}}</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button type="primary" @click="showCheckConfirm('edit')">修改</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</div>
<div>
  <alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{alert.catchErrorMsg}}</alert>
  <alert :show.sync="alert.showErrorNoHandled" button-text="好的">{{alert.errorMsgNoHandled}}</alert>
  <confirm :show.sync="alert.showCheckConfirm" title="" confirm-text="取消" cancel-text="确认" @on-cancel="closeComfirm">
    <p style="text-align:center;">{{alert.confirmModelText}}</p>
  </confirm>
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
  Alert,
  Confirm
} from 'vux'
import pmpProductAPI from '../../api/pmp_product'
import EmploymentHeadimgUpload from '../extend/employment-headimg-upload'

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
    Confirm,
    EmploymentHeadimgUpload
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
        chooseSpecificationItems: [],
        variantImages: [],
        addImageFileId: null,
        closeComfirmFlag: null
      },
      showModel: {
        showEditSpecificationModel: false,
        showAddButtonModel: false,
      },
      specificationOptions: [],
      onSellText: null,
      alert: {
        showCatchError: false,
        catchErrorMsg: null,
        showErrorNoHandled: false,
        errorMsgNoHandled: null,
        showCheckConfirm: false,
        confirmModelText: null
      }
    }
  },
  methods: {
    headerGoBack() {
      console.log("返回编辑商品首页")
      this.currentActive = "MainPage"
    },
    isFirstTimeAddSpecification() {
      if (this.ProductInfo.pmp_variants.length == 0) {
        return true
      } else {
        return false
      }
    },
    getProductSpecifications() {
      var specifications = []
      this.ProductInfo.pmp_variants.map((o) => {
        if (o.name == this.chooseSpecification) {
          o.pmp_specifications.map((productSpecificationItem) => {
            if (productSpecificationItem.on_sell) {
              specifications.push(productSpecificationItem.name)
            }
          })
        }
      })
      return specifications
    },
    getProductVariantName() {
      var variantName = null
      this.ProductInfo.pmp_variants.map((o) => {
        if (o.name == this.chooseSpecification) {
          variantName = o.name
        }
      })
      return variantName
    },
    isOnSell() {
      var isOnSellFlag = null
      this.ProductInfo.pmp_variants.map((o) => {
        if (o.name == this.chooseSpecification) {
          isOnSellFlag = o.on_sell
        }
      })
      return isOnSellFlag
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
    getProductImages() {
      var images = []
      this.ProductInfo.pmp_variants.map((o) => {
        if (o.name == this.chooseSpecification) {
          if (o.id == null) {
            images = o.pmp_variant_images
          } else {
            o.pmp_variant_images.map((productImageItem) => {
              images.push(productImageItem.attachment_id)
            })
          }
        }
      })
      return images
    },
    addImage() {
      if (this.inputDate.addImageFileId == null) {
        this.inputDate.addImageFileId = null

        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "请选择图片"
      } else if (this.inputDate.variantImages.length == 5) {
        this.inputDate.addImageFileId = null
        
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "您已选择超过5张图片"
      } else {
        var addImageFileId = this.inputDate.addImageFileId
        this.inputDate.addImageFileId = null
        this.inputDate.variantImages.push(addImageFileId)
      }
    },
    editImage() {
      console.log("编辑图片")
    },
    confirm() {
      if (this.inputDate.variant == null || this.inputDate.variant.trim() == "") {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "请输入商品规格"
      } else if (this.inputDate.chooseSpecificationItems.length == 0) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "请选择商品尺寸"
      } else if (this.inputDate.variantImages.length == 0) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "商品图片不能为空"
      } else {
        var newProductFlag = null

        if (this.isFirstTimeAddSpecification()) {
          newProductFlag = true
        } else {
          this.ProductInfo.pmp_variants.map((o) => {
            if (o.name == this.chooseSpecification && o.id == null) {
              newProductFlag = true
            } else {
              newProductFlag = false
            }
          })
        }

        if (newProductFlag == true) {
          this.ProductInfo.pmp_variants.push({
            name: this.inputDate.variant,
            on_sell: true,
            pmp_specifications: this.getConfirmSpecifications(),
            pmp_variant_images: this.inputDate.variantImages
          })
        } else {
          console.log("非首次添加的商品")
        }

        this.currentActive = "MainPage"
      }
    },
    changeProductOnSell() {
      this.ProductInfo.pmp_variants.map((o) => {
        o.on_sell = !o.on_sell
      })

      this.currentActive = "MainPage"
    },
    changeProductInfo() {
      this.ProductInfo.pmp_variants = []
      this.confirm()

      this.currentActive = "MainPage"
    },
    getConfirmSpecifications() {
      var onSellSpecifications = []
      var addSpecifications = []

      this.specificationOptions.map((option) => {
        this.inputDate.chooseSpecificationItems.map((chooseItem) => {
          if (option.name == chooseItem) {
            onSellSpecifications.push(option.name)
          }
        })
        addSpecifications.push({
          name: option.name,
          on_sell: false
        })
      })

      addSpecifications.map((item) => {
        onSellSpecifications.map((onSellItem) => {
          if (onSellItem == item.name) {
            item.on_sell = true
          }
        })
      })

      return addSpecifications
    },
    getSpecificationImgHref(fileId) {
      if (fileId == null) {
        return null
      } else {
        return '/service/public/upload/getAttachment?id=' + fileId
      }
    },
    showCheckConfirm(chooseText) {
      if (chooseText == "onSell") {
        if (this.isOnSell()) {
          this.alert.confirmModelText = "确定下架吗？"
        } else {
          this.alert.confirmModelText = "确定上架吗？"
        }
        this.alert.showCheckConfirm = true
      } else if (chooseText == 'edit') {
        this.alert.confirmModelText = "确定修改该商品规格吗？"
        this.alert.showCheckConfirm = true
      }

      this.inputDate.closeComfirmFlag = chooseText
    },
    closeComfirm() {
      if (this.inputDate.closeComfirmFlag == "onSell") {
        this.changeProductOnSell()
      } else {
        this.changeProductInfo()
      }

    },
    errorHandled() {
      this.currentActive = "MainPage"
    }
  },
  ready() {
    this.showModel.showEditSpecificationModel = false

    if (this.isFirstTimeAddSpecification()) {
      this.showModel.showAddButtonModel = true

      this.getSpecificationOptions()
    } else {
      this.showModel.showAddButtonModel = false

      this.getSpecificationOptions()
      this.inputDate.variant = this.getProductVariantName()
      this.inputDate.variantImages = this.getProductImages()
      console.log(JSON.stringify(this.inputDate.variantImages))
      this.inputDate.chooseSpecificationItems = this.getProductSpecifications()
      if (this.isOnSell()) {
        this.onSellText = "下架"
      } else {
        this.onSellText = "上架"
      }
      console.log(JSON.stringify(this.ProductInfo))
    }

    this.showModel.showEditSpecificationModel = true
  }
}
</script>
