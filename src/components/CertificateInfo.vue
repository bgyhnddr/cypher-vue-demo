<template>
<div>
  <div class="brandauthorization-bac">
    <div class="brandauthorizations">
      <div class="brandauthorization-img">
        <p class="brand-logo">
          <img class="vux-x-img ximg-demo" alt="品牌logo" src="/static/TestIMG/brand_logo_href.png" />
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
            <td>{{auditInfo.name}}</td>
            <td rowspan="4" align="right">
              <img class="vux-x-img ximg-demo" alt="授权者头像" :src.sync="auditInfo.headImg" />
            </td>
          </tr>
          <tr>
            <td> 微信:</th>
              <td>{{auditInfo.wechat}}</td>
          </tr>
          <tr>
            <td>{{auditInfo.IDType}}:</th>
              <td>{{auditInfo.IDNumber}}</td>
          </tr>
          <tr>
            <td height="6px"></td>
            <td></td>
          </tr>

        </table>
        <div class="set-agent ">为
          <label>{{auditInfo.Brand}}</label>
          <label>{{auditInfo.agent_level}}</label>
        </div>
        <div class="allow-agent">允许其在网络上销售
          <label>{{auditInfo.Brand}}</label>
          <label>旗下产品</label>
        </div>
        <div v-if="AdminFlag" class="agent-height">
          <div class="agent-message">
            <p>授权编号
              <label>{{auditInfo.AuthorizationNum}}</label>
            </p>
            <p>授权期限
              <label>{{auditInfo.term_from}}</label>至
              <label>{{auditInfo.term_to}}</label>
            </p>
          </div>
        </div>
        <p class="agent-unit ">授权单位
          <label class="color-gray">{{auditInfo.Brand}}</label>
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
      AdminFlag:"",
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
        term_to: "",
        headImg: "",
        IDType: "",
        IDNumber: "",
        AuthorizationNum: "",
        Brand: ""
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
        var LocateFrom = that.$route.params.locate
        var LoacteAccount = that.$route.params.account
        if (LocateFrom == 'history' || LocateFrom == 'account' || LocateFrom == 'auditInfo') {
          that.auditInfo.Brand = result.GetBrand.name
          if (LoacteAccount != 'admin') {
            that.auditInfo.AuthorizationNum = result.Getemployment.guid.substring(result.Getemployment.guid.length - 12, result.Getemployment.guid.length)
            that.auditInfo.term_from = result.Getdetail[0].agent.employment_term.term_from
            that.auditInfo.term_to = result.Getdetail[0].agent.employment_term.term_to
          }
          result = result.Getdetail
        }

        switch (result[0].agent.agent_brand_role.brand_role_code) {
          case "brand_role1":
            that.auditInfo.agent_level = "品牌商"
            break
          case "brand_role2":
            that.auditInfo.agent_level = "总代理"
            break
          case "brand_role3":
            that.auditInfo.agent_level = "二级代理"
            break
          case "brand_role4":
            that.auditInfo.agent_level = "特约销售员"
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
                  that.auditInfo.employer = result[item]['value']
                  break
                case "headImg":
                  that.auditInfo.headImg = "/service/public/upload/getAttachment?id=" + result[item]['value']
                  break
                case "IDType":
                  that.auditInfo.IDType = result[item]['value']
                  break
                case "IDNumber":
                  that.auditInfo.IDNumber = result[item]['value']
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
    if (this.$route.params.account == 'admin') {
      this.AdminFlag = false
    } else {
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
