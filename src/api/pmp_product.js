var httpRequest = require('../extend/http-request')
var path = '/pmp/product/' //full path:  /pmp/product/getProducts/123
var token = '/123'

export default {
    getProducts(params) {
        return httpRequest.get(path + 'getProducts' + token, params)
    },
    getProduct(params) {
        return httpRequest.get(path + 'getProduct' + token, params)
    },
    getLabels() {
        return httpRequest.get(path + 'getLabels' + token)
    },
    deleteLabels(params) {
        return httpRequest.post(path + 'deleteLabels' + token, params)
    },
    getBrandRoles() {
        return httpRequest.get(path + 'getBrandRoles' + token)
    },
    getSpecificationOptions() {
        return httpRequest.get(path + 'getSpecificationOptions' + token)
    },
    submitProduct(params) {
        return httpRequest.post(path + 'submitProduct' + token, params)
    },
}
