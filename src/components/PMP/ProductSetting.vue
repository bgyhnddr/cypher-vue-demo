<template>
<div>
  <x-header :left-options="leftOptions" @click="headerGoBack">我的货品</x-header>
  <div @click="openSearchComponent">
    <img alt="搜索按钮" />
  </div>
</div>
<div>
  <tab>
    <tab-item :selected="tabItems.default === item.key" v-for="item in tabItems.list" @click="chooseTabItem(item.value)">{{item.key}}</tab-item>
  </tab>
  <div v-if="showModel.showProductContainer">
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
  </div>
  <div>
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
    Scroller
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
        list: [{
          key: "全部",
          value: undefined
        }, {
          key: "出售商品",
          value: 1
        }, {
          key: "停售商品",
          value: 0
        }]
      },
      productsData: {
        getProducts: {
          end: null,
          list: []
        },
        page: 0,
        chooseTab: null
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
      }
    }
  },
  methods: {
    headerGoBack() {
      this.$route.router.go("/productManagement")
    },
    chooseTabItem(item) {
      var that = this

      console.log("选择:" + item + "======" + this.productsData.chooseTab)

      if (typeof(this.productsData.chooseTab) != typeof(item) || this.productsData.chooseTab != item) {
        this.productsData.chooseTab = item
        that.showModel.showProductContainer = false

        pmpProductAPI.getProducts({
          page: 0,
          on_sell: this.productsData.chooseTab
        }).then(function(result) {
          console.log(JSON.stringify(result))
          if (result.list.length == 0) {
            that.showModel.showNoProduct = true
          } else {
            that.productsData.getProducts.end = result.end
            that.productsData.getProducts.list = result.list
            that.productsData.page = 1

            that.showModel.showNoProduct = false
          }
          that.showModel.showProductContainer = true
        })

      }
    },
    loadProduct(uuid) {
      var that = this

      pmpProductAPI.getProducts({
        page: this.productsData.page,
        on_sell: this.productsData.chooseTab
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

      })
    },
    addProduct() {
      console.log("添加商品")
    },
    openSearchComponent() {
      console.log("打开搜索组件")
    }
  },
  ready() {
    this.chooseTabItem()
  }
}
</script>
