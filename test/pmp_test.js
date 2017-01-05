var should = require('should')
var pmp_brand_meta = require('../db/models/pmp_brand_meta')
var pmp_brand = require('../db/models/pmp_brand')
var pmp_label = require('../db/models/pmp_label')
var pmp_option_item = require('../db/models/pmp_option_item')
var pmp_product_label = require('../db/models/pmp_product_label')
var pmp_product_price = require('../db/models/pmp_product_price')
var pmp_product = require('../db/models/pmp_product')
var pmp_specification_option = require('../db/models/pmp_specification_option')
var pmp_specification = require('../db/models/pmp_specification')
var pmp_variant_image = require('../db/models/pmp_variant_image')
var pmp_variant = require('../db/models/pmp_variant')

describe('pmp', function() {

  before(function() {
    this.timeout(10000);
    return Promise.all([
      pmp_brand_meta,
      pmp_brand,
      pmp_label,
      pmp_option_item,
      pmp_product_label,
      pmp_product_price,
      pmp_product,
      pmp_specification_option,
      pmp_specification,
      pmp_variant_image,
      pmp_variant
    ].map((o) => o.sync({
      force: true
    }))).then(function(){
    return Promise.all([
      pmp_brand.create({
        access_token: "123",
        app_key: "123",
        app_secret: "123",
        name: "测试brand",
        company: "测试公司"
      }),
      pmp_specification_option.create({
        pmp_brand_id: 1,
        name: "尺寸"
      }),
      pmp_option_item.bulkCreate([{
        pmp_specification_option_id: 1,
        name: "XS码"
      }, {
        pmp_specification_option_id: 1,
        name: "S码"
      }, {
        pmp_specification_option_id: 1,
        name: "M码"
      }, {
        pmp_specification_option_id: 1,
        name: "L码"
      }, {
        pmp_specification_option_id: 1,
        name: "XL码"
      }, {
        pmp_specification_option_id: 1,
        name: "XXL码"
      }]),
      pmp_product.bulkCreate([{
        pmp_brand_id: 1,
        name: "测试商品1",
        description: "测试商品1描述"
      }, {
        pmp_brand_id: 1,
        name: "测试商品2",
        description: "测试商品2描述"
      }]),
      pmp_variant.bulkCreate([{
        pmp_product_id: 1,
        name: "测试 test 1"
      }, {
        pmp_product_id: 1,
        name: "测试 test 2"
      }, {
        pmp_product_id: 2,
        name: "测试 test 1"
      }]),
      pmp_variant_image.bulkCreate([{
        pmp_variant_id: 1,
        attachment_id: 1
      }, {
        pmp_variant_id: 2,
        attachment_id: 1
      }, {
        pmp_variant_id: 3,
        attachment_id: 1
      }]),
      pmp_specification.bulkCreate([{
        pmp_variant_id: 1,
        name: "测试1"
      }, {
        pmp_variant_id: 2,
        name: "测试2"
      }, {
        pmp_variant_id: 3,
        name: "测试3"
      }]),
      pmp_label.bulkCreate([{
        pmp_brand_id: 1,
        label: "测试标签1"
      }, {
        pmp_brand_id: 1,
        label: "测试标签2"
      }, {
        pmp_brand_id: 1,
        label: "测试标签3"
      }]),
      pmp_product_label.bulkCreate([{
        pmp_product_id: 1,
        pmp_label_id: 1
      }, {
        pmp_variant_id: 1,
        pmp_label_id: 2
      }])
    ])
    })
  });

  describe('product', function() {

    var cres = {
      send: function(text) {
        return text
      },
      status: (code) => {
        console.log(code)
        return {
          send: function(text) {
            return text
          }
        }
      }
    }
    var testfunction = (action, params) => {
      return require('../server/pmp/product')({
        params: {
          action,
          token:'123'
        },
        query: params,
        body: params
      }, cres)
    }
    // before(function() {

    // })

    it('getProducts', function() {
      return testfunction("getProducts", {
        pmp_brand_id: "1",
        filterKey: "",
        page: "0",
        count: "10"
      }).then((result) => {
        return result.list.length.should.equal(2)
      })
    });

    it('getProduct', function() {
      return testfunction("getProduct", {
        id: "1"
      }).then((result) => {
        return result.id.should.equal(1)
      })
    });

    it('getLabels', function() {
      return testfunction("getLabels", {
        pmp_brand_id: "1"
      }).then((result) => {
        return result.length.should.equal(2)
      })
    });

    it('deleteLabels', function() {
      return testfunction("deleteLabels", {
        ids: ["1"]
      }).then(() => {
        return testfunction("getLabels", {
          pmp_brand_id: "1"
        })
      }).then((result) => {
        return result.length.should.equal(1)
      })
    });

    it('getBrandRoles', function() {
      return testfunction("getBrandRoles").then((result) => {
        return result.length.should.equal(4)
      })
    });

    it('getSpecificationOptions', function() {
      return testfunction("getSpecificationOptions", {
        pmp_brand_id: "1"
      }).then((result) => {
        result.length.should.equal(1)
        result[0].pmp_option_items.length.should.equal(6)
      
      })
    });

    it('创建测试商品3', function() {
      return testfunction("submitProduct", {
        pmp_brand_id: 1,
        name: "测试商品3"
      }).then(() => {
        return testfunction("getProducts", {
          pmp_brand_id: "1",
          filterKey: "",
          page: "0",
          count: "10"
        })
      }).then((result) => {
        result.list.length.should.equal(3) 
      })
    })

    it('修改商品3名字为测试商品3改', function() {
      return testfunction("submitProduct", {
        id: "3",
        name: "测试商品3改"
      }).then(() => {
        return testfunction("getProduct", {
          id: "3"
        }).then((result) => {
          result.name.should.equal("测试商品3改")
        })
      })
    })

    it('为测试商品3改添加一个规格', function() {
      return testfunction("submitProduct", {
        id: "3",
        pmp_variants: [{
          name: "测试规格"
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: "3"
        }).then((result) => {
          result.pmp_variants.length.should.above(0)
          result.pmp_variants[0].name.should.equal("测试规格")
        })
      })
    })

    it('为测试商品3规格添加一个图片', function() {
      return testfunction("submitProduct", {
        id: "3",
        pmp_variants: [{
          id: '4',
          pmp_variant_images: [{
            attachment_id: "1"
          }]
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: "3"
        }).then((result) => {
          result.pmp_variants.length.should.above(0)
          result.pmp_variants[0].name.should.equal("测试规格")
          result.pmp_variants[0].pmp_variant_images.length.should.above(0)
          result.pmp_variants[0].pmp_variant_images[0].attachment_id.should.equal(1)
        })
      })
    })

    it('为测试商品3规格添加一个型号', function() {
      return testfunction("submitProduct", {
        id: "3",
        pmp_variants: [{
          id: '4',
          pmp_specifications: [{
            name: "测试型号"
          }]
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: "3"
        }).then((result) => {
          result.pmp_variants.length.should.above(0)
          result.pmp_variants[0].name.should.equal("测试规格")
          result.pmp_variants[0].pmp_specifications.length.should.above(0)
          result.pmp_variants[0].pmp_specifications[0].name.should.equal("测试型号")
        })
      })
    })

    it('为测试商品3添加一个标签', function() {
      return testfunction("submitProduct", {
        id: "3",
        pmp_product_labels: [{
          pmp_label: {
            name: "新增标签"
          }
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: "3"
        }).then((result) => {
          result.pmp_product_labels.length.should.above(0)
          result.pmp_product_labels[0].pmp_label.name.should.equal("新增标签") 
        })
      })
    })


    it('为测试商品3添加一个价格', function() {
       return testfunction("submitProduct", {
        id: "3",
        pmp_product_prices: [{
          brand_role_code: "1",
          price: "1",
          price_unit: "RMB"
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: "3"
        }).then((result) => {
          result.pmp_product_prices.length.should.above(0)
          result.pmp_product_prices[0].price_unit.should.equal("RMB")
        })
      })
    })

  })

});

