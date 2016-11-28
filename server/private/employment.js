var getTeamNum = () => {
  var team_num = require('../../db/models/team_num')

  function mkcode(n) {
    var n3 = n % 17576
    var a3 = Math.floor(n3 / 676)
    var n2 = n3 - a3 * 676
    var a2 = Math.floor(n2 / 26)
    var n1 = n2 - a2 * 26
    var a1 = Math.floor(n1)
    return ((10 + a3).toString(36) + (10 + a2).toString(36) + (10 + a1).toString(36)).toUpperCase()
  }

  return team_num.findOne({
    where: {
      id: 1
    }
  }).then((o) => {
    return Promise.all([
      team_num.update({
        num: o.num + 1
      }, {
        where: {
          id: 1
        }
      }),
      mkcode(o.num+1)
    ])
  })
}

var getTeamCode = (e) => {
  var agent = require('../../db/models/agent')
  var team_agent = require('../../db/models/team_agent')

  agent.hasOne(team_agent)

  return agent.findOne({
    where: {
      user_account: e
    },
    include: team_agent
  }).then((o) => {
    return Promise.all([
      team_agent.count({
        where:{
          team_code:o.team_agent.team_code
        }
      }),
      o.team_agent.team_code
    ])
    // return o.team_agent.team_code
  })
}
var exec = {
  getEmployableRoles(req, res, next) {
    var brand_role_code = req.body.brand_role_code

    var brand_role = require('../../db/models/brand_role')
    var employable_rule = require('../../db/models/employable_rule')

    employable_rule.belongsTo(brand_role, {
      foreignKey: 'employable_brand_role_code',
      constraints: false
    })

    return employable_rule.findAll({
      where: {
        employer_brand_role_code: brand_role_code,
      },
      include: [{
        model: brand_role,
      }],
      order: [
        [{
          model: brand_role
        }, 'level', 'ASC']
      ]
    }).then(function(result) {
      return result
    })

  },
  getBrandInfo(req, res, next) {
    var user_account = req.session.userInfo.name

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
  getRoleName(req, res, next) {
    var brand_role_code = req.body.brand_role_code

    var brand_role = require('../../db/models/brand_role')

    return brand_role.findOne({
      where: {
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
    var user_account = req.session.userInfo.name

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
  getAuditList(req, res, next) {
    // return req.session.userInfo
    var userinfo = req.session.userInfo
    var employment = require('../../db/models/employment')
    var employment_detail = require('../../db/models/employment_detail')
    var brand_role = require('../../db/models/brand_role')
    var selectMsg = req.body.key
    var select = "employer_time desc"

    if (selectMsg != null) {
      switch (selectMsg) {
        case "timeasc":
          select = "employer_time asc"
          break
        case "timedesc":
          select = "employer_time desc"
          break
        case "leveldesc":
          select = "brand_role_code asc"
          break
        case "levelasc":
          select = "brand_role_code desc"
      }
    }

    employment.hasMany(employment_detail)
    employment.belongsTo(brand_role)

    if (userinfo) {
      var account = userinfo.name
      return employment.findAll({
        where: {
          audit_user_account: account,
          status: "未审核"
        },
        include: [{
          model: employment_detail
        }, {
          model: brand_role
        }],
        order: select
      })
    } else {
      return Promise.reject("请先登录")
    }
  },
  getAuditInfo(req, res, next) {
    var auditID = req.body.auditID
    var employment = require('../../db/models/employment')
    var user = require('../../db/models/user')
    var employment_detail = require('../../db/models/employment_detail')
    var brand = require('../../db/models/brand')
    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')

    employment.belongsTo(brand)
    employment.hasMany(employment_detail)
    employment.belongsTo(user, {
      foreignKey: "employer_user_account"
    })
    user.hasOne(agent)
    agent.hasMany(agent_detail)

    return employment.findOne({
      where: {
        guid: auditID
      },
      include: [brand,
        employment_detail, {
          model: user,
          include: {
            model: agent,
            include: agent_detail
          }
        }
      ]
    }).then((result) => {
      var obj = result.toJSON()
      obj.employment_detail = {}
      obj.employment_details.forEach((d) => {
        obj.employment_detail[d.key] = d.value
      })

      obj.user.agent.agent_detail = {}
      obj.user.agent.agent_details.forEach((d) => {
        obj.user.agent.agent_detail[d.key] = d.value
      })
      delete obj.employment_details
      delete obj.user.agent.agent_details
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

    employment.belongsTo(brand)
    employment.belongsTo(brand_role)

    user.hasOne(employment, {
      foreignKey: "employee_user_account"
    })

    agent.hasMany(agent_detail)
    agent.hasOne(agent_brand_role)
    agent_brand_role.belongsTo(brand_role)
    agent.belongsTo(user)
    agent.hasOne(employment_term)
    user.hasOne(agent)

    employment.belongsTo(user, {
      foreignKey: "employer_user_account"
    })

    return agent.findOne({
      where: {
        user_account: account
      },
      include: [agent_detail,
        employment_term, {
          model: agent_brand_role,
          include: brand_role
        }, {
          model: user,
          include: {
            model: employment,
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

      obj.user.employment.user.agent.agent_detail = {}
      obj.user.employment.user.agent.agent_details.forEach((d) => {
        obj.user.employment.user.agent.agent_detail[d.key] = d.value
      })

      delete obj.agent_details
      delete obj.user.employment.user.agent.agent_details
      return obj
    })
  },
  passAudit(req, res, next) {
    var auditID = req.body.auditID
    var termNum = req.body.termNum
    var employment = require('../../db/models/employment')
    var employment_term = require('../../db/models/employment_term')
    var employment_detail = require('../../db/models/employment_detail')
    var team = require('../../db/models/team')
    var team_agent = require('../../db/models/team_agent')
    var user = require('../../db/models/user')
    var user_role = require('../../db/models/user_role')
    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')
    var agent_brand_role = require('../../db/models/agent_brand_role')

    var uuid = require('node-uuid')
    var guid = uuid.v1()

    var createList
    var term

    var team
    var brand = 'B'

    employment_detail.belongsTo(employment)

    return employment.findOne({
      where: {
        guid: auditID
      },
      include: [{
        model: employment_detail
      }]
    }).then(function(result) {
      var date = new Date(result.employer_time)
      var year = parseInt(date.getFullYear())
      var month = parseInt(date.getMonth() + 1)
      var day = parseInt(date.getDate())

      if (termNum) {
        var val = parseInt(termNum)
        if (val > 12) {
          var num = parseInt(val / 12)
          if (!(val % 12)) {
            term = (year + (num)) + '-' + (month + val - 12 * (num)) + '-' + day
          } else {
            term = (year + (num + 1)) + '-' + (month + val - 12 * (num + 1)) + '-' + day
          }
        } else if (month + val > 12) {
          term = (year + 1) + '-' + (month + val - 12) + '-' + day
        } else {
          term = year + '-' + (month + val) + '-' + day
        }
      }

      for (var item in result.employment_details) {
        createList = agent_detail.create({
          //guid test
          agent_guid: guid,
          key: result.employment_details[item]['key'],
          value: result.employment_details[item]['value']
        })
      }

      if (result.brand_role_code == 'brand_role2') {
        getTeamNum().then((o) => {
          team = team.create({
            brand: brand,
            code: o[1]
          })
          team_agent = team_agent.create({
            agent_guid: guid,
            team_code: o[1],
            num: '0001'
          })
        })
      } else {
        getTeamCode(result.employer_user_account).then((o) => {
            var num = (o[0]+1)
            var initNum = '0000'
            var countNum = initNum.substring(0,((initNum.length)-(num.toString().length)))+num

            team_agent = team_agent.create({
              agent_guid: guid,
              team_code: o[1],
              num: countNum
            })
        })
      }
      return Promise.all([
        employment_term.create({
          agent_guid: guid,
          term_from: year + '-' + month + '-' + day,
          term_to: term
        }),
        agent.create({
          user_account: result.employee_user_account,
          guid: guid
        }),
        agent_brand_role.create({
          agent_guid: guid,
          brand_role_code: result.brand_role_code
        }),
        agent_detail.create({
          agent_guid: guid,
          key: 'employer',
          value: result.employer_user_account
        }),
        team,
        team_agent,
        createList,
        result.status = "已审核",
        result.audit_time = new Date().toLocaleString(),
        result.audit_result = "已通过",
        result.save()
      ])
    }).then(function() {
      return "success"
    })

  },
  rejectAudit(req, res, next) {
    var auditID = req.body.auditID
    var reason = req.body.reason
    var employment = require('../../db/models/employment')
    return employment.findOne({
      where: {
        guid: auditID
      }
    }).then(function(result) {
      result.status = "已审核"
      result.audit_time = new Date().toLocaleString()
      result.audit_result = "已拒绝"
      result.reject_reason = reason
      return result.save()
    }).then(function() {
      return "success"
    })
  },
  getAuditHistory(req, res, next) {
    // return req.session.userInfo
    var userinfo = req.session.userInfo
    var employment = require('../../db/models/employment')
    var employment_detail = require('../../db/models/employment_detail')
    var brand_role = require('../../db/models/brand_role')

    var level = req.body.level
    var date_from = req.body.date_from
    var date_to = req.body.date_to

    employment_detail.belongsTo(employment)
    employment.belongsTo(brand_role)

    var addEmployment = (account, employeeList, list) => {
      var childList = list.filter(o => o.employer_user_account == account).map(o => o.employee_user_account)
      Array.prototype.push.apply(employeeList, childList)
      childList.forEach((o) => {
        addEmployment(o, employeeList, list)
      })
    }


    return employment.findAll().then((result) => {
      if (userinfo.name == "admin") {
        return []
      } else {
        var employeeList = []
        addEmployment(userinfo.name, employeeList, result)
        return employeeList
      }
    }).then((result) => {
      var condition = {}
      condition.status = '已审核'
      condition.audit_result = '已通过'
      if (result.length > 0) {
        condition = {
          employee_user_account: {
            $in: result
          },
          status: '已审核',
          audit_result: '已通过'
        }
      }
      if (level && level != "all") {
        condition.brand_role_code = level
      }
      if (date_from) {
        condition.employer_time = {
          $gt: date_from,
          $lte: date_to
        }
      }
      return employment.findAll({
        where: condition,
        include: [{
          model: employment_detail
        }, {
          model: brand_role
        }]
      })
    })
  },
  getLevel(req, res, next) {
    var userinfo = req.session.userInfo
    var brand_role = require('../../db/models/brand_role')
    var agent = require('../../db/models/agent')
    var agent_brand_role = require('../../db/models/agent_brand_role')
    agent.hasOne(agent_brand_role)
    agent_brand_role.belongsTo(brand_role)
    return agent.findOne({
      where: {
        user_account: userinfo.name
      },
      include: {
        model: agent_brand_role,
        include: brand_role
      }
    }).then((o) => {
      return brand_role.findAll({
        where: {
          level: {
            $gt: o.agent_brand_role.brand_role.level
          }
        }
      })
    })
  },
  createEmployment(req, res, next) {
    var employer = req.body.employer
    var roleCode = req.body.roleCode
    var brandGuid = req.body.brandGuid
    var createTime = req.body.createTime

    var uuid = require('node-uuid')
    var guid = uuid.v1()

    var publish_employment = require('../../db/models/publish_employment')

    return publish_employment.create({
      guid: guid,
      brand_guid: brandGuid,
      brand_role_code: roleCode,
      employer_user_account: employer,
      create_time: createTime,
      status: true
    }).then(function(result) {
      if (result == null) {
        return Promise.reject("创建招募失败")
      } else {
        return guid
      }
    })
  },
  getHeadImg(req, res, next) {
    var account = req.body.account
    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')

    agent_detail.belongsTo(agent)

    return agent_detail.findOne({
      include: {
        model: agent,
        where: {
          user_account: account
        }
      },
      where: {
        key: "headImg"
      }
    })
  },
  changeHeadImg(req, res, next) {
    var account = req.body.account
    var ImgID = req.body.ImgID

    var agent = require('../../db/models/agent')
    var agent_detail = require('../../db/models/agent_detail')

    agent_detail.belongsTo(agent)

    return agent_detail.findOne({
      include: {
        model: agent,
        where: {
          user_account: account
        }
      },
      where: {
        key: "headImg"
      }
    }).then(function(result) {
      result.value = ImgID
      return result.save()
    })
  },
  getCurrentList(req, res, next) {
    var selectMsg = req.body.key
    var user_account = req.session.userInfo.name
    var select = null

    var brand_role = require('../../db/models/brand_role')
    var publish_employment = require('../../db/models/publish_employment')

    publish_employment.belongsTo(brand_role)

    switch (selectMsg) {
      case "timeAsc":
        select = "publish_employment.created_at ASC" //时间由远到近
        return publish_employment.findAll({
          where: {
            employer_user_account: user_account,
            status: true
          },
          include: [{
            model: brand_role
          }],
          order: select
        })
      case "timeDesc":
        select = "publish_employment.created_at DESC" //时间由近到远
        return publish_employment.findAll({
          where: {
            employer_user_account: user_account,
            status: true
          },
          include: [{
            model: brand_role
          }],
          order: select
        })
      case "levelDesc":
        select = "brand_role.level DESC" // 等级由低到高
        return publish_employment.findAll({
          where: {
            employer_user_account: user_account,
            status: true
          },
          include: [{
            model: brand_role
          }],
          order: [
            [{
              model: brand_role
            }, 'level', 'DESC'],
            ['created_at', 'DESC']
          ]
        })
      case "levelAsc":
        select = "brand_role.level ASC" // 等级由高到低
        return publish_employment.findAll({
          where: {
            employer_user_account: user_account,
            status: true
          },
          include: [{
            model: brand_role
          }],
          order: [
            [{
              model: brand_role
            }, 'level', 'ASC'],
            ['created_at', 'DESC']
          ]
        })
    }
  },
  closeOverduePublishEmployment(req, res, next) {
    var delectItemList = req.body.delectItemList

    var publish_employment = require('../../db/models/publish_employment')

    for (var item in delectItemList) {
      publish_employment.findOne({
        where: {
          guid: delectItemList[item]
        }
      }).then(function(result) {
        result.status = false
        result.save()
      })
    }
  },
  getCurrentInfo(req, res, next) {
    var guid = req.body.guid

    var publish_employment = require('../../db/models/publish_employment')
    var employment = require('../../db/models/employment')
    var brand_role = require('../../db/models/brand_role')

    publish_employment.hasMany(employment)
    publish_employment.belongsTo(brand_role)

    return publish_employment.findOne({
      where: {
        guid: guid
      },
      include: [{
        model: employment
      }, {
        model: brand_role
      }]
    }).then(function(result) {
      if (result == null) {
        return Promise.reject("查找招募详情异常")
      } else {
        return result
      }
    })
  },
  closeEmployment(req, res, next) {
    var guid = req.body.guid

    var publish_employment = require('../../db/models/publish_employment')

    return publish_employment.findOne({
      where: {
        guid: guid
      }
    }).then(function(result) {
      if (result == null) {
        return Promise.reject("查找招募详情异常")
      } else {
        result.status = false
        return result.save()
      }
    }).then(function(result) {
      if (result == null) {
        return Promise.reject("关闭当前招募失败")
      } else {
        return true
      }
    })
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
        return result
      }
    })

  },
  getEmploymentInfo(req, res, next) {
    var user_account = req.session.userInfo.name

    var employment = require('../../db/models/employment')
    var agent = require('../../db/models/agent')
    var employment_term = require('../../db/models/employment_term')

    agent.hasOne(employment_term)

    return Promise.all([
      employment.findOne({
        where: {
          employee_user_account: user_account
        }
      }),
      agent.findOne({
        where: {
          user_account: user_account
        },
        include: [{
          model: employment_term,
        }]

      }),
    ]).then(function(result) {
      // return result[0]
      if (result[0] == null || result[1] == null) {
        return Promise.reject("读取招募信息读取出错")
      } else {
        return result
      }
    })

  },
  getCurrentListLength(req, res, next) {
    var user_account = req.session.userInfo.name
    var nowString = req.body.nowString

    var publish_employment = require('../../db/models/publish_employment')

    return publish_employment.findAll({
      where: {
        employer_user_account: user_account,
        status: true,
        create_time: {
          $gt: nowString
        }
      }
    }).then(function(result) {
      return result
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
    console.log(error)
    res.status(500).send(error.toString())
  })
}
