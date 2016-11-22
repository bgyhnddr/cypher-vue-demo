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
    var crypto = require('crypto')
    var fs = require('fs')
    var media_id = req.query.media_id

    if (!fs.existsSync("upload")) {
      fs.mkdirSync("upload")
    }

    if (!fs.existsSync("upload/files")) {
      fs.mkdirSync("upload/files")
    }

    var file = require('../../db/models/file')
    var attachment = require('../../db/models/attachment')
    return new Promise((resolve) => {
      wechatapi.getMedia(media_id, function(err, buffer, res) {
        var hash = crypto.createHash('md5')
        hash.update(buffer)
        var md5 = hash.digest('hex')

        fs.writeFileSync("upload/files/" + md5, buffer)
        console.log(res.headers)

        resolve({
          md5: md5,
          res: res
        })
      })
    }).then((result) => {
      return file.upsert({
        hash: result.md5,
        size: result.res.headers["content-length"],
        path: "upload/files/" + result.md5,
        type: result.res.headers["content-type"]
      }).then(() => {
        return attachment.create({
          file_hash: result.md5,
          name: result.md5
        })
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
