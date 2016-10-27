var user = require('./models/user')
var role = require('./models/role')
var permission = require('./models/permission')
var user_role = require('./models/user_role')
var role_permission = require('./models/role_permission')
var brand = require('./models/brand')
var brand_role = require('./models/brand_role')

module.exports = function() {
    return Promise.all([
        user.create({ account: 'admin', password: "admin" }),
        user.create({ account: 'bili', password: "123" }),
        role.create({ code: "admin", name: "admin" }),
        role.create({ code: "user" , name: "user"}),
        user_role.create({ user_account: "admin", role_code: "admin" }),
        user_role.create({ user_account: "bili", role_code: "user" }),
        role_permission.create({ role_code: "admin", permission_code: "admin" }),
        role_permission.create({ role_code: "admin", permission_code: "personalInfo" }),
        permission.create({ code: "admin", name: "admin" }),
        permission.create({ code: "personalInfo", name: "personalInfo" }),
    ])
}