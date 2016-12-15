var exec = {
  /**
   * 获取商品列表
   * get
   */
  getCommoditys(req, res, next) {
    var pmp_brand_id = req.query.pmp_brand_id == undefined ? "" : req.query.pmp_brand_id
    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)
    var sort = req.query.sort == undefined ? {} : req.query.sort

    var pmp_product = require('../../db/models/pmp_product')
    var pmp_variant = require('../../db/models/pmp_variant')
    var pmp_variant_image = require('../../db/models/pmp_variant_image')
    pmp_product.hasMany(pmp_variant)
    pmp_variant.hasMany(pmp_variant_image)

    var where = {
      pmp_brand_id: pmp_brand_id
    }
    if (filterKey) {
      where.name = {
        $like: "%" + filterKey + "%"
      }
    }

    return pmp_product.findAndCountAll({
      include: {
        model: pmp_variant,
        include: pmp_variant_image
      },
      where: where,
      offset: page * count,
      limit: count
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
  getCommodity(req, res, next) {
    var id = req.query.id == undefined ? "" : req.query.id

    var pmp_product = require('../../db/models/pmp_product')
    var pmp_variant = require('../../db/models/pmp_variant')
    var pmp_specification = require('../../db/models/pmp_specification')
    var pmp_variant_image = require('../../db/models/pmp_variant_image')
    var pmp_product_price = require('../../db/models/pmp_product_price')
    var brand_role = require('../../db/models/brand_role')
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
        include: brand_role_code
      }]
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
  getLabels(req, res, next) {
    var pmp_label = require('../../db/models/pmp_label')
    var pmp_product_label = require('../../db/models/pmp_product_label')
    var pmp_brand_id = req.query.pmp_brand_id == undefined ? "" : req.query.pmp_brand_id
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
  deleteLabels(req, res, next) {
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
  getBrandRoles(req, res, next) {
    var brand_role = require('../../db/models/brand_role')

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
  getSpecificationOptions(req, res, next) {
    var pmp_specification_option = require('../../db/models/pmp_specification_option')
    var pmp_option_item = require('../../db/models/pmp_option_item')
    var pmp_brand_id = req.query.pmp_brand_id == undefined ? "" : req.query.pmp_brand_id
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
  submitCommodity(req, res, next) {
    var pmp_product = require('../../db/models/pmp_product')
    var pmp_variant = require('../../db/models/pmp_variant')
    var pmp_variant_image = require('../../db/models/pmp_variant_image')
    var pmp_specification = require('../../db/models/pmp_specification')
    var pmp_product_label = require('../../db/models/pmp_product_label')
    var pmp_label = require('../../db/models/pmp_label')
    var pmp_product_price = require('../../db/models/pmp_product_price')
    var obj = req.body
    pmp_product.upsert(obj).then(() => {
      if (obj["pmp_variants"] != undefined) {
        var variantUpsertList = []
        obj["pmp_variants"].forEach((v) => {
          variantUpsertList.push(pmp_variant.upsert(v).then(() => {
            var variantDetailUpsertList = []
            if (v["pmp_variant_images"] != undefined) {
              v["pmp_variant_images"].forEach((img) => {
                variantDetailUpsertList.push(pmp_variant_image.upsert(img))
              })
            }
            if (v["pmp_specifications"] != undefined) {
              v["pmp_specifications"].forEach((spe) => {
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
          productLabelUpsertList.push(pmp_product_label.upsert(pl).then(() => {
            return pmp_label.upsert(pl.pmp_label)
          }))
        })
        return Promise.all(productLabelUpsertList)
      }
    }).then(() => {
      if (obj["pmp_product_prices"] != undefined) {
        var productPriceUpsertList = []
        obj["pmp_product_prices"].forEach((pp) => {
          productPriceUpsertList.push(pmp_product_price.upsert(pp))
        })
        return Promise.all(productPriceUpsertList)
      }
    }).then(()=>{
      return "OK"
    })
  }
}




module.exports = (req, res, next) => {
  var action = req.params.action
  return Promise.resolve(action).then(function(result) {
    return exec[result](req, res, next)
  }).then(function(result) {
    return res.send(result)
  }).catch(function(error) {
    return res.status(500).send(error.toString())
  })
}
