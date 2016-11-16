<template>
  <div>
<div class="history-button">
    <flexbox-item>
        <x-button type="default" @click="ShowFilterBox">筛选</x-button>
    </flexbox-item>
</div>
<div class="history-message">
    <group>
        <cell v-for="item in items">
            <div slot="icon">申请人：{{item.employment_details[1].value}}</div>
            <div slot="icon">申请级别：{{item.brand_role.name}}</div>
            <div slot="icon">申请时间：{{new Date(item.employer_time).Format('yyyy-MM-dd hh:mm:ss')}}</div>
            <x-button mini v-link="{path: '/employManagement/auditInfo/'+item.employee_user_account+'/'+item.guid+'/'+item.brand_guid+'/history'}">查看</x-button>
        </cell>
    </group>
</div>

    <popup :show.sync="show">
        <div>
            <div class="history-level">
            <group title="代理等级">
                <radio :options="radio" @on-change="change"></radio>
            </group>
</div>
 <div class="history-choose">
            <group title="时间范围">
                <datetime :value.sync="date1" title = "" placeholder="请选择日期"></datetime>
                <span>至</span>
                <datetime :value.sync="date2" title = "" placeholder="请选择日期"></datetime>
                <!--<calendar :value.sync="date1" title="从" disable-past></calendar>
                <calendar :value.sync="date2" title="至" disable-past></calendar>-->
<div class="history-buttons">
            <flexbox>
                <flexbox-item>
                    <x-button type="default" @click="commit">确认</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button type="default" @click="reset">重置</x-button>
                </flexbox-item>
            </flexbox></div>
            </group>
        </div></div>
    </popup>
    <alert :show.sync="showAlert" @on-hide="onHide">无记录</alert>
    <toast :show.sync="showToast" :time="1000" type="text">{{errMsg}}</toast>
  </div>
</template>

<script>
    import {
        Cell,
        Group,
        XButton,
        Flexbox,
        FlexboxItem,
        Popup,
        Radio,
        Alert,
        Toast,
        Datetime
    } from 'vux'
    import employAPI from '../api/employment'
    export default {
        data() {
            return {
                errMsg: "",
                date1: "",
                date2: "",
                level: "",
                showAlert: false,
                showToast: false,
                show: false,
                radio: ['一级代理', '二级代理', '三级代理', '销售员', '查看所有'],
                items: []
            }
        },
        components: {
            Group,
            Cell,
            XButton,
            Flexbox,
            FlexboxItem,
            Popup,
            Radio,
            Alert,
            Toast,
            Datetime
        },
        methods: {
            getdata() {
                var that = this
                employAPI.getAuditHistory({
                    level: that.level,
                    date_from: new Date(that.date1),
                    date_to: new Date(that.date2)
                }).then(function(result) {
                    if (!result[0]) {
                        that.showAlert = true
                    }
                    that.items = result
                }).catch(function(err) {
                    console.log(err)
                    that.serveMsg = err
                })
            },
            ShowFilterBox() {
                var that = this
                that.show = true
            },
            change(value) {
                switch (value) {
                    case "一级代理":
                        this.level = "brand_role2"
                        break
                    case "二级代理":
                        this.level = "brand_role3"
                        break
                    case "三级代理":
                        this.level = "brand_role4"
                        break
                    case "销售员":
                        this.level = "brand_role5"
                        break
                    case "查看所有":
                        this.level = "all"
                        break
                }
            },
            reset() {
                this.date1 = ""
                this.date2 = ""
            },
            commit() {
                if ((this.date1 && this.date2) || (!this.date1 && !this.date2)) {
                    if (this.date1 > this.date2) {
                        this.errMsg = "请正确选择日期"
                        this.showToast = true
                    } else {
                        this.getdata()
                        this.show = false
                    }
                } else {
                    this.errMsg = "请选择日期"
                    this.showToast = true
                }
            },
            onHide() {

            }
        },
        ready() {
            this.getdata()
        }
    }
</script>
<style>
    .history-button {
        position: absolute;
        z-index: 1000;
        right: 5%;
        width: 22%;
        top: 11px;
    }

    .history-button button.weui_btn,
    input.weui_btn {
        line-height: 1.8;
       font-size: 4.1vw;/*13px*/
        font-family: "微软雅黑";
        color: #000;
        border-radius: 0;
    }

    .history-button .weui_btn:after {
        border-radius: 0;
    }
    /*信息*/

    .history-message .weui_cell {
        background: #fff;
        border-bottom: 1px solid #d3d1d1;
        border-top: 1px solid #d3d1d1;
        font-size: 4.5vw;/*14px*/
        margin-top: 3%;
        color: #000;
        font-family: "微软雅黑";
        line-height: 1.8em;
        padding: 0px 15px;
    }

    .history-message .weui_cell_hd {
        width: 100%;
    }

    .history-message .weui_btn.weui_btn_mini {
        position: absolute;
        right: 4%;
        width: 24%;
        border-radius: 2px;
        font-family: "微软雅黑";
        background: #5091d5;
        color: #fff;
        top: 33%;
        font-size: 4.5vw;/*14px*/
    }

    .history-message .weui_btn:after {
        border: 0
    }
    /*筛选*/

    .history-level .weui_cell:before {
        border: 0
    }

    .history-level .weui_cell {
        padding: 0;
        border-bottom: 1px solid #d3d1d1;
    }

    .history-level .weui_cell:nth-child(5) {
        border-bottom: 0
    }

    .history-level .weui_cells_title {
        font-size: 4.5vw;/*14px*/
        color: #666666;
        margin-top: 0.2em;
    }

    .history-level .weui_cells_radio {
        background: #fff;
    }

    .history-level .weui_cell_bd.weui_cell_primary p {
        color: #4d4d4d;
        font-size: 4.5vw;/*14px*/
        padding: 5px 15px;
    }

    .history-choose a {
        width: 37%;
        border: 1px solid #d3d1d1;
        margin-bottom: 3%;
    }

    .history-choose .weui_cells_title {
        margin-top: .3em;
        margin-bottom: .2em;
    }

    .history-choose a:nth-child(1) {
        float: left;
        background: #fff;
        margin-left: 4%;
    }

    .history-choose a:nth-child(2) {
        float: right;
        background: #fff;
        margin-right: 4%;
    }
    .history-choose span
{

  float: left;
padding: 1px 3px;
}
    .history-choose .weui_cell {
        padding: 2px 8px;
        background: #fff;
    }

    .history-choose .weui_cell:before {
        border: 0
    }
    .history-choose  .weui_cell_primary{

          -webkit-box-flex: 0;
          -ms-flex: 0;
          flex: 0;


    }
    .history-choose .weui_cell_ft{

    padding-left: 20%;
    }
    .history-choose  .weui_cell_ft.with_arrow:after{
  display:none
    }
    .history-buttons .weui_btn {
        position: relative;
        display: block;
        padding-left: 0;
        padding-right: 0;
        font-size: 4.7vw;/*15px*/
        text-align: center;
        text-decoration: none;
        color: #fff;
        line-height: 2.0;
        border-radius: 0;
        overflow: hidden;
        font-family: "微软雅黑";
    }

    .history-buttons .weui_btn:after {
        border-radius: 0;
        border: 0;
    }

    .history-buttons .vux-flexbox .vux-flexbox-item {
        margin-left: 0px!important;
    }

    .history-buttons .vux-flexbox .vux-flexbox-item:nth-child(1) .weui_btn {
        background: #21c36d;
    }

    .history-buttons .vux-flexbox .vux-flexbox-item:nth-child(2) .weui_btn {
        background: #9b9b9b;
    }
</style>
