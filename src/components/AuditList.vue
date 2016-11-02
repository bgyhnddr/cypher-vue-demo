<template>
  <div>
    <group>
      <selector :value.sync="value" title="排序" :options="List" @on-change="onChange"></selector>
    </group>
    <!--<button class="weui_btn weui_btn_mini weui_btn_default weui_btn_plain_default vux-center">返回</button>-->
    <!--<group>
      <cell v-for="item in items" title="Go to Radio" link="/component/radio" inline-desc='link='></cell>
    </group>-->
    <!--v-link="{path: '/test='+this.items[itemIndex].employment_guid}"-->
    <group>
        <cell v-for="item in items">
            <div slot="icon">申请人：{{item.employment_details[1].value}}</div>
            <!--{{$index}}-->
            <div slot="icon">申请级别：{{item.brand_role.name}}</div>
            <div slot="icon">申请时间：{{new Date(item.employer_time).Format('yyyy-MM-dd hh:mm:ss')}}</div>
            <x-button mini v-link="{path: '/employManagement/auditInfo?employmentID='+item.guid+'&brandID='+item.brand_guid}">审核</x-button>
        </cell>
    </group>
  </div>
</template>

<script>
    import {
        Cell,
        Group,
        XButton,
        Selector
    } from 'vux'
    import employAPI from '../api/employment'
    export default {
        data() {
            return {
                items: [],
                List: [{
                    key: "timedesc",
                    value: "时间由近到远"
                }, {
                    key: "timeasc",
                    value: "时间由远到近"
                }, {
                    key: "leveldesc",
                    value: "等级由高到低"
                }, {
                    key: "levelasc",
                    value: "等级由低到高"
                }],
                value: "timedesc"
            }
        },
        components: {
            Group,
            Cell,
            XButton,
            Selector
        },
        methods: {
            getdata(e) {
                var that = this
                employAPI.getAuditList({
                    key: e
                }).then(function(result) {
                    that.items = result
                    console.log()
                }).catch(function(err) {
                    console.log(err)
                    that.serveMsg = err
                })
            },
            onChange(val) {
                this.getdata(val)
            }
        },
        ready() {
            this.getdata()
        }
    }
</script>