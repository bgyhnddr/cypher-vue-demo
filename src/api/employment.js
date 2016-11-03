var httpRequest = require('../extend/http-request')
var path = '/service/private/employment/'

export default {
    getEmployableRoles(params) {
        return httpRequest.post(path + 'getEmployableRoles', params)
    },
    getBrandInfo(params) {
        return httpRequest.post(path + 'getBrandInfo', params)
    },
    getRoleName(params) {
        return httpRequest.post(path + 'getRoleName', params)
    },
    getAuditList(params) {
        return httpRequest.post(path + 'getAuditList', params)
    },
    getAuditInfo(params) {
        return httpRequest.post(path + 'getAuditInfo', params)
    },
    passAudit(params) {
        return httpRequest.post(path + 'passAudit', params)
    },
    rejectAudit(params) {
        return httpRequest.post(path + 'rejectAudit', params)
    }
}