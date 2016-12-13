var exec = {
  /**
   * 获取商品列表
   */
  getCommoditys(req, res, next) {
    return {
      end: false,
      list: []
    }
  },
  /**
   * 获取商品
   */
  getCommodity(req, res, next) {
    return {

    }
  },
  /**
   * 获取所有标签
   */
  getTags(req, res, next) {

  },
  /**
   * 获取代理列表
   */
  getBrandRoles(req, res, next) {

  },
  /**
   * 获取代理列表
   */
  getBrandRoles(req, res, next) {

  },
  /**
   * 提交商品，提交需要修改的结构
   */
  submitCommodity(req, res, next) {

  },
  /**
   * 提交商品，提交需要修改的结构
   */
  getSpecificationOptions(req, res, next) {

  }
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
