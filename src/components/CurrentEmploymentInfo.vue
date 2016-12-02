<template>
<div>
  <div class="currnt-info" v-if="showCurrentInfoModel">
    <span>招募等级：{{data.brand_role.name}}</span>

    <span>发起时间：{{data.create_time}}</span>

    <span>当前申请人数：{{applicantNum}}人</span>

    <span>剩余时间：{{data.remainingTime}}</span>
    <x-button  type="warn" @click="showCheck=true">关闭当前招募</x-button>
    <div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
  </div>
  <alert :show.sync="showErrorNoHandled" button-text="确认">{{errorMsgNoHandled}}</alert>
  <alert :show.sync="showCatchError" button-text="确认" @on-hide="onHideError">{{catchErrorMsg}}</alert>
  <confirm :show.sync="showCheck" title="" confirm-text="确认" cancel-text="取消" @on-confirm="closeEmployment">
    <p style="text-align:center;">是否关闭当前招募？</p>
  </confirm>
</div>
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
        remainingTime: null
      },
      applicantNum: null,
      showErrorNoHandled: false,
      errorMsgNoHandled: null,
      showCatchError: false,
      catchErrorMsg: null,
      showCheck: false,
      showCurrentInfoModel: false
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
        that.data = result.publish_employment
        that.calculateRemainingTime(result.publish_employment,result.nowDateString)
        that.count(result.publish_employment)
        that.showCurrentInfoModel = true
      }).catch(function(err) {
        that.showCatchError = true
        that.catchErrorMsg = err
      })
    },
    calculateRemainingTime(item,nowDateString) {
      var createTime = item.create_time
      var startDate = new Date(createTime)
      var endDate = new Date(startDate.getTime() + 2 * 3600 * 1000)

      var remainingSec = endDate.getTime() - new Date(nowDateString).getTime()

      var hour = parseInt(remainingSec / 3600 / 1000)
      var min = parseInt((remainingSec - hour * 3600 * 1000) / (1000 * 60))
      var sec = parseInt((remainingSec - hour * 3600 * 1000 - min * 1000 * 60) / 1000)

      if (hour == 0) {
        this.data.remainingTime = min + " 分钟 " + sec + " 秒"
      } else if (hour == 0 && min == 0) {
        this.data.remainingTime = sec + " 秒"
      } else {
        this.data.remainingTime = hour + " 小时 " + min + " 分钟 " + sec + " 秒"
      }
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
