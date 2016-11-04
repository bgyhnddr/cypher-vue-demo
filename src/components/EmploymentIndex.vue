<template>
    <div>
        <a class="weui_cell"  v-link="{path: 'employManagement/chooseEmployableRoles'}" >
            <div class="weui_cell_hd">
               <img src="../icon/initiate.png" />
            </div>
            <div class="weui_cell_bd weui_cell_primary">
                <p>发起招募</p>
                <p>发起招募申请表</p>
            </div>
            <div class="weui_cell_ft" :class="{'with_arrow': true}">
                <slot name="value"></slot>
                <slot></slot>
            </div>
        </a>
	</div>
</template>

<script>
    import authAPI from '../api/auth'
    import agentInfoAPI from '../api/agentInfo'

    export default {
        data() {
            return {
                user: {
                    user_info: {},
                    brand_info: {
                        brand_role: {
                            agent_brand_role: {
                                agent: {}
                            }
                        }
                    }
                }
            }
        },
        methods: {
            getPersonalInfo() {
                var that = this
                authAPI.getUser().then(function(result) {
                    if (typeof(result.name) == 'undefined') {
                        window.alert("获取用户登录信息失败，请重新登录")
                        that.$route.router.go('/auth/login')
                        return
                    }

                    that.user.user_info = result
                    console.log("用户账号:" + that.user.user_info.name)

                    agentInfoAPI.getBrandInfo({
                        user_account: that.user.user_info.name
                    }).then(function(result) {
                        that.user.brand_info = result
                    }).catch(function(err) {
                        window.alert(err)
                    })
                })
            }
        },
        ready() {
            this.getPersonalInfo()
        }
    }
</script>
<style lang="less">

body {
    font-family: "微软雅黑";
    background-color: #f2f2f2;
}
/*顶栏*/
a.vux-header-back.headerTransition-transition {
    display: block;
    font-size: 14px;
    color: #fff;
    font-family: "微软雅黑";
}
/*发起招募*/
.weui_cell img {
    width: 70%;
    margin: 6% 0 0 0;
}
.view.fate-transition {
    margin-top: 10px;
}
.weui_cell_bd.weui_cell_primary p:first-child {
    font-size: 15px;
 font-family: "微软雅黑";
}
.weui_cell_bd.weui_cell_primary p:nth-child(2) {
    font-size: 12px;
    color: #999999;
    font-family: "微软雅黑";
    margin-top: -2%;
}
.weui_cell {
    padding: 1px 15px;
    background: #fff;
}
.weui_cell_hd {
    width: 16%;
}
/*图标大小*/
.vux-header .vux-header-left .vux-header-back:before {
  
    border: 1px solid #fff;
    border-width: 2px 0 0 2px;}
.weui_cell_ft.with_arrow:after {
    border-width: 2px 2px 0 0;
    border-color: #9a9fa4;
top: -2px;
right: 2px;
}


</style>