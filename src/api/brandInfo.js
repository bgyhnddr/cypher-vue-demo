var httpRequest = require('../extend/http-request')
var path = '/service/public/brandInfo/'

export default {
    getBrandInfo() {
        return httpRequest.post(path + 'getBrandInfo')
    }
}
