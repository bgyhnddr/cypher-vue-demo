<template>
<div>
  <div class="changepcellphone-input">
    <group title="新手机号">
      <x-input class="weui_cell_primary" title="+86" keyboard="number" :value.sync="cellphone" placeholder="输入新手机号" :show-clear="false" :required="false" v-ref:cellphone></x-input>
      <p v-if="showRemind">{{errorMsg}}</p>
      <x-button type="primary" @click="confirm">确认修改</x-button>
      <alert :show.sync="showMsg" @on-hide="onHide()" button-text="确认">您已成功修改手机号<button @click="onHide()">X</button></alert>
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
      cellphone: "",
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
    cellphone() {
      this.showRemind = false
    }
  },
  methods: {
    confirm() {
      var that = this
      var reg = /^[1][358][0-9]{9}$/  //手机号

      //检测手机号输入是否正确
      if (!reg.test(this.cellphone)) {
        that.showRemind = true
        that.errorMsg = "手机号填写错误，请重新输入"
      } else {
        authAPI.getUser().then(function(userinfo) {

          changeUserInfoAPI.changeCellphone({
            user_account: userinfo.name,
            cellphone: that.cellphone
          }).then(function(result) {
            if (result == true) {
              that.showMsg = true
            }
          }).catch(function(err) {
            that.showRemind = true
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
.changepcellphone-input .weui_label {
  font-size: 15px;
  color: #000;
  font-family: "微软雅黑";
}

.changepcellphone-input .weui_input {
  width: 93%;
  border: 0;
  outline: 0;
  -webkit-appearance: none;
  background-color: transparent;
  font-size: inherit;
  color: inherit;
  height: 2.5em;
  line-height: 2em;
  border: 1px solid #d3d1d1;
  font-family: "微软雅黑";
  padding-left: 5%;
  color: #aeaeae;
  font-size: 4.5vw;
  /*14px*/
}

.changepcellphone-input .weui_dialog_ft {
  width: 89%;
  margin: 8% auto;
  background: #fd5e5e;
  line-height: 35px;
  border-radius: 2px;
}

.changepcellphone-input .weui_dialog_bd {
  color: #000000;
  font-size: 5.2vw;
  /*17px*/
  font-family: "微软雅黑";
  margin-top: 5%;
}

.changepcellphone-input .weui_btn_dialog.primary {
  font-size: 4.9vw;
  /*16px*/
  color: #fff;
}

.changepcellphone-input .weui_dialog {
  width: 92%;
}
</style>
