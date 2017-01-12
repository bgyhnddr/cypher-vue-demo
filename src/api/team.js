var httpRequest = require('../extend/http-request')
var path = '/service/private/frozen/'

export default {
  getFrozenLevels() {
      return httpRequest.get(path + 'getFrozenLevels')
  },
}
