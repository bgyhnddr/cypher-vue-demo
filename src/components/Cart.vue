<template>
<div>
  <view-box v-ref:view-box>
    <div slot="header">
      <x-header @on-click-back="onClickBack" :left-options="leftOptions">采购清单</x-header>
    </div>
    <group>
      <cell v-for="item in myCartList" :title="item.pmp_specification_name">
        <div slot="child">
          <span @click="toggleItem($index,item)">
            <span v-if="item.checked">check</span>span</span>
        </div>
        <img slot="icon" width="50" src="" alt="产品图片" />
      </cell>
    </group>
  </view-box>
</div>
</template>

<script>
import {
  XHeader,
  ViewBox,
  Cell,
  Group,
  XInput
} from 'vux'
export default {
  props: {
    cartList: Array,
    backPath: {
      type: String,
      default: "/Login"
    }
  },
  components: {
    XHeader,
    ViewBox,
    Cell,
    Group,
    XInput
  },
  data() {
    return {
      myCartList: [],
      leftOptions: {
        backText: "返回",
        preventGoBack: true,
        showBack: true
      }
    }
  },
  watch: {
    cartList(val) {
      if (val) {
        this.myCartList = val.map((o) => {
          return {
            "pmp_specification_id": o.pmp_specification_id, //类型ID
            "pmp_specification_name": o.pmp_specification_name, //类型名
            "pmp_variant_name": o.pmp_variant_name, //规格名
            "pmp_product": o.pmp_product, //产品名
            "count": o.count, //数量
            "price": o.price, //单价
            "checked": false
          }
        })
      }
    }
  },
  methods: {
    onClickBack() {
      this.$router.go(this.backPath)
    },
    toggleItem(index, item) {
      this.myCartList.$set(index, item)
      this.$emit('on-change', this.myCartList)
    }
  },
  ready() {
    this.myCartList = this.cartList
  }
}
</script>
