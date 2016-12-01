var httpRequest = require('../extend/http-request')
var path = '/service/public/applyEmployment/'

export default {
    getBrandInfo(params) {
        return httpRequest.post(path + 'getBrandInfo', params)
    },
    getRoleName(params) {
        return httpRequest.post(path + 'getRoleName', params)
    },
    submitApplication(params) {
        return httpRequest.post(path + 'submitApplication', params)
    },
    getPwd() {
        return httpRequest.post(path + 'getPwd')
    },
    getAgentInfo(params) {
        return httpRequest.post(path + 'getAgentInfo', params)
    },
    getPublishEmploymentInfo(params) {
        return httpRequest.post(path + 'getPublishEmploymentInfo', params)
    },
    checkBeforeSubmit(params) {
        return httpRequest.post(path + 'checkBeforeSubmit', params)
    },
    getAgentDetail(params) {
        return httpRequest.post(path + 'getAgentDetail', params)
    },
    getBrandDetail(params) {
        return httpRequest.post(path + 'getBrandDetail', params)
    },
}
