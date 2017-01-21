<template>
<div class="certificate-bac">
  <div>
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="{showBack: false}">账户资料</x-header>
      <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
    </div>
  </div>
  <div class="certificate-messages">
    <group>
      <cell>
        <div slot="icon">
          <span>上级信息</span>
        </div>
      </cell>
      <cell>
        <div slot="icon">提拔人：
          <span>{{agentInfo.user.agent.agent_detail.name}}</span>
        </div>
        <x-button type="default" class="certificate-views " v-link="{path:'' }">查看授权证书</x-button>
      </cell>
      <cell>
        <div slot="icon">招募人已用金额：
          <span>￥10000</span>
        </div>
      </cell>
    </group>
  </div>
  <div class="certificate-messages">
    <div class="certificate-header">
      <div class="vux-center">
        <img class="vux-x-img ximg-demo vux-center" alt="头像" :src="'/service/public/upload/getAttachment?id='+agentInfo.agent.agent_detail.headImg" />
      </div>
    </div>
    <group>
      <div>
        <cell>
          <div slot="icon">提拔成员信息</div>
        </cell>
        <cell>
          <div slot="icon">授权品牌：
            <label>{{agentInfo.brand_role.brand.name}}</label>
          </div>
          <!-- <x-button type="default" class="certificate-view " v-link="{path: '/accountManagement/CertificateInfo/'+this.agentInfo.user.account+'/promote'+'/#'+'/#'+'/'+this.agentInfo.user.account}">查看授权证书</x-button> -->
        </cell>
        <cell>
          <div slot="icon">姓名：
            <label>{{agentInfo.agent.agent_detail.name}}</label>
          </div>
        </cell>
        <cell>
          <div slot="icon">微信号：
            <label>{{agentInfo.agent.agent_detail.wechat}}</label>
          </div>
        </cell>
        <cell>
          <div slot="icon">手机号：
            <label>{{agentInfo.agent.agent_detail.cellphone}}</label>
          </div>
        </cell>
        <cell>
          <div slot="icon">地址：
            <label>{{agentInfo.agent.agent_detail.address}}{{agentInfo.agent.agent_detail.address_detail}}</label>
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
        <x-button type="warn" @click="show=true">打回</x-button>
      </flexbox-item>
    </flexbox>
  </div>
  <div class="auditinfo-backto ">
    <dialog :show.sync="show" class="dialog-demo">
      <!-- <button @click="show=false" class="close-button"></button> -->
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
    <div class="completely">
      <alert :show.sync="showAlert" @on-hide="onHide" button-Text="继续审核">{{alertMsg}}</alert>
    </div>
  </div>
</div>
<alert :show.sync="showAlert" button-text="确认">{{alertMsg}}</alert>
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
  XTextarea
} from 'vux'
import promoteAPI from '../../api/promote'
export default {
  data() {
    return {
      headImg: null,
      agentInfo: {
        brand_role: {
          brand: {}
        },
        agent: {
          agent_detail: {}
        },
        user: {
          agent: {
            agent_detail: {}
          }
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
    Alert,
    Flexbox,
    FlexboxItem,
    XTextarea
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
        console.log(result)
        that.agentInfo = result
      }).catch(function(err) {
        that.showAlert = true
        that.alertMsg = err
      })
    },
    PassAudit(){

    },
    rejectAudit() {

    },
    onHide() {

    }
  },
  ready() {
    this.getAuditInfo()
  }
}
</script>
<style>
.certificate-bac {
  min-height: 485px;
}

.certificate-header img {
  border: 0;
  background-size: 100%;
  width: 25%;
}

.certificate-header {
  text-align: center;
  padding-top: 2%;
}

.certificate-header button {
  border: 0;
  background-size: 100%;
  width: 28%;
}

.certificate-header button img {
  width: 100%;
  height: auto;
}

.certificate-header p {
  color: #595959;
  font-size: 4.5vw;
  /*14px*/
}

.certificate-header .vux-center {
  width: 86%;
  display: block;
  margin: auto;
}

.certificate-messages {
  position: relative;
  width: 89%;
  margin: 7% auto 0;
}

.certificate-messages .weui_cell:before {
  border-top: 0
}

.certificate-messages .weui_cell {
  border-bottom: 1px solid #d3d1d1;
  padding: 9px 0;
}

.certificate-messages .weui_btn {
  padding-left: 0;
  padding-right: 0;
}

.certificate-messages .certificate-view,
.certificate-messages .certificate-views {
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

.certificate-messages .certificate-view {
  top: -93%;
}

.certificate-messages .certificate-views {
  top: 4px;
}

.certificate-messages .weui_cell_hd {
  width: 100%;
  font-size: 4.5vw;
  /*14px*/
  color: #000;
  font-family: "微软雅黑";
}

.certificate-messages .weui_cell_hd label {
  color: #595959;
}
</style>
