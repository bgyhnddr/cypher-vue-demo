<template>
  <div>
    <div class="vux-center">
        <img class="vux-x-img ximg-demo vux-center" alt="头像" :src.sync="auditInfo.headImg"/></p>
    </div>
    <group>
        <div>      
            <cell><div slot="icon">用户名：{{auditInfo.account}}</div></cell>
            <cell>
                <div slot="icon">授权品牌：adminbrand</div>
                <x-button v-if="!Toggle" type="default" v-link="{path: '/accountManagement/CertificateInfo/'+this.auditInfo.account+'/account'}">查看授权证书</x-button>
            </cell>
            <cell>
                <div slot="icon">授权上级：{{auditInfo.employer}}</div>
                <x-button type="default" v-link="{path: '/accountManagement/CertificateInfo/'+this.auditInfo.employer+'/account'}">查看授权证书</x-button>
            </cell>
            <cell><div slot="icon">姓名：{{auditInfo.name}}</div></cell>
            <cell><div slot="icon">微信号：{{auditInfo.wechat}}</div></cell>
            <cell><div slot="icon">手机号：{{auditInfo.cellphone}}</div></cell>
            <cell><div slot="icon">地址：{{auditInfo.address}}{{auditInfo.addressDetail}}</div></cell>
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
                List: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                term: "",
                auditInfo: {
                    account: "",
                    time: "",
                    employer: "",
                    name: "",
                    wechat: "",
                    cellphone: "",
                    address: "",
                    addressDetail: "",
                    deadline: "",
                    headImg: ""
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
                    brandID: that.$route.params.brandID,
                    account: that.$route.params.account,
                    locate: that.$route.params.locate,
                }).then(function(result) {
                    if (that.$route.params.locate == 'audit') {
                        that.auditInfo.time = result[0].employment.employer_time
                        that.auditInfo.employer = result[0].employment.employer_user_account
                    }
                    for (var item in result) {
                        for (var meta in result[item]) {
                            if (meta == 'key') {
                                switch (result[item][meta]) {
                                    case "headImg":
                                        that.auditInfo.headImg = "/service/public/upload/getAttachment?id=" + result[item]['value']
                                    case "name":
                                        that.auditInfo.name = result[item]['value']
                                    case "wechat":
                                        that.auditInfo.wechat = result[item]['value']
                                    case "cellphone":
                                        that.auditInfo.cellphone = result[item]['value']
                                    case "address":
                                        that.auditInfo.address = result[item]['value']
                                    case "addressDetail":
                                        that.auditInfo.addressDetail = result[item]['value']
                                    case "employer":
                                        if (that.$route.params.locate == 'history') {
                                            that.auditInfo.employer = result[item]['value']
                                        }
                                        break
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    console.log(err)
                    that.serveMsg = err
                })
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
                    this.$router.go({
                        path: '/employManagement/audit'
                    })
                } else if (this.alertMsg == "该申请已经审核") {
                    this.$router.go({
                        path: '/employManagement'
                    })
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
            if (this.$route.params.locate == 'audit') {
                this.Toggle = true
            }
            this.auditInfo.account = this.$route.params.account
            this.auditID = this.$route.params.employmentID
            this.getInfo()
        }
    }
</script>