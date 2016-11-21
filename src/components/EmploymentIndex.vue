<template>

    <div class="employmentindex-bac">

        <group v-if="showClickModel">
         <a class="weui_cell a-li a-li-first" v-if="showCreateClick"  v-link="{path: '/employManagement/chooseEmployableRoles'}" >
            <div class="weui_cell_hd">
               <img src="/static/TestIMG/initiate.png" />
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
            <!--当前招募-->
            <a class="weui_cell a-li "  v-link="{path: '/employManagement/currentList'}" >
                <div class="weui_cell_hd">
                      <img src="/static/TestIMG/current.png" />
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>当前招募</p>
                    <p>查看当前进行的招募状态</p>
                </div>
                <div class="weui_cell_ft" :class="{'with_arrow': true}">
                    <slot name="value"></slot>
                    <slot></slot>
                </div>
            </a>
            <!--成员审核-->
            <a class="weui_cell a-li" v-if="showAuditClick" v-link="{path: '/employManagement/audit'}" >
                <div class="weui_cell_hd">
                     <img src="/static/TestIMG/audit.png"/>
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>成员审核</p>
                    <p>审核新代理申请表</p>
                </div>
                <div class="weui_cell_ft" :class="{'with_arrow': true}">
                   <label> <slot name="value">{{auditListLength}}</slot></label>
                    <slot></slot>
                </div>
            </a>
            <!--招募历史-->
            <a class="weui_cell a-li-last"  v-link="{path: '/employManagement/employmentHistory'}" >
                <div class="weui_cell_hd">
                     <img src="/static/TestIMG/history.png" />
                </div>
                <div class="weui_cell_bd weui_cell_primary">
                    <p>招募历史</p>
                    <p>查看已成功招募信息</p>
                </div>
                <div class="weui_cell_ft" :class="{'with_arrow': true}">
                    <slot name="value"></slot>
                    <slot></slot>
                </div>
            </a>
        </group>
        <alert :show.sync="showMsg" button-text="确认">{{errorMsg}}</alert>
	</div>
  <div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
    import {
        Group,
        Alert
    } from 'vux'
    import authAPI from '../api/auth'
    import agentInfoAPI from '../api/agentInfo'
    import employmentAPI from '../api/employment'

    export default {
        components: {
            Group,
            Alert
        },
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
                },
                showAuditClick: false,
                showCreateClick: false,
                auditListLength: null,
                showMsg: false,
                errorMsg: null,
                showClickModel: false
            }
        },
        methods: {
            getPersonalInfo() {
                var that = this
                    agentInfoAPI.getBrandRoleInfo().then(function(result) {
                        employmentAPI.getAuditList().then(function(result) {
                            if (result.length != 0) {
                                that.auditListLength = result.length
                            } else {
                                that.auditListLength = null
                            }
                        }).catch(function(err) {
                            this.showMsg = true
                            this.errorMsg = err
                        })
                        
                        if (result.brand_role.level == "0") {
                            that.showAuditClick = true
                        }
                        if (result.brand_role.level != "4") {
                            that.showCreateClick = true
                        }
                        that.user.brand_info = result
                        that.showClickModel = true
                    }).catch(function(err) {
                        this.showMsg = true
                        this.errorMsg = err
                    })

            }
        },
        ready() {
            this.getPersonalInfo()
        }
    }
</script>
<style lang="less">
    .employmentindex-bac {
        font-family: "微软雅黑";
        background-color: #f2f2f2;
            min-height: 460px;
    }
    /*顶栏*/

    a.vux-header-back.headerTransition-transition {
        display: block;
        font-size: 4.5vw;/*14px*/
        color: #fff;
        font-family: "微软雅黑";
    }
    /*背景*/

    .weui_cells {
        background: none;
        border: 0;
    }
    .employmentindex-bac  .weui_cell:before{
  border: 0;

    }
    /*发起招募*/

    a.weui_cell.a-li.a-li-first {
        margin-top: 11px;
    }

    .a-li {
        padding: 2px 15px;
        background: #fff;
        margin-bottom: 3px;
    }

    .a-li-last {
        padding: 1px 15px;
        background: #fff;
    }

    .a-li img,
    .a-li-last img {
        width: 70%;
        margin: 6% 0 0 0;
        height: auto;
    }

    .weui_cell_bd.weui_cell_primary p:first-child {
        font-size: 4.7vw;/*15px*/
        font-family: "微软雅黑";
    }

    .weui_cell_bd.weui_cell_primary p:nth-child(2) {
        font-size: 3.9vw;/*12px*/
        color: #999999;
        font-family: "微软雅黑";
        margin-top: -1%;
    }

    .weui_cell_hd {
        width: 16%;
    }
    /*图标大小*/

    .vux-header .vux-header-left .vux-header-back:before {
        border: 1px solid #fff;
        border-width: 2px 0 0 2px;
    }

    .weui_cell_ft.with_arrow:after {
        border-width: 2px 2px 0 0;
        border-color: #9a9fa4;
        top: -2px;
        right: 2px;
        height: 8px;
        width: 8px;
    }

    .a-li label {
         font-size: 4.9vw;/*16px*/
        color: #000;
    }
</style>
