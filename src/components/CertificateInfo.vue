<template>
  <div id="certificateinfo">
<div>
  <div class="certificateinfo-box">

  <div class="certificateinfo-top"></div>
  <div class="certificateinfo-bac">

    <div class="certificateinfo">

      <div>

  <div class="certificateinfo-title">
    <img src="/static/TestIMG/certificateinfo_title.png" />
  </div>
        <table boder=0 class="personal-identitys">
          <tbody>
          <tr>
            <td width=37%><img src="/static/TestIMG/i_have_granted.png"/></td>
            <td>{{agentInfo.agent_detail.name}}</td>

          </tr>
          <tr>
              <td width=37%><img src="/static/TestIMG/authorization_level.png"/></td>
            <td>{{agentInfo.brand}}{{agentInfo.brand_role}}</th>

          </tr>
          <tr>
  <td v-if="AdminFlag" width=37%><img src="/static/TestIMG/authorization_num.png"/></td>
              <td>{{agentInfo.AuthorizationID}}</td>
          </tr>
          <tr>
  <td width=37%><img src="/static/TestIMG/wechat.png"/></td>
              <td>{{agentInfo.agent_detail.wechat}}</td>
          </tr>
          <tr>
  <td width=37%><img src="/static/TestIMG/idcard.png"/></td>
              <td>{{agentInfo.agent_detail.IDNumber}}</td>
          </tr>

</tbody>
        </table>
        <div v-if="agentInfo.frozenFlag" class="freeze-icon">
            <img src="/static/TestIMG/freeze-icon .png" alt="冻结水印标识"/>
        </div>
        <div class="attention"><img src="/static/TestIMG/attention.png"/></div>
<table class="agents-height">
  <tbody>
    <tr>
<td v-if="AdminFlag" width="60%">
  <img src="/static/TestIMG/data.png" />
  <p>{{agentInfo.term_from}}-
  {{agentInfo.term_to}}</td></p>
<td align="right"  width="40%"><img src="/static/TestIMG/brand_people.png" /></td>
</tr>


  </tbody>
</table>


      </div>

    </div>

  </div>

    <div class="certificateinfo-footer"></div>
</div></div>

 <div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
 </div>
</template>
<script>
import applyEmployAPI from '../api/applyEmployment'
export default {
  data() {
    return {
      AdminFlag: "",
      agentInfo: {
        account: "",
        brand: "",
        brand_role: "",
        employer: "",
        AuthorizationID: "",
        term_from: "",
        term_to: "",
        frozenFlag:false,
        agent_detail: {}
      }
    }
  },
  methods: {
    getAgentInfo() {
      var that = this
      applyEmployAPI.getAgentDetail({
        account: that.$route.params.account,
        role: that.$route.params.from
      }).then(function(result) {
        if(result.frozen_agent){
          that.agentInfo.frozenFlag = true
        }
        that.agentInfo.term_from = result.employment_term.term_from
        that.agentInfo.term_to = result.employment_term.term_to
        that.agentInfo.AuthorizationID = result.team_agent.team.brand+result.agent_brand_role.brand_role.level+result.team_agent.team_code+result.team_agent.num
        that.agentInfo.agent_detail = result.agent_detail
        that.agentInfo.brand = result.user.employment.brand.name
        that.agentInfo.brand_role = result.agent_brand_role.brand_role.name

      }).catch(function(err) {
        console.log(err)
        that.serveMsg = err
      })
    },
    getBrandDetail() {
      var that = this
      applyEmployAPI.getBrandDetail({
        account: that.$route.params.account
      }).then(function(result) {
        console.log(result)
        that.agentInfo.agent_detail = result.agent_detail
        that.agentInfo.brand = result.agent_brand_role.brand_role.brand.name
        that.agentInfo.brand_role = result.agent_brand_role.brand_role.name
      }).catch(function(err) {
        console.log(err)
        that.serveMsg = err
      })
    }
  },
  ready() {
    this.agentInfo.account = this.$route.params.account
    if (this.$route.params.account == 'admin') {
      this.getBrandDetail()
      this.AdminFlag = false
    } else {
      this.getAgentInfo()
      this.AdminFlag = true
    }
  }
}
</script>
<style>
/*底部距离*/
#certificateinfo{
  background: url(/static/TestIMG/certificateinfo_bac.png) #fff;
  background-size: cover;
    background-position: 0 -51px;
        height: 100%;

      padding-top: 40%;
}
#certificateinfo .certificateinfo-box{
  width: 93%;
  margin: auto;
  position: relative;

}
#certificateinfo .certificateinfo-top{
  background: url(/static/TestIMG/certificateinfo_top.png);
  background-repeat: no-repeat;
  padding-top: 6%;
  background-size: contain;

}
#certificateinfo .certificateinfo-footer{
  background: url(/static/TestIMG/certificateinfo_footer.png);
  background-repeat: no-repeat;
  padding-top:5%;
  background-size: 100%;
  margin-bottom: 42%

}
#certificateinfo .weui_tab_bd {
  padding-bottom: 0;
}

#certificateinfo .certificateinfo-bac {
  background: url(/static/TestIMG/certificateinfo-middle.png) repeat-y #000;
  background-size: 100%;
    margin-top: -1%;
}
#certificateinfo .certificateinfo-title {
    width: 70%;
    margin: auto;
}
#certificateinfo .certificateinfo-title img{
  width: 100%
}
#certificateinfo .certificateinfo {
  background: url(/static/TestIMG/certificateinfo.png ) no-repeat 50% 88%;
  background-size: 55%;
  margin:0 auto;
  font-size: 3vw;
  color: #3f3a36;

}

#certificateinfo .certificateinfo h3 {
  font-size: 3vw;
}

#certificateinfo .certificateinfo-img .brand-logo img {
    width: 100%;
  height: auto;
  margin: 4% auto 2%;
}

#certificateinfo .certificateinfo-img h3 {
  font-family: " 微软雅黑";
}

#certificateinfo .authorization {
  width: 57%;
  height: auto;
}

 #certificateinfo .certificateinfo-img {
  text-align: center;
}

 #certificateinfo .certificateinfo table.personal-identitys {
  font-family: "微软雅黑";
width: 100%;
margin-top: -3%;
color: #fff;}

 #certificateinfo .certificateinfo table.personal-identitys tbody tr td {
  font-family: "微软雅黑";
  text-align: left;
}

 #certificateinfo .certificateinfo table.personal-identitys tbody tr td img {
  width:37%;
  height: auto;
  float: right;

}

 #certificateinfo .color-gray {
  color: #57534d;
}

 #certificateinfo .set-agent {
  font-family: "微软雅黑";
  text-align: center;
}

 #certificateinfo .set-agent label {
  font-size: 3.9vw!important;
  /*12px*/
  color: #36bdaf;
  font-family: "微软雅黑";
}

 #certificateinfo .allow-agent {
  text-align: center;
  font-family: "微软雅黑";

}

#certificateinfo .agent-message {
  text-align: left;
}

 #certificateinfo .agent-message p {
  text-align: left;
  font-family: "微软雅黑";
}

 #certificateinfo .agent-unit {
  font-family: "微软雅黑";
  text-align: right;
  margin-bottom: 42%
}

 #certificateinfo.agents-height {
  color: #fff;
  font-family: "微软雅黑";
  font-size: 3vw;
  width: 80%;
  margin: -3% auto 0 auto;
  position: relative;
}
 #certificateinfo .agents-height tr td{
  line-height: normal;
      vertical-align: top;
}
 #certificateinfo .agents-height tr td:nth-child(1)   img {
   width: 42%;
 margin-right: 10%;
    }
#certificateinfo .agents-height tr td:nth-child(2) img {
    width:94%;
    margin: auto;
}
 #certificateinfo .agents-height tr td:nth-child(1)  p{
  position: absolute;
  top: 37%;
left: 2%;
}
 #certificateinfo .attention {
    text-align: center;
    line-height: initial;
    margin: 0;
    padding: 0;
}
 #certificateinfo .attention img {
    width: 79%;
    margin: auto;
}
 #certificateinfo .freeze-icon{
  position: absolute;
  right: 6%;
  width: 37%;
  bottom: -12%;
}
 #certificateinfo .freeze-icon img{ width: 100%}
  #certificateinfo  .weui_tab{
       height: auto!important;
 }
</style>
