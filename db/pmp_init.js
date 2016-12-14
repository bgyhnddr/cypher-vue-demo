module.exports = function(req, res, next) {
  Promise.all([
    require('./models/pmp_brand_meta'),
    require('./models/pmp_brand'),
    require('./models/pmp_label'),
    require('./models/pmp_option_item'),
    require('./models/pmp_product_label'),
    require('./models/pmp_product_price'),
    require('./models/pmp_product'),
    require('./models/pmp_specification_option'),
    require('./models/pmp_specification'),
    require('./models/pmp_variant_image'),
    require('./models/pmp_variant')
  ].map((o) => o.sync({
    force: true
  }))).then(function() {
    
  }).then(function() {
    res.send("success")
  }).catch(function(err) {
    res.send(err)
  })
}
