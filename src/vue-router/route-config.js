export function configRouter(router) {
    router.map({
        '/': {
            component: require('../components/WapMain.vue'),
            subRoutes: {
                'index': {
                    component: require('../components/LoginPage.vue')
                },
                'example2': {
                    component: require('../components/example2.vue')
                },
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
                },
                'employManagement': {
                    component: require('../components/EmploymentIndex.vue')
                },
                'chooseEmployableRoles': {
                    component: require('../components/ChooseEmployableRoles.vue')
                },
                'brandAuthorization': {
                    component: require('../components/BrandAuthorization.vue')
                }
            }
        },
        '/auth': {
            component: require('../components/WapMain.vue'),
            subRoutes: {
                'login': {
                    component: require('../components/LoginPage.vue')
                },
                'regist': {
                    component: require('../components/RegistPage.vue')
                },
                'changepwd': {
                    component: require('../components/ChangeUserPassword.vue')
                },
                'test': {
                    component: require('../components/testPage.vue')
                },
            }
        },
        '/employManagement': {
            component: require('../components/WapMain.vue'),
            subRoutes: {
                '': {
                    component: require('../components/EmploymentIndex.vue')
                },
                'index': {
                    component: require('../components/EmploymentIndex.vue')
                },
                'chooseEmployableRoles': {
                    component: require('../components/ChooseEmployableRoles.vue')
                },
                'brandAuthorization': {
                    name: 'BrandAuthorization',
                    component: require('../components/BrandAuthorization.vue')
                },
                'audit': {
                    component: require('../components/AuditList.vue')
                },
                'auditInfo': {
                    component: require('../components/AuditInfo.vue')
                }
            }
        }

    })

    router.redirect({
        '/': '/index'
    })
}