<template>
<div class="vux-demo-header-box wapmain-header" slot="header">
  <x-header :left-options="leftOptions"></x-header>
  <div slot="left" class="onclick-back" @click="headerGoBack">返回</div>
</div>
<div>
  <group>
    <x-input class="weui_cell_primary" title='' placeholder="输入搜索商品名称" :value.sync="keyword" :show-clear=false :required="false"></x-input>
    <button @click="search">搜索</button>
  </group>
  <div v-if="showSearchProductModel">
    <scroller lock-x scrollbar-y use-pullup :pullup-config="pullUpScroller.pullupConfig" height="280px" @pullup:loading="loadProduct">
      <group v-for="productItem in productsData.getProducts.list">
        <a class="weui_cell" v-link="{path: '/productManagement/editProduct/'+ productItem.id}">
          <div class="weui_cell_hd">
            <img :src="getProductImgHref(productItem.pmp_variants[0].pmp_variant_images[0].attachment_id)" width="50px" height="50px" alt="产品图片">
          </div>
          <div class="weui_cell_bd weui_cell_primary">
            <p>{{productItem.name}}</p>
            <p>￥ </p>
          </div>
        </a>
      </group>
    </scroller>
  </div>
</div>
<div>
  <alert :show.sync="alert.showCatchError" button-text="确认" @on-hide="errorHandled">{{catchErrorMsg}}</alert>
  <alert :show.sync="alert.showErrorNoHandled" button-text="确认">{{alert.errorMsgNoHandled}}</alert>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</div>
</template>

<script>
import {
  XHeader,
  Scroller,
  Group,
  XInput,
  Alert
} from 'vux'
import pmpProductAPI from '../../api/pmp_product'

export default {
  components: {
    XHeader,
    Scroller,
    Group,
    XInput,
    Alert
  },
  data() {
    return {
      leftOptions: {
        showBack: false,
        backText: null,
        preventGoBack: false
      },
      showSearchProductModel: false,
      keyword: null,
      productsData: {
        getProducts: {
          end: null,
          list: []
        },
        page: 0
      },
      pullUpScroller: {
        pullupStatus: 'default',
        pullupConfig: {
          content: '上拉加载更多',
          downContent: '松开进行加载',
          upContent: '上拉加载更多',
          loadingContent: '加载中...'
        }
      },
      alert: {
        showCatchError: false,
        catchErrorMsg: null,
        showErrorNoHandled: false,
        errorMsgNoHandled: null,
      }
    }
  },
  methods: {
    headerGoBack() {
      this.$route.router.go("/productManagement/productSetting")
    },
    search() {
      var that = this
      console.log("搜索")

      if (this.keyword == null || this.keyword.trim() == "") {
        this.alert.showErrorNoHandled = true
        this.alert.errorMsgNoHandled = "输入需要搜索的关键字"
      } else {
        pmpProductAPI.getProducts({
          filterKey: this.keyword
        }).then(function(result) {
          if (result.list.length == 0) {
            that.alert.showErrorNoHandled = true
            that.alert.errorMsgNoHandled = "无此商品"
          } else {
            that.productsData.getProducts.end = result.end
            that.productsData.getProducts.list = result.list
            that.productsData.page = 1

            that.showSearchProductModel = true
          }
        }).catch(function(err) {
          that.alert.showCatchError = true
          that.alert.catchErrorMsg = "搜索货品异常，请稍后再试"
        })
      }
    },
    loadProduct(uuid) {
      var that = this
      pmpProductAPI.getProducts({
        page: this.productsData.page
      }).then(function(result) {

        setTimeout(() => {
          if (result.list.length == 0) {
            that.$broadcast('pullup:done', uuid)
          } else {
            setTimeout(() => {
              that.$broadcast('pullup:reset', uuid)

              result.list.map((o) => {
                that.productsData.getProducts.list.push(o)
              })
              that.productsData.getProducts.end = result.end
              that.productsData.page += 1

            }, 10)
          }
        }, 2000)

      }).catch(function(err) {
        that.alert.showCatchError = true
        that.alert.catchErrorMsg = "读取我的货品信息异常，请稍后再试"
      })
    },
    getProductImgHref(fileId){
      return '/service/public/upload/getAttachment?id=' + fileId
    },
    errorHandled() {
      this.$route.router.go("/productManagement/productSetting")
    }
  }

}
</script>
