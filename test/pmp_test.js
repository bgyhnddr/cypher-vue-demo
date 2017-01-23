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
var pmp_outcome_count = require('../db/models/pmp_outcome_count')
var pmp_goods = require('../db/models/pmp_goods')
var pmp_goods_meta = require('../db/models/pmp_goods_meta')

describe('pmp-test', () => {
  before(function() {
    this.timeout(10000)
      // runs before all tests in this block
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
      pmp_variant,
      pmp_outcome_count,
      pmp_goods,
      pmp_goods_meta
    ].map((o) => o.sync({
      force: true
    }))).then((result) => {
      return pmp_brand.create({
        access_token: "123",
        app_key: "123",
        app_secret: "123",
        name: "测试brand",
        company: "测试公司",
        status: "ACT"
      }).then((result) => {
        pmp_brand_id = result.id
        return Promise.all([
          pmp_specification_option.create({
            pmp_brand_id: result.id,
            name: "尺寸"
          }).then((result) => {
            pmp_option_item.bulkCreate([{
              pmp_specification_option_id: result.id,
              name: "XS码"
            }, {
              pmp_specification_option_id: result.id,
              name: "S码"
            }, {
              pmp_specification_option_id: result.id,
              name: "M码"
            }, {
              pmp_specification_option_id: result.id,
              name: "L码"
            }, {
              pmp_specification_option_id: result.id,
              name: "XL码"
            }, {
              pmp_specification_option_id: result.id,
              name: "XXL码"
            }])
          }),
          pmp_product.bulkCreate([{
            pmp_brand_id: result.id,
            name: "测试商品1",
            description: "测试商品1描述",
            on_sell: true
          }, {
            pmp_brand_id: result.id,
            name: "测试商品2",
            description: "测试商品2描述",
            on_sell: false
          }, {
            pmp_brand_id: result.id,
            name: "测试商品3",
            description: "测试商品3描述"
          }]).then(() => {
            return pmp_product.findAll()
          }).then((result) => {
            return Promise.all([
              pmp_variant_image.bulkCreate(
                result.map((o) => {
                  return {
                    pmp_variant_id: o.id,
                    attachment_id: 1
                  }
                })),
              pmp_specification.bulkCreate(
                result.map((o) => {
                  return {
                    pmp_variant_id: o.id,
                    name: "测试" + o.id,
                    on_sell: true
                  }
                }))
            ])
          }),
          pmp_label.bulkCreate([{
            pmp_brand_id: result.id,
            label: "测试标签1"
          }, {
            pmp_brand_id: result.id,
            label: "测试标签2"
          }, {
            pmp_brand_id: result.id,
            label: "测试标签3"
          }]).then(() => {
            return pmp_label.findAll()
          }).then((labels) => {
            pmp_product_label.bulkCreate(labels.slice(0, 2).map((o) => {
              return {
                pmp_product_id: result.id,
                pmp_label_id: o.id
              }
            }))
          })
        ])
      })
    })
  })
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
    try {
      return require('../server/pmp/product')({
        session: {
          userInfo: {
            name: "testman"
          }
        },
        params: {
          action,
          token: "123"
        },
        query: params,
        body: params
      }, cres)
    } catch (e) {
      console.log(e)
    }
  }
  describe('getProducts', () => {
    it('get all', () => {
      return testfunction("getProducts", {
        filterKey: "",
        page: "0",
        count: "10"
      }).then((result) => {
        return result.list.length.should.equal(3)
      })
    })
    it('get on_sell', () => {
      return testfunction("getProducts", {
        filterKey: "",
        page: "0",
        count: "10",
        on_sell: true
      }).then((result) => {
        result.list.length.should.equal(1)
        result.list[0].on_sell.should.equal(true)
      })
    })
    it('get not on_sell', () => {
      return testfunction("getProducts", {
        filterKey: "",
        page: "0",
        count: "10",
        on_sell: false
      }).then((result) => {
        result.list.length.should.equal(1)
        result.list[0].on_sell.should.equal(false)
      })
    })
    it('get filterKey=1', () => {
      return testfunction("getProducts", {
        filterKey: "1",
        page: "0",
        count: "10"
      }).then((result) => {
        result.list.length.should.equal(1)
        result.end.should.equal(true)
      })
    })
  })
  describe('labels', () => {
    var labelId
    it('getLabels', () => {
      return testfunction("getLabels").then((result) => {
        result.length.should.equal(2)
        labelId = result[0].pmp_product_labels[0].id
      })
    })
    it('deleteLabels', () => {
      return testfunction("deleteLabels", {
        ids: [labelId]
      }).then(() => {
        return testfunction("getLabels")
      }).then((result) => {
        result.length.should.equal(1)
      })
    })
  })
  describe('BrandRoles', () => {
    it('getBrandRoles', () => {
      return testfunction("getBrandRoles").then((result) => {
        result.length.should.equal(4)
      })
    })
  })
  describe('SpecificationOptions', () => {
    it('getSpecificationOptions', () => {
      return testfunction("getSpecificationOptions").then((result) => {
        result.length.should.equal(1)
        result[0].pmp_option_items.length.should.equal(6)
      })
    })
  })
  var productId, product
  describe('submitProduct', () => {
    it('base', () => {
      return testfunction("submitProduct", {
        name: "测试商品"
      }).then((id) => {
        productId = id
      })
    })
    it('change name to 测试商品改', () => {
      return testfunction("submitProduct", {
        id: productId,
        name: "测试商品改"
      }).then(() => {
        return testfunction("getProduct", {
          id: productId
        }).then((result) => {
          result.name.should.equal("测试商品改")
        })
      })
    })
    it('add pmp_variants', () => {
      return testfunction("submitProduct", {
        id: productId,
        pmp_variants: [{
          name: "测试规格"
        }, {
          name: "测试规格t1"
        }, {
          name: "测试规格t2"
        }, {
          name: "测试规格t3"
        }, {
          name: "测试规格t4"
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: productId
        }).then((result) => {
          product = result
          result.pmp_variants.length.should.be.above(0)
          result.pmp_variants[0].name.should.equal("测试规格")
        })
      })
    })
    it('add pmp_variant_images', () => {
      return testfunction("submitProduct", {
        id: productId,
        pmp_variants: [{
          id: product.pmp_variants[0].id,
          pmp_variant_images: [{
            attachment_id: "1"
          }]
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: productId
        }).then((result) => {
          result.pmp_variants.length.should.be.above(0)
          result.pmp_variants[0].name.should.equal("测试规格")
          result.pmp_variants[0].pmp_variant_images.length.should.be.above(0)
          result.pmp_variants[0].pmp_variant_images[0].attachment_id.should.equal(1)
        })
      })
    })
    it('add pmp_specifications', () => {
      return testfunction("submitProduct", {
        id: productId,
        pmp_variants: [{
          id: product.pmp_variants[0].id,
          pmp_specifications: [{
            name: "测试型号",
            on_sell: true
          }]
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: productId
        }).then((result) => {
          result.pmp_variants.length.should.be.above(0)
          result.pmp_variants[0].name.should.equal("测试规格")
          result.pmp_variants[0].pmp_variant_images.length.should.be.above(0)
          result.pmp_variants[0].pmp_specifications[0].name.should.equal("测试型号")
        })
      })
    })
    it('add pmp_product_labels', () => {
      return testfunction("submitProduct", {
        id: productId,
        pmp_product_labels: [{
          pmp_label: {
            name: "新增标签"
          }
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: productId
        }).then((result) => {
          result.pmp_product_labels.length.should.be.above(0)
          result.pmp_product_labels[0].pmp_label.name.should.equal("新增标签")
        })
      })
    })
    it('add pmp_product_prices', () => {
      return testfunction("submitProduct", {
        id: productId,
        pmp_product_prices: [{
          brand_role_code: "1",
          price: "1",
          price_unit: "RMB"
        }, {
          brand_role_code: "2",
          price: "2",
          price_unit: "RMB"
        }, {
          brand_role_code: "2",
          price: "2",
          price_unit: "RMB"
        }, {
          brand_role_code: "2",
          price: "2",
          price_unit: "RMB"
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: productId
        }).then((result) => {
          result.pmp_product_prices.length.should.be.above(0)
          result.pmp_product_prices[0].price_unit.should.equal("RMB")
        })
      })
    })
  })
  describe('Specification', () => {
    var specificationId
    it('getSpecifications', () => {
      return testfunction("getSpecifications", {
        filterKey: "",
        page: "0",
        count: "10"
      }).then((res) => {
        res.list.length.should.equal(1)
        res.end.should.equal(true)
        specificationId = res.list[0].id
      })
    })
    it('getSpecification', () => {
      return testfunction("getSpecification", {
        id: specificationId
      }).then((res) => {
        res.id.should.equal(specificationId)
      })
    })
  })
  describe('scan test', () => {
    before(function() {
      this.timeout(10000)
      var pmp_server = require('../server/pmp_server')
      return pmp_server.clearTestData().then(() => {
        return pmp_server.genauto_tags({
          brand_id: '88',
          crate_totalnum: '7',
          crate_size: '4'
        }, new Date('2016-11-21'))
      })
    })
    it('getBoxCodes', () => {
      return testfunction("getBoxCodes", {
        code: "B-55C-88-4716-0004"
      }).then((list) => {
        list.length.should.be.above(0)
      })
    })
    it('submitCountResult', () => {
      return testfunction("getProduct", {
        id: productId
      }).then((result) => {
        return testfunction("submitCountResult", {
          countList: [{
            pmp_specification_id: result.pmp_variants[0].pmp_specifications[0].id,
            goods_code: "B-55C-88-4716-0004"
          }]
        })
      }).then(() => {
        return pmp_goods.findAll()
      }).then((result) => {
        result.length.should.be.above(0)
      })
    })
  })
})
