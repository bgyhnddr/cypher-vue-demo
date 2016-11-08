<template>
    <div>
        <p>代理申请表</p>
        <div v-if="!showNextFillModel">
                <p>上级代理:{{employmentData.employerName}}上级授权号{{employmentData.agentGuid}}</p>
                <p>您当前代理级别为:{{employmentData.brandRoleName}}</p>
                <img class="vux-x-img ximg-demo" :name.sync="meta.headimg" alt="上传头像" />
                <vue-strap-upload :file-id.sync="data.headimg" ></vue-strap-upload>
                <group>
                    <x-input class="weui_cell_primary" title="申请人" :name.sync="meta.name" :value.sync="data.name"  
                        placeholder="申请人姓名" is-type="china-name" v-ref:name ></x-input>
                </group>
                <p>*姓名一经审批将不得修改，请慎重填写</p>
                <group>
                    <x-input class="weui_cell_primary" type="text" title="微信号" :name.sync="meta.wechat" :value.sync="data.wechat"
                        placeholder="必须以字母开头，6-20个字母，数字，下划线或减号" :min="6" :max="20" 
                        v-ref:wechat ></x-input>
                </group>
                <group>
                    <x-input class="weui_cell_primary" keyboard="number" title="手机号" :value.sync="data.account"  
                        placeholder="请输入手机号码"  is-type="china-mobile" v-ref:account></x-input>
                </group>
                <button class="weui_btn weui_btn_primary" :class="classes"  @click="goFillEmployment2">下一步</button>
        </div>
        <div v-else>
            <group>
                <selector placeholder="-证件类型-" :options="personalIdentityTypeList" :value.sync="data.typeOfPersonalIdentity"></selector>
                <x-input class="weui_cell_primary" keyboard="number" placeholder="输入证件号" :value.sync="data.valueOfPersonalIdentity" v-ref:valueOfPersonalIdentity></x-input>
            </group>
            <group title="通讯地址">
                <address title="" :value.sync="data.provinceAndRegionTemp" :list="addressData"></address>
            </group>
            <group>
                <x-textarea :name.sync="meta.addressDetail" :max="50" placeholder="请填写详细地址" :value.sync="data.addressDetail"></x-textarea>
            </group>
            <button class="weui_btn weui_btn_primary" :class="classes" @click="submit">确认申请</button>
        </div>
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
        Cell
    } from 'vux'
    import authAPI from '../api/auth'
    import applyEmploymentAPI from '../api/applyEmployment'
    import filterAddress from '../extend/filter-address'
    import VueStrapUpload from './extend/vue-strap-upload'

    export default {
        components: {
            Group,
            XInput,
            XNumber,
            Selector,
            Address,
            XTextarea,
            VueStrapUpload,
            Cell
        },
        data() {
            return {
                meta: {
                    headimg: "申请人头像",
                    name: "申请人",
                    wechat: "微信号",
                    account: "手机号",
                    typeOfPersonalIdentity: "证件类型",
                    valueOfPersonalIdentity: "证件号",
                    provinceAndRegion: "通讯地址",
                    addressDetail: "详细地址"
                },
                data: {
                    headimg: null,
                    name: "",
                    wechat: "",
                    account: "",
                    typeOfPersonalIdentity: "",
                    valueOfPersonalIdentity: "",
                    provinceAndRegionTemp: [],
                    provinceAndRegion: "",
                    addressDetail: ""
                },
                employmentData: {
                    employmentGuid: null,
                    publishEmploymentInfo: {},
                    agentGuid: "",
                    brandRoleName: "",
                    brandInfo: {},
                    employerName: {}
                },
                showNextFillModel: false,
                personalIdentityTypeList: ['身份证', '回乡证', '护照'],
                addressData: AddressChinaData

            }
        },
        methods: {
            initDate() {
                var that = this
                this.employmentData.employmentGuid = this.$route.params.employmentGuid

                applyEmploymentAPI.getPublishEmploymentInfo({
                    employmentGuid: this.employmentData.employmentGuid
                }).then(function(result) {
                    console.log(JSON.stringify(result))

                    //TODO:招募失效
                    var startDate = new Date(result.create_time)
                    var endDate = new Date(startDate.getTime() + 2 * 3600 * 1000)
                    if (endDate <= new Date()) {
                        window.alert("招募已失效")
                        that.$route.router.go('/auth/login')
                    } else {
                        that.employmentData.publishEmploymentInfo = result

                        that.getEmploymentInfo(result.employer_user_account)
                        that.getAgentGuid(result.employer_user_account)
                    }
                }).catch(function(err) {
                    window.alert(err)
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
                    window.alert(err)
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
                    window.alert(err)
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
                    window.alert(err)
                })
            },
            goFillEmployment2() {
                console.log("打开第二部分表格")
                var reg = /^[a-z]+[a-zA-Z0-9_]*$/ //微信号
                var reg2 = /[\u4e00-\u9fa5]/ //中文

                if (!this.$refs.name.valid || !reg.test(this.data.name)) {
                    window.alert("申请人填写错误，请填写完整，再跳转到下一页")
                } else if (!this.$refs.wechat.valid || !reg.test(this.data.wechat)) {
                    window.alert("微信号填写错误，请填写完整，再跳转到下一页")
                } else if (!this.$refs.account.valid) {
                    window.alert("手机号填写错误，请填写完整，再跳转到下一页")
                } else if (this.data.headimg == null) {
                    window.alert("头像还未上传，请填写完整，再跳转到下一页")
                } else {
                    this.$dispatch('fillInEmployment_goBack', true)
                    this.showNextFillModel = true
                }
            },
            submit() {
                var that = this
                    //将data.provinceAndRegion 转换成中文字符串
                this.data.provinceAndRegion = filterAddress(this.data.provinceAndRegionTemp, AddressChinaData)
                console.log(JSON.stringify(this.data))

                //招募失效
                var startDate = new Date(this.employmentData.publishEmploymentInfo.create_time)
                var endDate = new Date(startDate.getTime() + 2 * 3600 * 1000)
                if (endDate <= new Date()) {
                    window.alert("招募已失效")
                    that.$route.router.go('/auth/login')
                    return
                }

                //检查未填写完整的值
                if (this.data.typeOfPersonalIdentity == "") {
                    window.alert("证件类型未填写，请填写完整，再跳转到下一页")
                } else if (!this.$refs.valueofpersonalidentity.valid) {
                    window.alert("证件号填写错误，请填写完整，再跳转到下一页")
                } else if (this.data.provinceAndRegion == "") {
                    window.alert("通讯地址填写错误，请填写完整，再跳转到下一页")
                } else if (this.data.addressDetail == "") {
                    window.alert("通讯地址填写错误，请填写完整，再跳转到下一页")
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
                        that.$route.router.go('/employManagement/employmentSubmission/' + that.$route.params.brandName)
                    }).catch(function(err) {
                        window.alert(err)
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