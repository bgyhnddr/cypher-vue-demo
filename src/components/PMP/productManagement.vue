<template>
<div id="productManagement">
  <div>
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="{showBack: false}">我的货品</x-header>
      <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
    </div>
    <div style="padding-top:46px">
      <group>
        <!--货品管理-->
        <a class="weui_cell a-li a-li-first" v-link="{path: '/productManagement/productSetting'}">
          <div class="weui_cell_hd">
            <img src="/static/TestIMG/goods_management.png">
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
        <a class="weui_cell a-li-last" v-link="{path: 'productManagement/linkProductToQRCode'}">
          <div class="weui_cell_hd">
            <img src="/static/TestIMG/goods_associated.png">
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
    document.body.style.background = '#f2f2f2'
  }
}
</script>
<style>
#productManagement {
  min-height: 528px;
  font-family: "微软雅黑";
  background-color: #f2f2f2;
}


/*顶栏*/

#productManagement a.vux-header-back.headerTransition-transition {
  display: block;
  font-size: 4.5vw;
  /*14px*/
  color: #fff;
  font-family: "微软雅黑";
}


/*背景*/

#productManagement .weui_cells {
  background: none;
  border: 0;
}

#productManagement .weui_cell:before {
  border: 0;
}


/*发起招募*/

#productManagement a.weui_cell.a-li.a-li-first {
  margin-top: 11px;
}

#productManagement .a-li {
  padding: 2px 15px;
  background: #fff;
  margin-bottom: 3px;
}

#productManagement .a-li-last {
  padding: 1px 15px;
  background: #fff;
}

#productManagement .a-li img,
#productManagement .a-li-last img {
  width: 70%;
  margin: 6% 0 0;
  height: auto;
}

#productManagement .weui_cell_bd.weui_cell_primary p:first-child {
  font-size: 4.7vw;
  /*15px*/
  font-family: "微软雅黑";
}

#productManagement .weui_cell_bd.weui_cell_primary p:nth-child(2) {
  font-size: 3.9vw;
  /*12px*/
  color: #999999;
  font-family: "微软雅黑";
  margin-top: -1%;
}

#productManagement .weui_cell_hd {
  width: 16%;
}


/*图标大小*/

#productManagement .vux-header .vux-header-left .vux-header-back:before {
  border: 1px solid #fff;
  border-width: 2px 0 0 2px;
}

#productManagement .weui_cell_ft.with_arrow:after {
  border-width: 2px 2px 0 0;
  border-color: #9a9fa4;
  top: -2px;
  right: 2px;
  height: 8px;
  width: 8px;
}

#productManagement .a-li label {
  font-size: 4.9vw;
  /*16px*/
  color: #000;
}
</style>
</style>
