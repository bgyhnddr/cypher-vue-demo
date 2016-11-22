var exec = {
  getJsConfig(req, res, next, api, wechatapi) {
    var list = req.body.list
    var url = req.body.url
    param = {
      debug: false,
      jsApiList: list,
      url: url
    }
    return new Promise((resolve, reject) => {
      wechatapi.getJsConfig(param, function(err, result) {
        resolve(result)
      })
    })
  },
  saveAttachment(req, res, next, api, wechatapi) {
    // var crypto = require('crypto')
    // var fs = require('fs')
    // var rs = fs.createReadStream('upload/files/6e51cf7a10d7b9c225e142bbf3498bb1')
    //
    // var hash = crypto.createHash('md5')
    // rs.on('data', hash.update.bind(hash))
    //
    // return new Promise((resolve) => {
    //   rs.on('end', function() {
    //     var d = hash.digest('hex')
    //     console.log(d)
    //     resolve(d)
    //   })
    // })
    return new Promise((resolve) => {
      wechatapi.uploadMedia('upload/files/6e51cf7a10d7b9c225e142bbf3498bb1', "image", function(err, result) {
        console.log(result)
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
