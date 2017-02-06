<template>
<cart :cart-list="cartList" @on-change="change">
</cart>
</template>
<script>
import Cart from "./Cart"
export default {
  data() {
    return {
      cartList: [{
        "pmp_specification_id": "", //类型ID
        "pmp_specification_name": "类型名", //类型名
        "pmp_variant_name": "", //规格名
        "pmp_product": "", //产品名
        "count": "", //数量
        "price": "" //单价
      }]
    }
  },
  methods: {
    change(list) {
      this.cartList = list
    }
  },
  components: {
    Cart
  },
  ready() {

  }
}
</script>
