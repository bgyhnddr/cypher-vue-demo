var httpRequest = require('../extend/http-request')
var path = '/service/public/sendSMS/'

export default {
    SendVerificationCode(params) {
        return httpRequest.post(path + 'SendVerificationCode', params)
    },
    SendSMS(params) {
        return httpRequest.post(path + 'SendSMS', params)
    },
    GetBalance() {
        return httpRequest.post(path + 'GetBalance', params)
    }
}
