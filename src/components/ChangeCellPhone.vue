<template>
<div>
  <div class="changepcellphone-input">
    <group>
      <p class="checkPwd-title">输入新手机号</p>
      <x-input class="weui_cell_primary" title="+86" keyboard="number" :value.sync="cellphone" placeholder="输入新手机号" :show-clear="false" :required="false" v-ref:cellphone></x-input>
      <p v-if="showRemind" class="phone-error">{{errorMsg}}</p>
      <x-button type="primary" @click="confirm">确认修改</x-button>
      <alert :show.sync="showMsg" @on-hide="onHide()" button-text="确认">您已成功修改手机号</alert>
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
          changeUserInfoAPI.changeCellphone({
            cellphone: that.cellphone
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
.changepcellphone-input button.weui_btn.weui_btn_primary{
margin-top: 9%

}
.phone-error{
  width: 89%;
  color: rgb(210, 45, 35);
  font-family: 微软雅黑;
  font-size: 4.1vw;
  margin: auto;

}
.changepcellphone-input{
    min-height: 460px;

}
.changepcellphone-input .weui_label {
  font-size: 15px;
  color: #000;
  font-family: "微软雅黑";
}

.changepcellphone-input .weui_input {
  width: 92%;
      border: 0;
      outline: 0;
      -webkit-appearance: none;
      background-color: transparent;
      font-size: inherit;
      color: inherit;
      height: inherit;
      line-height: inherit;
      border: 1px solid #d3d1d1;
      font-family: "\5FAE\8F6F\96C5\9ED1";
      padding-left: 5%;
      color: #aeaeae;
      font-size: 4.5vw;
      padding: 8px 3%;
      border-radius: 3px;
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
.changepcellphone-input .weui_cell:before{
border-top:0

}
.changepcellphone-input .weui_cell{

  padding: 5px 15px;


}
</style>
