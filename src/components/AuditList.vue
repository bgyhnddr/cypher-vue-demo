<template>
<div>
  <div class="audit-choose">
    <group>

      <selector placeholder="&nbsp;&nbsp;&nbsp;&nbsp;--排序--" :options="List" @on-change="onChange"></selector>

    </group>
  </div>
  <div class="audit-list">
    <group>
      <cell v-for="item in items">
        <div slot="icon">申请人：{{item.detail.name}}</div>
        <!--{{$index}}-->
        <div slot="icon">申请级别：{{item.brand_role.name}}</div>
        <div slot="icon">申请时间：{{item.employer_time}}</div>
        <x-button mini v-link="{path: '/employManagement/auditInfo/'+item.employee_user_account+'/'+item.guid+'/'+item.brand_guid+'/audit'}">审核</x-button>
      </cell>
    </group>
    <alert :show.sync="show">无记录</alert>
  </div>
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

        result.forEach((o) => {
          var list = o.employment_details
          var obj = {}
          o.employment_details.forEach((d) => {
            console.log(d)
            obj[d.key] = d.value
          })
          o.detail = obj
        })

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
.audit-list {}

.audit-list .weui_btn {
  position: absolute;
  top: 27%;
  width: 25%;
  right: 6%;
  background: #5091d5;
  border-radius: 0;
  color: #fff;
  font-family: "微软雅黑";
  font-size: 4.5vw;
  /*14px*/
  border-radius: 2px;
}

.audit-list .weui_btn:after {
  border-radius: 0px;
}

.audit-list .weui_cell {
  background: #fff;
  margin: 3% 0;
  border-top: 1px solid #d3d1d1;
  border-bottom: 1px solid #d3d1d1;
  position: relative;
  padding: 4px 15px;
}

.audit-list .weui_cells {
  color: #000000;
  font-size: 4.5vw;
  /*14px*/
  font-family: "微软雅黑";
}

.audit-list .weui_cell .weui_cell_hd {
  width: 83%;
  line-height: 1.6em;
}

.audit-list .weui_cell:before {
  border-top: 0
}

.audit-choose .weui_cells.vux-no-group-title {
  position: absolute;
  z-index: 1000;
  top: 12px;
  right: 16px;
}

.audit-choose .weui_cell.weui_cell_select {
  padding: 0;
}

.audit-choose .weui_cell_select .weui_select {
  height: 23px;
  line-height: 22px;
  font-size: 4.1vw;
  /*13px*/
  font-family: "微软雅黑";
  padding-right: 14px;
  background: #fff;
  border: 1px solid #d3d1d1;
  padding-left: 1px;
}

.audit-choose .weui_cell_select .weui_cell_bd:after {
  transform: rotate(135deg);
  top: 44%;
  right: 5px;
  z-index: 1;
  height: 4px;
  width: 4px;
}

.audit-choose .weui_cell_select .weui_select option:nth-child(even) {
  background-color: #f5f5f5;
}
</style>
