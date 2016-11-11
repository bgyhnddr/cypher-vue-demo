<template>
    <div>
        当前招募详情
    </div>
</template>

<script>
    import {
        Group,
        Selector
    } from 'vux'
    import authAPI from '../api/auth'
    import employmentAPI from '../api/employment'

    export default {
        data() {
            return {

            }
        },
        components: {
            Group,
            Selector
        },
        methods: {
            getData(val) {},
        },
        ready() {
            this.getData("timeDesc")
        }
    }
</script>
<style>

</style>