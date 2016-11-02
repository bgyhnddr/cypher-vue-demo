<template>
  <div>
    <div class="vux-center">
        <img class="vux-x-img ximg-demo vux-center" alt="头像"/></p>
    </div>
    <group>
        <div>      
            <cell><div slot="icon">用户名：{{auditInfo.account}}</div></cell>
            <cell><div slot="icon">授权品牌：{{auditInfo.brand}}</div></cell>
            <cell><div slot="icon">授权上级：{{auditInfo.employer}}</div></cell>
            <cell><div slot="icon">姓名：{{auditInfo.name}}</div></cell>
            <cell><div slot="icon">微信号：{{auditInfo.wx}}</div></cell>
            <cell><div slot="icon">手机号：{{auditInfo.phone}}</div></cell>
            <cell><div slot="icon">地址：{{auditInfo.address}}</div></cell>
            <cell><div slot="icon">授权期：</div></cell>
        </div>
    </group>
    <flexbox>
        <flexbox-item>
            <x-button type="primary" @click="PassAudit">通过审核</x-button>
        </flexbox-item>
        <flexbox-item>
            <x-button type="warn" @click="show=true">打回</x-button>
        </flexbox-item>
    </flexbox>
    <div style="height: 1000px">
        <dialog :show.sync="show" class="dialog-demo">
            <group title="textarea">
                <x-textarea :value.sync="reason" placeholder="请填写详细信息" :show-counter="false"></x-textarea>
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
        <toast :show.sync="showAlert" :time="1000" @on-hide="onHide">{{alertMsg}}</toast>       
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
        Toast
    } from 'vux'
    import employAPI from '../api/employment'
    export default {
        data() {
            return {
                alertMsg: "",
                auditID: "",
                showAlert: false,
                show: false,
                reason: "",
                auditInfo: {
                    account: "",
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
            Toast
        },
        methods: {
            getInfo() {
                var that = this
                employAPI.getAuditInfo({
                    auditID: that.auditID,
                    brandID: that.GetQueryString('brandID')
                }).then(function(result) {
                    that.auditInfo.account = result[0].employment.employee_user_account
                    that.auditInfo.brand = result[0].employment.brand.name
                    that.auditInfo.employer = result[0].employment.employer_user_account
                    that.auditInfo.name = result[0].value
                    that.auditInfo.wx = result[1].value
                    that.auditInfo.phone = result[2].value
                    that.auditInfo.address = result[3].value
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
                employAPI.passAudit({
                    auditID: that.auditID
                }).then(function(result) {
                    that.alertMsg = "已通过"
                    that.showAlert = true
                    console.log(result)
                }).catch(function(err) {
                    console.log(err)
                    that.serveMsg = err
                })
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
                    console.log(result)
                }).catch(function(err) {
                    console.log(err)
                    that.serveMsg = err
                })
            },
            onHide() {
                this.$router.go('audit')
            }

        },
        ready() {
            this.auditID = this.GetQueryString('employmentID')
            this.getInfo()
        }
    }
</script>