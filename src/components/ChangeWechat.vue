<template>
<div>
  <div class="changewechat-input">
    <group title="新的微信号">
      <x-input class="weui_cell_primary" :value.sync="wechat" placeholder="输入新的微信号" type="text" :show-clear="false" :required="false" v-ref:wechat></x-input>
      <p v-if="showRemind">{{errorMsg}}</p>
      <x-button type="primary" @click="confirm">确认修改</x-button>
      <alert :show.sync="showMsg" @on-hide="onHide()" button-text="确认">您已经成功修改微信号</alert>
    </group>
  </div>
</div>
</template>

<script>
import {
  Group,
  XInput,
  XButton,
  Alert
} from 'vux'
import authAPI from '../api/auth'
import changeUserInfoAPI from '../api/changeUserInfo'

export default {
  data() {
    return {
      wechat: "",
      showMsg: false,
      showRemind: false,
      errorMsg: null
    }
  },
  components: {
    Group,
    XInput,
    XButton,
    Alert
  },
  watch: {
    wechat() {
      this.showRemind = false
    }
  },
  methods: {
    confirm() {
      var that = this
      var reg = /^[a-zA-Z]+[a-zA-Z0-9_]*$/ //微信号

      //检测微信账号输入是否正确
      if (!this.$refs.wechat.valid || !reg.test(this.wechat) || this.wechat.length < 6 || this.wechat.length > 20) {
        that.showRemind = true
        that.errorMsg = "微信号必须以字母开头，由6-20个字母，数字，下划线或减号组成的字符串"
      } else {
        authAPI.getUser().then(function(result) {

          changeUserInfoAPI.changeWechat({
            user_account: result.name,
            wechat: that.wechat
          }).then(function(result) {
            if (result == true) {
              that.showMsg = true
            }
          }).catch(function(err) {
            that.showMsg = true
            that.errorMsg = err
          })

        })
      }
    },
    onHide() {
      this.showMsg = false
      this.$route.router.go('/accountManagement')
    }
  }
}
</script>
<style>
.changewechat-input .weui_cell {
  border: 1px solid #d3d1d1;
  width: 83%;
  margin: 0 auto 13% auto;
  padding: 9px 3%;
  border-radius: 3px;
}

.changewechat-input .weui_cell_hd {
  width: 0
}

.changewechat-input .weui_input {
  font-family: "微软雅黑";
  font-size: 4.5vw;
  /*14px*/
  color: #aeaeae;
}

.changewechat-input .weui_cells_title {
  margin-top: 13%;
  color: #000;
  font-size: 4.7vw;
  /*15px*/
}

.changewechat-input .weui_dialog_ft {
  width: 89%;
  margin: 8% auto;
  background: #fd5e5e;
  line-height: 35px;
  border-radius: 2px;
}

.changewechat-input .weui_dialog_bd {
  color: #000000;
  font-size: 5.2vw;
  /*17px*/
  font-family: "微软雅黑";
  margin-top: 5%;
}

.changewechat-input .weui_btn_dialog.primary {
  font-size: 4.9vw;
  /*16px*/
  color: #fff;
}

.changewechat-input .weui_dialog {
  width: 92%;
}
</style>
