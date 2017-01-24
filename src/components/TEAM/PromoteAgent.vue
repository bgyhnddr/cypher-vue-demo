<template>
<div id="promoteAgent">
  <div>
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="{showBack: false}">{{agentInfo.agent_detail.name}}</x-header>
      <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
    </div>
  </div>
  <div class="certificate-header">
    <div class="vux-center">
      <img class="vux-x-img ximg-demo vux-center" alt="头像" :src="'/service/public/upload/getAttachment?id='+this.headImg" />
    </div>
  </div>
  <div class="certificate-messages ">
    <group>
      <div>
        <cell>
          <div slot="icon">用户名：
            <label>{{agentInfo.agent_detail.cellphone}}</label>
          </div>
          <x-button type="default" class="certificate-view " v-link="{path: '/accountManagement/CertificateInfo/'+this.agentInfo.user.account+'/promote'+'/#'+'/#'+'/'+this.agentInfo.user.account}">查看授权证书</x-button>
        </cell>
        <cell>
          <div slot="icon">授权品牌：
            <label>{{agentInfo.user.employment.brand.name}}</label>
          </div>
        </cell>
        <cell>
          <div slot="icon">授权等级：
            <label>{{agentInfo.agent_brand_role.brand_role.name}}</label>
          </div>
        </cell>
        <cell>
          <div slot="icon">授权上级：
            <label>{{agentInfo.user.employment.user.agent.agent_detail.name }}
            </label>
          </div>
          <x-button type="default" class="certificate-views " v-link="{path: '/accountManagement/CertificateInfo/'+this.agentInfo.user.employment.employer_user_account+'/promote'+'/#'+'/#'+'/'+this.agentInfo.user.account}">查看授权证书</x-button>
        </cell>
        <cell>
          <div slot="icon">姓名：
            <label>{{agentInfo.agent_detail.name}}</label>
          </div>
        </cell>
        <cell>
          <div slot="icon">微信号：
            <label>{{agentInfo.agent_detail.wechat}}</label>
          </div>
        </cell>
        <cell>
          <div slot="icon">手机号：
            <label>{{agentInfo.agent_detail.cellphone}}</label>
          </div>
        </cell>
        <cell>
          <div slot="icon">地址：
            <label>{{agentInfo.agent_detail.address}}{{agentInfo.agent_detail.addressDetail}}</label>
          </div>
        </cell>
      </div>
    </group>

  </div>
</div>
<div class="promoteAgent-button">
  <x-button type="primary" @click="ShowPromote">提拔</x-button>
</div>
<alert :show.sync="showAlert" button-text="确认">{{alertMsg}}</alert>
</template>

<script>
import {
  Cell,
  Group,
  XButton,
  XHeader,
  Alert
} from 'vux'
import employAPI from '../../api/employment'
export default {
  data() {
    return {
      headImg: null,
      agentInfo: {
        user: {
          employment: {
            brand: {},
            user: {
              agent: {
                agent_detail: {}
              }
            }
          }
        },
        agent_detail: {},
        agent_brand_role: {
          brand_role: {}
        }
      },
      showAlert: false,
      show: false,
      alertMsg: ""
    }
  },
  components: {
    Group,
    Cell,
    XButton,
    XHeader,
    Alert
  },
  methods: {
    onClickBack() {
      this.$route.router.go("/teamManagement/promoteLevelList")
    },
    ShowPromote() {
      this.$route.router.go("/teamManagement/choosePromoteRole/" + this.$route.params.account)
    },
    getAgentInfo() {
      var that = this
      employAPI.getAgentDetail({
        account: this.$route.params.account
      }).then(function(result) {
        that.agentInfo = result
      }).catch(function(err) {
        that.showAlert = true
        that.alertMsg = err
      })
    },
    getHeadImg() {
      var that = this
      employAPI.getHeadImg({
        account: that.$route.params.account
      }).then(function(result) {
        that.headImg = parseInt(result.value)
      }).catch(function(err) {
        that.showAlert = true
        that.alertMsg = err
      })
    }
  },
  ready() {
    this.getAgentInfo()
    this.getHeadImg()
    document.body.style.background = '#f2f2f2'
  }
}
</script>
<style>
#promoteAgent {
  height: 100%
}

#promoteAgent .certificate-header img {
  border: 0;
  background-size: 100%;
  width: 25%;
}

#promoteAgent .certificate-header {
  text-align: center;
  padding-top: 46px;
}

#promoteAgent .certificate-header button {
  border: 0;
  background-size: 100%;
  width: 28%;
}

#promoteAgent .certificate-header button img {
  width: 100%;
  height: auto;
}

#promoteAgent .certificate-header p {
  color: #595959;
  font-size: 4.5vw;
  /*14px*/
}

#promoteAgent .certificate-header .vux-center {
  width: 23%;
  padding-top: 31%;
  position: relative;
  display: block;
  overflow: hidden;
}

#promoteAgent .certificate-header .vux-center img {
  left: -2%;
  top: 0%;
  width: 100%;
  position: absolute;
  vertical-align: middle;
  min-height: 95px;
}

#promoteAgent .certificate-messages {
  position: relative;
  width: 89%;
  margin: 7% auto 0;
}

#promoteAgent .certificate-messages .weui_cell:before {
  border-top: 0
}

#promoteAgent .certificate-messages .weui_cell {
  border-bottom: 1px solid #d3d1d1;
  padding: 9px 0;
}

#promoteAgent .certificate-messages .weui_btn {
  padding-left: 0;
  padding-right: 0;
}

#promoteAgent .certificate-messages .certificate-view,
#promoteAgent .certificate-messages .certificate-views {
  position: absolute;
  right: 0;
  border: 0;
  width: 33%;
  background: #5091d5;
  color: #fff;
  font-size: 3.9vw;
  /*12px*/
  border-radius: 0;
  font-family: "微软雅黑";
}

#promoteAgent .certificate-messages .certificate-view {
  top: 14%;
}

#promoteAgent .certificate-messages .certificate-views {
  top: 4px;
}

#promoteAgent .certificate-messages .weui_cell_hd {
  width: 100%;
  font-size: 4.5vw;
  /*14px*/
  color: #000;
  font-family: "微软雅黑";
}

#promoteAgent .certificate-messages .weui_cell_hd label {
  color: #595959;
}

.promoteAgent-button {
  position: fixed;
  bottom: 0;
  color: #fff;
  background: #21c36d;
  font-family: "微软雅黑";
  border-radius: 0;
  border: 0;
  width: 100%;
}
</style>
