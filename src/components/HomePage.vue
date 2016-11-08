<template>
    <div>
        <group>
            <img class="vux-x-img ximg-demo" :src.sync="user.userHeadimgHref" alt="用户头像"/>
            <p>{{user.brandName}}</p>
            <p>存款：金额数</p>
            <p>存货：存货数量</p>
        </group>
        <group>
            <x-input class="weui_cell_primary" title="" :value.sync="keyword"  
                    placeholder="输入需要查看的功能名称" :show-clear=false ></x-input>
            <button class="weui_btn weui_btn_primary" @click="search">搜索</button>
        </group>
        <div>
            <button v-link="btn_list[0].link">
                <img :src.sync="btn_list[0].iconhref" alt="icon" v-show="btn_list[0].isShow">
                <h4 class="weui_media_title">{{btn_list[0].title}}</h4>
            </button>
         </div>
         <div>
            <button v-link="btn_list[1].link">
                <img :src.sync="btn_list[1].iconhref" alt="icon" v-show="btn_list[1].isShow">
                <h4 class="weui_media_title">{{btn_list[1].title}}</h4>
            </button>
         </div>
         <div>
            <button v-link="btn_list[2].link">
                <img :src.sync="btn_list[2].iconhref" alt="icon" v-show="btn_list[2].isShow">
                <h4 class="weui_media_title">{{btn_list[2].title}}</h4>
            </button>
         </div>
         <div>
            <button v-link="btn_list[3].link">
                <img :src.sync="btn_list[3].iconhref" alt="icon" v-show="btn_list[3].isShow">
                <h4 class="weui_media_title">{{btn_list[3].title}}</h4>
            </button>
         </div>
         <div>
            <button v-link="btn_list[4].link">
                <img :src.sync="btn_list[4].iconhref" alt="icon" v-show="btn_list[4].isShow">
                <h4 class="weui_media_title">{{btn_list[4].title}}</h4>
            </button>
         </div>
         <div>
            <button v-link="btn_list[5].link">
                <img :src.sync="btn_list[5].iconhref" alt="icon" v-show="btn_list[5].isShow">
                <h4 class="weui_media_title">{{btn_list[5].title}}</h4>
            </button>
         </div>
         <div>
            <button v-link="btn_list[6].link">
                <img :src.sync="btn_list[6].iconhref" alt="icon" v-show="btn_list[6].isShow">
                <h4 class="weui_media_title">{{btn_list[6].title}}</h4>
            </button>
         </div>
         <div>
            <button v-link="btn_list[7].link">
                <img :src.sync="btn_list[7].iconhref" alt="icon" v-show="btn_list[7].isShow">
                <h4 class="weui_media_title">{{btn_list[7].title}}</h4>
            </button>
         </div>
          <div>
            <button v-link="btn_list[8].link">
                <img :src.sync="btn_list[8].iconhref" alt="icon" v-show="btn_list[8].isShow">
                <h4 class="weui_media_title">{{btn_list[8].title}}</h4>
            </button>
         </div>

	</div>
</template>

<script>
    import {
        Group,
        XInput
    } from 'vux'
    import authAPI from '../api/auth'
    import employmentAPI from '../api/employment'


    export default {
        components: {
            Group,
            XInput
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
</style>