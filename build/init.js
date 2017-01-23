Promise.all([
  require('../db/models/user'),
  require('../db/models/role'),
  require('../db/models/permission'),
  require('../db/models/user_role'),
  require('../db/models/role_permission'),
  require('../db/models/attachment'),
  require('../db/models/file'),
  require('../db/models/brand'),
  require('../db/models/brand_detail'),
  require('../db/models/team'),
  require('../db/models/team_agent'),
  require('../db/models/team_num'),
  require('../db/models/agent'),
  require('../db/models/agent_detail'),
  require('../db/models/employment'),
  require('../db/models/employment_detail'),
  require('../db/models/frozen_agent'),
  require('../db/models/brand_employment_meta'),
  require('../db/models/agent_brand_role'),
  require('../db/models/brand_role'),
  require('../db/models/brand_role_meta'),
  require('../db/models/employable_rule'),
  require('../db/models/employment_term'),
  require('../db/models/publish_employment')
].map((o) => o.sync({
  force: true
}))).then(()=>{
  return require('../db/init_data')()
}).then(() => {
  return require('../db/init_app_data')()
}).then(function() {
  console.log("ok")
}).catch(function(err) {
  console.log(err)
})
