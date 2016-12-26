<template>
<div>
  <div>
    <x-header :left-options="{showBack: true,backText:'返回'}" @click="onClickBack"></x-header>
    <group>

    </group>
  </div>
</div>
</template>

<script>
import {
  Group,
  Alert,
  XHeader
} from 'vux'


export default {
  components: {
    Group,
    Alert,
    XHeader
  },
  data() {
    return {
    }
  },
  methods: {
    onClickBack() {
      this.$route.router.go('/productManagement/linkProductToQRCode')
    }
  },
  ready() {

  }
}
</script>
