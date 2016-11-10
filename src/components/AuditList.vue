<template>
  <div>
 <div class="audit-choose">
    <group>

      <selector placeholder="--排序--" title="排序" :options="List" @on-change="onChange"></selector>

    </group>
</div>
<div class="audit-list">
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
  </div></div>
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
<style>
.audit-list {
   
}
.audit-list  .weui_btn{
    position: absolute;
    top: 27%;
    width: 25%;
    right: 6%;
background: #5091d5;
border-radius:0;
    color: #fff;
    font-family: "微软雅黑";
font-size: 14px
}
.audit-list .weui_cell{
    background: #fff;
    margin:3% 0;
    border-top: 1px solid #d3d1d1;
    border-bottom: 1px solid #d3d1d1;
 position: relative;
    padding: 4px 15px;
}
.audit-list .weui_cells {
    color: #000000;
    font-size: 14px;
    font-family: "微软雅黑";
}
.audit-list .weui_cell .weui_cell_hd{

    width: 83%;
line-height: 1.6em;
}

.audit-list  .weui_cell:before{
border-top:0
}
.audit-choose {
    position: absolute;
    top: 4%;
    z-index: 100000;
        right: 2%;
width: 31%;
border: 1px solid #d3d1d1;
}
.audit-choose  .weui_cell{
position: initial;
    
        width: 83%;
    background: #fff;
    padding: 1% 28% 1% 6%;

}
.audit-choose  .weui_cell_select .weui_select{
    padding-right: 0;
font-family: "微软雅黑";
    height: 22px;
    line-height: 22px;
font-size: 13px;
}

.audit-choose  .weui_cell_select .weui_cell_bd:after{
    right: 3%;
    top: 41%;
    height: 4px;
    width: 4px;

}

.audit-choose  .weui_cell_select .weui_select  option:nth-child(even) { background-color:#f5f5f5; }

</style>