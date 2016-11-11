<template>
  <div>
<div class="auditinfo-header">
    <div class="vux-center">
        <img class="vux-x-img ximg-demo vux-center" style="display:none" alt="头像" :src.sync="auditInfo.headImg" src="/static/TestIMG/grantee.jpg" /></p>
    <img class="vux-x-img ximg-demo vux-center" alt="头像"  src="/static/TestIMG/grantee.jpg" /></p>
    </div>
</div>
<div class="auditinfo-message">
    <group>
        <div>      
            <cell><div slot="icon">用户名：<label>{{auditInfo.account}}</label></div></cell>
            <cell>
                <div slot="icon">授权品牌：<label>adminbrand</label></div>
                <x-button v-if="!Toggle" type="default" class="auditinfo-view" v-link="{path: '/accountManagement/CertificateInfo/'+this.auditInfo.account+'/account'}">查看授权证书</x-button>
            </cell>
            <cell>
                <div slot="icon">授权上级：<label>{{auditInfo.employer}}</label></div>
                <x-button type="default" class="auditinfo-views" v-link="{path: '/accountManagement/CertificateInfo/'+this.auditInfo.employer+'/account'}">查看授权证书</x-button>
            </cell>
            <cell><div slot="icon">姓名：<label>{{auditInfo.name}}</label></div></cell>
            <cell><div slot="icon">微信号：<label>{{auditInfo.wechat}}</label></div></cell>
            <cell><div slot="icon">手机号：<label>{{auditInfo.cellphone}}</label></div></cell>
            <cell><div slot="icon">地址：<label>{{auditInfo.address}}{{auditInfo.addressDetail}}</label></div></cell>
            <div class="auditinfo-choose "><selector v-if="Toggle" :value.sync="value" title="授权期限" :options="List" @on-change="onChange" placeholder="请选择期限"></selector><p v-if="Toggle">月</p></div>
        </div>
    </group>
</div>
<div class="auditinfo-button">
    <flexbox v-if="Toggle">
        <flexbox-item>
            <x-button type="primary" @click="PassAudit">通过审核</x-button>
        </flexbox-item>
        <flexbox-item>
            <x-button type="warn" @click="show=true">打回</x-button>
        </flexbox-item> 
    </flexbox></div>
    <div class="auditinfo-backto ">
        <dialog :show.sync="show" class="dialog-demo">
            <group title="打回理由">
                <x-textarea :value.sync="reason" placeholder="填写打回理由" :show-counter="false"></x-textarea>
            </group>
            <flexbox>
                <flexbox-item>
                    <x-button type="default" @click="rejectAudit" class="auditinfo-determine ">确定</x-button>
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
                                        break
                                    case "name":
                                        that.auditInfo.name = result[item]['value']
                                        break
                                    case "wechat":
                                        that.auditInfo.wechat = result[item]['value']
                                        break
                                    case "cellphone":
                                        that.auditInfo.cellphone = result[item]['value']
                                        break
                                    case "address":
                                        that.auditInfo.address = result[item]['value']
                                        break
                                    case "addressDetail":
                                        that.auditInfo.addressDetail = result[item]['value']
                                        break
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
<style>
.auditinfo-header{
text-align: center;
margin-top: 2%;
}
.auditinfo-header img{
    
    border: 0;
    background-size: 100%;
    width: 25%;
}



.auditinfo-message .weui_cell_hd{
    width: 100%;

}

.auditinfo-message{
    position: relative;
    width: 89%;
     margin:1% auto;
}
.auditinfo-message .weui_cell:before{
border-top:0
}
.auditinfo-message .weui_cell{
    border-bottom: 1px solid #d3d1d1;
    padding: 9px 0;

}
.auditinfo-message  .weui_btn
{
    padding-left: 0;
    padding-right: 0;
}
.auditinfo-message   .auditinfo-view,.auditinfo-message   .auditinfo-views {
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
.auditinfo-message   .auditinfo-view{
    top: -33px;
}
.auditinfo-message   .auditinfo-views {
    top: 4px;
}
.auditinfo-message .weui_cell_hd{

    width: 100%;
    font-size: 14px;
    color: #000;
    font-family: "微软雅黑";
}
.auditinfo-message .weui_cell_hd label{

color: #595959;

}
.auditinfo-button {
    position: fixed;
    width: 100%;
    bottom: 0;
}
.auditinfo-button .vux-flexbox .vux-flexbox-item{
    margin-left: 0px!important; 
}
.auditinfo-button button.weui_btn.weui_btn_primary,.auditinfo-button button.weui_btn, input.weui_btn  {
    width: 100%;
     line-height: 2.2; 
   
    font-family: "\5FAE\8F6F\96C5\9ED1";
    font-size: 17px;
    border-radius: 0;
}
.auditinfo-button button.weui_btn.weui_btn_primary{
 background: #21c36d;

}
.auditinfo-button .weui_cell_primary{

}
.auditinfo-button button.weui_btn, input.weui_btn{
 background: #9b9b9b;
}
.auditinfo-button .weui_btn:after{
border:0
}
.auditinfo-choose {
    position: relative;
margin-top: 3%;
}
.auditinfo-choose .weui_cell_hd{
width: 24%;
}
.auditinfo-choose .weui_cell_hd label{

width: 100%!important;
    display: inline-block;
    color: #000;
}
.auditinfo-choose .weui_select{
font-family: "微软雅黑";
  width: 43%;
    border: 1px solid #d3d1d1;
    height: 24px;
    line-height: 24px;
    padding-right: 0;
    background: #fff;
    font-size: 13px;
    text-align: center;
    z-index: 0;
}
.auditinfo-choose .weui_cell_select .weui_cell_bd:after{
    right: 45%;

   
}
.auditinfo-choose p{

position: absolute;
    z-index: 100000;
    color: #000;
    right: 38%;
        bottom: 1px;
}
.auditinfo-choose .weui_cell{
border-bottom:0
}

/*打回弹窗*/
.auditinfo-backto .weui_dialog{

    width: 89%;
border-radius: 5px;

}
.auditinfo-backto .weui_textarea {
    display: block;
    border: 0;
    resize: none;
    width: 96%;
    color: inherit;
    font-size: 1em;
    line-height: inherit;
    outline: 0;
    border: 1px solid #d3d1d1;
    min-height: 120px;
    font-size: 15px;
    color: #aeaeae;
    padding: 2%;


}
.auditinfo-backto .weui_cells_title{
    font-size: 17px;
    margin-top: 0.45em;
    color: #000;
    font-family: "微软雅黑";

}
.auditinfo-backto .weui_cell {
    padding: 5px 15px;
}

.auditinfo-backto .vux-flexbox {
    width: 91%;
    margin:4% auto 9% auto;}

.auditinfo-backto .weui_btn {
    line-height: 2.2;
    font-size: 14px;
    font-family: "微软雅黑";
    border-radius: 0;
    background: #9b9b9b;
    color: #fff;
}
.auditinfo-backto .auditinfo-determine{

 background: #21c36d;
}
.auditinfo-backto .weui_btn:after{
border:0

}
.auditinfo-backto .vux-flexbox .vux-flexbox-item{
    margin-left: 5px;

}
</style>