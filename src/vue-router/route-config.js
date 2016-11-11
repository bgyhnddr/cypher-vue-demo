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
                'changepwd': {
                    component: require('../components/ChangeUserPassword.vue')
                },
                'PhoneVerification/:locate': {
                    name:"PhoneVerification",
                    component: require('../components/PhoneVerification.vue')
                }
            }
        },
        '/homePage': {
            component: require('../components/WapMain.vue'),
            subRoutes: {
                '': {
                    component: require('../components/HomePage.vue')
                },
                'search/:keyword': {
                    name: 'HomePageSearch',
                    component: require('../components/HomePageSearch.vue')
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
                'brandAuthorization/:account/:employableRole/:brandName': {
                    name: 'BrandAuthorization',
                    component: require('../components/BrandAuthorization.vue')
                },
                'fillInEmployment/:employmentGuid/:brandName': {
                    name: 'FillInEmployment',
                    component: require('../components/FillInEmployment.vue')
                },
                'employmentSubmission/:brandName': {
                    name: 'EmploymentSubmission',
                    component: require('../components/EmploymentSubmission.vue')
                },
                'audit': {
                    component: require('../components/AuditList.vue')
                },
                'auditInfo/:account/:employmentID/:brandID/:locate': {
                    name: "AuditInfo",
                    component: require('../components/AuditInfo.vue')
                },
                'employmentHistory': {
                    component: require('../components/EmploymentHistory.vue')
                }

            }
        },
        '/accountManagement': {
            component: function(reslove) {
                return require(['../components/WapMain.vue'], reslove)
            },
            subRoutes: {
                '': {
                    component: require('../components/AccountIndex.vue')
                },
                'MyCertificate/:account/:locate': {
                    name: "MyCertificate",
                    component: require('../components/MyCertificate.vue')
                },
                'CertificateInfo/:account/:locate': {
                    name: "CertificateInfo",
                    component: require('../components/CertificateInfo.vue')
                }
            }
        }

    })

    router.redirect({
        '/': '/index'
    })
}