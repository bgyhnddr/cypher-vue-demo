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
            component: function(reslove) {
                return require(['../components/Master.vue'], reslove)
            },
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
            component: function(reslove) {
                return require(['../components/WapMain.vue'], reslove)
            },
            subRoutes: {
                '': {
                    component: require('../components/EmploymentIndex.vue')
                },
                'chooseEmployableRoles': {
                    component: require('../components/ChooseEmployableRoles.vue')
                },
                'brandAuthorization/:account/:employableRole/:startTime': {
                    name: 'BrandAuthorization',
                    component: require('../components/BrandAuthorization.vue')
                },
                'fillInEmployment/:account/:employableRole/:startTime': {
                    component: require('../components/FillInEmployment.vue')
                },
                'audit': {
                    component: require('../components/AuditList.vue')
                },
                'auditInfo': {
                    component: require('../components/AuditInfo.vue')
                }
            }
        },
        '/test': {
            component: require('../components/Test.vue')
        }

    })

    router.redirect({
        '/': '/index'
    })
}