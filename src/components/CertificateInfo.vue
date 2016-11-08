<template>
    <div>
<div class="brandauthorization-bac">
<div class="brandauthorization">
<div class="brandauthorization-img">
        <img class="vux-x-img ximg-demo" :src.sync="brand_logo_href" alt="品牌logo"/>
        <p>授权证书</p>
</div>
        <div>
            <p>兹授权</p>
     <table boder=0 class="personal-identity">


            <tr><th>姓名</th><th>{{auditInfo.name}}</th><th rowspan="3"><img class="vux-x-img ximg-demo" alt="授权者头像"/></th></tr>
           <tr><th> 微信</th><th>{{auditInfo.wechat}}</th></tr>
            <tr><th>身份证</th><th>4404xxxxxxxxxxxxx</th></tr>
            
</table>
            <p>为<label>adminBrand</label><label>{{auditInfo.agent_level}}</label></p>
            <p>允许其在网络上销售<label>adminBrand</label><label>旗下产品</label></p>
            <p>授权编号<label>A111</label></p>
            <p>授权期限<label>{{auditInfo.term_from}}</label>至<label>{{auditInfo.term_to}}</label></p>
            <p>备注：本授权书以正本为有效文本，不得影印，涂改，转让。A公司有此授权书最终解释权。</p>
            <p>授权单位<label>A公司</label></p>
        </div>
    </div></div></div>
</template>
<script>
    import employAPI from '../api/employment'
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
                    agent_level: "",
                    term_from: "",
                    term_to: ""
                }
            }
        },
        methods: {
            getInfo() {
                var that = this
                employAPI.getAuditInfo({
                    account: that.$route.params.account,
                    locate: that.$route.params.locate,
                }).then(function(result) {
                    that.auditInfo.term_from = result[0].agent.employment_term.term_from
                    that.auditInfo.term_to = result[0].agent.employment_term.term_to
                    switch (result[0].agent.agent_brand_role.brand_role_code) {
                        case "brand_role2":
                            that.auditInfo.agent_level = "总代理"
                            break
                        case "brand_role3":
                            that.auditInfo.agent_level = "二级代理"
                            break
                        case "brand_role4":
                            that.auditInfo.agent_level = "三级代理"
                            break
                        case "brand_role5":
                            that.auditInfo.agent_level = "销售员"
                            break
                    }
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
    /*底部距离*/
    
    .weui_tab_bd {
        padding-bottom: 0;
    }
    
    .brandauthorization-bac {
        background: url(/static/TestIMG/PowerOfAttorney-bac.png) no-repeat;
        background-size: cover;
    }
    
    .brandauthorization {
        width: 69%;
        margin: auto;
        padding: 23% 13%;
        font-size: 10px;
    }
    
    .brandauthorization-img {
        text-align: center;
    }
    
    .personal-identity {}
</style>