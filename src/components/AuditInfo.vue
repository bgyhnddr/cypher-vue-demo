<template>
  <div>
    <div class="vux-center">
        <img class="vux-x-img ximg-demo vux-center" alt="头像"/></p>
    </div>
    <group>
        <div>      
            <cell><div slot="icon">用户名：{{auditInfo.account}}</div></cell>
            <cell><div slot="icon">授权品牌：{{auditInfo.brand}}</div></cell>
            <cell>
                <div slot="icon">授权上级：{{auditInfo.employer}}</div>
                <x-button type="default">查看授权证书</x-button>
            </cell>
            <cell><div slot="icon">姓名：{{auditInfo.name}}</div></cell>
            <cell><div slot="icon">微信号：{{auditInfo.wx}}</div></cell>
            <cell><div slot="icon">手机号：{{auditInfo.phone}}</div></cell>
            <cell><div slot="icon">地址：{{auditInfo.address}}</div></cell>
            <selector v-if="Toggle" :value.sync="value" title="授权期限" :options="List" @on-change="onChange" placeholder="请选择期限"></selector>
        </div>
    </group>
    <flexbox v-if="Toggle">
        <flexbox-item>
            <x-button type="primary" @click="PassAudit">通过审核</x-button>
        </flexbox-item>
        <flexbox-item>
            <x-button type="warn" @click="show=true">打回</x-button>
        </flexbox-item>
    </flexbox>
    <div style="height: 1000px">
        <dialog :show.sync="show" class="dialog-demo">
            <group title="打回理由">
                <x-textarea :value.sync="reason" placeholder="填写打回理由" :show-counter="false"></x-textarea>
            </group>
            <flexbox>
                <flexbox-item>
                    <x-button type="default" @click="rejectAudit">确定</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button type="default" @click="show=false">取消</x-button>
                </flexbox-item>
            </flexbox>
        </dialog>
    </div>
    <div>
        <toast :show.sync="showAlert" :time="1000" @on-hide="onHide" type="text">{{alertMsg}}</toast>       
    </div> 
  </div>
</template>

<script>
    import {
        Cell,
        Group,
        Flexbox,
        FlexboxItem,
        XButton,
        Dialog,
        XTextarea,
        XInput,
        Toast,
        Selector
    } from 'vux'
    import employAPI from '../api/employment'
    export default {
        data() {
            return {
                alertMsg: "",
                auditID: "",
                value: "",
                Toggle: false,
                showAlert: false,
                show: false,
                reason: "",
                List: ['1', '2', '3', '4', '5', '6'],
                term: "",
                auditInfo: {
                    account: "",
                    time: "",
                    brand: "",
                    employer: "",
                    name: "",
                    wx: "",
                    phone: "",
                    address: "",
                    deadline: ""
                }
            }
        },
        components: {
            Group,
            Cell,
            Flexbox,
            FlexboxItem,
            XButton,
            Dialog,
            XTextarea,
            XInput,
            Toast,
            Selector
        },
        methods: {
            valid() {
                return this.value
            },
            getInfo() {
                var that = this
                employAPI.getAuditInfo({
                    auditID: that.auditID,
                    brandID: that.GetQueryString('brandID')
                }).then(function(result) {
                    if (result[0].employment.status == "已审核") {
                        that.alertMsg = "已审核"
                        that.showAlert = true
                    } else {
                        that.auditInfo.account = result[0].employment.employee_user_account
                        that.auditInfo.time = result[0].employment.employer_time
                        that.auditInfo.brand = result[0].employment.brand.name
                        that.auditInfo.employer = result[0].employment.employer_user_account
                        that.auditInfo.name = result[0].value
                        that.auditInfo.wx = result[1].value
                        that.auditInfo.phone = result[2].value
                        that.auditInfo.address = result[3].value
                    }
                }).catch(function(err) {
                    console.log(err)
                    that.serveMsg = err
                })
            },
            GetQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
                var r = window.location.search.substr(1).match(reg)
                if (r != null) return unescape(r[2])
                return null
            },
            PassAudit() {
                var that = this
                if (that.valid()) {
                    employAPI.passAudit({
                        auditID: that.auditID,
                        term: that.term
                    }).then(function(result) {
                        that.alertMsg = "已通过"
                        that.showAlert = true
                        console.log(result)
                    }).catch(function(err) {
                        console.log(err)
                        that.serveMsg = err
                    })
                } else {
                    that.alertMsg = "请选择授权期限"
                    that.showAlert = true
                }
            },
            rejectAudit() {
                var that = this
                console.log(that.reason)
                employAPI.rejectAudit({
                    auditID: that.auditID,
                    reason: that.reason
                }).then(function(result) {
                    that.alertMsg = "已拒绝"
                    that.showAlert = true
                }).catch(function(err) {
                    console.log(err)
                    that.serveMsg = err
                })
            },
            onHide() {
                if (this.valid() || this.alertMsg == "已拒绝") {
                    this.$router.go('audit')
                } else if (this.alertMsg == "已审核") {
                    this.$router.go('audit')
                }
            },
            onChange(val) {
                var date = new Date(this.auditInfo.time)
                var year = parseInt(date.getFullYear())
                var month = parseInt(date.getMonth() + 1)
                var day = parseInt(date.getDate())
                var time = parseInt(date.getHours()) + ":" + parseInt(date.getMinutes()) + ":" + parseInt(date.getSeconds())

                val = parseInt(val)

                if (month + val > 12) {
                    this.term = (year + 1) + '-' + (month + val - 12) + '-' + day + " " + time
                } else {
                    this.term = year + '-' + (month + val) + '-' + day + " " + time
                }
            }
        },
        ready() {
            if (this.GetQueryString('from') == 'audit') {
                this.Toggle = true
            }
            this.auditID = this.GetQueryString('employmentID')
            this.getInfo()
        }
    }
</script>