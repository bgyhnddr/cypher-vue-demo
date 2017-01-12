<template>
<div class="all-footer">
  © 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
import teamAPI from '../../api/team'

export default {

  methods: {

  },
  ready() {
    console.log("开始")
    teamAPI.getFrozenLevels().then(function(result) {
      console.log(JSON.stringify(result))

    }).catch(function(err) {
      console.log(err)
    })
  }
}
</script>
