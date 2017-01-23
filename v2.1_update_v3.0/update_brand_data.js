var pmp_brand = require('../db/models/pmp_brand')
var permission = require('../db/models/permission')
var role_permission = require('../db/models/role_permission')
var pmp_option_item = require('../db/models/pmp_option_item')
var pmp_specification_option = require('../db/models/pmp_specification_option')


pmp_brand.create({ access_token: '123', app_key: '123', name: 'Bleman & CaraCara', company: '广州市卡哇卡哇信息科技有限责任公司', status: 'ACT'})
.then((pmpBrand) => {
  return pmp_specification_option.create({
    pmp_brand_id: pmpBrand.id,
    name: "尺寸"
  })
}).then((option) => {
  return pmp_option_item.bulkCreate([{
    pmp_specification_option_id: option.id,
    name: "XS码"
  }, {
    pmp_specification_option_id: option.id,
    name: "S码"
  }, {
    pmp_specification_option_id: option.id,
    name: "M码"
  }, {
    pmp_specification_option_id: option.id,
    name: "L码"
  }, {
    pmp_specification_option_id: option.id,
    name: "XL码"
  }, {
    pmp_specification_option_id: option.id,
    name: "XXL码"
  }])
}).then(() =>{
  return Promise.all([
    permission.create({ code: 'frozen', name: 'frozen' }),
    permission.create({ code: 'promote', name: 'promote' }),
    role_permission.create({ role_code: 'user', permission_code: 'frozen' }),
    role_permission.create({ role_code: 'user', permission_code: 'promote' })
  ])
}).then(() => {
  console.log('ok')
})

