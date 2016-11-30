var httpRequest = require('../extend/http-request')
var path = '/service/public/sale/'

export default {
  showPack(params) {
    return httpRequest.post(path + 'showPack', params)
  },
  packSoldBy(params) {
    return httpRequest.post(path + 'packSoldBy', params)
  },
  getAgentInfo(params) {
    return httpRequest.post(path + 'getAgentInfo', params)
  }
}
