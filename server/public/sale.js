//var pmp_server = require('../pmp_server')
var pmp_good = require('../../db/models/pmp_goods')
var pmp_specification = require('../../db/models/pmp_specification')
var pmp_variant = require('../../db/models/pmp_variant')
var pmp_product = require('../../db/models/pmp_product')
var pmp_product_price = require('../../db/models/pmp_product_price')

var exec = {
  showPack(req, res, next) {
    var packcode = req.body.packcode

    pmp_good.belongsTo(pmp_specification)
    pmp_specification.belongsTo(pmp_variant)
    pmp_variant.belongsTo(pmp_product)
    pmp_product.hasMany(pmp_product_price)

    return pmp_good.findOne({
      where: {
        goods_code: packcode
      },
      include: {
        model: pmp_specification,
        include: {
          model: pmp_variant,
          include: {
            model: pmp_product,
            include: {
              model: pmp_product_price,
              where: { brand_role_code: '99' }
            }
          }
        }
      }
    }).then((result) => {
      return {
        full_code: result.goods_code,
        product_name: result.pmp_specification.pmp_variant.pmp_product.name,
        retail_price: '￥' + result.pmp_specification.pmp_variant.pmp_product.pmp_product_prices[0].price.toFixed(2),
        variant_name: result.pmp_specification.pmp_variant.name,
        specification: result.pmp_specification.name,
        sold_time: result.sold_time,
        sold_by: result.seller_user_account,
        sold: result.status === 'SOL'
      }
    })
  },

  packSoldBy(req, res, next) {
    var packcode = req.body.packcode

    var user_account = req.session.userInfo.name

    var agent = require('../../db/models/agent')


    return agent.findOne({
      where: {
        user_account: user_account
      }
    }).then(function (result) {
      if (result == null) {
        return Promise.reject("获取您的个人资料读取出错")
      } else {
        var who = result.user_account

        return pmp_good.findOne({
          where: {
            goods_code: packcode
          }
        }).then((good) => {
          if (good) {
            return good.update({
              seller_user_account: user_account,
              sold_time: new Date(),
              status: 'SOL'
            })
          }
        })
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
    }).then(function (result) {
      if (result == null) {
        return Promise.reject("销售员资料读取出错")
      } else {
        return result
      }
    })
  },

}


module.exports = (req, res, next) => {
  var action = req.params.action
  Promise.resolve(action).then(function (result) {
    return exec[result](req, res, next)
  }).then(function (result) {
    res.send(result)
  }).catch(function (error) {
    res.status(500).send(error.toString())
  })
}
