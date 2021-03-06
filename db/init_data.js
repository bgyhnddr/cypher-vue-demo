﻿var user = require('./models/user')
var role = require('./models/role')
var permission = require('./models/permission')
var user_role = require('./models/user_role')
var role_permission = require('./models/role_permission')
var brand = require('./models/brand')
var brand_role = require('./models/brand_role')

module.exports = function() {
    return Promise.all([
        user.create({ account: 'administrator', password: "admin" }),
        role.create({ code: "admin", name: "admin" }),
        role.create({ code: "user", name: "user" }),
        user_role.create({ user_account: "administrator", role_code: "admin" }),
        role_permission.create({ role_code: "admin", permission_code: "admin" }),
        role_permission.create({ role_code: "user", permission_code: "agentInfo" }),
        role_permission.create({ role_code: "user", permission_code: "employment" }),
        role_permission.create({ role_code: "user", permission_code: "changeUserInfo" }),
        permission.create({ code: "admin", name: "admin" }),
        permission.create({ code: "agentInfo", name: "agentInfo" }),
        permission.create({ code: "employment", name: "employment" }),
        permission.create({ code: "changeUserInfo", name: "changeUserInfo" }),
    ])
}