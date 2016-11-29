<template>
<div>
  <div class="certificateinfo-bac">
    <div class="certificateinfo">

      <div>

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
        <div class="attention"><img src="/static/TestIMG/attention.png"></div>

<table class="agents-height">
  <tbody>
    <tr>
<td v-if="AdminFlag" width="60%">
  <img src="/static/TestIMG/data.png" />
  <p>{{agentInfo.term_from}}-
  {{agentInfo.term_to}}</td></p>
<td align="right"><img src="/static/TestIMG/brand_people.png" /></td>
</tr>


  </tbody>
</table>


      </div>
    </div>
  </div>
</div>
</template>
<script>
import employAPI from '../api/employment'
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
        agent_detail: {}
      }
    }
  },
  methods: {
    getAgentInfo() {
      var that = this
      employAPI.getAgentDetail({
        account: that.$route.params.account,
        role: that.$route.params.from
      }).then(function(result) {
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
      employAPI.getBrandDetail({
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

.weui_tab_bd {
  padding-bottom: 0;
}

.certificateinfo-bac {

}

.certificateinfo {
  width: 93%;
  margin: 40% auto;
  padding: 13% 0 0 0;
  font-size: 3vw;
  color: #3f3a36;
  background: url(/static/TestIMG/certificateinfo.png) no-repeat #000;
  background-size: 100%;
}

.certificateinfo h3 {
  font-size: 3vw;
}

.certificateinfo-img .brand-logo img {
    width: 100%;
  height: auto;
  margin: 4% auto 2%;
}

.certificateinfo-img h3 {
  font-family: " 微软雅黑";
}

.authorization {
  width: 57%;
  height: auto;
}

.certificateinfo-img {
  text-align: center;
}

.certificateinfo table.personal-identitys {
  font-family: "微软雅黑";
  width: 100%;
margin: 8% auto 0 0;
  color: #fff}

.certificateinfo table.personal-identitys tbody tr td {
  font-family: "微软雅黑";
  text-align: left;
}

.certificateinfo table.personal-identitys tbody tr td img {
  width:37%;
  height: auto;
  float: right;

}

.color-gray {
  color: #57534d;
}

.set-agent {
  font-family: "微软雅黑";
  text-align: center;
}

.set-agent label {
  font-size: 3.9vw!important;
  /*12px*/
  color: #36bdaf;
  font-family: "微软雅黑";
}

.allow-agent {
  text-align: center;
  font-family: "微软雅黑";

}

.agent-message {
  text-align: left;
}

.agent-message p {
  text-align: left;
  font-family: "微软雅黑";
}

.agent-unit {
  font-family: "微软雅黑";
  text-align: right;
  margin-bottom: 42%
}

.agents-height {
color: #fff;
font-family: "微软雅黑";
font-size: 3vw;
width: 80%;
margin: auto;
position: relative;
}
.agents-height tr td{
  line-height: normal;
      vertical-align: top;
}
.agents-height tr td:nth-child(1)   img {
    width: 66%;
    margin: auto;
    }
.agents-height tr td:nth-child(2) img {
    width:100%;
    margin: auto;
}
.agents-height tr td:nth-child(1)  p{
  position: absolute;
  top: 37%;
left: 2%;
}
.attention {
    text-align: center;
    line-height: initial;
    margin: 0;
    padding: 0;
}
.attention img {
    width: 79%;
    margin: auto;
}
</style>
