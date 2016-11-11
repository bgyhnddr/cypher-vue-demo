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
    getAgentInfo(params) {
        return httpRequest.post(path + 'getAgentInfo', params)
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
    },
    getAuditHistory(params) {
        return httpRequest.post(path + 'getAuditHistory', params)
    },
    createEmployment(params) {
        return httpRequest.post(path + 'createEmployment', params)
    },
    changeHeadImg(params) {
        return httpRequest.post(path + 'changeHeadImg', params)
    },
    getCurrentEmploymentList(params) {
        return httpRequest.post(path + 'getCurrentEmploymentList', params)
    },
    CloseOverduePublishEmployemnt(params) {
        return httpRequest.post(path + 'CloseOverduePublishEmployemnt', params)
    }
}