<template>
  <div>
    <flexbox-item>
        <x-button type="default" @click="ShowFilterBox">筛选</x-button>
    </flexbox-item>
    <group>
        <cell v-for="item in items">
            <div slot="icon">申请人：{{item.employment_details[0].value}}</div>
            <div slot="icon">申请级别：{{item.brand_role.name}}</div>
            <div slot="icon">申请时间：{{new Date(item.employer_time).Format('yyyy-MM-dd hh:mm:ss')}}</div>
            <x-button mini v-link="{path: '/employManagement/auditInfo/'+item.employee_user_account+'/'+item.guid+'/'+item.brand_guid+'/history'}">查看</x-button>
        </cell>
    </group>
    <popup :show.sync="show">
        <div>
            <group title="代理等级">
                <radio :options="radio" @on-change="change"></radio>
            </group>
            <group title="时间">
                <datetime :value.sync="date1" title="从"></datetime>
                <datetime :value.sync="date2" title="至"></datetime>
                <!--<calendar :value.sync="date1" title="从" disable-past></calendar>
                <calendar :value.sync="date2" title="至" disable-past></calendar>-->
            <flexbox>
                <flexbox-item>
                    <x-button type="default" @click="commit">确认</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button type="default" @click="reset">重置</x-button>
                </flexbox-item>
            </flexbox>
            </group>
        </div>
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