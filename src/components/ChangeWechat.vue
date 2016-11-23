<template>
  <div class="changewechat-bac">
<div>
  <div class="changewechat-input">
    <group title="新的微信号">
      <x-input class="weui_cell_primary" :value.sync="wechat" placeholder="输入新的微信号" type="text" :show-clear="false" :required="false" v-ref:wechat></x-input>
      <p v-if="showRemind" class="wechat-error">{{errorMsg}}</p>
      <x-button type="primary" @click="confirm">确认修改</x-button>
      <alert :show.sync="showMsg" @on-hide="onHide()" button-text="确认">您已成功修改微信号</alert>
    </group>
  </div>
</div></div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
import {
  Group,
  XInput,
  XButton,
  Alert
} from 'vux'
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
          changeUserInfoAPI.changeWechat({
            wechat: that.wechat
          }).then(function(result) {
            if (result == true) {
              that.showMsg = true
            }
          }).catch(function(err) {
            that.showRemind = true
            that.errorMsg = err
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
.changewechat-bac{
    min-height: 421px;
}
.changewechat-input button.weui_btn.weui_btn_primary{
margin-top: 9%

}

.changewechat-input  .wechat-error{

  width: 89%;
      margin: auto ;
      color: #d22d23;
      font-family: "微软雅黑";
      font-size: 4.1vw;
}
.changewechat-input .weui_cell {
  border: 1px solid #d3d1d1;
  width: 83%;
  margin: 0 auto;
  padding:7px 3%;
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
      margin: 20% auto 2%;
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
/*.changewechat-input .weui_cell_primary{

  font-size: initial;
line-height: initial;
}*/
</style>
