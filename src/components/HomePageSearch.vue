<template>
    <div>
        <group>
            <x-input class="weui_cell_primary" title='' :value.sync="keyword" :show-clear=false ></x-input>
            <button class="weui_btn weui_btn_primary" @click="search">搜索</button>
        </group>
        <group>
            <p>功能</p>
            <a class="weui_cell" v-for="item in funcList" v-link="item.link" v-show="item.isShow">
                <div class="weui_cell_hd">
                    <img :src.sync="item.iconhref" />
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>{{item.name}}</p>
                </div>
            </a>
        </group>
    </div>
</template>

<script>
    import {
        Group,
        XInput
    } from 'vux'
    import authAPI from '../api/auth'
    import agentInfoAPI from '../api/agentInfo'


    export default {
        components: {
            Group,
            XInput
        },
        data() {
            return {
                keyword: null,
                userInfo: {},
                userLevel: null,
                funcList: [{
                    name: '发起招募',
                    iconhref: '/static/icon/initiate.png',
                    link: '/employManagement/chooseEmployableRoles',
                    isShow: true
                }, {
                    name: '当前招募',
                    iconhref: '/static/icon/current.png',
                    link: null,
                    isShow: true
                }, {
                    name: '成员审核',
                    iconhref: '/static/icon/audit.png',
                    link: '/employManagement/audit',
                    isShow: true
                }, {
                    name: '招募历史',
                    iconhref: '/static/icon/history.png',
                    link: '/employManagement/employmentHistory',
                    isShow: true
                }, {
                    name: '我的证书',
                    iconhref: '/static/icon/user.png',
                    link: null, //TODO 
                    isShow: true
                }, {
                    name: '修改密码',
                    iconhref: '/static/icon/password.png',
                    link: '/auth/changepwd',
                    isShow: true
                }, {
                    name: '修改手机号',
                    iconhref: '',
                    link: null,
                    isShow: true
                }, {
                    name: '修改微信号',
                    iconhref: '',
                    link: null,
                    isShow: true
                }],
            }
        },
        methods: {
            init() {
                var that = this
                this.keyword = this.$route.params.keyword

                //获取用户角色
                authAPI.getUser().then(function(result) {
                    that.userInfo = result
                    console.log("用户账号:" + that.userInfo.name)

                    //根据级别选择显示功能
                    agentInfoAPI.getBrandRoleInfo({
                        user_account: that.userInfo.name
                    }).then(function(result) {
                        console.log(JSON.stringify(result))
                        that.userLevel = result.brand_role.level
                        that.filter(that.$route.params.keyword)
                    }).catch(function(err) {
                        window.alert(err)
                    })
                })
            },
            search() {
                console.log("开始搜索")
                var reg = /^[\u4e00-\u9fa5]*$/ //中文

                if (this.keyword == null) {
                    window.alert("搜索框内容不能为空")
                } else if (!reg.test(this.keyword)) {
                    window.alert("填写格式错误，请填写中文")
                } else {
                    this.filter(this.keyword)
                }
            },
            filter(keyword) {
                //根据级别选择显示功能
                if (this.userLevel == "0") {
                    for (var item in this.funcList) {
                        if (this.funcList[item]['name'] == '成员审核' || this.funcList[item]['name'] == '我的证书') {
                            this.funcList[item].isShow = false
                        } else {
                            this.funcList[item].isShow = true
                        }
                    }
                } else {
                    for (var item in this.funcList) {
                        this.funcList[item].isShow = true
                    }
                }

                //根据搜索关键字选择显示功能
                for (var item in this.funcList) {
                    if (this.funcList[item].name.match(keyword) == null) {
                        this.funcList[item].isShow = false
                    }
                }

                console.log(JSON.stringify(this.funcList))
            }
        },
        ready() {
            this.init()
        }
    }
</script>
<style lang="less">

</style>