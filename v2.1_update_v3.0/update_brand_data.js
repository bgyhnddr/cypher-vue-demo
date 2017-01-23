var pmp_brand = require('../db/models/pmp_brand')
var permission = require('../db/models/permission')
var role_permission = require('../db/models/role_permission')

Promise.all([
  pmp_brand.create({ access_token: '123', app_key: '123', name: 'Bleman & CaraCara', company: '广州市卡哇卡哇信息科技有限责任公司', status: 'ACT'}),
  permission.create({ code: 'frozen', name: 'frozen' }),
  permission.create({ code: 'promote', name: 'promote' }),
  role_permission.create({ role_code: 'user', permission_code: 'frozen' }),
  role_permission.create({ role_code: 'user', permission_code: 'promote' })
]).then(() => {
  console.log('ok')
})