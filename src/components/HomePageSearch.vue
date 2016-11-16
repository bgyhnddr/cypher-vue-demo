<template>
<div>
    <div class="function-search">
        <group>
            <x-input class="weui_cell_primary" title='' :value.sync="keyword" :show-clear=false :required="false"></x-input>
            <div class="function-search-button"><button class="weui_btn weui_btn_primary" @click="search">.</button></div>
        </group>
    </div>
    <div class="function-search-list">
        <h1>功能</h1>
        <group v-if="showResult">
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
    <alert :show.sync="show" button-text="确认">{{errorMsg}}</alert>
</div>
</template>

<script>
    import {
        Group,
        XInput,
        Alert
    } from 'vux'
    import authAPI from '../api/auth'
    import agentInfoAPI from '../api/agentInfo'


    export default {
        components: {
            Group,
            XInput,
            Alert
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
                show: false,
                errorMsg: null,
                showResult: false
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
                        this.show = true
                        this.errorMsg = err
                    })
                })
            },
            search() {
                console.log("开始搜索")
                var reg = /^[\u4e00-\u9fa5]*$/ //中文

                if (this.keyword == null || this.keyword == '') {
                    this.show = true
                    this.errorMsg = "搜索框内容不能为空"
                } else if (!reg.test(this.keyword)) {
                    this.show = true
                    this.errorMsg = "填写格式错误，请填写中文"
                } else {
                    this.showResult = false
                    this.filter(this.keyword)
                }
            },
            filter(keyword) {
                //根据级别选择显示功能
                if (this.userLevel == "0") {
                    for (var item in this.funcList) {
                        if (this.funcList[item]['name'] == '成员审核') {
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
                this.showResult = true
                console.log(JSON.stringify(this.funcList))
            }
        },
        ready() {
            this.init()
        }
    }
</script>
<style lang="less">
    .function-search .weui_cell {
        padding: 9px
    }
    
    .function-search .weui_cell_hd {
        width: 0;
    }
    
    .function-search input.weui_input {
        width: 97%;
        background: #fff;
        margin: auto;
        padding-left: 2%;
        height: 2.1em;
        font-family: "微软雅黑";
        font-size: 15px;
        color: #9b9c9c;
        border: 1px solid #d3d1d1;
    }
    
    .function-search-button {
        position: absolute;
        z-index: 10000000;
        right: 9%;
        top: 23%;
    }
    
    .function-search-button button.weui_btn.weui_btn_primary {
        width: 10%;
        line-height: 2.0;
        background: url(/static/TestIMG/search.png);
        background-size: 100%;
        background-repeat: no-repeat;
    }
    
    .function-search-button .weui_btn:after {
        border: 0;
    }
    
    .function-search .weui_icon_warn:before {
        font-size: 14px;
        color: #f43530;
    }
    
    .function-search-list {
        background: #fff;
        border-top: 1px solid #d3d1d1;
        border-bottom: 1px solid #d3d1d1;
    }
    
    .function-search-list h1 {
        color: #393a3f;
        font-size: 15px;
        font-family: "微软雅黑";
        padding: 2% 4%;
        font-weight: normal;
    }
    
    .function-search-list .weui_cell:before {
        border-top: 0
    }
    
    .function-search-list .weui_cell {
        border-top: 1px solid #d3d1d1;
        padding: 7px 3% 4px 3%;
    }
    
    .function-search-list .weui_cell_hd {
        width: 11%;
    }
    
    .function-search-list img {
        width: 80%
    }
</style>