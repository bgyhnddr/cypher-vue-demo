var getBoxCodes = (code) => {
  var pmp_server = require('../pmp_server')
  return pmp_server.packs_under_crate(code).then((result) => {
    return result.map(o => o.full_code)
  })
}

var getBrandId = (token) => {
  var pmp_brand = require('../../db/models/pmp_brand')
  return pmp_brand.findOne({
    where: {
      access_token: token,
      status: "ACT"
    }
  }).then((result) => {
    if (result != null) {
      return result.id
    } else {
      return Promise.reject("check access_token fail")
    }
  })
}
var exec = {
  /**
   * 获取商品列表
   * get
   */
  getProducts(req, res, pmp_brand_id) {
    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)
    var sort = req.query.sort == undefined ? {} : req.query.sort
    var order = req.query.order
    var on_sell = req.query.on_sell

    var pmp_product = require('../../db/models/pmp_product')
    var pmp_product_price = require('../../db/models/pmp_product_price')
    var pmp_variant = require('../../db/models/pmp_variant')
    var pmp_variant_image = require('../../db/models/pmp_variant_image')
    pmp_product.hasMany(pmp_variant)
    pmp_product.hasMany(pmp_product_price)
    pmp_variant.hasMany(pmp_variant_image)

    var where = {
      pmp_brand_id: pmp_brand_id
    }
    if (filterKey) {
      where.name = {
        $like: "%" + filterKey + "%"
      }
    }
    if (on_sell != undefined) {
      where.on_sell = on_sell
    }

    var orderstring = "created_at DESC"
    if (order) {
      orderstring = order.key + " " + (order.asc ? "" : "DESC")
    }

    return pmp_product.findAndCountAll({
      include: [{
        model: pmp_variant,
        include: pmp_variant_image
      }, pmp_product_price],
      where: where,
      offset: page * count,
      limit: count,
      order: orderstring
    }).then((result) => {
      return {
        end: (result.rows.length + page * count) >= result.count,
        list: result.rows
      }
    })
  },
  /**
   * 获取商品
   * get
   */
  getProduct(req, res, pmp_brand_id) {
    var id = req.query.id == undefined ? "" : req.query.id

    var pmp_product = require('../../db/models/pmp_product')
    var pmp_variant = require('../../db/models/pmp_variant')
    var pmp_specification = require('../../db/models/pmp_specification')
    var pmp_variant_image = require('../../db/models/pmp_variant_image')
    var pmp_product_price = require('../../db/models/pmp_product_price')
    var brand_role = require('../../db/models/pmp_brand_role')
    var pmp_product_label = require('../../db/models/pmp_product_label')
    var pmp_label = require('../../db/models/pmp_label')

    pmp_product.hasMany(pmp_variant)
    pmp_product.hasMany(pmp_product_label)
    pmp_product.hasMany(pmp_product_price)
    pmp_variant.hasMany(pmp_variant_image)
    pmp_variant.hasMany(pmp_specification)
    pmp_product_label.belongsTo(pmp_label)

    pmp_product_price.belongsTo(brand_role)

    return pmp_product.findOne({
      include: [{
        model: pmp_variant,
        include: [pmp_variant_image, pmp_specification]
      }, {
        model: pmp_product_label,
        include: pmp_label
      }, {
        model: pmp_product_price,
        include: brand_role
      }],
      where: {
        id: id
      }
    }).then((result) => {
      if (result != null) {
        return result
      } else {
        return Promise.reject("找不到记录")
      }
    })
  },
  /**
   * 获取所有标签
   * get
   */
  getLabels(req, res, pmp_brand_id) {
    var pmp_label = require('../../db/models/pmp_label')
    var pmp_product_label = require('../../db/models/pmp_product_label')
    pmp_label.hasMany(pmp_product_label)

    return pmp_label.findAll({
      include: {
        model: pmp_product_label,
        required: true
      },
      where: {
        pmp_brand_id: pmp_brand_id
      }
    })
  },
  /**
   * 删除选定标签
   * post
   */
  deleteLabels(req, res, pmp_brand_id) {
    var pmp_product_label = require('../../db/models/pmp_product_label')
    var ids = req.body.ids
    return pmp_product_label.destroy({
      where: {
        id: {
          $in: ids
        }
      }
    }).then((result) => {
      return "OK"
    })
  },
  /**
   * 获取代理列表
   * get
   */
  getBrandRoles(req, res, pmp_brand_id) {
    var brand_role = require('../../db/models/pmp_brand_role')

    return brand_role.findAll({
      where: {
        level: {
          $gt: 0
        }
      }
    })
  },
  /**
   * 获取奎哥
   * get
   */
  getSpecificationOptions(req, res, pmp_brand_id) {
    var pmp_specification_option = require('../../db/models/pmp_specification_option')
    var pmp_option_item = require('../../db/models/pmp_option_item')
    pmp_specification_option.hasMany(pmp_option_item)
    return pmp_specification_option.findAll({
      include: pmp_option_item,
      where: {
        pmp_brand_id: pmp_brand_id
      }
    })
  },
  /**
   * 提交商品，提交需要修改的结构
   * post
   */
  submitProduct(req, res, pmp_brand_id) {
    var pmp_product = require('../../db/models/pmp_product')
    var pmp_variant = require('../../db/models/pmp_variant')
    var pmp_variant_image = require('../../db/models/pmp_variant_image')
    var pmp_specification = require('../../db/models/pmp_specification')
    var pmp_product_label = require('../../db/models/pmp_product_label')
    var pmp_label = require('../../db/models/pmp_label')
    var pmp_product_price = require('../../db/models/pmp_product_price')
    var obj = req.body
    obj.pmp_brand_id = pmp_brand_id
    return pmp_product.findOrCreate({
      where: {
        id: obj.id
      }
    }).spread((result) => {
      for (var col in obj) {
        if (typeof(obj[col]) != "object") {
          result[col] = obj[col]
        }
      }
      return result.save()
    }).then((product) => {
      obj.id = product.id
      if (obj["pmp_variants"] != undefined) {
        var variantUpsertList = []
        obj["pmp_variants"].forEach((v) => {
          v.pmp_product_id = product.id
          variantUpsertList.push(Promise.resolve().then(() => {
            if (v.id) {
              return pmp_variant.findOne({
                where: {
                  id: v.id
                }
              })
            } else {
              return pmp_variant.create(v)
            }
          }).then((variant) => {
            var variantDetailUpsertList = []
            if (v["pmp_variant_images"] != undefined) {
              v["pmp_variant_images"].forEach((img) => {
                img.pmp_variant_id = variant.id
                variantDetailUpsertList.push(pmp_variant_image.upsert(img))
              })
            }
            if (v["pmp_specifications"] != undefined) {
              v["pmp_specifications"].forEach((spe) => {
                spe.pmp_variant_id = variant.id
                variantDetailUpsertList.push(pmp_specification.upsert(spe))
              })
            }
            return Promise.all(variantDetailUpsertList)
          }))
        })
        return Promise.all(variantUpsertList)
      }
    }).then(() => {
      if (obj["pmp_product_labels"] != undefined) {
        var productLabelUpsertList = []
        obj["pmp_product_labels"].forEach((pl) => {
          productLabelUpsertList.push(pmp_label.upsert(pl.pmp_label).then(() => {
            return pmp_label.findOne({
              where: {
                name: pl.pmp_label.name
              }
            })
          }).then((label) => {
            return pmp_product_label.upsert({
              pmp_label_id: label.id,
              pmp_product_id: obj.id
            })
          }))
        })
        return Promise.all(productLabelUpsertList)
      }
    }).then(() => {
      if (obj["pmp_product_prices"] != undefined) {
        var productPriceUpsertList = []
        obj["pmp_product_prices"].forEach((pp) => {
          pp.pmp_product_id = obj.id
          productPriceUpsertList.push(pmp_product_price.upsert(pp))
        })
        return Promise.all(productPriceUpsertList)
      }
    }).then(() => {
      return obj.id
    })
  },
  /**
   * 根据产品获取产品的规格
   * get
   */
  getSpecifications(req, res) {
    var pmp_product_id = req.query.pmp_product_id == undefined ? "" : req.query.pmp_product_id
    var pmp_specification = require('../../db/models/pmp_specification')
    var pmp_variant = require('../../db/models/pmp_variant')

    pmp_specification.belongsTo(pmp_variant)
    return pmp_specification.findAll({
      include: {
        model: pmp_variant,
        where: {
          pmp_product_id: pmp_product_id
        }
      }
    })
  },
  /**
   * 获取盒号集合
   * get
   */
  getBoxCodes(req, res) {
    var code = req.query.code == undefined ? "" : req.query.code
    return getBoxCodes(code)
  },
  /**
   * 提交关联扫描结果
   * post
   */
  submitCountResult(req, res) {
    var pmp_product_id = req.body.pmp_product_id == undefined ? "" : req.body.pmp_product_id
    var countList = req.body.countList == undefined ? [] : req.body.countList
    var pmp_outcome_count = require('../../db/models/pmp_outcome_count')
    var pmp_goods = require('../../db/models/pmp_goods')

    return Promise.all(countList.map((o) => {
      return pmp_outcome_count.create({
        pmp_specification_id: o.pmp_specification_id,
        goods_code: o.goods_code,
        counter_user_account: req.session.userInfo.name,
        count_time: new Date()
      }).then((result) => {
        return getBoxCodes(o.goods_code).then((codes) => {
          return Promise.all(codes.map((code) => {
            return pmp_outcome_count.create({
              pmp_specification_id: o.pmp_specification_id,
              goods_code: code,
              counter_user_account: req.session.userInfo.name,
              count_time: new Date(),
              pmp_outcome_count_id: result.id
            }).then((created) => {
              return pmp_goods.upsert({
                pmp_specification_id: o.pmp_specification_id,
                goods_code: code,
                pmp_outcome_count_id: created.id,
                owner_user_account: req.session.userInfo.name
              })
            })
          }))
        })
      })
    }))
  }
}


module.exports = (req, res, next) => {
  var action = req.params.action
  return Promise.resolve(action).then(function(result) {
    return getBrandId(req.params.token).then((id) => {
      return exec[result](req, res, id)
    })
  }).then(function(result) {
    return res.send(result)
  }).catch(function(error) {
    console.log(error)
    return res.status(500).send(error.toString())
  })
}
