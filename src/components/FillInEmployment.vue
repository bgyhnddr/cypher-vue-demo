<template>
<div>
  <div class="fillin">
    <h3>代理申请表</h3>
    <div v-if="!showNextFillModel">
      <div class="ApplyFor-agent-message">
        <p>上级授权号&nbsp;:&nbsp;{{employmentData.showGuid}}</p>
        <p>上级代理&nbsp;:&nbsp;{{employmentData.employerName}}</p>
        <p>您当前代理级别为&nbsp;:&nbsp;
          <label>{{employmentData.brandRoleName}}</label>
        </p>
      </div>
      <div class="ApplyFor-agent-header" style="display:none">
        <img class="vux-x-img ximg-demo" :name.sync="meta.headImg" src="/static/TestIMG/upload.png" />
      </div>
      <div class="ApplyFor-agent-header">
        <employment-headimg-upload :file-id.sync="data.headImg"></employment-headimg-upload>
        <p v-if="errorRemind.headImg" class="fliin-error">请上传头像</p>
      </div>
      <div class="ApplyFor-agent-input">
        <group>
          <x-input class="weui_cell_primary  applicant-name" title="申请人&nbsp;:&nbsp;" :name.sync="meta.name" :value.sync="data.name" placeholder="申请人姓名" :show-clear="false" :required="false"></x-input>
        </group>
        <p class="applicants">*姓名一经审批将不得修改，请慎重填写</p>
        <p v-if="errorRemind.name" class="fliin-error">申请人请填写中文</p>
        <x-input class="weui_cell_primary applicant-weixin" type="text" title="微信号&nbsp;:&nbsp;" :name.sync="meta.wechat" :value.sync="data.wechat" placeholder="6-20个字母，数字，下划线或减号" :show-clear="false" :required="false"></x-input>
        <p v-if="errorRemind.wechat" class="fliin-error">微信号填写错误</p>
        </group>
        <group>
          <x-input class="weui_cell_primary applicant-phone" keyboard="number" title="手机号&nbsp;:&nbsp;" :value.sync="data.cellphone" placeholder="请输入手机号码" :show-clear="false" :required="false"></x-input>
          <p v-if="errorRemind.cellphone" class="fliin-error">手机号填写错误</p>
        </group>
      </div>
      <button class="weui_btn weui_btn_primary" :class="classes" @click="goFillEmployment2">下一步</button>
    </div>
    <div v-else>
      <div class="certificate ">
        <group>
          <selector placeholder="-证件类型-" :options="IDTypeList" :value.sync="data.IDType"></selector>
          <x-input class="weui_cell_primary certificate-input" placeholder="输入证件号" :value.sync="data.IDNumber" :show-clear="false" :required="false" v-ref:IDNumber></x-input>
          <p v-if="errorRemind.IDNumber">{{errorRemind.IDNumberErrorMsg}}</p>
          <div class="clean"></div>
        </group>
        <group title="通讯地址">
          <address title="" :value.sync="data.addressTemp" :list="addressData" placeholder="--省份--&nbsp;&nbsp;--城市--&nbsp;&nbsp;--地区--"></address>
        </group>
        <group>
          <x-textarea :name.sync="meta.addressDetail" :max="50" placeholder="请填写详细地址" :value.sync="data.addressDetail"></x-textarea>
          <p v-if="errorRemind.address" class="fliin-error">通讯地址填写错误</p>
        </group>
        <button class="weui_btn weui_btn_primary" :class="classes" @click="submit">确认申请</button>
      </div>
    </div>
    <alert :show.sync="showMsg" button-text="确认" @on-hide="onHide">{{errorMsg}}</alert>
    <alert :show.sync="showSubmitMsg" button-text="确认">{{submitMsg}}</alert>
  </div>
  <div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>
<script>
import {
  Group,
  XInput,
  XNumber,
  Selector,
  Address,
  AddressChinaData,
  XTextarea,
  Cell,
  Alert
} from 'vux'
import uuid from 'node-uuid'
import authAPI from '../api/auth'
import applyEmploymentAPI from '../api/applyEmployment'
import filterAddress from '../extend/filter-address'
import EmploymentHeadimgUpload from './extend/employment-headimg-upload'

export default {
  components: {
    Group,
    XInput,
    XNumber,
    Selector,
    Address,
    XTextarea,
    EmploymentHeadimgUpload,
    Cell,
    Alert
  },
  watch: {
    'data.headImg' () {
      this.errorRemind.headImg = false
    },
    'data.name' () {
      this.errorRemind.name = false
    },
    'data.wechat' () {
      this.errorRemind.wechat = false
    },
    'data.cellphone' () {
      this.errorRemind.cellphone = false
    },
    'data.IDType' () {
      this.errorRemind.IDNumber = false
    },
    'data.IDNumber' () {
      this.errorRemind.IDNumber = false
    },
    'data.addressTemp' () {
      this.errorRemind.address = false
    },
    'data.addressDetail' () {
      this.errorRemind.address = false
    }
  },
  data() {
    return {
      meta: {
        headImg: "申请人头像",
        name: "申请人",
        wechat: "微信号",
        cellphone: "手机号",
        IDType: "证件类型",
        IDNumber: "证件号",
        address: "通讯地址",
        addressDetail: "详细地址"
      },
      data: {
        headImg: null,
        name: "",
        wechat: "",
        cellphone: "",
        IDType: "",
        IDNumber: "",
        addressTemp: [],
        address: "",
        addressDetail: ""
      },
      employmentData: {
        publishEmploymentInfo: {},
        agentGuid: "",
        brandRoleName: "",
        brandInfo: {},
        employerName: {},
        guid: "",
        showGuid: "",
      },
      showNextFillModel: false,
      IDTypeList: ['身份证', '回乡证', '护照'],
      addressData: AddressChinaData,
      showMsg: false,
      errorMsg: null,
      errorRemind: {
        headImg: false,
        name: false,
        wechat: false,
        cellphone: false,
        IDNumber: false,
        IDNumberErrorMsg: null,
        address: false
      },
      loginUser: null,
      showSubmitMsg: false,
      submitMsg: null,
    }
  },
  methods: {
    initDate() {
      var that = this
      var publishEmploymentID = this.$route.params.publishEmploymentID
      authAPI.getUser().then(function(result) {
        that.loginUser = result.name

        applyEmploymentAPI.getPublishEmploymentInfo({
          employmentGuid: publishEmploymentID
        }).then(function(result) {
          that.employmentData.publishEmploymentInfo = result

          if (that.loginUser == result.employer_user_account) { //是发起人
            that.$route.router.go('/employManagement/brandAuthorization/' + publishEmploymentID)
          } else { //非发起人或者未登录

            var guid = uuid.v1()
            that.employmentData.guid = guid
            that.employmentData.showGuid = guid.split("-")[4]

            var startDate = new Date(result.create_time)
            var endDate = new Date(startDate.getTime() + 2 * 3600 * 1000)
              //招募已关闭
            if (result.status == false || endDate <= new Date()) {
              that.showMsg = true
              that.errorMsg = "招募已关闭，请关闭本页面"
            } else {
              that.getEmploymentInfo(result.employer_user_account)
              that.getAgentGuid(result.employer_user_account)
            }
          }
        }).catch(function(err) {
          that.showMsg = true
          that.errorMsg = err
        })

      })
    },
    getEmploymentInfo(user_account) {
      var that = this
      applyEmploymentAPI.getBrandInfo({
        user_account: user_account
      }).then(function(result) {
        that.employmentData.brandInfo = result

        that.getEmploymentBrandRole()
      }).catch(function(err) {
        that.showMsg = true
        that.errorMsg = err
      })
    },
    getEmploymentBrandRole() {
      var that = this
      applyEmploymentAPI.getRoleName({
        brand_guid: this.employmentData.brandInfo.guid,
        brand_role_code: this.employmentData.publishEmploymentInfo.brand_role_code
      }).then(function(result) {
        that.employmentData.brandRoleName = result.name
      }).catch(function(err) {
        that.showMsg = true
        that.errorMsg = err
      })
    },
    getAgentGuid(user_account) {
      var that = this
      applyEmploymentAPI.getAgentInfo({
        user_account: user_account
      }).then(function(result) {
        that.employmentData.agentGuid = result.guid

        for (var item in result.agent_details) {
          for (var meta in result.agent_details[item]) {
            if (meta == 'key' && result.agent_details[item][meta] == 'name') {
              that.employmentData.employerName = result.agent_details[item]['value']
            }
          }
        }
      }).catch(function(err) {
        that.showMsg = true
        that.errorMsg = err
      })
    },
    goFillEmployment2() {
      var that = this
      var showNextPage = true
      var reg = /^[a-zA-Z]+[a-zA-Z0-9_]*$/ //微信号
      var reg2 = /[\u4e00-\u9fa5]/ //中文
      var reg3 = /^(\+?0?86\-?)?1[345789]\d{9}$/ //手机号

      if (!reg2.test(this.data.name)) {
        this.errorRemind.name = true
        showNextPage = false
      }
      if (!reg.test(this.data.wechat) || this.data.wechat.length < 6 || this.data.wechat.length > 20) {
        this.errorRemind.wechat = true
        showNextPage = false
      }
      if (!reg3.test(this.data.cellphone)) {
        this.errorRemind.cellphone = true
        showNextPage = false
      }
      if (this.data.headImg == null) {
        this.errorRemind.headImg = true
        showNextPage = false
      }
      if (showNextPage) {
        //测试是否手机号与微信号已经被注册
        applyEmploymentAPI.checkBeforeSubmit({
          meta: this.meta,
          data: this.data,
          publishEmploymentGuid: this.employmentData.publishEmploymentInfo.guid
        }).then(function(result) {
          if (result) {
            that.$dispatch('fillInEmployment_goBack', true)
            that.showNextFillModel = true
          }
        }).catch(function(err) {
          if (err == "招募已关闭，请关闭本页面") {
            that.showMsg = true
            that.errorMsg = err
          } else {
            that.showSubmitMsg = true
            that.submitMsg = err
          }
        })


      }
    },
    submit() {
      var that = this
      var commitFlag = true
        //将data.provinceAndRegion 转换成中文字符串
      this.data.address = filterAddress(this.data.addressTemp, AddressChinaData)

      var startDate = new Date(this.employmentData.publishEmploymentInfo.create_time)
      var endDate = new Date(startDate.getTime() + 2 * 3600 * 1000)

      //检查未填写完整的值
      if (this.data.IDType == "") {
        this.errorRemind.IDNumber = true
        this.errorRemind.IDNumberErrorMsg = "证件类型未勾选"
        commitFlag = false
      } else if (this.$refs.idnumber.valid) {
        var reg1 = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/ //身份证
        var reg2 = /^[A-Z]\d{10}$/ //回乡证
        var reg3 = /^[a-zA-Z0-9]{6,30}$/ //长度
          //护照
        if (this.data.IDType == "身份证" && !reg1.test(this.data.IDNumber)) {
          this.errorRemind.IDNumber = true
          this.errorRemind.IDNumberErrorMsg = "身份证填写错误"
          commitFlag = false
        } else if (this.data.IDType == "回乡证" && !reg2.test(this.data.IDNumber)) {
          this.errorRemind.IDNumber = true
          this.errorRemind.IDNumberErrorMsg = "回乡证填写错误"
          commitFlag = false
        } else if (this.data.IDType == "护照" && !reg3.test(this.data.IDNumber)) {
          this.errorRemind.IDNumber = true
          this.errorRemind.IDNumberErrorMsg = "护照填写错误"
          commitFlag = false
        }
      }

      if (this.data.address == "") {
        this.errorRemind.address = true
        commitFlag = false
      }
      if (this.data.addressDetail == "") {
        this.errorRemind.address = true
        commitFlag = false
      }
      if (commitFlag) {
        var deadline = endDate.Format('yyyy-MM-dd hh:mm:ss')

        applyEmploymentAPI.submitApplication({
          meta: this.meta,
          data: this.data,
          employmentData: this.employmentData,
          deadline: deadline,
          publishEmploymentGuid: this.employmentData.publishEmploymentInfo.guid
        }).then(function(result) {
          that.$route.router.go("/employManagement/employmentSubmission")
        }).catch(function(err) {
          if (err == "招募已关闭，请关闭本页面") {
            that.showMsg = true
            that.errorMsg = err
          } else {
            that.showSubmitMsg = true
            that.submitMsg = err
          }
        })
      }
    },
    onHide() {
      if (this.loginUser == null) {
        location.href = location.origin + "/#!/auth/login"
      } else {
        location.href = location.origin + "/#!/employManagement"
      }
    }
  },
  events: {
    goFillEmployment1() {
      this.$dispatch('fillInEmployment_goBack', false)
      this.showNextFillModel = false
    }
  },
  ready() {
    this.initDate()
  }
}
</script>
<style>
.clean {
  clean: both
}

.fillin {
  width: 90%;
  margin: 0 auto;
  min-height: 485px;
}

.fillin h3 {
  text-align: center;
  color: #852d25;
  font-family: "微软雅黑";
  font-size: 5.3vw;
  /*18px*/
  margin-top: 1%;
}

.ApplyFor-agent-message {
  font-family: "微软雅黑";
  font-size: 4.5vw;
  /*14px*/
  color: #000;
  margin-top: 1%;
}

.ApplyFor-agent-message label {
  font-size: 4.5vw;
  /*14px*/
  color: #fd5e5e;
  font-weight: bold;
}

.ApplyFor-agent-header {
  text-align: center;
  width: 28%;
  margin: auto;
}

.ApplyFor-agent-header button {
  width: 100%;
  background: none;
  border: 0;
}

.ApplyFor-agent-header img {
  width: 100%;
  height: auto;
  margin-top: 5%;
}

.ApplyFor-agent-input .weui_cell {
  padding: 2% 0;
}

.ApplyFor-agent-input .weui_cell:before {
  border-top: 0
}

.ApplyFor-agent-input label.weui_label {
  color: #000;
  font-size: 4.7vw;
  /*15px*/
  font-family: "微软雅黑";
  display: inline;
}

.ApplyFor-agent-input .weui_cell_hd {
  width: 21%;
}

.applicant-name .weui_cell_primary,
.applicant-weixin .weui_cell_primary,
.applicant-phone .weui_cell_primary {
  background: #fff;
  border: 1px solid #d3d1d1;
  padding: 8px 0;
  border-radius: 2px;
}

.applicant-name .weui_cell_primary input,
.applicant-weixin .weui_cell_primary input,
.applicant-phone .weui_cell_primary input {
  padding-left: 2%;
  color: #aeaeae;
  font-size: 4.5vw;
  /*14px*/
  font-family: "微软雅黑";
  height: auto;
}

.applicants {
  font-size: 3.9vw;
  /*12px*/
  color: #d22d23;
  font-family: "微软雅黑";
}

.fillin button.weui_btn.weui_btn_primary {
  width: 100%;
  margin-top: 5%;
}

.fillin .weui_icon_warn:before {
  font-size: 4.5vw;
  /*14px*/
  color: #f43530;
}


/*证件信息*/

.certificate {
  margin-top: 3%;
}

.certificate .weui_cell {
  padding: 2% 0;
}

.certificate .weui_cell_hd {
  width: auto;
}

.certificate .weui_cell:before {
  border-top: 0;
}

.weui_cell_select .weui_cell_bd:after {
  transform: rotate(135deg);
  top: 44%;
  right: 11px;
}

.certificate .weui_cell_select {
  padding-top: 0!important;
  padding-bottom: 0!important;
  width: 35%;
  background: #fff;
  height: 2.5em;
  float: left;
  border: 1px solid #d3d1d1;
}

.certificate .weui_cell_select .weui_select {
  padding-left: 4%;
  font-family: "微软雅黑";
  padding-right: 23%;
  font-size: 4.5vw;
}

.certificate .weui_input {
  font-family: "微软雅黑";
  padding-left: 2%;
  font-size: 4.5vw;
}

.certificate .weui_cells_title {
  padding: 0;
  font-size: 4.7vw;
  /*15px*/
  font-family: "微软雅黑";
  color: #000;
}

.certificate .weui_cell_ft.weui_cell_primary.with_arrow {
  text-align: left;
  padding-left: 2%;
  background: #fff;
  height: 2.5em;
  line-height: 2.5;
  border: 1px solid #d3d1d1;
  position: relative;
}

.certificate-input {
  background: #fff;
  height: 1.7em;
  width: 60%;
  float: right;
  border: 1px solid #d3d1d1;
  padding-left: 2%;
}

.certificate span.vux-popup-picker-value {
  width: 89%;
  font-size: 4.5vw;
}

.certificate .weui_cell_ft.with_arrow:after {
  transform: rotate(135deg);
  height: 6px;
  width: 6px;
  border-width: 2px 2px 0 0;
  border-color: #c8c8cd;
  border-style: solid;
  position: relative;
  top: -1px;
  margin-left: .3em;
}

.certificate textarea.weui_textarea {
  border: 1px solid #d3d1d1;
  width: 97%;
  padding-left: 2%;
  font-size: 4.5vw;
  padding-top: 1%;
}

.certificate .weui_textarea_counter {
  margin-top: 4%;
  font-family: "微软雅黑";
  font-size: 4.5vw;
}

.certificate [class*=" weui_icon_"]:before,
[class^=weui_icon_]:before {
  margin-right: 0.5em;
}

.certificate .weui_cell_ft.weui_cell_primary.with_arrow span:nth-child(2) {
  position: absolute;
  left: 5%;
  font-size: 4.5vw;
  top: 11%;
  font-family: "微软雅黑";
}


/*错误*/

.fliin-error {
  font-size: 3.9vw;
  color: #d22d23;
  font-family: "微软雅黑"
}

.certificate:first-child p {
  font-family: "微软雅黑";
  width: 100%;
  clear: both;
  font-family: "\5FAE\8F6F\96C5\9ED1";
  font-size: 3.9vw;
  color: #d22d23;
  text-align: right
}
</style>
