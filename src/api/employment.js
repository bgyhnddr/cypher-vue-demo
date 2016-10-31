var httpRequest = require('../extend/http-request')
var path = '/service/private/employment/'

export default {
    getEmployableRoles(params) {
        return httpRequest.post(path + 'getEmployableRoles', params)
    },
    getBrandInfo(params){
        return httpRequest.post(path + 'getBrandInfo', params)
    },
    getAuditList(){
        return httpRequest.get(path + 'getAuditList')
    }
}