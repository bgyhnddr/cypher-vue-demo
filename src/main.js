
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import {
  configRouter
} from './vue-router/route-config'
import {
  disableHistoryBack
} from './extend/disable-history-back'
import {
  dateformat
} from './extend/date-format'

import timei from './extend/vue-resource-timeout'
import authCallback from './extend/auth-callback'

import authAPI from './api/auth'
import checkPermission from './extend/check-permission'


Vue.use(require('vue-resource'))
Vue.http.interceptors.push(timei)
Vue.http.interceptors.push(authCallback)
dateformat()
disableHistoryBack()

var attachFastClick = require('fastclick')
attachFastClick.attach(document.body)

window.state = {
  userInfo: {
    name: "",
    permissions: []
  },
  showLoginModal: false
}

window.actions = {
    logout: function() {
      window.state.userInfo = {
        name: "",
        permissions: []
      }
    }
  }
  /* eslint-disable no-new */
Vue.use(VueRouter)

const router = new VueRouter({
  history: false
})

configRouter(router)

router.beforeEach((tran) => {
  var path = tran.to.path
  var name = tran.to.name

  var FirstPath = path.split('/')[1]
  var SecPath = path.split('/')[2]

  if (FirstPath == "employManagement") {
    switch (SecPath) {
      case "fillInEmployment":
      case "employmentSubmission":
      case "brandAuthorization":
        tran.next()
        return
    }
  } else if (FirstPath == "auth") {
    switch (SecPath) {
      case "PhoneVerification":
      case "resetpwd":
      case "SuccessPage":
        tran.next()
        return
    }
  } else if (FirstPath == "saleManagement") {
    switch (SecPath) {
      case "sale":
        tran.next()
        return
    }
  } else if (FirstPath == "accountManagement") {
    switch (SecPath) {
      case "CertificateInfo":
        tran.next()
        return
    }
  } else if (FirstPath == "test") {
    tran.next()
    return
  }

  function CheckInfo() {
    if (checkPermission(['agentInfo', 'employment'])) {
      authAPI.CheckUserBrand().then(function(result) {
        if (result) {
          tran.next()
        } else {
          window.alert('品牌权限不足')
          router.go({
            path: path.replace(path, '/index')
          })
        }
      })

    } else {
      window.alert('权限不足')
      router.go({
        path: path.replace(path, '/index')
      })
    }
  }

  authAPI.getUser().then(function(result) {
    window.state.userInfo = {
      name: result.name,
      permissions: result.permissions
    }
    if (result.name) {
      if (FirstPath == "employManagement") {
        switch (SecPath) {
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
      } else if (FirstPath == "accountManagement") {
        switch (SecPath) {
          case undefined:
          case "MyCertificate":
          case "checkPwd":
          case "changeWechat":
          case "changeCellPhone":
            tran.next()
            break
        }
      } else if (FirstPath == "homePage") {
        switch (SecPath) {
          case undefined:
          case "search":
            CheckInfo()
            break
        }
      } else if (FirstPath == "auth") {
        switch (SecPath) {
          case "login":
            router.go('homePage')
            break
          case "changepwd":
            tran.next()
            break

        }
      } else if (FirstPath == "MyProduct") {
        tran.next()
      } else if (path == '/index') {
        router.go('homePage')
      }
    } else {
      if (path == '/index' || path == '/auth/login') {
        tran.next()
      } else {
        router.go({
          path: path.replace(path, '/index')
        })
      }
    }
  })
})

router.start(App, 'app')

var request = require('./extend/http-request')
request.post('/wechat/getJsConfig', {
  list: ['scanQRCode', 'chooseImage', 'uploadImage'],
  url: window.location.href.split('#')[0]
}).then((result) => {
  window.wx.config(result)
  window.wx.error(function(res) {
    console.alert(JSON.stringify(res))
  })
}).catch((err) => {
  window.alert(err)
})
