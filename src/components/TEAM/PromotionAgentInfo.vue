<template>
<div id="PromotionAgentinfo">
<div class="certificate-bac">
  <div>
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="{showBack: false}">账户资料</x-header>
      <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
    </div>
  </div>
  <div class="certificate-messages">
    <group>
      <h3>
      <cell>
        <div slot="icon">
          <span>上级信息</span>
        </div>
      </cell>
    </h3>
    <div class="PromotionAgentinfo-superior">
      <cell>
        <div slot="icon">提拔人：
          <span>{{agentInfo.employer_user.agent.agent_detail.name}}</span>
        </div>
      </cell>
      <cell>
        <div slot="icon">提拔人等级：
          <label>{{agentInfo.employer_user.agent.agent_brand_role.brand_role.name}}</label>
        </div>
        <x-button type="default" class="certificate-view " v-link="{path: '/accountManagement/CertificateInfo/'+agentInfo.employer_user.account+'/promotion'+'/#'+'/#'+'/'+agentInfo.employee_user.agent.user_account}">查看授权证书</x-button>
      </cell>
      <cell>
        <div slot="icon">招募人已用金额：
          <span>￥{{agentInfo.brand_role_meta.totleInitialFee}}</span>
        </div>
      </cell>
    </div>
    </group>
  </div>
  <div class="certificate-messages">

    </div>
    <group>
        <h3>
        <cell>
          <div slot="icon">提拔成员信息</div>
        </cell>
      </h3>
          <div class="PromotionAgentinfo-superior-main">
      <div class="certificate-header">
        <div class="vux-center certificate-header-img ">
          <img class="vux-x-img ximg-demo vux-center" alt="头像" :src="'/service/public/upload/getAttachment?id='+agentInfo.employee_user.agent.agent_detail.headImg" />
        </div>
        <cell>
          <div slot="icon">授权品牌：
            <label>{{agentInfo.brand_role.brand.name}}</label>
          </div>
          <!-- <x-button type="default" class="certificate-view " v-link="{path: '/accountManagement/CertificateInfo/'+this.agentInfo.user.account+'/promote'+'/#'+'/#'+'/'+this.agentInfo.user.account}">查看授权证书</x-button> -->
        </cell>
        <cell>
          <div slot="icon">提拔等级：
            <label>{{agentInfo.brand_role.name}}</label>
          </div>
        </cell>
        <cell>
          <div slot="icon">姓名：
            <label>{{agentInfo.employee_user.agent.agent_detail.name}}</label>
          </div>
        </cell>
        <cell>
          <div slot="icon">微信号：
            <label>{{agentInfo.employee_user.agent.agent_detail.wechat}}</label>
          </div>
        </cell>
        <cell>
          <div slot="icon">手机号：
            <label>{{agentInfo.employee_user.agent.agent_detail.cellphone}}</label>
          </div>
        </cell>
        <cell>
          <div slot="icon">地址：
            <label>{{agentInfo.employee_user.agent.agent_detail.address}}{{agentInfo.employee_user.agent.agent_detail.address_detail}}</label>
          </div>
        </cell>
      </div>
    </group>
  </div>
  <div class="auditinfo-button">
    <flexbox>
      <flexbox-item>
        <x-button type="primary" @click="PassAudit">通过审核</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button type="warn" @click="showReason=true">打回</x-button>
      </flexbox-item>
    </flexbox>
  </div>
  <div class="auditinfo-backto ">
    <dialog :show.sync="showReason" class="dialog-demo">
      <group title="打回理由">
        <x-textarea :value.sync="reason" placeholder="填写打回理由" :show-counter="false"></x-textarea>
      </group>
      <flexbox>
        <flexbox-item>
          <x-button type="default" @click="rejectAudit" class="auditinfo-determine ">确定</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="default" @click="showReason=false">取消</x-button>
        </flexbox-item>
      </flexbox>
    </dialog>
  </div>
  <div>
    <div class="completely">
      <alert :show.sync="showTips" @on-hide="onHide" button-Text="继续审核">{{alertMsg}}</alert>
    </div>
  </div>
</div>
<alert :show.sync="showAlert" button-text="确认">{{alertMsg}}</alert>
</div>
</template>

<script>
import {
  Cell,
  Group,
  XButton,
  XHeader,
  Alert,
  Flexbox,
  FlexboxItem,
  XTextarea,
  Dialog
} from 'vux'
import promoteAPI from '../../api/promote'
export default {
  data() {
    return {
      headImg: null,
      showReason: false,
      showTips: false,
      showAlert: false,
      show: false,
      reason: "",
      alertMsg: "",
      agentInfo: {
        brand_role: {
          brand: {}
        },
        brand_role_meta: {},
        agent: {
          agent_detail: {}
        },
        employer_user: {
          agent: {
            agent_detail: {},
            agent_brand_role:{
              brand_role:{}
            }
          }
        },
        employee_user: {
          agent: {
            agent_detail: {}
          }
        }
      }
    }
  },
  components: {
    Group,
    Cell,
    XButton,
    XHeader,
    Alert,
    Flexbox,
    FlexboxItem,
    XTextarea,
    Dialog
  },
  methods: {
    onClickBack() {
      this.$route.router.go("/teamManagement/promotionAuditList")
    },
    getAuditInfo() {
      var that = this
      promoteAPI.getPromoteAuditInfo({
        account: this.$route.params.account
      }).then(function(result) {
        result.brand_role_meta.totleInitialFee = result.brand_role_meta.totleInitialFee.toFixed(1)
        that.agentInfo = result
      }).catch(function(err) {
        that.showAlert = true
        that.alertMsg = err
      })
    },
    PassAudit() {
      var that = this
      promoteAPI.PassPromote({
        account: that.$route.params.account
      }).then((result) => {
        if (result == "success") {
          that.showTips = true
          that.alertMsg = "您已完成审核"
        }
      }).catch(function(err) {
        that.showAlert = true
        that.alertMsg = err
      })
    },
    rejectAudit() {
      var that = this
      promoteAPI.RejectPromote({
        reason: that.reason,
        account: that.$route.params.account
      }).then((result) => {
        console.log(result)
        that.showReason = false
        that.showTips = true
        that.alertMsg = "您已完成审核"
      }).catch(function(err) {
        that.showReason = false
        that.showAlert = true
        that.alertMsg = err
      })
    },
    onHide() {
      this.$route.router.go("/teamManagement/promotionAuditList")
    }
  },
  ready() {
    this.getAuditInfo()
  }
}
</script>
<style>
#PromotionAgentinfo .certificate-bac {
  min-height: 485px;
}

#PromotionAgentinfo .certificate-header img {
  border: 0;
  background-size: 100%;
  width: 25%;
}

#PromotionAgentinfo .certificate-header {
  text-align: center;
  padding-top: 2%;
  background: #fff
}
#PromotionAgentinfo .certificate-header-img{
  width: 28%;
      padding-top: 31%;
      position: relative;
      display: block;
      overflow: hidden;
      margin: auto;
      border: 0;
      background: none;
      text-align: center;
      margin-top: 2%;
}
#PromotionAgentinfo .certificate-header-img img{
  left: -2%;
top: 0;
width: 100%;
position: absolute;
vertical-align: middle;
min-height: 95px;
}
#PromotionAgentinfo .certificate-header button {
  border: 0;
  background-size: 100%;
  width: 28%;
}

#PromotionAgentinfo .certificate-header button img {
  width: 100%;
  height: auto;
}

#PromotionAgentinfo .certificate-header p {
  color: #595959;
  font-size: 4.5vw;
  /*14px*/
}

#PromotionAgentinfo .certificate-header .vux-center {

  display: block;
  margin: auto;
}

#PromotionAgentinfo .certificate-messages {
  position: relative;
      width: 100%;
      margin: 0;
      padding: 0;
}

#PromotionAgentinfo .certificate-messages .weui_cell:before {
  border-top: 0
}

#PromotionAgentinfo .certificate-messages .weui_cell {
  border-bottom: 1px solid #d3d1d1;
  padding: 9px 6%;
  width: 88%;
  margin: auto;
}

#PromotionAgentinfo .certificate-messages .weui_btn {
  padding-left: 0;
  padding-right: 0;
}

#PromotionAgentinfo .certificate-messages .certificate-view,
#PromotionAgentinfo .certificate-messages .certificate-views {
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

#PromotionAgentinfo .certificate-messages .certificate-view {
  top: -93%;
  right: 3%;
}

#PromotionAgentinfo .certificate-messages .certificate-views {
  top: 4px;
}

#PromotionAgentinfo .certificate-messages .weui_cell_hd {
  width: 100%;
  font-size: 4.5vw;
  /*14px*/
  color: #000;
  font-family: "微软雅黑";
}

#PromotionAgentinfo .certificate-messages .weui_cell_hd label {
  color: #595959;
}
#PromotionAgentinfo h3{
color: #595959;
font-size: 4.5vw;
font-weight: normal;
}
#PromotionAgentinfo h3 span{
  color: #595959;
}
#PromotionAgentinfo .PromotionAgentinfo-superior{
background: #fff
}
#PromotionAgentinfo .PromotionAgentinfo-superior .weui_cell span{
  color: #595959
}
#PromotionAgentinfo .PromotionAgentinfo-superior-main{

    border-top: 1px solid #d3d1d1;
        min-height: 400px;
}

#PromotionAgentinfo .PromotionAgentinfo-superior-main .weui_cell{
  border-bottom: 1px solid #d3d1d1;
  padding: 9px 6%;
  width: 88%;
  margin: auto;
  font-size: 4.5vw
}
#PromotionAgentinfo .PromotionAgentinfo-superior-main .weui_cell label{
    color: #595959
}
#PromotionAgentinfo .weui_cell_hd{
width: auto;
}
</style>
