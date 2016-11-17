<template>
<div>
  <div class="brandauthorization-bac" v-if="showBrandAuthorizationModel">
    <div class="brandauthorizations">
      <div class="brandauthorization-img">
        <p class="brand-logo">
          <img class="vux-x-img ximg-demo" src="/static/TestIMG/bleman_cert_logo.jpg" alt="品牌logo" />
        </p>
        <p>
          <img src="/static/TestIMG/authorization.png" class="authorization" />
        </p>
      </div>
      <div>
        <h3>兹授权</h3>
        <table boder=0 class="personal-identity">
          <tbody>

            <tr>
              <td width="60px">姓名:</td>
              <td class="color-gray">{{agentInfo.name}}</td>
              <td rowspan="4" style="text-align:right">
                <img class="vux-x-img ximg-demo" alt="授权者头像" :src.sync="agentInfo.headHref" />
              </td>
            </tr>
            <tr>
              <td> 微信:</td>
              <td class="color-gray">{{agentInfo.wechat}}</td>
            </tr>
            <tr>
              <td>{{agentInfo.IDType}}:</td>
              <td class="color-gray">{{agentInfo.IDNumber}}</td>
            </tr>
            <tr>
              <td height="6px"></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div class="set-agent ">为{{employmentData.name}}
          <label>{{brand_role_name}}</label>
        </div>
        <div class="allow-agent"> 允许其在网络上销售{{employmentData.name}}
          <label>旗下产品</label>
        </div>
        <div class="agent-height">
          <div class="agent-message" v-show="showEmploymentIDAndTerm">
            <p>授权编号:
              <label class="color-gray">{{employmentIDAndTerm.employmentGuid}}</label>
            </p>
            <p>授权期限:
              <label class="color-gray">{{employmentIDAndTerm.start}}</label>
              至
              <label class="color-gray">{{employmentIDAndTerm.deadline}}</label>
            </p>
          </div>
        </div>
        <p class="agent-unit ">授权单位:
          <label class="color-gray">{{company_name}}</label>
        </p>
      </div>
    </div>
  </div>
  <alert :show.sync="showMsg" button-text="确认">{{errorMsg}}</alert>
</div>
</template>
<script>
import {
  Alert
} from 'vux'
import authAPI from '../api/auth'
import agentInfoAPI from '../api/agentInfo'
import employmentAPI from '../api/employment'
import applyEmploymentAPI from '../api/applyEmployment'

export default {
  components: {
    Alert
  },
  data() {
    return {
      employmentData: {},
      company_name: null,
      publishEmploymentData: {},
      brand_role_name: "",
      agentInfo: {
        name: "",
        wechat: "",
        IDType: "",
        IDNumber: "",
        headHref: "/static/TestIMG/default_headImg.png",
      },
      employmentIDAndTerm: {
        employmentGuid: "",
        start: "",
        deadline: ""
      },
      showEmploymentIDAndTerm: true,
      showBrandAuthorizationModel: false,
      showMsg: false,
      errorMsg: null
    }
  },
  methods: {
    initData() {
      console.log("显示发起招募证书")
      var that = this
      var publishEmploymentID = this.$route.params.publishEmploymentID

      //获取发起招募信息
      applyEmploymentAPI.getPublishEmploymentInfo({
        employmentGuid: publishEmploymentID
      }).then(function(result) {
        console.log(JSON.stringify(result))
        that.publishEmploymentData = result

        //招募失效
        var startDate = new Date(result.create_time)
        var endDate = new Date(startDate.getTime() + 2 * 3600 * 1000)
        if (endDate <= new Date()) {
          that.showMsg = true
          that.errorMsg = "招募已失效"
          that.$route.router.go('/auth/login')
        } else {
          //判断用户类型
          that.getBrandInfo()
          authAPI.getUser().then(function(result) {
            if (result.name == that.publishEmploymentData.employer_user_account) {
              //获取自己的资料
              that.getAgentInfo(result.name)
                //获取自己的代理等级名称 & 获取授权编号 & 授权期
              that.getRoleName(result.name)
              that.showBrandAuthorizationModel = true
            } else {
              console.log("非招募跳转地址：" + '/employManagement/fillInEmployment/' + publishEmploymentID + '/' + that.$route.params.brandName)
              that.$route.router.go('/employManagement/fillInEmployment/' + publishEmploymentID + '/' + that.$route.params.brandName)
            }
          })
        }
      }).catch(function(err) {
        that.showMsg = true
        that.errorMsg = err
        that.$route.router.go('/employManagement/chooseEmployableRoles')
      })
    },
    getBrandInfo() {
      var that = this
      console.log("正在获取品牌资料")

      applyEmploymentAPI.getBrandInfo({
        user_account: this.publishEmploymentData.employer_user_account
      }).then(function(result) {
        console.log(JSON.stringify(result))
        that.employmentData = result

        for (var item in result.brand_details) {
          for (var meta in result.brand_details[item]) {
            //key = "companyName"
            if (meta == 'key' && result.brand_details[item][meta] == 'companyName') {
              console.log(result.brand_details[item]['value'])
              that.company_name = result.brand_details[item]['value']
            }
          }
        }

      }).catch(function(err) {
        that.showMsg = true
        that.errorMsg = err
      })
    },
    getRoleName(account) {
      var that = this
      agentInfoAPI.getBrandRoleInfo({
        user_account: account
      }).then(function(result) {
        console.log(JSON.stringify(result))
        that.brand_role_name = result.brand_role.name

        if (result.brand_role.level == "0") {
          that.showEmploymentIDAndTerm = false
        } else {
          //获取授权编号 & 授权期
          that.getEmploymentGuidAndTerm(account)
        }
      }).catch(function(err) {
        that.showMsg = true
        that.errorMsg = err
      })
    },
    getAgentInfo(account) {
      var that = this
      employmentAPI.getAgentInfo({
        user_account: account
      }).then(function(result) {
        console.log(JSON.stringify(result))
        that.agentInfo = result

        for (var item in result.agent_details) {
          for (var meta in result.agent_details[item]) {
            if (meta == 'key') {
              switch (result.agent_details[item][meta]) {
                case "headImg":
                  that.agentInfo.headHref = "/service/public/upload/getAttachment?id=" + parseInt(result.agent_details[item]['value'])
                  break
                case "name":
                  that.agentInfo.name = result.agent_details[item]['value']
                  break
                case "wechat":
                  that.agentInfo.wechat = result.agent_details[item]['value']
                  break
                case "IDType":
                  that.agentInfo.IDType = result.agent_details[item]['value']
                  break
                case "IDNumber":
                  that.agentInfo.IDNumber = result.agent_details[item]['value']
                  break
              }
            }
          }
        }
      }).catch(function(err) {
        that.showMsg = true
        that.errorMsg = err
      })
    },
    getEmploymentGuidAndTerm(account) {
      var that = this
      employmentAPI.getEmploymentInfo({
        account: account
      }).then(function(result) {
        console.log(JSON.stringify(result))
        that.employmentIDAndTerm.employmentGuid = result[0].guid.split('-')[4]
        that.employmentIDAndTerm.start = new Date(result[1].employment_term.term_from).Format("yyyy 年 MM 月 dd 日")
        that.employmentIDAndTerm.deadline = new Date(result[1].employment_term.term_to).Format("yyyy 年 MM 月 dd 日")
      }).catch(function(err) {
        that.showMsg = true
        that.errorMsg = err
      })
    }
  },
  ready() {
    this.initData()
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
  width: 54%;
  height: auto;
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
  margin: 8% 0 0 0;
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
