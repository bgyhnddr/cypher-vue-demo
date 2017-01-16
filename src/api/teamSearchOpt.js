var httpRequest = require('../extend/http-request')
var path = '/service/private/teamSearchOpt/'

export default {
  getOperableLevels() {
      return httpRequest.get(path + 'getOperableLevels')
  },
  getOperableStaffs(params) {
      return httpRequest.post(path + 'getOperableStaffs',params)
  },
}
