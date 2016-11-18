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
            }]
        }).then(function(result) {
            if (result == null) {
                return Promise.reject("找不到您的品牌商角色")
            } else {
                return brand.findOne({
                    where: {
                        guid: result.guid,
                    },
                    include: [{
                        model: brand_detail,
                    }],
                }).then(function(result) {
                    if (result == null) {
                        return Promise.reject("找不到您的品牌商资料")
                    } else {
                        return result
                    }
                })
            }
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

        var employment = require('../../db/models/employment')
        var employment_detail = require('../../db/models/employment_detail')
        var brand_role = require('../../db/models/brand_role')
        var user = require('../../db/models/user')
        var user_role = require('../../db/models/user_role')
        var agent = require('../../db/models/agent')
        var agent_brand_role = require('../../db/models/agent_brand_role')
        var sequelize = require('../../db/sequelize')

        employment.hasMany(employment_detail)
        agent.hasOne(agent_brand_role)
        agent_brand_role.belongsTo(brand_role)

        return Promise.all([
            //查找是否已提交过招募申请
            employment.findOne({
                where: {
                    brand_guid: employmentData.publishEmploymentInfo.brand_guid,
                    employee_user_account: data.cellphone
                }
            }),
            //查找是否已注册过账号
            user.findOne({
                where: {
                    account: data.cellphone
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
            })
        ]).then(function(result) {
            if (result[2] == null) {
                return Promise.reject("找不到审核人的信息")
            } else if (result[0] != null || result[1] != null) {
                return Promise.reject("您的手机号已提交申请或已成为该品牌成员，申请失败")
            } else {

                var pwd = "";
                for (var i = 0; i < 8; i++) {
                    pwd += Math.floor(Math.random() * 10);
                }

                var audit_user_account = result[2].user_account

                return sequelize.transaction().then(function(t) {
                    return Promise.all([
                        user.create({ account: data.cellphone, password: pwd }, { transaction: t }),
                        user_role.create({ user_account: data.cellphone, role_code: 'user' }, { transaction: t }),
                        employment.create({
                            guid: employmentData.guid,
                            publish_employment_guid: employmentData.publishEmploymentInfo.guid,
                            employer_user_account: employmentData.publishEmploymentInfo.employer_user_account,
                            brand_role_code: employmentData.publishEmploymentInfo.brand_role_code,
                            brand_guid: employmentData.publishEmploymentInfo.brand_guid,
                            employee_user_account: data.cellphone,
                            employer_time: employmentData.publishEmploymentInfo.create_time,
                            audit_user_account: audit_user_account,
                            deadline: deadline,
                            status: "未审核"
                        }, { transaction: t }),
                        employment_detail.bulkCreate([
                            { employment_guid: employmentData.guid, key: 'headImg', value: data['headImg'] },
                            { employment_guid: employmentData.guid, key: 'name', value: data['name'] },
                            { employment_guid: employmentData.guid, key: 'wechat', value: data['wechat'] },
                            { employment_guid: employmentData.guid, key: 'cellphone', value: data['cellphone'] },
                            { employment_guid: employmentData.guid, key: 'IDType', value: data['IDType'] },
                            { employment_guid: employmentData.guid, key: 'IDNumber', value: data['IDNumber'] },
                            { employment_guid: employmentData.guid, key: 'address', value: data['address'] },
                            { employment_guid: employmentData.guid, key: 'addressDetail', value: data['addressDetail'] }
                        ], { transaction: t })
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
            }
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
                return result
            }
        })

    },
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
