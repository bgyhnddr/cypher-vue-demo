var httpRequest = require('../extend/http-request')
var path = '/service/private/changeUserInfo/'

export default {
    checkPwd(params) {
        return httpRequest.post(path + 'checkPwd', params)
    },
    changeWechat(params) {
        return httpRequest.post(path + 'changeWechat', params)
    },
    changeCellphone(params) {
        return httpRequest.post(path + 'changeCellphone', params)
    },
    getCheckPwdSession() {
        return httpRequest.post(path + 'getCheckPwdSession')
    },
}
