<template>
<div>
  <!-- 主页 -->
  <div>
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="{showBack: false}">{{ProductInfo.name}}</x-header>
      <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
    </div>
    <Group>
      <div class="weui_cell">
        <swiper :list="ImgList" auto style="width:80%;margin:0 auto;" height="180px" dots-class="custom-bottom" dots-position="center"></swiper>
      </div>
      <div class="weui_cell">
        <div class="weui_cell_bd weui_cell_primary">
          <p>{{ProductInfo.name}}</p>
        </div>
      </div>
      <div class="weui_cell">
        <div class="weui_cell_bd weui_cell_primary">
          <p>{{ProductInfo.description}}</p>
        </div>
      </div>
    </Group>
    <flexbox>
      <flexbox-item>
        <x-button type="default" @click="editProduct">编辑</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button type="default" @click="showConfirm">{{ProductInfo.on_sell == true?"下架":"上架"}}</x-button>
      </flexbox-item>
    </flexbox>
    <confirm :show.sync="show" title="" confirm-text="确认" cancel-text="取消" @on-confirm="changeSellMode">
      <p style="text-align:center;">确定{{ProductInfo.on_sell == true?"下架":"上架"}}该商品吗?</p>
    </confirm>
  </div>
</div>
</template>

<script>
import {
  Group,
  Alert,
  XHeader,
  Flexbox,
  FlexboxItem,
  XButton,
  Confirm,
  Swiper
} from 'vux'

import pmpProductAPI from '../../api/pmp_product'

export default {
  components: {
    Group,
    Alert,
    XHeader,
    Flexbox,
    FlexboxItem,
    XButton,
    Confirm,
    Swiper
  },
  props: {
    currentActive: {
      type: String
    },
    ProductInfo: {
      type: Object
    }
  },
  data() {
    return {
      show: false,
      ImgList: []
    }
  },
  methods: {
    onClickBack() {
      this.$route.router.go("/productManagement/productSetting")
    },
    editProduct() {
      this.currentActive = "MainPage"
    },
    showConfirm() {
      this.show = true
    },
    getProductImgHref(fileId) {
      return '/service/public/upload/getAttachment?id=' + fileId
    },
    changeSellMode() {
      var that = this
      var id = that.$route.params.id
      var sellMode = that.ProductInfo.on_sell == true ? false : true
      pmpProductAPI.submitProduct({
        id: id,
        on_sell: sellMode
      }).then(() => {
        that.$route.router.go('/productManagement/productSetting')
      })
    }
  },
  watch: {
    'ProductInfo.pmp_variants': function(val, oldvalue) {
      var that = this
      if (that.ProductInfo) {
        that.ImgList = that.ProductInfo.pmp_variants.map((e) => {
          if (e.pmp_variant_images && e.pmp_variant_images.length > 0) {
            return {
              img: that.getProductImgHref(e.pmp_variant_images[0].attachment_id)
            }
          } else {
            return {
              img: ""
            }
          }
        })
      }
    }
  },
  ready() {
  }
}
</script>
<style>

</style>
