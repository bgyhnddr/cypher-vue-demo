<template>
    <p>查找</p>
   
</template>

<script>
    import {
        Group,
        XInput
    } from 'vux'
    import authAPI from '../api/auth'
    import employmentAPI from '../api/employment'


    export default {
        components: {
            Group,
            XInput
        },
        data() {
            return {
                keyword: null,
            }
        },
        methods: {},
        ready() {}
    }
</script>
<style lang="less">

</style>