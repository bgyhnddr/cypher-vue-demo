var httpRequest = require('../extend/http-request')
var path = '/service/private/promote/'

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
  },
  PassPromote(params) {
      return httpRequest.get(path + 'PassPromote',params)
  },
  RejectPromote(params) {
      return httpRequest.get(path + 'RejectPromote',params)
  },
  getPromotelist(params) {
      return httpRequest.get(path + 'getPromotelist',params)
  },
  getPromoteAuditInfo(params) {
      return httpRequest.get(path + 'getPromoteAuditInfo',params)
  },
  confirmPromotion(params) {
      return httpRequest.post(path + 'confirmPromotion',params)
  },
}
