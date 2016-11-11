<template>
    <div>
        <span>招募等级：{{data.brand_role.name}}</span>
        <p></p>
        <span>发起时间：{{data.create_time}}</span>
        <p></p>
        <span>当前申请人数：{{applicantNum}}人</span>
        <p></p>
        <span>剩余时间：{{calculateRemainingTime(data)}}</span>
        <x-button type="warn" @click="closeEmployment" >关闭当前招募</x-button>
    </div>
</template>

<script>
    import {
        XButton
    } from 'vux'
    import authAPI from '../api/auth'
    import employmentAPI from '../api/employment'

    export default {
        components: {
            XButton
        },
        data() {
            return {
                data: {
                    employments: [],
                    brand_role: {}
                },
                applicantNum: null
            }
        },
        methods: {
            init() {
                this.getData(this.$route.params.guid)
            },
            getData(guid) {
                var that = this
                employmentAPI.getCurrentInfo({
                    guid: guid
                }).then(function(result) {
                    console.log(JSON.stringify(result))
                    that.data = result
                    that.calculateRemainingTime(result)
                    that.count(result)
                }).catch(function(err) {
                    window.alert(err)
                })
            },
            calculateRemainingTime(item) {
                console.log("剩余时间")
                var createTime = item.create_time
                console.log(item.create_time)
                var startDate = new Date(createTime)
                var endDate = new Date(startDate.getTime() + 2 * 3600 * 1000)

                var remainingSec = endDate.getTime() - new Date().getTime()

                var hour = parseInt(remainingSec / 3600 / 1000)
                var min = parseInt((remainingSec - hour * 3600 * 1000) / (1000 * 60))
                var sec = parseInt((remainingSec - hour * 3600 * 1000 - min * 1000 * 60) / 1000)

                if (hour == 0) {
                    return min + " 分钟 " + sec + " 秒"
                } else if (hour == 0 && min == 0) {
                    return sec + " 秒"
                } else {
                    return hour + " 小时 " + min + " 分钟 " + sec + " 秒"
                }
            },
            count(item) {
                this.applicantNum = (item.employments != null) ? item.employments.length : 0
            },
            closeEmployment() {
                console.log("关闭当前招募")
                var that = this
                employmentAPI.closeEmployment({
                    guid: this.$route.params.guid
                }).then(function(result) {
                    if (result == true) {
                        window.alert("成功关闭当前招募")
                        that.$route.router.go('/employManagement/currentList')
                    }
                }).catch(function(err) {
                    window.alert(err)
                })
            }
        },
        ready() {
            this.init()
        }
    }
</script>
<style>

</style>