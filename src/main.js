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
    authAPI.getUser().then(function(result) {
        window.state.userInfo = { name: result.name, permissions: result.permissions }
        if (result.name) {
            switch (path.split('?')[0]) {
                case "/employManagement":
                case "/employManagement/audit":
                case "/employManagement/auditInfo":
                case "/employManagement/employmentHistory":
                case "/employManagement/chooseEmployableRoles":
                case "/employManagement/brandAuthorization/:account/:employableRole/:brandName":
                    if (checkPermission(['agentInfo', 'employment'])) {
                        authAPI.CheckUserBrand().then(function(result) {
                            if (result) {
                                tran.next()
                            } else {
                                window.alert('权限不足')
                                router.go({ path: path.replace(path, '/index') })
                            }
                        })

                    } else {
                        window.alert('权限不足')
                        router.go({ path: path.replace(path, '/index') })
                    }
                    break
                case "/index":
                case "/auth/login":
                    router.go('employManagement')
                    break
            }
        } else {
            if (path == '/index' || path == '/auth/login') {
                tran.next()
            } else {
                router.go({ path: path.replace(path, '/index') })
            }
        }
    })
    if (path == "/employManagement/fillInEmployment/:employmentGuid/:brandName" || path == "/employManagement/employmentSubmission/:brandName") {
        tran.next()
    }
})

router.start(App, 'app');