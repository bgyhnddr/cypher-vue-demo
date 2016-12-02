<template>
<div>
  <div class="current-bac">
    <group>
      <selector title="" placeholder="&nbsp;&nbsp;&nbsp;&nbsp;--排序--" :options="selectList" @on-change="onChange"></selector>
    </group>
  </div>
  <div class="current-list">
    <group>
      <a v-for="item in data" class="weui_cell a-li a-li-first current-list-list" v-link="{path: '/employManagement/currentInfo/'+ item.guid}">
        <div class="weui_cell_bd weui_cell_primary">
          <span>招募等级：{{item.brand_role.name}}</span>

          <span>发起时间：{{item.create_time}}</span>

          <span>剩余时间：{{item.left_time}}</span>
        </div>
      </a>
    </group>
    <alert :show.sync="showMsg" button-text="确认">{{errorMsg}}</alert>
  </div>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
import {
  Group,
  Selector,
  Alert
} from 'vux'
import employmentAPI from '../api/employment'

export default {
  components: {
    Group,
    Selector,
    Alert
  },
  data() {
    return {
      data: [],
      selectList: [{
        key: "timeDesc",
        value: "时间由近到远"
      }, {
        key: "timeAsc",
        value: "时间由远到近"
      }, {
        key: "levelAsc",
        value: "等级由高到低"
      }, {
        key: "levelDesc",
        value: "等级由低到高"
      }],
      showMsg: false,
      errorMsg: null,
      endDateTicket: 0,
      interval: undefined
    }
  },
  methods: {
    getData(val) {
      var that = this
        //改变列表内容
      employmentAPI.getCurrentList({
        key: val
      }).then(function(result) {
        if (result.currentList.length == 0) {
          that.showMsg = true
          that.errorMsg = "暂无记录"
        } else {
          that.nowDateTicket = result.nowDateTicket
          that.data = result.currentList.map(o => {
            o.left_time = that.convertTicket(o.end_time_tick - that.nowDateTicket)
            return o
          })
        }
      }).catch(function(err) {
        that.showMsg = true
        that.errorMsg = "搜索记录出错"
      })
    },
    onChange(val) {
      if (val == '') {
        val = "timeDesc"
      }
      this.getData(val)
    },
    convertTicket(tick) {
      var left = tick
      if (left >= 0) {
        var hour = Math.floor(left / (1000 * 60 * 60))
        left = left - hour * 1000 * 60 * 60
        var minute = Math.floor(left / (1000 * 60))
        left = left - minute * 1000 * 60
        var seconds = Math.floor(left / 1000)
        return hour + "时" + minute + "分" + seconds + "秒"
      } else {
        return "过期"
      }
    }
  },
  ready() {
    var mark = new Date().getTime()
    let that = this
    setInterval(function() {
      let now = new Date().getTime()
      for (var i = 0; i < that.data.length; i++) {
        var temp = that.data[i]
        temp.left_time = that.convertTicket((temp.end_time_tick - (that.nowDateTicket + now - mark)))
        that.data.$set(i, temp)
      }
    }, 1000)
  }
}
</script>
<style>
.current-list {
  min-height: 485px;
}

.current-list a.current-list-list {
  background: #fff;
  margin: 3% 0;
  border-top: 1px solid #d3d1d1;
  border-bottom: 1px solid #d3d1d1;
  position: relative;
  padding: 3px 15px 3px 15px;
  line-height: 1.2em;
}

.current-list .weui_cell:before {
  border-top: 0;
}

.current-list .weui_cell_bd.weui_cell_primary span {
  line-height: 1.7em;
  font-size: 4.5vw;
  /*14px*/
  font-family: "微软雅黑";
  display: block;
}

.current-list .weui_cell_bd.weui_cell_primary span:nth-chlid(1) {
  line-height: 1.3em;
}

.current-list .weui_cell_bd.weui_cell_primary:after {
  content: " ";
  display: inline-block;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  height: 8px;
  width: 8px;
  border-width: 1px 1px 0 0;
  border-color: #686f78;
  border-style: solid;
  position: relative;
  top: -2px;
  position: absolute;
  top: 50%;
  right: 15px;
  margin-top: -3px;
}

.current-bac .weui_cells.vux-no-group-title {
  position: absolute;
  z-index: 1000;
  top: 12px;
  right: 16px;
}

.current-bac .weui_cell.weui_cell_select {
  padding: 0;
}

.current-bac .weui_cell_select .weui_select {
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

.current-bac .weui_cell_select .weui_cell_bd:after {
  transform: rotate(135deg);
  top: 44%;
  right: 5px;
  z-index: 1;
  height: 4px;
  width: 4px;
}

.current-list .weui_dialog {
  width: 92%;
}

.current-list .weui_dialog_ft {
  width: 89%;
  margin: 8% auto;
  background: #0bb20c;
  line-height: 35px;
  border-radius: 2px;
}

.current-list .weui_btn_dialog.primary {
  color: #fff
}

.current-list .weui_dialog_bd {
  color: #000000;
  font-size: 5.2vw;
  font-family: "微软雅黑";
}
</style>
