<template>
<button @click="scan">
  扫一扫</button>
</template>
<script>
var request = require('../extend/http-request')
export default {
  data() {
    return {
      test: false
    }
  },
  methods: {
    getJsConfig() {
      request.post('/wechat/getJsConfig', {
        list: ['scanQRCode'],
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
    }
  },
  ready() {
    this.getJsConfig()
  }
}
</script>
