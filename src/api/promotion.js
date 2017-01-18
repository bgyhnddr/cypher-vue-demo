var httpRequest = require('../extend/http-request')
var path = '/service/private/promotion/'

export default {
  getPromotionOperableLevels() {
      return httpRequest.get(path + 'getPromotionOperableLevels')
  },
  getPromotionOperableStaffs(params) {
      return httpRequest.get(path + 'getPromotionOperableStaffs',params)
  },
  getLevels(params) {
      return httpRequest.get(path + 'getLevels',params)
  },
  createPromotion(params) {
      return httpRequest.post(path + 'createPromotion',params)
  },
  getPromotion(params) {
      return httpRequest.get(path + 'getPromotion',params)
  }
}
