<template>
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
        list: ['scanQRCode']
      }).then((result) => {
        window.wx.config(result)
      })
    }
  }
}
</script>
