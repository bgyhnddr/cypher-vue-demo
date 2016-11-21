var httpRequest = require('../extend/http-request')
var path = '/service/public/agentInfo/'

export default {
    getBrandRoleInfo() {
        return httpRequest.post(path + 'getBrandRoleInfo')
    }
}
