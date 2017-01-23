require('../../src/extend/date-format').dateformat()

var exec = {
  getBrandInfo(req, res, next) {
    var user_account = req.body.user_account

    var agent = require('../../db/models/agent')
    var agent_brand_role = require('../../db/models/agent_brand_role')
    var brand_role = require('../../db/models/brand_role')
    var brand = require('../../db/models/brand')
    var brand_detail = require('../../db/models/brand_detail')

    brand.hasOne(brand_role)
    brand_role.hasOne(agent_brand_role)
    agent_brand_role.belongsTo(agent)
    brand.hasMany(brand_detail)

    return brand.findOne({
      include: [{
        model: brand_role,
        include: [{
          model: agent_brand_role,
          include: [{
            model: agent,
            where: {
              user_account: user_account
            },
          }],
        }],
      }, {
        model: brand_detail
      }]
    }).then(function(result) {
      if (result == null) {
        return Promise.reject("找不到您的品牌商资料")
      } else {
        return result
      }
    })
  },
  getAgentDetail(req, res, next) {
    var account = req.body.account
    var role = req.body.role
    var locate = req.body.locate
    var employment = require('../../db/models/employment')
    var employment_term = require('../../db/models/employment_term')
    var user = require('../../db/models/user')
    var brand = require('../../db/models/brand')
    var brand_role = require('../../db/models/brand_role')
    var agent = require('../../db/models/agent')
    var agent_brand_role = require('../../db/models/agent_brand_role')
    var agent_detail = require('../../db/models/agent_detail')
    var team = require('../../db/models/team')
    var team_agent = require('../../db/models/team_agent')
    var frozen_agent = require('../../db/models/frozen_agent')

    employment.belongsTo(brand)
    employment.belongsTo(brand_role)

    user.hasMany(employment, {
      foreignKey: "employee_user_account"
    })

    agent.hasMany(agent_detail)
    agent.hasOne(agent_brand_role)
    agent_brand_role.belongsTo(brand_role)
    agent.belongsTo(user)
    agent.hasOne(employment_term)
    agent.hasOne(team_agent)
    agent.hasOne(frozen_agent)
    team_agent.belongsTo(team, {
      foreignKey: "team_code"
    })
    user.hasOne(agent)

    employment.belongsTo(user, {
        foreignKey: "employer_user_account"
      })
      //关联团队数据
    return agent.findOne({
      where: {
        user_account: account
      },
      include: [agent_detail,frozen_agent,
        employment_term, {
          model: team_agent,
          include: team
        }, {
          model: agent_brand_role,
          include: brand_role
        }, {
          model: user,
          include: {
            model: employment,
            where: {
              status: '已审核',
              audit_result: '已通过'
            },
            include: [brand, {
              model: user,
              include: {
                model: agent,
                include: agent_detail
              }
            }]
          }
        }
      ]
    }).then((result) => {
      var obj = result.toJSON()
      obj.agent_detail = {}
      obj.agent_details.forEach((d) => {
        obj.agent_detail[d.key] = d.value
      })
      obj.user.employment = obj.user.employments[0]
      obj.user.employment.user.agent.agent_detail = {}
      obj.user.employments[0].user.agent.agent_details.forEach((d) => {
        obj.user.employment.user.agent.agent_detail[d.key] = d.value
      })

      delete obj.agent_details
      delete obj.user.employments[0].user.agent.agent_details
      return obj
    })
  },
  getBrandDetail(req, res, next) {
    var account = req.body.account
    var user = require('../../db/models/user')
    var brand = require('../../db/models/brand')
    var brand_role = require('../../db/models/brand_role')
    var agent = require('../../db/models/agent')
    var agent_brand_role = require('../../db/models/agent_brand_role')
    var agent_detail = require('../../db/models/agent_detail')

    agent.hasMany(agent_detail)
    agent.hasOne(agent_brand_role)
    agent_brand_role.belongsTo(brand_role)
    agent.belongsTo(user)
    user.hasOne(agent)
    brand_role.belongsTo(brand)

    return agent.findOne({
      where: {
        user_account: account
      },
      include: [agent_detail, user, {
        model: agent_brand_role,
        include: {
          model: brand_role,
          include: brand
        }
      }]
    }).then((result) => {
      var obj = result.toJSON()
      obj.agent_detail = {}
      obj.agent_details.forEach((d) => {
        obj.agent_detail[d.key] = d.value
      })
      delete obj.agent_details
      return obj
    })
  },
  getRoleName(req, res, next) {
    var brand_guid = req.body.brand_guid
    var brand_role_code = req.body.brand_role_code

    var brand_role = require('../../db/models/brand_role')

    return brand_role.findOne({
      where: {
        brand_guid: brand_guid,
        code: brand_role_code
      }
    }).then(function(result) {
      if (result == null) {
        return Promise.reject("品牌商角色读取出错")
      } else {
        return result
      }
    })

  },
  getAgentInfo(req, res, next) {
    var user_account = req.body.user_account

    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')

    agent.hasMany(agent_detail)

    return agent.findOne({
      where: {
        user_account: user_account
      },
      include: [{
        model: agent_detail
      }]
    }).then(function(result) {
      if (result == null) {
        return Promise.reject("上级授权角色资料读取出错")
      } else {
        return result
      }
    })
  },
  submitApplication(req, res, next) {
    var meta = req.body.meta
    var data = req.body.data
    var employmentData = req.body.employmentData
    var deadline = req.body.deadline
    var publishEmploymentGuid = req.body.publishEmploymentGuid

    var uuid = require('node-uuid')
    var guid = uuid.v1()

    var employment = require('../../db/models/employment')
    var employment_detail = require('../../db/models/employment_detail')
    var brand_role = require('../../db/models/brand_role')
    var user = require('../../db/models/user')
    var user_role = require('../../db/models/user_role')
    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')
    var agent_brand_role = require('../../db/models/agent_brand_role')
    var sequelize = require('../../db/sequelize')
    var publish_employment = require('../../db/models/publish_employment')

    agent.hasOne(agent_brand_role)
    agent_brand_role.belongsTo(brand_role)
    employment.hasMany(employment_detail)

    return Promise.all([
      //查找是否已提交招募申请,未通过
      employment.findOne({
        include: [{
          model: employment_detail,
          where: {
            $or: [{
              key: "cellphone",
              value: data.cellphone
            }, {
              key: "wechat",
              value: data.wechat
            }]
          },
        }],
        where: {
          status: "未审核"
        }
      }),
      //查找是否已注册成为代理
      agent_detail.findOne({
        where: {
          $or: [{
            key: "cellphone",
            value: data.cellphone
          }, {
            key: "wechat",
            value: data.wechat
          }]
        }
      }),

      //查找品牌商account
      agent.findOne({
        include: [{
          model: agent_brand_role,
          include: [{
            model: brand_role,
            where: {
              level: "0"
            },
          }],
        }]
      }),

      //查找发起招募信息
      publish_employment.findOne({
        where: {
          guid: publishEmploymentGuid
        }
      })
    ]).then(function(result) {
      var overtime = false

      if (result[3] != null) {
        var startDate = new Date(result[2].create_time)
        if (new Date() - startDate > 2 * 3600 * 1000) {
          overtime = true
        }
      }

      if (result[0] != null) {
        return Promise.reject("您已提交申请或已成为该品牌成员，申请失败")
      } else if (result[1] != null) {
        return Promise.reject("您已提交申请或已成为该品牌成员，申请失败")
      } else if (result[2] == null) {
        return Promise.reject("招募信息读取出错")
      } else if (result[3] == null) {
        return Promise.reject("招募信息读取出错")
      } else if (result[3].status == false || overtime) {
        return Promise.reject("招募已关闭，请关闭本页面")
      }

      var pwd = "";
      for (var i = 0; i < 8; i++) {
        pwd += Math.floor(Math.random() * 10);
      }

      var audit_user_account = result[2].user_account

      return sequelize.transaction().then(function(t) {
        return Promise.all([
          user.create({
            account: guid,
            password: pwd
          }, {
            transaction: t
          }),
          user_role.create({
            user_account: guid,
            role_code: 'user'
          }, {
            transaction: t
          }),
          employment.create({
            publish_employment_guid: employmentData.publishEmploymentInfo.guid,
            employer_user_account: employmentData.publishEmploymentInfo.employer_user_account,
            brand_role_code: employmentData.publishEmploymentInfo.brand_role_code,
            brand_guid: employmentData.publishEmploymentInfo.brand_guid,
            employee_user_account: guid,
            employer_time: new Date().Format('yyyy-MM-dd hh:mm'),
            audit_user_account: audit_user_account,
            status: "未审核"
          }, {
            transaction: t
          }).then(function(result){
            employment_detail.bulkCreate([{
              employment_guid: result.guid,
              key: 'headImg',
              value: data['headImg']
            }, {
              employment_guid: result.guid,
              key: 'name',
              value: data['name']
            }, {
              employment_guid: result.guid,
              key: 'wechat',
              value: data['wechat']
            }, {
              employment_guid: result.guid,
              key: 'cellphone',
              value: data['cellphone']
            }, {
              employment_guid: result.guid,
              key: 'IDType',
              value: data['IDType']
            }, {
              employment_guid: result.guid,
              key: 'IDNumber',
              value: data['IDNumber']
            }, {
              employment_guid: result.guid,
              key: 'address',
              value: data['address']
            }, {
              employment_guid: result.guid,
              key: 'addressDetail',
              value: data['addressDetail']
            }], {
              transaction: t
            })
          })
        ]).then(function() {
          t.commit()
          req.session.pwd = pwd
          return true
        }).catch(function(err) {
          // err 是事务回调中使用promise链中的异常结果
          t.rollback()
          return Promise.reject("后台数据添加异常，申请失败")
        })

      })

    })
  },
  getPwd(req, res, next) {
    return req.session.pwd
  },
  getPublishEmploymentInfo(req, res, next) {
    var employmentGuid = req.body.employmentGuid

    var publish_employment = require('../../db/models/publish_employment')

    return publish_employment.findOne({
      where: {
        guid: employmentGuid
      }
    }).then(function(result) {
      if (result == null) {
        return Promise.reject("招募信息读取出错")
      } else {
        var startDate = new Date(result.create_time)
        result.status = result.status && (new Date() - startDate <= 2 * 3600 * 1000)
        return result
      }
    })

  },
  checkBeforeSubmit(req, res, next) {
    var meta = req.body.meta
    var data = req.body.data
    var publishEmploymentGuid = req.body.publishEmploymentGuid

    var employment = require('../../db/models/employment')
    var employment_detail = require('../../db/models/employment_detail')
    var agent_detail = require('../../db/models/agent_detail')
    var publish_employment = require('../../db/models/publish_employment')

    employment.hasMany(employment_detail)

    return Promise.all([
      //查找是否已提交招募申请,未通过
      employment.findOne({
        include: [{
          model: employment_detail,
          where: {
            $or: [{
              key: "cellphone",
              value: data.cellphone
            }, {
              key: "wechat",
              value: data.wechat
            }]
          },
        }],
        where: {
          status: "未审核"
        }
      }),
      //查找是否已注册成为代理
      agent_detail.findOne({
        where: {
          $or: [{
            key: "cellphone",
            value: data.cellphone
          }, {
            key: "wechat",
            value: data.wechat
          }]
        }
      }),

      //查找发起招募信息
      publish_employment.findOne({
        where: {
          guid: publishEmploymentGuid
        }
      })
    ]).then(function(result) {
      var overtime = false

      if (result[2] != null) {
        var startDate = new Date(result[2].create_time)
        if (new Date() - startDate > 2 * 3600 * 1000) {
          overtime = true
        }
      }

      if (result[0] != null) {
        return Promise.reject("您已提交申请或已成为该品牌成员，申请失败")
      } else if (result[1] != null) {
        return Promise.reject("您已提交申请或已成为该品牌成员，申请失败")
      } else if (result[2] == null) {
        return Promise.reject("招募信息读取出错")
      } else if (result[2].status == false || overtime) {
        return Promise.reject("招募已关闭，请关闭本页面")
      }
      return true

    })
  }
}

module.exports = (req, res, next) => {
  var action = req.params.action
  Promise.resolve(action).then(function(result) {
    return exec[result](req, res, next)
  }).then(function(result) {
    res.send(result)
  }).catch(function(error) {
    res.status(500).send(error.toString())
  })
}
