<template>
<div>
  <div class="checkpasswork-input">
    <group>
      <p class="checkPwd-title">输入登录密码</p>
      <x-input class="weui_cell_primary" :value.sync="pwd" placeholder="请输入登录密码" type="password" :show-clear=false :equal-with="password" :required="false"></x-input>
      <p v-if="showMsg" class="pwd-error ">{{errorMsg}}</p>
      <x-button type="primary" @click="cheakPwd">下一步</x-button>
    </group>
  </div>
</div>
<div class="login-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
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
  watch: {
    pwd() {
      this.showMsg = false
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
      changeUserInfoAPI.checkPwd({
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
    }
  }
}
</script>
<style>
.checkpasswork-input button.weui_btn.weui_btn_primary {
  margin-top: 9%
}

.checkpasswork-input {
  min-height: 460px;
}

.checkPwd-title {
  margin: 20% auto 2%;
  width: 90%;
  color: #000000;
  font-size: 4.7vw;
  font-family: "微软雅黑";
}

.checkpasswork-input .pwd-error {
  width: 89%;
  margin: auto;
  color: #d22d23;
  font-family: "微软雅黑";
  font-size: 4.1vw;
}

.checkpasswork-input .weui_cell {
  border: 1px solid #d3d1d1;
  width: 83%;
  margin: 0 auto 0 auto;
  padding: 7px 3%;
  border-radius: 3px;
}

.checkpasswork-input .weui_cell_hd {
  width: 0
}

.checkpasswork-input .weui_cell:before {
  border-top: 0
}

.checkpasswork-input .weui_input {
  font-family: "微软雅黑";
  font-size: 4.5vw;
  /*14px*/
  color: #aeaeae;
  line-height: inherit;
  height: auto;
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
.checkpasswork-input .vux-flex-row{
  margin-top: 5px!important;
}

</style>
