var Sequelize = require('sequelize')
module.exports = function(req, res, next) {
    Promise.all([
        require('./models/user'),
        require('./models/role'),
        require('./models/permission'),
        require('./models/user_role'),
        require('./models/role_permission'),
        require('./models/attachment'),
        require('./models/file'),
        require('./models/brand'),
        require('./models/brand_detail'),
        require('./models/agent'),
        require('./models/agent_detail'),
        require('./models/employment'),
        require('./models/employment_detail'),
        require('./models/brand_employment_meta'),
        require('./models/agent_brand_role'),
        require('./models/brand_role'),
        require('./models/employable_rule'),
        require('./models/employment_term'),
        require('./models/publish_employment')
    ].map((o) => o.sync({ force: true }))).then(function() {
        return require('./init_data')()
    }).then(() => {
        return require('./init_app_data')()
    }).then(function() {
        res.send("success")
    }).catch(function(err) {
        res.send(err)
    })
}