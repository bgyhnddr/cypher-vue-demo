<template>
    <div>
        <p>代理申请表</p>
        <div v-if="!showNextFillModel">
                <p>上级代理:{{employmentData.company_name}}上级授权号{{employmentData.guid}}</p>
                <p>您当前代理级别为:{{employer.employee_role}}</p>
                <img class="vux-x-img ximg-demo" alt="上传头像" />
                <group>
                    <x-input class="weui_cell_primary" :value.sync="data.name" type="text" placeholder="申请人姓名" title="申请人" ></x-input>
                </group>
                <p>*姓名一经审批将不得修改，请慎重填写</p>
                <group>
                    <x-input class="weui_cell_primary" :value.sync="data.wechat" type="text" placeholder="6-20个字母，数字，下划线或减号" title="微信号"></x-input>
                </group>
                <group>
                    <x-input class="weui_cell_primary" :value.sync="data.account" type="number" placeholder="请输入手机号码" title="手机号"></x-input>
                </group>
                <button class="weui_btn weui_btn_primary" :class="classes" @click="goFillEmployment2">下一步</button>
        </div>
        <div v-else>
            <group>
                <selector placeholder="-证件类型-" :options="personalIdentityTypeList" :value.sync="data.typeOfPersonalIdentity"></selector>
                <x-input class="weui_cell_primary"  type="text" placeholder="输入证件号" :value.sync="data.valueOfPersonalIdentity"></x-input>
            </group>
            <group title="通讯地址">
                <address title=""  raw-value :list="addressData" :value.sync="data.provinceAndRegion"></address>
            </group>
            <group>
                <x-textarea name="addressDetail" :max="50" placeholder="请填写详细地址" :value.sync="data.addressDetail"></x-textarea>
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

    export default {
        components: {
            Group,
            XInput,
            XNumber,
            Selector,
            Address,
            XTextarea
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
                    headimg: "",
                    name: "",
                    wechat: "",
                    account: "",
                    typeOfPersonalIdentity: "",
                    valueOfPersonalIdentity: "",
                    provinceAndRegion: [],
                    addressDetail: ""
                },
                employer: {
                    user_account: "",
                    employee_role: ""
                },
                employmentData: {},
                showNextFillModel: false,
                personalIdentityTypeList: ['身份证', '回乡证', '护照'],
                addressData: AddressChinaData,
                date: {
                    start: "",
                    deadline: ""
                }
            }
        },
        methods: {
            initDate() {
                this.employer.user_account = this.$route.params.account
                this.employer.employee_role = this.$route.params.employableRole

                var startTime = this.$route.params.startTime
                this.date.start = new Date(parseInt(startTime)).Format('yyyy-MM-dd')
                var startDate = new Date(this.date.start)
                this.date.deadline = new Date(startDate.getTime() + 30 * 24 * 3600 * 1000).Format('yyyy-MM-dd')

                this.getEmploymentInfo()
            },
            getEmploymentInfo() {
                var that = this
                console.log("正在获取品牌资料:" + this.employer.user_account)
                applyEmploymentAPI.getBrandInfo({
                    user_account: this.employer.user_account
                }).then(function(result) {
                    // console.log(JSON.stringify(result))
                    that.employmentData = result
                }).catch(function(err) {
                    window.alert(err)
                })
            },
            goFillEmployment2() {
                console.log("打开第二部分表格")
                this.showNextFillModel = true
            },
            goFillEmployment1() {
                console.log("打开第一部分表格")
                this.showNextFillModel = false
            },
            submit() {
                // console.log(JSON.stringify(this.meta))
                // console.log(JSON.stringify(this.data))
                // console.log(JSON.stringify(this.date))
                // console.log(JSON.stringify(this.employer))
                // console.log(JSON.stringify(this.employmentData))

                applyEmploymentAPI.submitApplication({
                    meta: this.meta,
                    data: this.data,
                    date: this.date,
                    employer: this.employer,
                    employmentData: this.employmentData
                }).then(function(result) {
                    console.log(JSON.stringify(result))
                        // that.employmentData = result
                }).catch(function(err) {
                    window.alert(err)
                })


            }
        },
        ready() {
            this.initDate()
        }
    }
</script>