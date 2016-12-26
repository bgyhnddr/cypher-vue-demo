<template>
<div>
  <div>
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="{showBack: false}"></x-header>
      <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
    </div>
    <div>
      <div>{{ProductInfo.name}}</div>
      <div>
        <span>{{ProductInfo.variant}}</span>
        <span>{{ProductInfo.specification}}</span>
      </div>
    </div>
    <group>
      <cell v-for="item in BoxList">
        <div @click="ToggleShowBoxes($index)">
          <span>箱号：{{item.code}}</span>
        </div>
        <div v-if="item.show">
          <div>盒号：</div>
          <div v-for="box in item.box">
            <div slot="icon">{{box}}</div>
          </div>
        </div>
      </cell>
    </group>
    <flexbox>
      <flexbox-item>
        <x-button type="default" @click="SubmitResult">完成</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button type="default" @click="ScanQRCode">扫码</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</div>
</template>

<script>
import {
  Group,
  Alert,
  XHeader,
  Cell,
  Flexbox,
  FlexboxItem,
  XButton
} from 'vux'

import pmpProductAPI from '../../api/pmp_product'

export default {
  components: {
    Group,
    Alert,
    XHeader,
    Cell,
    Flexbox,
    FlexboxItem,
    XButton
  },
  data() {
    return {
      ProductInfo: {
        name: "",
        variant: "",
        specification: ""
      },
      CountList: [],
      BoxList: []
    }
  },
  methods: {
    onClickBack() {
      this.$route.router.go('/productManagement/linkProductToQRCode')
    },
    ToggleShowBoxes(e){
      if(this.BoxList[e].show){
        this.BoxList[e].show = false
      }else{
        this.BoxList[e].show = true
      }
    },
    SubmitResult() {
      // pmpProductAPI.submitCountResult().then((o) => {
      //
      // })
    },
    ScanQRCode() {
      //测试箱号
      var that = this
      var result = "B-55C-88-4716-0004"
      window.wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"],
        success: function(res) {
          window.alert(res) // 当needResult 为 1 时，扫码返回的结果
        }
      })
      // that.CountList.push({
      //   pmp_specification_id: that.$route.params.id,
      //   goods_code: result
      // })
      // pmpProductAPI.getBoxCodes({
      //   code: result
      // }).then((o) => {
      //   that.BoxList.push({
      //     code: result,
      //     box: o,
      //     show: false
      //   })
      // })
    }
  },
  ready() {
    var that = this
    var id = that.$route.params.id
    pmpProductAPI.getSpecification({
      id: id
    }).then((o) => {
      console.log(o)
      that.ProductInfo.name = o.pmp_variant.pmp_product.name
      that.ProductInfo.variant = o.pmp_variant.name
      that.ProductInfo.specification = o.name
    })
    that.ScanQRCode()
  }
}
</script>
