<template>
<div>
  <div class="currnt-info">
    <span>招募等级：{{data.brand_role.name}}</span>

    <span>发起时间：{{data.create_time}}</span>

    <span>当前申请人数：{{applicantNum}}人</span>

    <span>剩余时间：{{calculateRemainingTime(data)}}</span>
    <x-button type="warn" @click="showCheck=true">关闭当前招募</x-button>
    <alert :show.sync="showMsg" button-text="确认">{{errorMsg}}</alert>
    <confirm :show.sync="showCheck" title="" confirm-text="确认" cancel-text="取消" @on-confirm="closeEmployment">
      <p style="text-align:center;">是否关闭当前招募？</p>
    </confirm>
  </div>
</div>
  <div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
import {
  XButton,
  Alert,
  Confirm
} from 'vux'
import authAPI from '../api/auth'
import employmentAPI from '../api/employment'

export default {
  components: {
    XButton,
    Alert,
    Confirm
  },
  data() {
    return {
      data: {
        employments: [],
        brand_role: {}
      },
      applicantNum: null,
      showMsg: false,
      errorMsg: null,
      showCheck: false
    }
  },
  methods: {
    init() {
      this.getData(this.$route.params.guid)
    },
    getData(guid) {
      var that = this
      employmentAPI.getCurrentInfo({
        guid: guid
      }).then(function(result) {
        console.log(JSON.stringify(result))
        that.data = result
        that.calculateRemainingTime(result)
        that.count(result)
      }).catch(function(err) {
        that.showMsg = true
        that.errorMsg = err
      })
    },
    calculateRemainingTime(item) {
      console.log("剩余时间")
      var createTime = item.create_time
      console.log(item.create_time)
      var startDate = new Date(createTime)
      var endDate = new Date(startDate.getTime() + 2 * 3600 * 1000)

      var remainingSec = endDate.getTime() - new Date().getTime()

      var hour = parseInt(remainingSec / 3600 / 1000)
      var min = parseInt((remainingSec - hour * 3600 * 1000) / (1000 * 60))
      var sec = parseInt((remainingSec - hour * 3600 * 1000 - min * 1000 * 60) / 1000)

      if (hour == 0) {
        return min + " 分钟 " + sec + " 秒"
      } else if (hour == 0 && min == 0) {
        return sec + " 秒"
      } else {
        return hour + " 小时 " + min + " 分钟 " + sec + " 秒"
      }
    },
    count(item) {
      this.applicantNum = (item.employments != null) ? item.employments.length : 0
    },
    closeEmployment() {
      console.log("关闭当前招募")
      var that = this
      employmentAPI.closeEmployment({
        guid: this.$route.params.guid
      }).then(function(result) {
        that.$route.router.go('/employManagement/currentList')
      }).catch(function(err) {
        that.showMsg = true
        that.errorMsg = err
      })
    }
  },
  ready() {
    this.init()
  }
}
</script>
<style>
.currnt-info {
  width: 89%;
  margin: 5% auto 0;
      min-height: 444px;
}

.currnt-info span {
  display: block;
  font-size: 4.5vw;
  /*14px*/
  color: #000;
  font-family: "微软雅黑";
}

.currnt-info .weui_btn {
  line-height: 2.2;
  border-radius: 3px;
  font-family: "微软雅黑";
  font-size: 5.2vw;
  /*17px*/
  margin-top: 8%;
  background: #fd5e5e;
}

.currnt-info .weui_btn:after {
  border: 0;
  border-radius: 0
}
</style>
