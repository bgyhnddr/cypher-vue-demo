<template>
  <div>
<div class="certificate-header">
    <div class="vux-center">
        <headimg-upload :file-id.sync="auditInfo.headImg"></headimg-upload>
    </div>
</div>

<div class="certificate-messages ">
    <group>
        <div>      
            <cell><div slot="icon">用户名：<label>{{auditInfo.account}}</label></div></cell>
            <cell>
                <div slot="icon">授权品牌：<label>adminbrand</label></div>
                <x-button type="default" class="certificate-view " v-link="{path: '/accountManagement/CertificateInfo/'+this.auditInfo.account+'/account'}">查看授权证书</x-button>
            </cell>
            <cell>
                <div slot="icon">授权上级：<label>{{auditInfo.employer}}</label></div>
                <x-button type="default" class="certificate-views " v-link="{path: '/accountManagement/CertificateInfo/'+this.auditInfo.employer+'/account'}">查看授权证书</x-button>
            </cell>
            <cell><div slot="icon">姓名：<label>{{auditInfo.name}}</label></div></cell>
            <cell><div slot="icon">微信号：<label>{{auditInfo.wechat}}</label></div></cell>
            <cell><div slot="icon">手机号：<label>{{auditInfo.cellphone}}</label></div></cell>
            <cell><div slot="icon">地址：<label>{{auditInfo.address}}{{auditInfo.addressDetail}}</label></div></cell>
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
.certificate-header{
text-align: center;
margin-top: 2%;
}
.certificate-header button{
    
    border: 0;
    background-size: 100%;
    width: 54%;
}



.certificate-header button img{
     width: 100%;
    height: auto;

}
.certificate-header p{

color: #595959;
    font-size: 14px;
}
.certificate-messages{
    position: relative;
    width: 89%;
     margin: 7% auto;
}
.certificate-messages .weui_cell:before{
border-top:0
}
.certificate-messages .weui_cell{
    border-bottom: 1px solid #d3d1d1;
    padding: 9px 0;

}
.certificate-messages  .weui_btn
{
    padding-left: 0;
    padding-right: 0;
}
.certificate-messages   .certificate-view,.certificate-messages   .certificate-views {
        position: absolute;
   right: 0;
    border: 0;
    width: 33%;
    background: #5091d5;
    color: #fff;
    font-size: 12px;
    border-radius: 0;
    font-family: "微软雅黑";


}
.certificate-messages   .certificate-view{
    top: -33px;
}
.certificate-messages   .certificate-views {
    top: 4px;
}
.certificate-messages .weui_cell_hd{

    width: 100%;
    font-size: 14px;
    color: #000;
    font-family: "微软雅黑";
}
.certificate-messages .weui_cell_hd label{

color: #595959;

}

</style>