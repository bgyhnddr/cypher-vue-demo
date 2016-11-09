<template>
<div>
    <group>
        <table border="0" class="platform-message" cellspacing=0 cellpadding=0>
            <tbody>
                <tr>
                    <td width="22%"> <img class="vux-x-img ximg-demo" :src.sync="user.userHeadimgHref" alt="用户头像" /></td>
                    <td>{{user.brandName}}</td>
                    <td> </td>
                    <td>
                        <p>存款&nbsp;:&nbsp;<label>金额数</label></p>
                        <p>存货&nbsp;:&nbsp;<label>存货数量</p></label>
                    </td>
                </tr>
            </tbody>
        </table>
    </group>
    <group>
        <div class="search">
            <x-input class="weui_cell_primary" title="" :value.sync="keyword" placeholder="输入需要查看的功能名称" :show-clear=false></x-input>
            <div class="search-button"><button class="weui_btn weui_btn_primary" @click="search">.</button></div>
        </div>
    </group>
    <div>
    <flexbox :gutter="0" wrap="wrap">
        <flexbox-item :span="1/3" v-for="item in btn_list">
            <div class="flex-demo">
                 <button v-link="item.link">
                    <img :src.sync="item.iconhref" alt="icon" v-show="item.isShow">
                    <h4 class="weui_media_title">{{item.title}}</h4>
                </button>
            </div>
        </flexbox-item>
    </flexbox>
</div>

</template>

<script>
    import {
        Group,
        XInput,
        Flexbox,
        FlexboxItem
    } from 'vux'
    import authAPI from '../api/auth'
    import employmentAPI from '../api/employment'


    export default {
        components: {
            Group,
            XInput,
            Flexbox,
            FlexboxItem
        },
        data() {
            return {
                btn_list: [{
                    title: '货品销售',
                    link: '',
                    iconhref: '/static/icon/audit.png',
                    isShow: true
                }, {
                    title: '货品查验',
                    link: '',
                    iconhref: null,
                    isShow: true
                }, {
                    title: '成员招募',
                    link: '/employManagement',
                    iconhref: null,
                    isShow: true
                }, {
                    title: '订货管理',
                    link: '',
                    iconhref: '',
                    isShow: true
                }, {
                    title: '我的库存',
                    link: '',
                    iconhref: '',
                    isShow: true
                }, {
                    title: '我的团队',
                    link: '',
                    iconhref: '',
                    isShow: true
                }, {
                    title: '我的货品',
                    link: '',
                    iconhref: '',
                    isShow: true
                }, {
                    title: '我的账户',
                    link: '/accountManagement',
                    iconhref: '',
                    isShow: true
                }, {
                    title: '更多功能，敬请期待',
                    isShow: false
                }],
                keyword: null,
                user: {
                    userInfo: {},
                    agentInfo: {},
                    userHeadimgHref: null,
                    brandName: null
                }
            }
        },
        methods: {
            init() {
                var that = this
                authAPI.getUser().then(function(result) {
                    that.user.userInfo = result
                    that.getAgentInfo(result.name)
                }).catch(function(err) {
                    window.alert(err)
                })
            },
            search() {
                console.log("开始搜索")
                var reg = /^[\u4e00-\u9fa5]*$/ //全中文

                if (this.keyword == null) {
                    window.alert("搜索框内容不能为空")
                } else if (!reg.test(this.keyword)) {
                    window.alert("填写格式错误，请填写中文")
                } else {
                    // window.alert("填暂不开放")
                    this.$route.router.go('/homePage/search/' + this.keyword)
                }
            },
            getAgentInfo(user_account) {
                var that = this
                console.log(this.user.userInfo.name)
                employmentAPI.getAgentInfo({
                    user_account: user_account
                }).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.user.agentInfo = result
                    for (var item in result.agent_details) {
                        for (var meta in result.agent_details[item]) {
                            //key = "headImg"
                            if (meta == 'key' && result.agent_details[item][meta] == 'headImg') {
                                console.log(result.agent_details[item]['value'])
                                var user_headImg_href = parseInt(result.agent_details[item]['value'])
                                console.log("/service/public/upload/getAttachment?id=" + user_headImg_href)
                                that.user.userHeadimgHref = "/service/public/upload/getAttachment?id=" + user_headImg_href
                            }
                        }
                    }
                }).catch(function(err) {
                    window.alert(err)
                })

                employmentAPI.getBrandInfo({
                    user_account: user_account
                }).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.user.brandName = result.name
                }).catch(function(err) {
                    window.alert(err)
                })
            }
        },
        ready() {
            this.init()
        }
    }
</script>
<style lang="less">
    div.icon_btn {
        width: 110px;
    }
    
    table.platform-message {
        width: 94%;
        margin: auto;
        margin-top: 5%;
        color: #292832;
    }
    
    table.platform-message img {
        width: 4em;
        height: 4em;
        border-radius: 50%;
        border: 2px solid #fff;
    }
    
    table.platform-message label {
        color: #646464
    }
    
    .search .weui_cell {
        padding: 9px
    }
    
    .search .weui_cell_hd {
        width: 0;
    }
    
    .search input.weui_input {
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
    
    .search-button {
        position: absolute;
        z-index: 10000000;
        right: 9%;
        top: 23%;
    }
    
    .search-button button.weui_btn.weui_btn_primary {
        width: 10%;
        line-height: 2.0;
        background: url(/static/TestIMG/search.png);
        background-size: 100%;
        background-repeat: no-repeat;
    }
    
    .search-button .weui_btn:after {
        border: 0;
    }
    
    .search .weui_icon_warn:before {
        font-size: 14px;
        color: #f43530;
    }
</style>