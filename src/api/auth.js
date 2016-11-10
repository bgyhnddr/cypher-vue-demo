var httpRequest = require('../extend/http-request')
var path = '/service/public/auth/'

export default {
    login(params) {
        return httpRequest.post(path + 'login', params)
    },
    logout() {
        return httpRequest.post(path + 'logout')
    },
    getUser() {
        return httpRequest.get(path + 'getUser')
    },
    regist(params) {
        return httpRequest.post(path + 'regist', params)
    },
    changeuserpwd(params) {
        return httpRequest.post(path + 'changeuserpwd', params)
    },
    CheckUserBrand() {
        return httpRequest.post(path + 'CheckUserBrand')
    }
}