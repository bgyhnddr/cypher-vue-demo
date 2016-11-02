<template>
    <div>
        <p>代理申请表</p>
        <div v-if="!showNextFillModel">
                <p>上级代理:{{employmentData.brandInfo.company_name}}上级授权号{{employmentData.brandInfo.guid}}</p>
                <p>您当前代理级别为:{{employmentData.brand_role_name}}</p>
                <img class="vux-x-img ximg-demo" :name.sync="meta.headimg" alt="上传头像" />
                <vue-strap-upload :file-id.sync="data.headimg" ></vue-strap-upload>
                <group>
                    <x-input class="weui_cell_primary" title="申请人" :name.sync="meta.name" :value.sync="data.name"  
                        placeholder="申请人姓名" is-type="china-name" ></x-input>
                </group>
                <p>*姓名一经审批将不得修改，请慎重填写</p>
                <group>
                    <x-input class="weui_cell_primary" type="text" title="微信号" :name.sync="meta.name" :value.sync="data.wechat"
                        placeholder="6-20个字母，数字，下划线或减号" :min="6" :max="20" @on-change="wechatValidation"></x-input>
                </group>
                <group>
                    <x-input class="weui_cell_primary" keyboard="number" title="手机号" :value.sync="data.account"  
                        placeholder="请输入手机号码"  is-type="china-mobile"></x-input>
                </group>
                <button class="weui_btn weui_btn_primary" :class="classes" @click="goFillEmployment2">下一步</button>
        </div>
        <div v-else>
            <group>
                <selector placeholder="-证件类型-" :options="personalIdentityTypeList" :value.sync="data.typeOfPersonalIdentity"></selector>
                <x-input class="weui_cell_primary" keyboard="number" placeholder="输入证件号" :value.sync="data.valueOfPersonalIdentity"></x-input>
            </group>
            <group title="通讯地址">
                <address title="" :value.sync="data.provinceAndRegionTemp" :list="addressData"></address>
            </group>
            <group>
                <x-textarea :name.sync="meta.addressDetail" :max="50" placeholder="请填写详细地址" :value.sync="data.addressDetail"></x-textarea>
            </group>
            <button class="weui_btn weui_btn_primary" :class="classes" @click="goFillEmployment1">返回</button>
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
        XTextarea
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
            VueStrapUpload
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
                    user_account: "",
                    brand_role_code: "",
                    brand_role_name: "",
                    date: {
                        start: "",
                        deadline: ""
                    },
                    brandInfo: {}
                },
                showNextFillModel: false,
                personalIdentityTypeList: ['身份证', '回乡证', '护照'],
                addressData: AddressChinaData,

            }
        },
        methods: {
            initDate() {
                this.employmentData.user_account = this.$route.params.account
                this.employmentData.brand_role_code = this.$route.params.employableRole

                var startTime = this.$route.params.startTime
                this.employmentData.date.start = new Date(parseInt(startTime)).Format('yyyy-MM-dd')
                var startDate = new Date(this.employmentData.date.start)
                this.employmentData.date.deadline = new Date(startDate.getTime() + 30 * 24 * 3600 * 1000).Format('yyyy-MM-dd')

                this.getEmploymentInfo()

            },
            getEmploymentInfo() {
                var that = this
                console.log("正在获取品牌资料:" + this.employmentData.user_account)
                applyEmploymentAPI.getBrandInfo({
                    user_account: this.employmentData.user_account
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
                    brand_role_code: this.employmentData.brand_role_code
                }).then(function(result) {
                    that.employmentData.brand_role_name = result.name
                    console.log(JSON.stringify(result))
                }).catch(function(err) {
                    window.alert(err)
                })
            },
            goFillEmployment2() {
                console.log("打开第二部分表格")

                if (this.data.headimg != null && this.data.name != "" && this.data.wechat != "" && this.data.account != "") {
                    this.showNextFillModel = true
                } else {
                    window.alert("您还有未填写的项，请填写完整，再跳转到下一页")
                    return
                }
            },
            goFillEmployment1() {
                console.log("打开第一部分表格")
                this.showNextFillModel = false
            },
            submit() {
                var that = this
                    //将data.provinceAndRegion 转换成中文字符串
                this.data.provinceAndRegion = filterAddress(this.data.provinceAndRegionTemp, AddressChinaData)
                console.log(JSON.stringify(this.data))

                if (this.data.typeOfPersonalIdentity != "" && this.data.valueOfPersonalIdentity != "" &&
                    this.data.provinceAndRegion != "" && this.data.addressDetail) {
                    this.showNextFillModel = true
                } else {
                    window.alert("您还有未填写的项，请填写完整，再提交申请")
                    return
                }

                applyEmploymentAPI.submitApplication({
                    meta: this.meta,
                    data: this.data,
                    employmentData: this.employmentData
                }).then(function(result) {
                    console.log("提交成功")
                    that.$route.router.go('/employManagement/employmentSubmission')
                }).catch(function(err) {
                    window.alert(err)
                })
            },
            wechatValidation(val) {
                var reg = /^\w+$/
                if (!reg.test(val)) {
                    console.log("输入错误")
                }
            }
        },
        ready() {
            this.initDate()
        }
    }
</script>