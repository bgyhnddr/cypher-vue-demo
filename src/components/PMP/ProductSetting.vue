<template>
<div>
  <x-header :left-options="leftOptions">我的货品</x-header>
  <div @click="openSearchComponent">
    <img alt="搜索按钮" />
  </div>
</div>
<div>
  <tab>
    <tab-item :selected="tabItems.default === item" v-for="item in tabItems.list" @click="chooseTabItem(item)">{{item}}</tab-item>
  </tab>
  <div v-show="showModel.showProductContainer">
    <div v-if="showModel.showNoProduct">
      <p>没有任何商品哦~</p>
      <p>赶快去添加吧</p>
    </div>
    <div v-else>
      <scroller lock-x scrollbar-y use-pullup :pullup-config="pullUpScroller.pullupConfig" height="280px" @pullup:loading="loadProduct">
        <div>
          <group v-for="productItem in productsData.getProducts.list">
            <a class="weui_cell" v-link="">
              <div class="weui_cell_hd">
                <img alt="产品图片">
              </div>
              <div class="weui_cell_bd weui_cell_primary">
                <p>{{productItem.name}}</p>
                <p>￥ </p>
              </div>
              <div class="weui_cell_ft" :class="{'with_arrow': true}">
                <slot name="value"></slot>
                <slot></slot>
              </div>
            </a>
          </group>
        </div>
      </scroller>
    </div>
    <alert :show.sync="alert.showNoHanderMsg" button-text="确认">{{alert.msgNoHandled}}</alert>
  </div>
  <x-button @click="addProduct">添加商品</x-button>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
import {
  XHeader,
  Group,
  Cell,
  XButton,
  Tab,
  TabItem,
  Scroller,
  Alert
} from 'vux'
import pmpProductAPI from '../../api/pmp_product'

export default {
  components: {
    XHeader,
    Group,
    Cell,
    XButton,
    Tab,
    TabItem,
    Scroller,
    Alert
  },
  data() {
    return {
      leftOptions: {
        showBack: true,
        backText: "返回",
        preventGoBack: false
      },
      tabItems: {
        default: "全部",
        list: ["全部", "出售商品", "停售商品"]
      },
      productsData: {
        getProducts:{
          end: null,
          list: []
        },
        page: null
      },
      showModel: {
        showProductContainer: false,
        showNoProduct: true
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
        showNoHanderMsg: false,
        msgNoHandled: null
      }
    }
  },
  methods: {
    chooseTabItem(item) {
      console.log("选择:" + item)
    },
    loadProduct(uuid) {
      var that = this
      this.alert.showNoHanderMsg = false
      this.alert.msgNoHandled = null

      setTimeout(() => {
        if (this.productsData.end) {
          this.$broadcast('pullup:done', uuid)
          this.alert.showNoHanderMsg = true
          this.alert.msgNoHandled = "亲，已加载完了"
        } else {
          setTimeout(() => {
            this.$broadcast('pullup:reset', uuid)

            pmpProductAPI.getProducts({
              page: that.productsData.page,
              count: 2
            }).then(function(result) {
              if (result.list.length == 0) {
                that.alert.showNoHanderMsg = true
                that.alert.msgNoHandled = "亲，已加载完了"
              } else {
                console.log(JSON.stringify(result))
                result.list.map
                result.list.map((o) => {
                  that.productsData.getProducts.list.push(o)
                })
                that.productsData.getProducts.end = result.end
                that.productsData.page += 1
              }
              that.showModel.showProductContainer = true
            })
          }, 10)
        }
      }, 2000)
    },
    addProduct() {
      console.log("添加商品")
    },
    openSearchComponent() {
      console.log("打开搜索组件")
    }
  },
  ready() {
    var that = this
    pmpProductAPI.getProducts({
      count: 2
    }).then(function(result) {
      if (result.list.length == 0) {
        that.showModel.showNoProduct = true
      } else {
        console.log(JSON.stringify(result))
        that.productsData.getProducts = result
        that.showModel.showNoProduct = false
        that.productsData.page = 1
      }
      that.showModel.showProductContainer = true
    })
  }
}
</script>
