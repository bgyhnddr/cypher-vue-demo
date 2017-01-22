<template>
<div class="certificate-bac" id="frozenAgent">
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
            <label>{{agentInfo.user_account}}</label>
          </div>
          <x-button type="default" class="certificate-view " v-link="{path: '/accountManagement/CertificateInfo/'+agentInfo.user.account+'/'+Pagefrom+'/#'+'/#'+'/'+agentInfo.user.account}">查看授权证书</x-button>
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
        </cell>
        <cell>
          <div slot="icon">姓名：
            <label>{{agentInfo.agent_detail.name}}</label>
          </div>
          <x-button type="default" class="certificate-views " v-link="{path: '/accountManagement/CertificateInfo/'+agentInfo.user.employment.employer_user_account+'/'+Pagefrom+'/#'+'/#'+'/'+agentInfo.user.account}">查看授权证书</x-button>
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
    <div>
      <confirm :show.sync="confirmThaw" title="" confirm-text="确认" cancel-text="取消" @on-confirm="Thaw">
        <p style="text-align:center;">您确认解除冻结该成员吗?</p>
      </confirm>
      <confirm :show.sync="confirmFroze" title="" confirm-text="确认" cancel-text="取消" @on-confirm="Froze">
        <p style="text-align:center;">您确认冻结该成员吗?</p>
      </confirm>
    </div>
  </div>
</div>
<div class="frozenAgent-button">
  <x-button v-if="!agentInfo.frozen_agent" type="primary" @click="ShowFroze">冻结账号</x-button>
  <x-button v-if="agentInfo.frozen_agent" type="primary" @click="ShowThaw">解除冻结</x-button>
</div>
<alert :show.sync="showAlert" button-text="确认">{{alertMsg}}</alert>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
import {
  Cell,
  Group,
  XButton,
  XHeader,
  Confirm,
  Alert
} from 'vux'
import employAPI from '../../api/employment'
import FrozenAPI from '../../api/frozen'
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
      confirmThaw: false,
      confirmFroze: false,
      alertMsg: "",
      Pagefrom: ""
    }
  },
  components: {
    Group,
    Cell,
    XButton,
    XHeader,
    Confirm,
    Alert
  },
  methods: {
    onClickBack() {
      var that = this
      if (that.Pagefrom == 'Frozenlist') {
        this.$route.router.go("/teamManagement/forzenLevelList")
      } else if (that.Pagefrom == 'Frozenmembers') {
        this.$route.router.go("/teamManagement/frozenMember/" + this.agentInfo.agent_brand_role.brand_role_code)
      }
    },
    ShowFroze() {
      this.confirmFroze = true
    },
    ShowThaw() {
      this.confirmThaw = true
    },
    Froze() {
      var that = this
      var agent = that.agentInfo.guid
      FrozenAPI.FrozenAgent({
        agent: agent
      }).then(() => {
        that.getAgentInfo()
      }).catch(function(err) {
        that.showAlert = true
        that.alertMsg = err
      })
    },
    Thaw() {
      var that = this
      var agent = that.agentInfo.guid
      FrozenAPI.ThawAgent({
        agent: agent
      }).then(() => {
        that.getAgentInfo()
      }).catch(function(err) {
        that.showAlert = true
        that.alertMsg = err
      })
    },
    getAgentInfo() {
      var that = this
      employAPI.getAgentDetail({
        account: that.$route.params.account
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
    this.Pagefrom = this.$route.params.from
    this.getAgentInfo()
    this.getHeadImg()
  }
}
</script>
<style>
#frozenAgent {
  min-height: 485px;
}

#frozenAgent .certificate-header img {
  border: 0;
  background-size: 100%;
  width: 25%;
}

#frozenAgent .certificate-header {
  text-align: center;
  padding-top: 2%;
}

#frozenAgent .certificate-header button {
  border: 0;
  background-size: 100%;
  width: 28%;
}

#frozenAgent .certificate-header button img {
  width: 100%;
  height: auto;
}

#frozenAgent .certificate-header p {
  color: #595959;
  font-size: 4.5vw;
  /*14px*/
}

#frozenAgent .certificate-header .vux-center {
  width: 23%;
  padding-top: 31%;
  position: relative;
  display: block;
  overflow: hidden;
}

#frozenAgent .certificate-header .vux-center img {
  left: -2%;
  top: 0;
  width: 100%;
  position: absolute;
  vertical-align: middle;
  min-height: 77px;
}

#frozenAgent .certificate-messages {
  position: relative;
  width: 89%;
  margin: 7% auto 0;
}

#frozenAgent .certificate-messages .weui_cell:before {
  border-top: 0
}

#frozenAgent .certificate-messages .weui_cell {
  border-bottom: 1px solid #d3d1d1;
  padding: 9px 0;
}

#frozenAgent .certificate-messages .weui_btn {
  padding-left: 0;
  padding-right: 0;
}

#frozenAgent .certificate-messages .certificate-view,
#frozenAgent .certificate-messages .certificate-views {
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

#frozenAgent .certificate-messages .certificate-view {
  top: 11%;
}

#frozenAgent .certificate-messages .certificate-views {
  top: -35px;
}

#frozenAgent .certificate-messages .weui_cell_hd {
  width: 100%;
  font-size: 4.5vw;
  /*14px*/
  color: #000;
  font-family: "微软雅黑";
}

#frozenAgent .certificate-messages .weui_cell_hd label {
  color: #595959;
}


/*.certificate-messages .weui_cell:nth-child(7) {
  border-bottom: 0;
}*/

.frozenAgent-button {
  position: fixed;
  bottom: 0;
  color: #fff;
  background: #fd5e5e;
  font-family: "微软雅黑";
  font-size: 5.2vw;
  border-radius: 0;
  border: 0;
  width: 100%
}

.frozenAgent-button button.weui_btn.weui_btn_primary {
  background: #fd5e5e;
}

#frozenAgent .weui_dialog {
  width: 92%;
}

#frozenAgent .weui_dialog_bd {
  color: #000000;
  font-size: 5.2vw;
  font-family: "\5FAE\8F6F\96C5\9ED1";
  margin-top: 5%;
}

#frozenAgent .weui_dialog_ft {
  width: 89%;
  margin: 8% auto;
  line-height: 32px;
  border-radius: 2px;
}

#frozenAgent .weui_dialog_confirm .weui_dialog_ft a {
  border: 0;
  background: #9b9b9b;
  color: #fff;
  font-size: 4.5vw
}

#frozenAgent .weui_dialog_confirm .weui_dialog_ft a:first-child {
  background: #0bb20c;
  margin-right: 2%;
}

#frozenAgent .weui_dialog_ft:after {
  border-top: 0
}
</style>
