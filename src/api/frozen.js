var httpRequest = require('../extend/http-request')
var path = '/service/private/frozen/'

export default {
  getFrozenLevels() {
      return httpRequest.get(path + 'getFrozenLevels')
  },
  getFrozenMembers(params){
      return httpRequest.get(path + 'getFrozenMembers',params)
  },
  FrozenAgent(params) {
      return httpRequest.post(path + 'FrozenAgent',params)
  },
  ThawAgent(params) {
      return httpRequest.post(path + 'ThawAgent',params)
  },
}
