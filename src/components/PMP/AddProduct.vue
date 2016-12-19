<template>
<div>
  <div>
    <div class="vux-demo-header-box wapmain-header" slot="header">
      <x-header :left-options="{showBack: false}">添加商品</x-header>
      <div slot="left" class="onclick-back" @click="onClickBack">返回</div>
    </div>
    <group>
      <div>
        <x-input placeholder="请输入商品名称" :required="false"></x-input>
      </div>
      <a class="weui_cell" v-link="{path: ''}">
        <div class="weui_cell_bd weui_cell_primary">
          <p>品类</p>
          <p>未添加</p>
        </div>
        <div class="weui_cell_ft" :class="{'with_arrow': true}"></div>
      </a>
      <a class="weui_cell" v-link="{path: ''}">
        <div class="weui_cell_bd weui_cell_primary">
          <p>商品价格</p>
          <p>设置等级价格目录表</p>
        </div>
        <div class="weui_cell_ft" :class="{'with_arrow': true}"></div>
      </a>
      <div>
        <x-button disabled>添加商品规格介绍</x-button>
      </div>
    </group>
    <div>
      <x-button disabled>加入商品</x-button>
    </div>
  </div>
</div>
</template>

<script>
import {
  Group,
  Alert,
  XHeader,
  XInput,
  XButton
} from 'vux'

export default {
  components: {
    Group,
    Alert,
    XHeader,
    XInput,
    XButton
  },
  data() {
    return {}
  },
  methods: {
    onClickBack() {
      this.$route.router.go('/productManagement/productSetting')
    }
  },
  ready() {

  }
}
</script>
<style>

</style>
