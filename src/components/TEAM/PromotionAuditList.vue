<template>
<div>
  <div class="vux-demo-header-box wapmain-header" slot="header">
    <x-header :left-options="{showBack: false}">成员提拔审核</x-header>
    <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
  </div>
  <div class="audit-choose">
    <group>

      <selector placeholder="&nbsp;&nbsp;&nbsp;&nbsp;--排序--" :options="List" @on-change="onChange"></selector>

    </group>
  </div>
  <div class="audit-list" style="padding-top:46px">
    <group>
      <cell v-for="item in items">
        <div slot="icon">提拔人：{{item.user.agent.agent_detail.name}}</div>
        <!--{{$index}}-->
        <div slot="icon">提拔级别：{{item.brand_role.name}}</div>
        <div slot="icon">提拔时间：{{item.employer_time}}</div>
        <x-button mini v-link="{path: '/teamManagement/promotionAgentInfo/'+item.user.account}">审核</x-button>
      </cell>
    </group>
    <alert :show.sync="show" button-text="确认">无记录</alert>
  </div>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
import {
  Cell,
  Group,
  XButton,
  Selector,
  Alert,
  XHeader
} from 'vux'

import promoteAPI from '../../api/promote'

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
    Alert,
    XHeader
  },
  methods: {
    onClickBack(){
      this.$route.router.go("/employManagement")
    },
    getdata(e) {
      var that = this
      promoteAPI.getPromotelist({
        key: e
      }).then(function(result) {
        console.log(result)
        if (!result[0]) {
          that.show = true
        }
        that.items = result
      })
    },
    onChange(val) {
      this.getdata(val)
    }
  },
  ready() {
    this.getdata()
    document.body.style.background = '#f2f2f2'
  }
}
</script>
<style>
.audit-list {
    min-height: 485px;
}

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
.audit-list  .weui_dialog_ft {
  width: 89%;
  margin: 8% auto;
    background: #0bb20c;
  line-height: 35px;
  border-radius: 2px;
}

.audit-list  .weui_dialog_bd {
  color: #000000;
  font-size: 5.2vw;
  /*17px*/
  font-family: "微软雅黑";
  margin-top: 5%;
}

.audit-list .weui_btn_dialog.primary {
  font-size: 4.9vw;
  /*16px*/
  color: #fff;
}

.audit-list  .weui_dialog {
  width: 92%;
}
</style>
