<template>
<div>
  <div>
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="{showBack: false}">我的货品</x-header>
      <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
    </div>
    <group>
      <!--货品管理-->
      <a class="weui_cell" v-link="{path: '/productManagement/productSetting'}">
        <div class="weui_cell_hd">
          <img>
        </div>
        <div class="weui_cell_bd weui_cell_primary">
          <p>货品管理</p>
          <p>添加 设置货品信息</p>
        </div>
        <div class="weui_cell_ft" :class="{'with_arrow': true}">
          <slot name="value"></slot>
          <slot></slot>
        </div>
      </a>
      <!--入库管理-->
      <a class="weui_cell" v-link="{path: 'productManagement/linkProductToQRCode'}">
        <div class="weui_cell_hd">
          <img>
        </div>
        <div class="weui_cell_bd weui_cell_primary">
          <p>货品关联</p>
          <p>关联货品信息</p>
        </div>
        <div class="weui_cell_ft" :class="{'with_arrow': true}">
          <slot name="value"></slot>
          <slot></slot>
        </div>
      </a>
    </group>
  </div>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
import {
  Group,
  Alert,
  XHeader
} from 'vux'
import authAPI from '../../api/auth'

export default {
  components: {
    Group,
    Alert,
    XHeader
  },
  data() {
    return {
      user: {
        user_info: {}
      }
    }
  },
  methods: {
    onClickBack() {
      this.$route.router.go('/homePage')
    },
    getPersonalInfo() {
      var that = this
      authAPI.getUser().then(function(result) {
        that.user.user_info = result
      })
    }
  },
  ready() {
    this.getPersonalInfo()
  }
}
</script>
