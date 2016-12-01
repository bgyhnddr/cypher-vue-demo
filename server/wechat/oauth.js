module.exports = function(req, res, next, api, wechatapi) {
  return new Promise((resolve, reject) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    if (req.query.code) {
      api.getAccessToken(req.query.code, (err, result) => {
        if (result.errcode) {
          reject(result.errmsg)
        } else {
          wechatapi.getUser(result.data.openid, function(err, result) {
            if (result.subscribe) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        }
      })
    } else {
      var url = api.getAuthorizeURL(fullUrl, '', 'snsapi_base')
      res.redirect(url)
    }
  })
}
