<template>
<div id="productRelate">
  <div>
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="{showBack: false}"></x-header>
      <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
    </div>
    <div class="productRelate-title">
      <p>{{ProductInfo.name}}</p>
      <div>
        {{ProductInfo.variant}}
        <span>{{ProductInfo.specification}}</span>
      </div>
    </div>
    <div class="productRelate-Carton">
      <group>
        <cell v-for="item in BoxList">
          <div @click="ToggleShowBoxes($index)" class="productRelate-Carton-title">
            箱号：
            <span>{{item.code}}</span>
          </div>
          <ul v-if="item.show">
            <li v-if="item.box.length>0">盒号：</li>
            <li v-for="box in item.box">
              <div slot="icon">{{box}}</div>
            </li>
          </ul>
        </cell>
      </group>
    </div>
    <div class="productRelate-button">
      <flexbox>
        <flexbox-item>
          <x-button type="default" @click="SubmitResult" class="productRelate-complete ">完成</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="default" @click="ScanQRCode">扫码</x-button>
        </flexbox-item>
      </flexbox>
    </div>
    <loading :show="showLoading"></loading>
    <alert :show.sync="showAlert" button-Text="好的">{{alertMsg}}</alert>
    <confirm :show.sync="showConfirm" title="" cancel-text="否" confirm-text="是" @on-confirm="SubmitRelate(ScanResult)" @on-cancel="onClickBack">
      <p style="text-align:center;">是否将箱
        <font color="#f90303">{{ScanResult}}</font>关联到{{ProductInfo.name}}{{ProductInfo.variant}}{{ProductInfo.specification}}里？</p>
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
  Confirm,
  Loading
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
    Confirm,
    Loading
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
      ScanResult: "",
      alertMsg: "",
      showLoading: false,
      showAlert: false,
      showConfirm: false
    }
  },
  methods: {
    onClickBack() {
      this.$route.router.go('/productManagement/linkProductToQRCode')
    },
    ToggleShowBoxes(e) {
      if (this.BoxList[e].show) {
        this.BoxList[e].show = false
      } else {
        this.BoxList[e].show = true
      }
    },
    SubmitRelate(e) {
      var that = this
      if (!that.CountList.any((v)=>{ return v.goods_code === e})){
        pmpProductAPI.getBoxCodes({
          code: e
        }).then((o) => {
          that.CountList.push({
            pmp_specification_id: that.$route.params.id,
            goods_code: e
          })
          that.BoxList.push({
            code: e,
            box: o,
            show: false
          })
        }).catch((err) => {
          that.alertMsg = err
          that.showAlert = true
        })
      }
    },
    SubmitResult() {
      var that = this
      if (that.CountList.length == 0) {
        that.showAlert = true
        that.alertMsg = "请添加货品关联"
      } else {
        that.showLoading = true
        pmpProductAPI.submitCountResult({
          countList: that.CountList
        }).then((o) => {
          that.showLoading = false
          that.onClickBack()
        }).catch((err) => {
          that.showLoading = false
          that.alertMsg = err
          that.showAlert = true
        })
      }
    },
    ScanQRCode() {
      //测试箱号
      var that = this
        //  that.ScanResult = "B-55C-88-4716-0004"
        //that.showConfirm = true
      window.wx.scanQRCode({
        needResult: 1,
        scanType: ["qrCode", "barCode"],
        success: function(res) {
          var result = (function(str) {
            var a = str.split('/');
            return a[a.length - 1]
          })(res.resultStr)
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
    }).catch((err) => {
      that.alertMsg = err
      that.showAlert = true
    })
    that.ScanQRCode()
  }
}
</script>
<style>
#productRelate .weui_dialog {
  width: 92%;
}

#productRelate .weui_dialog_confirm .weui_dialog .weui_dialog_hd {
  padding: 1.2em 0 .5em;
}

#productRelate .weui_dialog_bd {
  color: #000000;
  font-size: 4.5vw;
  font-family: "微软雅黑";
  margin-top: 5%;
}

#productRelate .weui_dialog_ft {
  width: 89%;
  margin: 7% auto;
  line-height: 32px;
  border-radius: 2px;
}

#productRelate .weui_btn_dialog.primary {
  font-size: 4.5vw;
  color: #fff;
  background: #21c36d;
  margin: 1%;
}

#productRelate a.weui_btn_dialog.default {
  background: #9b9b9b;
  color: #fff;
  margin: 1%;
  font-size: 4.5vw;
}

#productRelate .weui_dialog_ft:after {
  border-top: 0
}

#productRelate .productRelate-title {
  padding: 2%;
  font-family: "微软雅黑";
}

#productRelate .productRelate-title p {
  color: #393a3f;
  font-size: 4.1vw;
  display: box;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

#productRelate .productRelate-title>div {
  color: #878787;
  font-size: 4.5vw;
}

#productRelate .productRelate-title>div span {
  margin-left: 2%
}

#productRelate .productRelate-Carton {
  text-align: left;
}

#productRelate .weui_cell {
  padding: 0
}

#productRelate .weui_cell_hd {
  width: auto;
}

#productRelate .weui_cell_primary {
  -webkit-box-flex: initial;
  -ms-flex: initial;
  flex: initial;
}

#productRelate ul {
  list-style: none;
  background: #fff;
  position: relative;
  overflow-y: scroll;
  max-height: 230px;
  border-bottom: 1px solid #d3d1d1;
}

#productRelate ul li:nth-child(1) {
  position: absolute;
  padding: 0;
  top: 5%;
  left: 2%;
  color: #000;
  border: 0
}

#productRelate ul li:last-child {
  border-bottom: 0
}

#productRelate ul li {
  padding: 2% 17%;
  color: #aeaeae;
  font-size: 4.5vw;
  border-bottom: 1px solid #d3d1d1;
}

#productRelate .weui_cell_ft {
  text-align: left;
  color: #888;
  width: 100%;
}

#productRelate .productRelate-Carton {
  margin-bottom: 2%;
}

#productRelate .productRelate-Carton-title {
  padding: 4% 2%;
  background: #fff;
  font-family: "微软雅黑";
  font-size: 4.5vw;
  border-top: 1px solid #d3d1d1;
  border-bottom: 1px solid #d3d1d1;
  color: #000;
  position: relative;
}

#productRelate .productRelate-Carton-title span {
  color: #aeaeae
}

#productRelate .productRelate-Carton-title:after {
  border-width: 2px 2px 0 0;
  border-color: #9a9fa4;
  top: 35%;
  right: 6%;
  height: 8px;
  width: 8px;
  margin-left: .3em;
  border-style: solid;
  position: absolute;
  content: " ";
  display: inline-block;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

#productRelate .productRelate-button {
  position: fixed;
  bottom: 0;
  width: 100%
}

#productRelate .productRelate-button .vux-flexbox-item {
  margin-left: 0!important;
}

#productRelate button.weui_btn.weui_btn_default {
  margin: 0;
  padding: 0;
  border-radius: 0;
  line-height: 2.2em;
  font-size: 5.2vw;
  font-family: "微软雅黑";
  background: #00cc66;
  color: #fff;
}

#productRelate .weui_btn:after {
  border: 0;
  border-radius: 0
}

#productRelate button.weui_btn.productRelate-complete.weui_btn_default {
  background: #fd5e5e;
}
</style>
