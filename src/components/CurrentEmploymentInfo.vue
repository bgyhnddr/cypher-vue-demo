<template>
<div>
  <div class="currnt-info" v-if="showCurrentInfoModel">
    <span>招募等级：{{data.brand_role.name}}</span>

    <span>发起时间：{{data.create_time}}</span>

    <span>当前申请人数：{{applicantNum}}人</span>

    <span>剩余时间：{{data.left_time}}</span>
    <x-button type="warn" @click="showCheck=true">关闭当前招募</x-button>

  </div>
  <alert :show.sync="showErrorNoHandled" button-text="确认">{{errorMsgNoHandled}}</alert>
  <alert :show.sync="showCatchError" button-text="确认" @on-hide="onHideError">{{catchErrorMsg}}</alert>
  <confirm :show.sync="showCheck" title="" confirm-text="确认" cancel-text="取消" @on-confirm="closeEmployment">
    <p style="text-align:center;">是否关闭当前招募？</p>
  </confirm>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
import {
  XButton,
  Alert,
  Confirm
} from 'vux'
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
        brand_role: {},
        remainingTime: null,
        left_time: ""
      },
      applicantNum: null,
      showErrorNoHandled: false,
      errorMsgNoHandled: null,
      showCatchError: false,
      catchErrorMsg: null,
      showCheck: false,
      showCurrentInfoModel: false,
      mark: undefined,
      nowDateTicket: undefined
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
        that.count(result.publish_employment)
        that.showCurrentInfoModel = true
        that.nowDateTicket = result.nowDateTicket
        that.mark = new Date().getTime()
        result.publish_employment.left_time = that.convertTicket(result.publish_employment.end_time_tick - that.nowDateTicket)
        that.data = result.publish_employment
      }).catch(function(err) {
        that.showCatchError = true
        that.catchErrorMsg = err
      })
    },
    count(item) {
      this.applicantNum = (item.employments != null) ? item.employments.length : 0
    },
    closeEmployment() {
      var that = this
      employmentAPI.closeEmployment({
        guid: this.$route.params.guid
      }).then(function(result) {
        that.$route.router.go('/employManagement/currentList')
      }).catch(function(err) {
        that.showErrorNoHandled = true
        that.errorMsgNoHandled = err
      })
    },
    onHideError() {
      this.$route.router.go('/employManagement/currentList')
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
    this.init()
    let that = this
    setInterval(function() {
      let now = new Date().getTime()
      that.data.left_time = that.convertTicket((that.data.end_time_tick - (that.nowDateTicket + now - that.mark)))
    }, 1000)
  }
}
</script>
<style>
.currnt-info {
  width: 89%;
  margin: 5% auto 0;
  min-height: 469px;
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
