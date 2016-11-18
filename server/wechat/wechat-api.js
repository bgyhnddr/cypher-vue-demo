var exec = {
  getJsConfig(req, res, next, api, wechatapi) {
    var list = req.body.list
    param = {
      debug: false,
      jsApiList: list,
      url: req.url
    }
    return new Promise((resolve, reject) => {
      wechatapi.getJsConfig(param, function(err, result) {
        resolve(result)
      })
    })
  }
}

module.exports = (req, res, next, api, wechatapi) => {
  var action = req.params.action
  Promise.resolve(action).then(function(result) {
    return exec[result](req, res, next, api, wechatapi)
  }).then(function(result) {
    res.send(result)
  }).catch(function(error) {
    res.status(500).send(error.toString())
  })
}
