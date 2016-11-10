<template>
  <div>
    <group>
      <selector placeholder="--排序--" title="排序" :options="List" @on-change="onChange"></selector>
    </group>
    <group>
        <cell v-for="item in items">
            <div slot="icon">申请人：{{item.employment_details[1].value}}</div>
            <!--{{$index}}-->
            <div slot="icon">申请级别：{{item.brand_role.name}}</div>
            <div slot="icon">申请时间：{{item.employer_time}}</div>
            <x-button mini v-link="{path: '/employManagement/auditInfo/'+item.employee_user_account+'/'+item.guid+'/'+item.brand_guid+'/audit'}">审核</x-button>
        </cell>
    </group>
    <alert :show.sync="show">无记录</alert>
  </div>
</template>

<script>
    import {
        Cell,
        Group,
        XButton,
        Selector,
        Alert
    } from 'vux'
    import employAPI from '../api/employment'
    export default {
        data() {
            return {
                show: false,
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
                    }]
                    // value: "请选择省份"
            }
        },
        components: {
            Group,
            Cell,
            XButton,
            Selector,
            Alert
        },
        methods: {
            getdata(e) {
                var that = this
                employAPI.getAuditList({
                    key: e
                }).then(function(result) {
                    if (!result[0]) {
                        that.show = true
                    }
                    that.items = result
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