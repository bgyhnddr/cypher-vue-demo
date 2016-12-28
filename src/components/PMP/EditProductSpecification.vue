<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions">添加商品规格</x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
</div>
<div v-if="showModel.showEditSpecificationModel">
  <div v-if="showModel.showAddImageModel">
    <x-input title='规格' placeholder="如颜色、款式" :value.sync="inputDate.variant" :show-clear=false :required="false"></x-input>
  </div>
  <div v-if="!showModel.showAddImageModel">
    <label>规格</label>
    <label>{{inputDate.variant}}</label>
  </div>
  <div v-if="showModel.showAddImageModel">
    <img v-for="image in inputDate.variantImages" :src="getSpecificationImgHref(image)" track-by="$index" width="50px" height="50px" alt="款式图片" />
    <div class="ApplyFor-agent-header">
      <employment-headimg-upload :file-id.sync="inputDate.addImageFileId"></employment-headimg-upload>
    </div>
    <flexbox>
      <flexbox-item>
        <x-button type="primary" @click="addImage">添加</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button type="primary" @click="editImage">编辑</x-button>
      </flexbox-item>
    </flexbox>
  </div>
  <div v-if="!showModel.showAddImageModel">
    <flexbox>
      <flexbox-item>
        <x-button type="primary" @click="removeImage">删除</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button type="primary" @click="cancalAddImage">取消</x-button>
      </flexbox-item>
    </flexbox>
    <checker :value.sync="inputDate.chooseImages" type="checkbox" default-item-class="checker-item" selected-item-class="checker-item-selected">
      <checker-item v-for="image in inputDate.variantImages" track-by="$index" :value="image">
        <img :src="getSpecificationImgHref(image)" width="50px" height="50px" alt="款式图片" />
      </checker-item>
    </checker>
  </div>
  <div>
    <p>尺寸（可多选）</p>
    <flexbox :gutter="0" wrap="wrap" v-if="showModel.showAddImageModel">
      <flexbox-item :span="1/3" v-for="specificationItem in specificationOptions">
        <checker :value.sync="inputDate.chooseSpecificationItems" type="checkbox" default-item-class="checker-item" selected-item-class="checker-item-selected">
          <div class="flex-demo">
            <checker-item :value="specificationItem.name">{{specificationItem.name}}</checker-item>
          </div>
        </checker>
      </flexbox-item>
    </flexbox>
    <flexbox :gutter="0" wrap="wrap" v-if="!showModel.showAddImageModel">
      <flexbox-item :span="1/3" v-for="specificationItem in specificationOptions">
        <div>
          {{specificationItem.name}}
        </div>
      </flexbox-item>
    </flexbox>
  </div>
  <div v-if="showModel.showAddButtonModel">
    <div v-if="showModel.showAddImageModel">
      <x-button @click="confirm('add')">确定添加</x-button>
    </div>
  </div>
  <div v-else>
    <flexbox v-if="showModel.showAddImageModel">
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
        editPmpVariantsIndex: null,
        variant: null,
        chooseSpecificationItems: [],
        variantImages: [],
        chooseImages: [],
        addImageFileId: null,
        closeComfirmFlag: null
      },
      showModel: {
        showEditSpecificationModel: false,
        showAddButtonModel: false,
        showAddImageModel: true,
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
      this.currentActive = "MainPage"
      this.showModel.showAddImageModel = true
      this.inputDate.chooseImages = []
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
    getProductVariantIndex() {
      var variantIndex = null
      this.ProductInfo.pmp_variants.map((o, index) => {
        if (o.name == this.chooseSpecification) {
          variantIndex = index
        }
      })
      return variantIndex
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
        if (o.name == this.chooseSpecification && o.pmp_variant_images.length != null) {
          o.pmp_variant_images.map((productImageItem) => {
            if (productImageItem.attachment_id != null) {
              images.push(productImageItem.attachment_id)
            } else {
              images.push(productImageItem)
            }
          })
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
      this.inputDate.chooseImages = []
      if (this.inputDate.variantImages.length == 0) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "暂无可编辑商品图片"
      } else {
        this.showModel.showAddImageModel = false
      }
    },
    removeImage() {
      var that = this
      var removeItems = []

      this.inputDate.chooseImages.map((addItem) => {
        this.inputDate.variantImages.map((productItem) => {
          if (addItem == productItem) {
            removeItems.push(addItem)
          }
        })
      })

      removeItems.map((removeItem) => {
        this.inputDate.variantImages.$remove(removeItem)
      })

      this.showModel.showAddImageModel = true
    },
    cancalAddImage() {
      this.inputDate.chooseImages = []
      this.showModel.showAddImageModel = true
    },
    confirmBeforeCheck() {
      var confirmFlag = false
      if (this.inputDate.variant == null || this.inputDate.variant.trim() == "") {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "请输入商品规格"
      } else if (this.inputDate.variantImages.length == 0) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "商品图片不能为空"
      } else if (this.inputDate.chooseSpecificationItems.length == 0) {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "请选择商品尺寸"
      } else {
        confirmFlag = true
      }
      return confirmFlag
    },
    confirm(status) {
      var isCheckedFlag = false
      if (status == "edit") {
        isCheckedFlag = true
      }

      var confirmSpecifaications = this.getConfirmSpecifications()
      var confirmImages = this.getConfirmImages()
      if (isCheckedFlag || this.confirmBeforeCheck()) {
        if (this.inputDate.editPmpVariantsIndex == null && this.chooseSpecification == null) {

          this.ProductInfo.pmp_variants.push({
            name: this.inputDate.variant,
            on_sell: true,
            pmp_specifications: confirmSpecifaications,
            pmp_variant_images: confirmImages
          })
        } else if (this.inputDate.editPmpVariantsIndex != null) {
          this.ProductInfo.pmp_variants.map((o, index) => {

            if (index == this.inputDate.editPmpVariantsIndex) {
              o.name = this.inputDate.variant
              o.pmp_specifications = confirmSpecifaications
              o.pmp_variant_images = confirmImages
            }
          })
        }

        this.currentActive = "MainPage"
      }
    },
    changeProductOnSell() {
      this.ProductInfo.pmp_variants.map((o, index) => {
        if (index == this.inputDate.editPmpVariantsIndex) {
          o.on_sell = !o.on_sell
        }
      })

      this.currentActive = "MainPage"
    },
    getConfirmSpecifications() {
      var addSpecifications = []

      if (this.inputDate.editPmpVariantsIndex == null) {
        this.specificationOptions.map((option) => {
          addSpecifications.push({
            name: option.name,
            on_sell: false
          })
        })
      } else {
        this.ProductInfo.pmp_variants.map((o, index) => {
          if (index == this.inputDate.editPmpVariantsIndex) {
            addSpecifications = o.pmp_specifications
            addSpecifications.map((item) => {
              item.on_sell = false
            })
          }
        })
      }

      this.inputDate.chooseSpecificationItems.map((onSellItem) => {
        addSpecifications.map((item) => {
          if (onSellItem == item.name) {
            item.on_sell = true
          }
        })
      })

      return addSpecifications
    },
    getConfirmImages() {
      var addImages = []

      if (this.inputDate.editPmpVariantsIndex == null) {
        this.inputDate.variantImages.map((option) => {
          addImages.push({
            attachment_id: option
          })
        })
      } else {
        this.ProductInfo.pmp_variants.map((o, index) => {
          if (index == this.inputDate.editPmpVariantsIndex) {

            this.inputDate.variantImages.map((addItem) => {
              o.pmp_variant_images.map((originalItem) => {
                if (addItem == originalItem.attachment_id) {
                  addImages.push(originalItem)
                }
              })
            })

            addImages.map((o) => {
              this.inputDate.variantImages.$remove(o.attachment_id)
            })

            this.inputDate.variantImages.map((option) => {
              addImages.push({
                attachment_id: option
              })
            })
          }
        })
      }

      return addImages
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
        if (this.confirmBeforeCheck()) {
          this.alert.confirmModelText = "确定修改该商品规格吗？"
          this.alert.showCheckConfirm = true
        }
      }

      this.inputDate.closeComfirmFlag = chooseText
    },
    closeComfirm() {
      if (this.inputDate.closeComfirmFlag == "onSell") {
        this.changeProductOnSell()
      } else {
        this.confirm("edit")
      }
    },
    errorHandled() {
      this.currentActive = "MainPage"
    }
  },
  ready() {
    this.showModel.showAddImageModel = true
    this.showModel.showEditSpecificationModel = false
    this.inputDate.chooseImages = []

    if (this.getProductVariantIndex() == null) {
      this.showModel.showAddButtonModel = true

      this.getSpecificationOptions()
    } else {
      this.showModel.showAddButtonModel = false

      this.getSpecificationOptions()
      this.inputDate.editPmpVariantsIndex = this.getProductVariantIndex()
      this.inputDate.variant = this.getProductVariantName()
      this.inputDate.variantImages = this.getProductImages()
      this.inputDate.chooseSpecificationItems = this.getProductSpecifications()
      if (this.isOnSell()) {
        this.onSellText = "下架"
      } else {
        this.onSellText = "上架"
      }
    }

    this.showModel.showEditSpecificationModel = true
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
