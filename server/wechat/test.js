module.exports = function(req, res, next, api, wechatapi) {
    try {
        if (req.query.code) {
            api.getAccessToken(req.query.code, (err, result) => {
                if (result.errcode) {
                    if (result.errcode == 40029) {
                        res.redirect('http://bgy.cyphertech.cn/wechat')
                    } else {
                        res.send(result.errmsg)
                    }
                } else {
                    wechatapi.getUser(result.data.openid, function(err, result) {
                        if (result.subscribe) {
                            res.send("已关�)
                        } else {
                            res.send("未关�)
                        }
                    })
                }
            })
        } else {
            var url = api.getAuthorizeURL('http://bgy.cyphertech.cn/wechat', '', 'snsapi_base')
            res.redirect(url)
        }
    } catch (e) {
        console.log(e)
        res.send(e)
    }
}
