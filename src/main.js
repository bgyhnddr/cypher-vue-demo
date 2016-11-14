import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import { configRouter } from './vue-router/route-config'
import { disableHistoryBack } from './extend/disable-history-back'
import { dateformat } from './extend/date-format'

import timei from './extend/vue-resource-timeout'
import authCallback from './extend/auth-callback'

import authAPI from './api/auth'
import checkPermission from './extend/check-permission'

Vue.use(require('vue-resource'))
Vue.http.interceptors.push(timei)
Vue.http.interceptors.push(authCallback)
dateformat()
disableHistoryBack()

window.state = {
    userInfo: { name: "", permissions: [] },
    showLoginModal: false
}

window.actions = {
        logout: function() {
            window.state.userInfo = { name: "", permissions: [] }
        }
    }
    /* eslint-disable no-new */
Vue.use(VueRouter)

const router = new VueRouter({
    history: true
})

configRouter(router)

router.beforeEach((tran) => {
    var path = tran.to.path
    var name = tran.to.name

    function CheckInfo() {
        if (checkPermission(['agentInfo', 'employment'])) {
            authAPI.CheckUserBrand().then(function(result) {
                if (result) {
                    tran.next()
                } else {
                    window.alert('品牌权限不足')
                    router.go({ path: path.replace(path, '/index') })
                }
            })

        } else {
            window.alert('权限不足')
            router.go({ path: path.replace(path, '/index') })
        }
    }
    authAPI.getUser().then(function(result) {
            window.state.userInfo = { name: result.name, permissions: result.permissions }
            if (result.name) {
                if (path.split('/')[1] == "employManagement") {
                    console.log(path.split('/')[2])
                    switch ((path.split('/')[2])) {
                        case undefined:
                        case "chooseEmployableRoles":
                        case "audit":
                        case "auditInfo":
                        case "employmentHistory":
                        case "currentList":
                        case "currentInfo":
                            CheckInfo()
                            break
                    }
                } else if (path.split('/')[1] == "accountManagement") {
                    switch (path.split('/')[2]) {
                        case undefined:
                        case "MyCertificate":
                        case "CertificateInfo":
                        case "checkPwd":
                        case "changeWechat":
                            tran.next()
                            break
                    }
                } else if (path.split('/')[1] == "homePage") {
                    switch (path.split('/')[2]) {
                        case undefined:
                        case "search":
                            CheckInfo()
                            break
                    }
                } else if (path.split('/')[1] == "auth") {
                    switch (path.split('/')[2]) {
                        case "login":
                            router.go('homePage')
                            break
                        case "changepwd":
                            tran.next()
                            break
                    }
                } else if (path == '/index') {
                    router.go('homePage')
                }
            } else {
                if (path == '/index' || path == '/auth/login') {
                    tran.next()
                } else {
                    router.go({ path: path.replace(path, '/index') })
                }
            }
        })
        //测试
    if (name == "BrandAuthorization" || name == "FillInEmployment" || name == "EmploymentSubmission") {
        tran.next()
    }
})

router.start(App, 'app');