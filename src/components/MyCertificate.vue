<template>
  <div>
<div class="certificate-header">
    <div class="vux-center">
        <headimg-upload :file-id.sync="auditInfo.headImg"></headimg-upload>
    </div>
</div>
<div>
    <group>
        <div>      
            <cell><div slot="icon">用户名：{{auditInfo.account}}</div></cell>
            <cell>
                <div slot="icon">授权品牌：adminbrand</div>
                <x-button type="default" v-link="{path: '/accountManagement/CertificateInfo/'+this.auditInfo.account+'/account'}">查看授权证书</x-button>
            </cell>
            <cell>
                <div slot="icon">授权上级：{{auditInfo.employer}}</div>
                <x-button type="default" v-link="{path: '/accountManagement/CertificateInfo/'+this.auditInfo.employer+'/account'}">查看授权证书</x-button>
            </cell>
            <cell><div slot="icon">姓名：{{auditInfo.name}}</div></cell>
            <cell><div slot="icon">微信号：{{auditInfo.wechat}}</div></cell>
            <cell><div slot="icon">手机号：{{auditInfo.cellphone}}</div></cell>
            <cell><div slot="icon">地址：{{auditInfo.address}}{{auditInfo.addressDetail}}</div></cell>
        </div>
    </group>
</div>
  </div>
</template>

<script>
    import {
        Cell,
        Group,
        XButton,
    } from 'vux'
    import employAPI from '../api/employment'
    import HeadimgUpload from './extend/change-headimg'
    export default {
        data() {
            return {
                auditInfo: {
                    account: "",
                    employer: "",
                    name: "",
                    wechat: "",
                    cellphone: "",
                    address: "",
                    addressDetail: "",
                    headImg: null
                }
            }
        },
        components: {
            Group,
            Cell,
            XButton,
            HeadimgUpload
        },
        methods: {
            getInfo() {
                var that = this
                employAPI.getAuditInfo({
                    account: that.$route.params.account,
                    locate: that.$route.params.locate,
                }).then(function(result) {
                    for (var item in result) {
                        for (var meta in result[item]) {
                            if (meta == 'key') {
                                switch (result[item][meta]) {
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
                                        that.auditInfo.employer = result[item]['value']
                                        break
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    console.log(err)
                    that.serveMsg = err
                })
            }
        },
        ready() {
            this.getInfo()
            this.auditInfo.account = this.$route.params.account
        }
    }
</script>
<style>
.certificate-header button{




}

</style>