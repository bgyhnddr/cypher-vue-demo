var exec = {
  getBrandInfo(req, res, next) {
    var brand = require('../../db/models/brand')
    var brand_detail = require('../../db/models/brand_detail')

    brand.hasMany(brand_detail)

    return brand.findOne({
      where: {
        guid: "brand1"
      },
      include: [{
        model: brand_detail
      }]
    }).then(function(result) {
      if (result == null) {
        return Promise.reject("找不到您的品牌商资料,请关闭本页面")
      } else {
        return result
      }
    })
  },
}


module.exports = (req, res, next) => {
  var action = req.params.action
  Promise.resolve(action).then(function(result) {
    return exec[result](req, res, next)
  }).then(function(result) {
    res.send(result)
  }).catch(function(error) {
    res.status(500).send(error.toString())
  })
}
