export function configRouter(router) {
    router.map({
        '/': {
            component: require('../components/WapMain.vue'),
            subRoutes: {
                'index': {
                    component: require('../components/example1.vue')
                },
                'example2': {
                    component: require('../components/example2.vue')
                },
                'login': {
                    component: require('../components/LoginPage.vue')
                },
                'regist': {
                    component: require('../components/RegistPage.vue')
                },
                'changepwd': {
                    component: require('../components/ChangeUserPassword.vue')
                }
            }
        },
        '/admin': {
            component: require('../components/Master.vue'),
            subRoutes: {
                'RBACManagement': {
                    component: require('../components/RBACManagement.vue'),
                    subRoutes: {
                        'User': {
                            component: require('../components/UserSetting.vue')
                        },
                        'Role': {
                            component: require('../components/RoleSetting.vue')
                        },
                        'Permission': {
                            component: require('../components/PermissionSetting.vue')
                        }
                    }
                }
            }
        }
    })

    router.redirect({
        '/': '/index'
    })
}