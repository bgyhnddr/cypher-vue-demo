console.log("初始化PMP数据库")
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


var pmp_brand_id
Promise.all([
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
}))).then((result) => {
  console.log("插入测试数据")
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
                name: "测试" + o.id
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
}).then(function() {
  console.log("初始化完成")
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
        token: "123"
      },
      query: params,
      body: params
    }, cres)
  }

  Promise.resolve("beginTest").then(() => {
    console.log("pmp_brand_id=" + pmp_brand_id)
    console.log("测试getProducts获取所有商品")
    return testfunction("getProducts", {
      pmp_brand_id: pmp_brand_id,
      filterKey: "",
      page: "0",
      count: "10"
    }).then((result) => {
      if (result.list.length == 3) {
        console.log("通过")
      } else {
        console.log("不通过")
      }
    })
  }).then(() => {
    console.log("测试getProducts获取on_sell商品")
    return testfunction("getProducts", {
      pmp_brand_id: pmp_brand_id,
      filterKey: "",
      page: "0",
      count: "10",
      on_sell: true
    }).then((result) => {
      if (result.list.length == 1 && result.list[0].on_sell) {
        console.log("通过")
      } else {
        console.log("不通过")
      }
    })
  }).then(() => {
    console.log("测试getProducts获取非on_sell商品")
    return testfunction("getProducts", {
      pmp_brand_id: pmp_brand_id,
      filterKey: "",
      page: "0",
      count: "10",
      on_sell: false
    }).then((result) => {
      if (result.list.length == 1 && !result.list[0].on_sell) {
        console.log("通过")
      } else {
        console.log("不通过")
      }
    })
  }).then(() => {
    console.log("测试getLabels")
    return testfunction("getLabels", {
      pmp_brand_id: pmp_brand_id
    }).then((result) => {
      if (result.length == 2) {
        console.log("通过")
        return result[0].pmp_product_labels[0].id
      } else {
        console.log(result.length)
        console.log("不通过")
      }
    })
  }).then((id) => {
    console.log("测试deleteLabels")
    return testfunction("deleteLabels", {
      ids: [id]
    }).then(() => {
      return testfunction("getLabels", {
        pmp_brand_id: pmp_brand_id
      })
    }).then((result) => {
      if (result.length == 1) {
        console.log("通过")
      } else {
        console.log(result.length)
        console.log("不通过")
      }
    })
  }).then(() => {
    console.log("测试getBrandRoles")
    return testfunction("getBrandRoles").then((result) => {
      if (result.length == 4) {
        console.log("通过")
      } else {
        console.log("不通过")
      }
    })
  }).then(() => {
    console.log("测试getSpecificationOptions")
    return testfunction("getSpecificationOptions", {
      pmp_brand_id: pmp_brand_id
    }).then((result) => {
      if (result.length == 1 && result[0].pmp_option_items.length == 6) {
        console.log("通过")
      } else {
        console.log("不通过")
      }
    })
  }).then(() => {
    console.log("测试submitProduct")
    console.log("创建测试商品")
    return testfunction("submitProduct", {
      pmp_brand_id: pmp_brand_id,
      name: "测试商品"
    }).then((id) => {
      return testfunction("getProducts", {
        pmp_brand_id: pmp_brand_id,
        filterKey: "",
        page: "0",
        count: "10"
      }).then((result) => {
        return [id, result]
      })
    }).then((result) => {
      if (result[1].list.length == 4) {
        console.log("通过")
        return result[0]
      } else {
        console.log(result[1].list.length)
        console.log("不通过")
      }
    }).then((id) => {
      console.log("修改测试商品名字为测试商品改")
      return testfunction("submitProduct", {
        id: id,
        name: "测试商品改"
      }).then(() => {
        return testfunction("getProduct", {
          id: id
        }).then((result) => {
          if (result.name == "测试商品改") {
            console.log("通过")
            return id
          } else {
            console.log("不通过")
          }
        })
      })
    }).then((id) => {
      console.log("为测试商品改添加一个规格")
      return testfunction("submitProduct", {
        id: id,
        pmp_variants: [{
          name: "测试规格"
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: id
        }).then((result) => {
          if (result.pmp_variants.length > 0 && result.pmp_variants[0].name == "测试规格") {
            console.log("通过")
            return result
          } else {
            console.log("不通过")
          }
        })
      })
    }).then((result) => {
      console.log("为测试商品规格添加一个图片")
      return testfunction("submitProduct", {
        id: result.id,
        pmp_variants: [{
          id: result.pmp_variants[0].id,
          pmp_variant_images: [{
            attachment_id: "1"
          }]
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: result.id
        }).then((result) => {
          if (result.pmp_variants.length > 0 &&
            result.pmp_variants[0].name == "测试规格" &&
            result.pmp_variants[0].pmp_variant_images.length > 0 &&
            result.pmp_variants[0].pmp_variant_images[0].attachment_id == "1") {
            console.log("通过")
            return result
          } else {
            console.log("不通过")
          }
        })
      })
    }).then((result) => {
      console.log("为测试商品规格添加一个型号")
      return testfunction("submitProduct", {
        id: result.id,
        pmp_variants: [{
          id: result.pmp_variants[0].id,
          pmp_specifications: [{
            name: "测试型号"
          }]
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: result.id
        }).then((result) => {
          if (result.pmp_variants.length > 0 &&
            result.pmp_variants[0].name == "测试规格" &&
            result.pmp_variants[0].pmp_specifications.length > 0 &&
            result.pmp_variants[0].pmp_specifications[0].name == "测试型号") {
            console.log("通过")
            return result
          } else {
            console.log("不通过")
          }
        })
      })
    }).then((result) => {
      console.log("为测试商品添加一个标签")
      return testfunction("submitProduct", {
        id: result.id,
        pmp_product_labels: [{
          pmp_label: {
            name: "新增标签"
          }
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: result.id
        }).then((result) => {
          if (result.pmp_product_labels.length > 0 &&
            result.pmp_product_labels[0].pmp_label.name == "新增标签") {
            console.log("通过")
            return result
          } else {
            console.log("不通过")
          }
        })
      })
    }).then((result) => {
      console.log("为测试商品添加一个价格")
      return testfunction("submitProduct", {
        id: result.id,
        pmp_product_prices: [{
          brand_role_code: "1",
          price: "1",
          price_unit: "RMB"
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: result.id
        }).then((result) => {
          if (result.pmp_product_prices.length > 0 &&
            result.pmp_product_prices[0].price_unit == "RMB") {
            console.log("通过")
          } else {
            console.log("不通过")
          }
        })
      })
    })
  }).then(() => {
    console.log("submitProduct 测试完毕")
  })
}).catch((e) => {
  console.log(e)
})
