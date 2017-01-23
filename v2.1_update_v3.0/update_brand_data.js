var pmp_brand = require('../db/models/pmp_brand')
var permission = require('../db/models/permission')
var role_permission = require('../db/models/role_permission')
var brand_role = require('../db/models/brand_role')
var pmp_option_item = require('../db/models/pmp_option_item')
var pmp_specification_option = require('../db/models/pmp_specification_option')
var brand_role_meta = require('../db/models/brand_role_meta')


pmp_brand.create({ access_token: '123', app_key: '123', name: 'Bleman & CaraCara', company: '广州市卡哇卡哇信息科技有限责任公司', status: 'ACT' })
  .then((pmpBrand) => {
    return pmp_specification_option.create({
      pmp_brand_id: pmpBrand.id,
      name: "尺寸"
    })
  }).then((option) => {
    return pmp_option_item.bulkCreate([
      { pmp_specification_option_id: option.id, name: "XS码" },
      { pmp_specification_option_id: option.id, name: "S码" },
      { pmp_specification_option_id: option.id, name: "M码" },
      { pmp_specification_option_id: option.id, name: "L码" },
      { pmp_specification_option_id: option.id, name: "XL码" },
      { pmp_specification_option_id: option.id, name: "XXL码" }
    ])
  }).then(() => {
    return brand_role_meta.bulkCreate([
      { brand_role_code: 'brand_role2', key: 'initialFee', type: 'float', value: '5000' },
      { brand_role_code: 'brand_role3', key: 'initialFee', type: 'float', value: '3000' },
      { brand_role_code: 'brand_role4', key: 'initialFee', type: 'float', value: '2000' },
      { brand_role_code: 'brand_role5', key: 'initialFee', type: 'float', value: '1000' }
    ])
  }).then(() => {
    return Promise.all([
      permission.create({ code: 'frozen', name: 'frozen' }),
      permission.create({ code: 'promote', name: 'promote' }),
      role_permission.create({ role_code: 'user', permission_code: 'frozen' }),
      role_permission.create({ role_code: 'user', permission_code: 'promote' })
    ])
  }).then(()=>{
    return brand_role.create({ code: 'brand_role99', brand_guid: 'brand1', name: '零售', level: '99' })
  }).done(() => {
    console.log('ok')
  })