var httpRequest = require('../extend/http-request')
var path = '/service/public/agentInfo/'

export default {
    getBrandInfo(params) {
        return httpRequest.post(path + 'getBrandInfo',params)
    }
}