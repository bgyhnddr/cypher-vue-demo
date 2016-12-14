Promise.all([
  require('../db/models/pmp_brand_meta'),
  require('../db/models/pmp_brand'),
  require('../db/models/pmp_label'),
  require('../db/models/pmp_option_item'),
  require('../db/models/pmp_product_label'),
  require('../db/models/pmp_product_price'),
  require('../db/models/pmp_product'),
  require('../db/models/pmp_specification_option'),
  require('../db/models/pmp_specification'),
  require('../db/models/pmp_variant_image'),
  require('../db/models/pmp_variant')
].map((o) => o.sync({
  force: true
}))).then(function() {

}).then(function() {
  console.log("ok")
}).catch(function(err) {
  console.log(err)
})
