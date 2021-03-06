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
          name: "PhoneVerification",
          component: require('../components/PhoneVerification.vue')
        },
        'resetpwd/:locate': {
          name: "resetpwd",
          component: require('../components/ResetUserPassword.vue')
        },
        'SuccessPage': {
          name: "SuccessPage",
          component: require('../components/SuccessPage.vue')
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
        'brandAuthorization/:publishEmploymentID': {
          name: 'BrandAuthorization',
          component: require('../components/BrandAuthorization.vue')
        },
        'fillInEmployment/:publishEmploymentID': {
          name: 'FillInEmployment',
          component: require('../components/FillInEmployment.vue')
        },
        'employmentSubmission': {
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
        },
        'currentList': {
          component: require('../components/CurrentEmploymentList.vue')
        },
        'currentInfo/:guid': {
          name: "CurrentInfo",
          component: require('../components/CurrentEmploymentInfo.vue')
        }


      }
    },
    '/saleManagement': {
      component: require('../components/WapMain.vue'),
      subRoutes: {
        'sale/:packcode': {
          name: "SaleProduct",
          component: require('../components/SaleProduct.vue')
        }
      }
    },
    '/accountManagement': {
      component: require('../components/WapMain.vue'),
      subRoutes: {
        '': {
          component: require('../components/AccountIndex.vue')
        },
        'MyCertificate/:account/:locate': {
          name: "MyCertificate",
          component: require('../components/MyCertificate.vue')
        },
        'CertificateInfo/:account/:locate/:employmentID/:brandID/:from': {
          name: "CertificateInfo",
          component: require('../components/CertificateInfo.vue')
        },
        'checkPwd/:from': {
          name: "CheckPwd",
          component: require('../components/CheckPwd.vue')
        },
        'changeWechat': {
          component: require('../components/ChangeWechat.vue')
        },
        'changeCellPhone': {
          component: require('../components/ChangeCellPhone.vue')
        }
      }
    },
    '/productManagement/productSetting': {
      component: require('../components/PMP/ProductSetting.vue')
    },
    '/productManagement/editProductSearch': {
      component: require('../components/PMP/EditProductSearch.vue')
    },
    '/productManagement/linkProductToQRCode': {
      component: require('../components/PMP/LinkProductToQRCode.vue')
    },
    '/productManagement/linkProductToQRCodeSearch': {
      component: require('../components/PMP/LinkProductToQRCodeSearch.vue')
    },
    '/productManagement/productRelate/:id': {
      component: require('../components/PMP/ProductRelate.vue')
    },
    '/productManagement/editProduct': {
      component: require('../components/PMP/EditProduct.vue')
    },
    '/productManagement/editProduct/:id': {
      component: require('../components/PMP/EditProduct.vue')
    },
    '/productManagement': {
      component: require('../components/PMP/ProductManagement.vue')
    },
    '/teamManagement': {
      component: require('../components/TEAM/TeamManagement.vue')
    },
    '/teamManagement/frozenMember/:code': {
      component: require('../components/TEAM/FrozenMember.vue')
    },
    '/teamManagement/frozenAgent/:account/:from': {
      component: require('../components/TEAM/FrozenAgent.vue')
    },
    '/teamManagement/forzenLevelList': {
      component: require('../components/TEAM/ForzenLevelList.vue')
    },
    '/teamManagement/promoteLevelList': {
      component: require('../components/TEAM/PromoteLevelList.vue')
    },
    '/teamManagement/promoteAgent/:account': {
      component: require('../components/TEAM/PromoteAgent.vue')
    },
    '/teamManagement/promotionAuditList': {
      component: require('../components/TEAM/PromotionAuditList.vue')
    },
    '/teamManagement/promotionAgentInfo/:account': {
      component: require('../components/TEAM/PromotionAgentInfo.vue')
    },
    '/teamManagement/choosePromoteRole/:account': {
      component: require('../components/TEAM/ChoosePromoteRole.vue')
    },
    '/teamManagement/promoteShare/:agentPromotionGuid': {
      component: require('../components/TEAM/PromoteShare.vue')
    },
    '/teamManagement/promoteApplication/:agentPromotionGuid': {
      component: require('../components/TEAM/PromoteApplication.vue')
    },
    '/test': {
      component: require('../components/Test.vue')
    }

  })

  router.redirect({
    '/': '/index'
  })
}
