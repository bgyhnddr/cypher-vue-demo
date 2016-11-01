var httpRequest = require('../extend/http-request')
var path = '/service/public/applyEmployment/'

export default {
    getBrandInfo(params) {
        return httpRequest.post(path + 'getBrandInfo', params)
    },
    submitApplication(params) {
        return httpRequest.post(path + 'submitApplication', params)
    }
}