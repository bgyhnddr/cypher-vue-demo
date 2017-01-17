var httpRequest = require('../extend/http-request')
var path = '/service/private/promotion/'

export default {
  getPromotionOperableLevels() {
      return httpRequest.get(path + 'getPromotionOperableLevels')
  },
  getOperableStaffs(params) {
      return httpRequest.get(path + 'getOperableStaffs',params)
  },
}
