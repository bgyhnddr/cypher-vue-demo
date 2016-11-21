var httpRequest = require('../extend/http-request')
var path = '/service/private/employment/'

export default {
    getEmployableRoles(params) {
        return httpRequest.post(path + 'getEmployableRoles', params)
    },
    getBrandInfo() {
        return httpRequest.post(path + 'getBrandInfo')
    },
    getRoleName(params) {
        return httpRequest.post(path + 'getRoleName', params)
    },
    getAgentInfo() {
        return httpRequest.post(path + 'getAgentInfo')
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
    getCurrentList(params) {
        return httpRequest.post(path + 'getCurrentList', params)
    },
    closeOverduePublishEmployment(params) {
        return httpRequest.post(path + 'closeOverduePublishEmployment', params)
    },
    getCurrentInfo(params) {
        return httpRequest.post(path + 'getCurrentInfo', params)
    },
    closeEmployment(params) {
        return httpRequest.post(path + 'closeEmployment', params)
    },
    getPublishEmploymentInfo(params) {
        return httpRequest.post(path + 'getPublishEmploymentInfo', params)
    },
    getEmploymentInfo() {
        return httpRequest.post(path + 'getEmploymentInfo')
    },
}
