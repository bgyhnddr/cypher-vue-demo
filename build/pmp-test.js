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
      }])
    ]),
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
        action
      },
      query: params,
      body: params
    }, cres)
  }

  Promise.resolve("beginTest").then(() => {
    console.log("\n测试getProducts")
    return testfunction("getProducts", {
      pmp_brand_id: "1",
      filterKey: "",
      page: "0",
      count: "10"
    }).then((result) => {
      if (result.list.length == 2) {
        console.log("通过")
      } else {
        console.log("不通过")
      }
    })
  }).then(() => {
    console.log("\n测试getProduct")
    return testfunction("getProduct", {
      id: "1"
    }).then((result) => {
      if (result.id == 1) {
        console.log("通过")
      } else {
        console.log(result)
        console.log("不通过")
      }
    })
  }).then(() => {
    console.log("\n测试getLabels")
    return testfunction("getLabels", {
      pmp_brand_id: "1"
    }).then((result) => {
      if (result.length == 2) {
        console.log("通过")
      } else {
        console.log(result)
        console.log("不通过")
      }
    })
  }).then(() => {
    console.log("\n测试deleteLabels")
    return testfunction("deleteLabels", {
      ids: ["1"]
    }).then(() => {
      return testfunction("getLabels", {
        pmp_brand_id: "1"
      })
    }).then((result) => {
      if (result.length == 1) {
        console.log("通过")
      } else {
        console.log(result)
        console.log("不通过")
      }
    })
  }).then(() => {
    console.log("\n测试getBrandRoles")
    return testfunction("getBrandRoles").then((result) => {
      if (result.length == 4) {
        console.log("通过")
      } else {
        console.log(result)
        console.log("不通过")
      }
    })
  }).then(() => {
    console.log("\n测试getSpecificationOptions")
    return testfunction("getSpecificationOptions", {
      pmp_brand_id: "1"
    }).then((result) => {
      if (result.length == 1 && result[0].pmp_option_items.length == 6) {
        console.log("通过")
      } else {
        console.log(result)
        console.log("不通过")
      }
    })
  }).then(() => {
    console.log("\n测试submitProduct")
    console.log("\n创建测试商品3")
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
      if (result.list.length == 3) {
        console.log("通过")
      } else {
        console.log(result)
        console.log("不通过")
      }
    }).then(() => {
      console.log("\n修改商品3名字为测试商品3改")
      return testfunction("submitProduct", {
        id: "3",
        name: "测试商品3改"
      }).then(() => {
        return testfunction("getProduct", {
          id: "3"
        }).then((result) => {
          if (result.name == "测试商品3改") {
            console.log("通过")
          } else {
            console.log(result)
            console.log("不通过")
          }
        })
      })
    }).then(() => {
      console.log("\n为测试商品3改添加一个规格")
      return testfunction("submitProduct", {
        id: "3",
        pmp_variants: [{
          name: "测试规格"
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: "3"
        }).then((result) => {
          if (result.pmp_variants.length > 0 && result.pmp_variants[0].name == "测试规格") {
            console.log("通过")
            return result.pmp_variants[0].id
          } else {
            console.log(result)
            console.log("不通过")
          }
        })
      })
    }).then((vid) => {
      console.log("\n为测试商品3规格添加一个图片")
      return testfunction("submitProduct", {
        id: "3",
        pmp_variants: [{
          id: vid,
          pmp_variant_images: [{
            attachment_id: "1"
          }]
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: "3"
        }).then((result) => {
          if (result.pmp_variants.length > 0 &&
            result.pmp_variants[0].name == "测试规格" &&
            result.pmp_variants[0].pmp_variant_images.length > 0 &&
            result.pmp_variants[0].pmp_variant_images[0].attachment_id == "1") {
            console.log("通过")
            return vid
          } else {
            console.log(result)
            console.log("不通过")
          }
        })
      })
    }).then((vid) => {
      console.log("\n为测试商品3规格添加一个型号")
      return testfunction("submitProduct", {
        id: "3",
        pmp_variants: [{
          id: vid,
          pmp_specifications: [{
            name: "测试型号"
          }]
        }]
      }).then(() => {
        return testfunction("getProduct", {
          id: "3"
        }).then((result) => {
          if (result.pmp_variants.length > 0 &&
            result.pmp_variants[0].name == "测试规格" &&
            result.pmp_variants[0].pmp_specifications.length > 0 &&
            result.pmp_variants[0].pmp_specifications[0].name == "测试型号") {
            console.log("通过")
          } else {
            console.log(result)
            console.log("不通过")
          }
        })
      })
    }).then((vid) => {
      console.log("\n为测试商品3添加一个标签")
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
          if (result.pmp_product_labels.length > 0 &&
            result.pmp_product_labels[0].pmp_label.name == "新增标签") {
            console.log("通过")
          } else {
            console.log(result)
            console.log("不通过")
          }
        })
      })
    }).then((vid) => {
      console.log("\n为测试商品3添加一个价格")
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
          if (result.pmp_product_prices.length > 0 &&
            result.pmp_product_prices[0].price_unit == "RMB") {
            console.log("通过")
          } else {
            console.log(result)
            console.log("不通过")
          }
        })
      })
    })
  })
}).catch((e) => {
  console.log(e)
})
