<template>
<div>
  <div class="checkpasswork-input">
    <group>
      <x-input class="weui_cell_primary" :value.sync="pwd" placeholder="输入登录密码" type="password" :show-clear=false :equal-with="password"></x-input>
      <x-button type="primary" @click="cheakPwd">下一步</x-button>
      <alert :show.sync="showMsg" button-text="确认">{{errorMsg}}</alert>
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
      pwd: "",
      showMsg: false,
      errorMsg: null
    }
  },
  components: {
    Group,
    XInput,
    XButton,
    Alert
  },
  methods: {
    cheakPwd() {
      var that = this
      console.log("检测 密码")
      console.log(that.pwd)

      authAPI.getUser().then(function(result) {

        changeUserInfoAPI.checkPwd({
          user_account: result.name,
          pwd: that.pwd
        }).then(function(result) {
          if (result == true) {
            console.log(result)
            if (that.$route.params.from == 'wechat') {
              that.$route.router.go('/accountManagement/changeWechat')
            } else if (that.$route.params.from == 'phone') {
              that.$route.router.go('/accountManagement/changeCellPhone')
            }
          }
        }).catch(function(err) {
          that.showMsg = true
          that.errorMsg = err
        })

      })
    }
  }
}
</script>
<style>
.checkpasswork-input .weui_cell {
  border: 1px solid #d3d1d1;
  width: 83%;
  margin: 20% auto 13% auto;
  padding: 9px 3%;
  border-radius: 3px;
}

.checkpasswork-input .weui_cell_hd {
  width: 0
}

.checkpasswork-input .weui_input {
  font-family: "微软雅黑";
  font-size: 4.5vw;
  /*14px*/
  color: #aeaeae;
}

.checkpasswork-input .weui_dialog_ft {
  width: 89%;
  margin: 8% auto;
  background: #fd5e5e;
  line-height: 35px;
  border-radius: 2px;
}

.checkpasswork-input .weui_dialog_bd {
  color: #000000;
  font-size: 5.2vw;
  /*17px*/
  font-family: "微软雅黑";
  margin-top: 5%;
}

.checkpasswork-input .weui_btn_dialog.primary {
  font-size: 4.9vw;
  /*16px*/
  color: #fff;
}

.checkpasswork-input .weui_dialog {
  width: 92%;
}
</style>
