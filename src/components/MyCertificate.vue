﻿<template>
<div class="certificate-bac">
  <div class="certificate-header">
    <div class="vux-center">
      <employment-headimg-upload :file-id.sync="agentInfo.headImg" @uploaded="changeHeadImg"></employment-headimg-upload>
      <p>点击头像可进行修改</p>
    </div>
  </div>

  <div class="certificate-messages ">
    <group>
      <div>
        <cell>
          <div slot="icon">用户名：
            <label>{{agentInfo.agent_detail.cellphone}}</label>
          </div>
        </cell>
        <cell>
          <div slot="icon">授权品牌：
            <label>{{agentInfo.brand}}</label>
          </div>
          <x-button type="default" class="certificate-view " v-link="{path: '/accountManagement/CertificateInfo/'+this.agentInfo.account+'/account'+'/#'+'/#'+'/'+this.agentInfo.account}">查看授权证书</x-button>
        </cell>
        <cell>
          <div slot="icon">授权等级：
            <label>{{agentInfo.brand_role}}</label>
          </div>
        </cell>
        <cell v-if="agentInfo.employerFlag">
          <div slot="icon">授权上级：
            <label>{{agentInfo.employer}}</label>
          </div>
          <x-button type="default" class="certificate-views " v-link="{path: '/accountManagement/CertificateInfo/'+this.agentInfo.employer_account+'/account'+'/#'+'/#'+'/'+this.agentInfo.account}">查看授权证书</x-button>
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
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
import {
  Cell,
  Group,
  XButton,
} from 'vux'
import employAPI from '../api/employment'
import EmploymentHeadimgUpload from './extend/employment-headimg-upload'
export default {
  data() {
    return {
      agentInfo: {
        employerFlag: false,
        headImg: null,
        account: "",
        brand: "",
        brand_role: "",
        employer: "",
        employer_account: "",
        agent_detail: {}
      }
    }
  },
  components: {
    Group,
    Cell,
    XButton,
    EmploymentHeadimgUpload
  },
  methods: {
    getAgentInfo() {
      var that = this
      employAPI.getAgentDetail({
        account: that.$route.params.account,
        locate: that.$route.params.locate
      }).then(function(result) {
        that.agentInfo.account = result.user.account
        that.agentInfo.agent_detail = result.agent_detail
        that.agentInfo.brand = result.user.employment.brand.name
        that.agentInfo.brand_role = result.agent_brand_role.brand_role.name
        that.agentInfo.employer = result.user.employment.user.agent.agent_detail.name
        that.agentInfo.employer_account = result.user.employment.employer_user_account
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
        that.agentInfo.account = result.user.account
        that.agentInfo.agent_detail = result.agent_detail
        that.agentInfo.brand = result.agent_brand_role.brand_role.brand.name
        that.agentInfo.brand_role = result.agent_brand_role.brand_role.name
        that.agentInfo.employer = result.user.employment.user.agent.agent_detail.name
        that.agentInfo.employer_account = result.user.employment.employer_user_account
      }).catch(function(err) {
        console.log(err)
        that.serveMsg = err
      })
    },
    getHeadImg() {
      var that = this
      employAPI.getHeadImg({
        account: that.$route.params.account
      }).then(function(result) {
        that.agentInfo.headImg = parseInt(result.value)
      }).catch(function(err) {
        console.log(err)
        that.serveMsg = err
      })
    },
    changeHeadImg() {
      var that = this
      employAPI.changeHeadImg({
        account: that.$route.params.account,
        ImgID: that.agentInfo.headImg
      }).then(function(result) {
        that.getHeadImg()
      }).catch(function(err) {
        console.log(err)
        that.serveMsg = err
      })
    },
  },
  ready() {
    if (this.$route.params.account != 'admin') {
      this.agentInfo.employerFlag = true
      this.getAgentInfo()
    } else {
      this.getBrandDetail()
    }
    this.getHeadImg()
  }
}
</script>
<style>
.certificate-bac {
  min-height: 485px;
}

.certificate-header {
  text-align: center;
  padding-top: 2%;
}

.certificate-header button {
  width:28%;
  padding-top: 31%;
  position: relative;
  display: block;
  overflow: hidden;
  margin: auto;
  border: 0;
background: none;
}

.certificate-header button img {
  left: -2%;
      top: 0;
      width: 100%;
      position: absolute;
      vertical-align: middle;
      min-height: 95px;
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


/*.certificate-messages .weui_cell:nth-child(7) {
  border-bottom: 0;
}*/
</style>
