<template>
<div>
  <div class="brandauthorization-bac">
    <div class="brandauthorizations">
      <div class="brandauthorization-img">
        <p class="brand-logo">
          <img class="vux-x-img ximg-demo" alt="品牌logo" src="/static/TestIMG/logo.png" />
        </p>
        <p>
          <img src="/static/TestIMG/authorization.png" class="authorization" />
        </p>
      </div>
      <div>
        <h3>兹授权</h3>
        <table boder=0 class="personal-identity">
          <tr>
            <td width="60px">姓名:</td>
            <td>{{agentInfo.agent_detail.name}}</td>
            <td rowspan="4" align="right">
              <img class="vux-x-img ximg-demo" alt="授权者头像" :src="'/service/public/upload/getAttachment?id='+agentInfo.agent_detail.headImg" />
            </td>
          </tr>
          <tr>
            <td> 微信:</th>
              <td>{{agentInfo.agent_detail.wechat}}</td>
          </tr>
          <tr>
            <td>{{agentInfo.agent_detail.IDType}}:</th>
              <td>{{agentInfo.agent_detail.IDNumber}}</td>
          </tr>
          <tr>
            <td height="6px"></td>
            <td></td>
          </tr>

        </table>
        <div class="set-agent ">为
          <label>{{agentInfo.brand}}</label>
          <label>{{agentInfo.brand_role}}</label>
        </div>
        <div class="allow-agent">允许其在网络上销售
          <label>{{agentInfo.brand}}</label>
          <label>旗下产品</label>
        </div>
        <div class="agent-height">
          <div v-if="AdminFlag">
            <div class="agent-message">
              <p>授权编号
                <label>{{agentInfo.AuthorizationID}}</label>
              </p>
              <p>授权期限
                <label>{{agentInfo.term_from}}</label>至
                <label>{{agentInfo.term_to}}</label>
              </p>
            </div>
          </div>
        </div>
        <p class="agent-unit ">授权单位
          <label class="color-gray">{{agentInfo.brand}}</label>
        </p>

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
        that.agentInfo.AuthorizationID = result.user.employment.guid.substring(result.user.employment.guid.length - 12, result.user.employment.guid.length)
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

.brandauthorization-bac {
  background: url(/static/TestIMG/PowerOfAttorney-bac.png) no-repeat;
  background-size: 100%;
  width: 100%;
  margin: 3% auto;
}

.brandauthorizations {
  width: 75%;
  margin: auto;
  padding: 13% 0%;
  font-size: 3vw;
  color: #3f3a36;
}

.brandauthorizations h3 {
  font-size: 3vw;
}

.brandauthorization-img .brand-logo img {
  width: 62%;
  height: auto;
  margin: 4% auto 2%;
}

.brandauthorization-img h3 {
  font-family: " 微软雅黑";
}

.authorization {
  width: 57%;
  height: auto;
}

.brandauthorization-img {
  text-align: center;
}

table.personal-identity {
  font-family: "微软雅黑";
  width: 100%;
  margin: auto;
}

table.personal-identity tbody tr td {
  font-family: "微软雅黑";
  text-align: left;
}

table.personal-identity tbody tr td img {
  width: 58px;
  height: auto;
  margin-right: 0;
  min-height: 76px;
  min-width: 46px;
  max-height: 84px;
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

.agent-height {
  margin: 8% 0px 10%;
  height: 38px
}
</style>
