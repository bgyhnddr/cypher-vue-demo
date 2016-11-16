<template>
    <div>
        <div class="fillin">
            <h3>代理申请表</h3>
            <div v-if="!showNextFillModel">
                <div class="ApplyFor-agent-message">
                    <p>上级授权号&nbsp;:&nbsp;{{employmentData.guid}}</p>
                    <p>上级代理&nbsp;:&nbsp;{{employmentData.employerName}}</p>
                    <p>您当前代理级别为&nbsp;:&nbsp;<label>{{employmentData.brandRoleName}}</label></p>
                </div>
                <div class="ApplyFor-agent-header" style="display:none"> <img class="vux-x-img ximg-demo" :name.sync="meta.headImg" src="/static/TestIMG/upload.png" /></div>
               <div class="ApplyFor-agent-header">  <employment-headimg-upload :file-id.sync="data.headImg"></employment-headimg-upload></div>
                <div class="ApplyFor-agent-input">
                    <group>
                        <x-input class="weui_cell_primary  applicant-name" title="申请人&nbsp;:&nbsp;" :name.sync="meta.name" :value.sync="data.name" placeholder="申请人姓名" is-type="china-name" :show-clear=false  v-ref:name></x-input>
                    </group>
                    <p class="applicants">*姓名一经审批将不得修改，请慎重填写</p>
                    <x-input class="weui_cell_primary applicant-weixin" type="text" title="微信号&nbsp;:&nbsp;" :name.sync="meta.wechat" :value.sync="data.wechat" placeholder="6-20个字母，数字，下划线或减号" :min="6" :max="20" :show-clear=false  v-ref:wechat></x-input>
                    </group>
                    <group>
                        <x-input class="weui_cell_primary applicant-phone" keyboard="number" title="手机号&nbsp;:&nbsp;" :value.sync="data.cellphone" placeholder="请输入手机号码" is-type="china-mobile" :show-clear=false  v-ref:cellphone></x-input>
                    </group>
                </div>
                <button class="weui_btn weui_btn_primary" :class="classes" @click="goFillEmployment2">下一步</button>
            </div>
            <div v-else>
                <div class="certificate ">
                    <group>
                        <selector placeholder="-证件类型-" :options="IDTypeList" :value.sync="data.IDType"></selector>
                        <x-input class="weui_cell_primary certificate-input" keyboard="number" placeholder="输入证件号" :value.sync="data.IDNumber" :show-clear=false v-ref:IDNumber></x-input>
                        <div class="clean"></div>
                    </group>
                    <group title="通讯地址">
                        <address title="" :value.sync="data.addressTemp" :list="addressData" placeholder="--省份--，--城市--，--地区--"></address>
                    </group>
                    <group>
                        <x-textarea :name.sync="meta.addressDetail" :max="50" placeholder="请填写详细地址" :value.sync="data.addressDetail"></x-textarea>
                    </group>
                    <button class="weui_btn weui_btn_primary" :class="classes" @click="submit">确认申请</button>
                </div>
            </div>
            <alert :show.sync="showMsg" button-text="确认">{{errorMsg}}</alert>
        </div>
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
                },
                showNextFillModel: false,
                IDTypeList: ['身份证', '回乡证', '护照'],
                addressData: AddressChinaData,
                showMsg: false,
                errorMsg: null
            }
        },
        methods: {
            initDate() {
                var that = this
                var guid = uuid.v1()
                this.employmentData.guid = guid
                var employmentGuid = this.$route.params.publishEmploymentID
                console.log(employmentGuid)
                applyEmploymentAPI.getPublishEmploymentInfo({
                    employmentGuid: employmentGuid
                }).then(function(result) {
                    console.log(JSON.stringify(result))

                    //招募失效
                    var startDate = new Date(result.create_time)
                    var endDate = new Date(startDate.getTime() + 2 * 3600 * 1000)
                    if (endDate <= new Date()) {
                        that.showMsg = true
                        that.errorMsg = "招募已失效"
                        that.$route.router.go('/auth/login')
                    } else {
                        that.employmentData.publishEmploymentInfo = result

                        that.getEmploymentInfo(result.employer_user_account)
                        that.getAgentGuid(result.employer_user_account)
                    }
                }).catch(function(err) {
                    that.showMsg = true
                    that.errorMsg = err
                })
            },
            getEmploymentInfo(user_account) {
                var that = this
                console.log("正在获取品牌资料:" + user_account)
                applyEmploymentAPI.getBrandInfo({
                    user_account: user_account
                }).then(function(result) {
                    that.employmentData.brandInfo = result
                    console.log(JSON.stringify(that.employmentData))

                    that.getEmploymentBrandRole()
                }).catch(function(err) {
                    that.showMsg = true
                    that.errorMsg = err
                })
            },
            getEmploymentBrandRole() {
                var that = this
                console.log("正在获取申请等级")
                applyEmploymentAPI.getRoleName({
                    brand_guid: this.employmentData.brandInfo.guid,
                    brand_role_code: this.employmentData.publishEmploymentInfo.brand_role_code
                }).then(function(result) {
                    that.employmentData.brandRoleName = result.name
                    console.log(JSON.stringify(result))
                }).catch(function(err) {
                    that.showMsg = true
                    that.errorMsg = err
                })
            },
            getAgentGuid(user_account) {
                var that = this
                console.log("获取招募者资料:" + user_account)
                applyEmploymentAPI.getAgentInfo({
                    user_account: user_account
                }).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.employmentData.agentGuid = result.guid

                    for (var item in result.agent_details) {
                        for (var meta in result.agent_details[item]) {
                            if (meta == 'key' && result.agent_details[item][meta] == 'name') {
                                console.log(result.agent_details[item]['value'])
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
                console.log("打开第二部分表格")
                var reg = /^[a-zA-Z]+[a-zA-Z0-9_]*$/ //微信号
                var reg2 = /[\u4e00-\u9fa5]/ //中文

                if (!this.$refs.name.valid || !reg2.test(this.data.name)) {
                    this.showMsg = true
                    this.errorMsg = "申请人需填写中文，请填写完整，再跳转到下一页"
                } else if (!this.$refs.wechat.valid || !reg.test(this.data.wechat)) {
                    this.showMsg = true
                    this.errorMsg = "微信号需填写以字母开头，由6-20个字母，数字，下划线或减号组成的字符串，请填写完整，再跳转到下一页"
                } else if (!this.$refs.cellphone.valid) {
                    this.showMsg = true
                    this.errorMsg = "手机号填写错误，请填写完整，再跳转到下一页"
                } else if (this.data.headImg == null) {
                    this.showMsg = true
                    this.errorMsg = "头像还未上传，请填写完整，再跳转到下一页"
                } else {
                    this.$dispatch('fillInEmployment_goBack', true)
                    this.showNextFillModel = true
                }
            },
            submit() {
                var that = this
                    //将data.provinceAndRegion 转换成中文字符串
                this.data.address = filterAddress(this.data.addressTemp, AddressChinaData)
                console.log(JSON.stringify(this.data))

                var startDate = new Date(this.employmentData.publishEmploymentInfo.create_time)
                var endDate = new Date(startDate.getTime() + 2 * 3600 * 1000)

                //检查未填写完整的值
                if (this.data.IDType == "") {
                    this.showMsg = true
                    this.errorMsg = "证件类型未填写，请填写完整，再跳转到下一页"
                } else if (!this.$refs.idnumber.valid) {
                    this.showMsg = true
                    this.errorMsg = "证件号填写错误，请填写完整，再跳转到下一页"
                } else if (this.$refs.idnumber.valid) {
                    var reg1 = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/ //身份证
                    var reg2 = /^[A-Z]\d{10}$/ //回乡证
                        //护照
                    if (this.data.IDType == "身份证" && !reg1.test(this.data.idnumber)) {
                        this.showMsg = true
                        this.errorMsg = "证件号填写错误，请填写完整，再跳转到下一页"
                    } else if (this.data.IDType == "回乡证" && !reg2.test(this.data.idnumber)) {
                        this.showMsg = true
                        this.errorMsg = "证件号填写错误，请填写完整，再跳转到下一页"
                    }
                } else if (this.data.address == "") {
                    this.showMsg = true
                    this.errorMsg = "通讯地址填写错误，请填写完整，再跳转到下一页"
                } else if (this.data.addressDetail == "") {
                    this.showMsg = true
                    this.errorMsg = "通讯地址填写错误，请填写完整，再跳转到下一页"
                } else {
                    var deadline = endDate.Format('yyyy-MM-dd hh:mm:ss')
                    console.log(deadline)

                    applyEmploymentAPI.submitApplication({
                        meta: this.meta,
                        data: this.data,
                        employmentData: this.employmentData,
                        deadline: deadline
                    }).then(function(result) {
                        console.log("提交成功")
                        that.$route.router.go('/employManagement/employmentSubmission/' + that.employmentData.brandInfo.name)
                    }).catch(function(err) {
                        that.showMsg = true
                        that.errorMsg = err
                    })
                }
            }
        },
        events: {
            goFillEmployment1() {
                console.log("打开第一部分表格")
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
        margin: auto;
    }
    
    .fillin h3 {
        text-align: center;
        color: #852d25;
        font-family: "微软雅黑";
        font-size: 18px;
        margin-top: 1%;
    }
    
    .ApplyFor-agent-message {
        font-family: "微软雅黑";
        font-size: 14px;
        color: #000;
        margin-top: 1%;
    }
    
    .ApplyFor-agent-message label {
        font-size: 14px;
        color: #fd5e5e;
    }
    
    .ApplyFor-agent-header {
        text-align: center;
        margin-top: 2%;
    }
    
    .ApplyFor-agent-header button {
        width: 100%;
        background: none;
        border: 0;
    }
    
    .ApplyFor-agent-header img {
        width: 31%;
        height: auto;
    }
    
    .ApplyFor-agent-input .weui_cell {
        padding: 2% 0;
    }
    
    .ApplyFor-agent-input .weui_cell:before {
        border-top: 0
    }
    
    .ApplyFor-agent-input label.weui_label {
        color: #000;
        font-size: 15px;
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
        border: 1px solid #a8a8a8;
        padding: 2% 0;
    }
    
    .applicant-name .weui_cell_primary input,
    .applicant-weixin .weui_cell_primary input,
    .applicant-phone .weui_cell_primary input {
        padding-left: 2%;
        color: #aeaeae;
        font-size: 14px;
        font-family: "微软雅黑";
    }
    
    .applicants {
        font-size: 12px;
        color: #d22d23;
        font-family: "微软雅黑";
    }
    
    .fillin button.weui_btn.weui_btn_primary {
        width: 100%;
        margin-top: 5%;
    }
    
    .fillin .weui_icon_warn:before {
        font-size: 14px;
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
    }
    
    .certificate .weui_input {
        font-family: "微软雅黑";
        padding-left: 2%;
    }
    
    .certificate .weui_cells_title {
        padding: 0;
        font-size: 15px;
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
    }
    
    .certificate .weui_textarea_counter {
        margin-top: 4%;
    }
    
    .certificate [class*=" weui_icon_"]:before,
    [class^=weui_icon_]:before {
        margin-right: 0.5em;
    }
    
    .certificate .weui_cell_ft.weui_cell_primary.with_arrow span:nth-child(2) {
        position: absolute;
        left: 5%;
    }
</style>