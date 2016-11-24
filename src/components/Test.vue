<template>
<button @click="scan">
  扫一扫</button>
<button @click="choose">上传</button>
<img :src="imgId" alt="" />
<div v-el:qr></div>
</template>
<script>
import qrcode from 'vue-qrcode'
var qrcanvas = require('qrcanvas')
var request = require('../extend/http-request')
export default {
  data() {
    return {
      test: false,
      imgId: "",
      str: "来吧中文"
    }
  },
  components: {
    qrcode
  },
  methods: {
    getJsConfig() {
      request.post('/wechat/getJsConfig', {
        list: ['scanQRCode', 'chooseImage', 'uploadImage'],
        url: window.location.href
      }).then((result) => {
        window.wx.config(result)
      })
    },
    scan() {
      window.wx.scanQRCode({
        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"]
      })
    },
    choose() {
      var that = this
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          that.imgId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          wx.uploadImage({
            localId: that.imgId, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function(res) {
              var serverId = res.serverId; // 返回图片的服务器端ID
            }
          })
        }
      })
    }
  },
  ready() {
    this.getJsConfig()
    this.$els.qr.appendChild(qrcanvas({
      data: 'http://localhost:8080/#!/employManagement/brandAuthorization/2c2cd470-b21d-11e6-920e-6b9af5cfe498/%E8%B4%9D%E5%88%A9%E9%BE%99'
    }))
  }
}
</script>
