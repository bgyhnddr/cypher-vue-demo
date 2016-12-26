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
    <alert :show.sync="showAlert" button-Text="好的">{{alertMsg}}</alert>
    <confirm :show.sync="showConfirm" title="" confirm-text="是" cancel-text="否" @on-confirm="SubmitRelate(ScanResult)" @on-cancel = "onClickBack">
      <p style="text-align:center;">是否将箱{{ScanResult}}关联到{{ProductInfo.name}}{{ProductInfo.variant}}{{ProductInfo.specification}}里？</p>
    </confirm>
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
  XButton,
  Confirm
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
    XButton,
    Confirm
  },
  data() {
    return {
      ProductInfo: {
        name: "",
        variant: "",
        specification: ""
      },
      CountList: [],
      BoxList: [],
      ScanResult:"",
      alertMsg:"",
      showAlert:false,
      showConfirm:false
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
    SubmitRelate(e){
      var that = this
      that.CountList.push({
        pmp_specification_id: that.$route.params.id,
        goods_code: e
      })
      pmpProductAPI.getBoxCodes({
        code: e
      }).then((o) => {
        that.BoxList.push({
          code: e,
          box: o,
          show: false
        })
      })
    },
    SubmitResult() {
      var that = this
      if(that.CountList.length==0){
        that.showAlert = true
        that.alertMsg = "请添加货品关联"
      }else{
        pmpProductAPI.submitCountResult({countList:that.CountList}).then((o) => {
          that.onClickBack()
        })
      }
    },
    ScanQRCode() {
      //测试箱号
      var that = this
      // var result = "B-55C-88-4716-0004"
      window.wx.scanQRCode({
        needResult: 1,
        scanType: ["qrCode", "barCode"],
        success: function(res) {
          var result = res.resultStr
          that.ScanResult = result
          that.showConfirm = true
        }
      })
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
