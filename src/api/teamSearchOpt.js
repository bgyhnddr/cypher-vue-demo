var httpRequest = require('../extend/http-request')
var path = '/service/private/teamSearchOpt/'

export default {
  getPromotionOperableLevels() {
      return httpRequest.get(path + 'getPromotionOperableLevels')
  },
  getOperableStaffs(params) {
      return httpRequest.get(path + 'getOperableStaffs',params)
  },
}
