export default function(request, next) {
    next((res) => {
        if (res.body) {
            if (res.body.code == "not_login") {
                location.href = "/"
            } else if (res.body.code == "no_authorization") {
                alert(res.body.msg)
            }
        }
    })
}
