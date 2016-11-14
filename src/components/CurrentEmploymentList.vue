<template>
  <div>
    <group>
      <selector title="" placeholder="&nbsp;&nbsp;&nbsp;&nbsp;--排序--" :options="selectList" @on-change="onChange"></selector>
    </group>
    <group>
         <a v-for="item in data" class="weui_cell a-li a-li-first"  v-link="{path: '/employManagement/currentInfo/'+ item.guid}" >
            <div class="weui_cell_bd weui_cell_primary">
                <span>招募等级：{{item.brand_role.name}}</span>
                <p></p>
                <span>发起时间：{{item.create_time}}</span>
                <p></p>
                <span>剩余时间：{{calculateRemainingTime(item)}}</span>
            </div>
         </a>
    </group>
    <alert :show.sync="showMsg" button-text="确认">{{errorMsg}}</alert>
</div>
</template>

<script>
    import {
        Group,
        Selector,
        Alert
    } from 'vux'
    import authAPI from '../api/auth'
    import employmentAPI from '../api/employment'

    export default {
        components: {
            Group,
            Selector,
            Alert
        },
        data() {
            return {
                data: [],
                selectList: [{
                    key: "timeDesc",
                    value: "时间由近到远"
                }, {
                    key: "timeAsc",
                    value: "时间由远到近"
                }, {
                    key: "levelAsc",
                    value: "等级由高到低"
                }, {
                    key: "levelDesc",
                    value: "等级由低到高"
                }],
                showMsg: false,
                errorMsg: null
            }
        },
        methods: {
            getData(val) {
                var that = this
                    //获取用户account
                authAPI.getUser().then(function(result) {
                    console.log("用户账号:" + result.name)
                        //改变列表内容
                    employmentAPI.getCurrentList({
                        key: val,
                        user_account: result.name
                    }).then(function(result) {
                        if (result == null) {
                            that.showMsg = true
                            that.errorMsg = "暂无当前招募"
                        } else {

                            var delectItemList = []
                            var showItemList = []
                            for (var item in result) {
                                // 筛选已经超过2小时的招募
                                if (new Date() >= new Date(new Date(result[item].create_time).getTime() + 2 * 3600 * 1000)) {
                                    delectItemList.push(result[item].guid)
                                } else {
                                    showItemList.push(result[item])
                                }
                            }
                            console.log(JSON.stringify(showItemList))
                            if (showItemList == null) {
                                that.showMsg = true
                                that.errorMsg = "暂无当前招募"
                            } else {
                                that.data = showItemList

                                // 关闭时间已经超过2小时的招募
                                console.log("清除时间已经超过2小时的招募")
                                console.log(JSON.stringify(delectItemList))
                                employmentAPI.closeOverduePublishEmployment({
                                    delectItemList: delectItemList
                                })
                            }
                        }
                    })
                })
            },
            onChange(val) {
                if (val == '') {
                    val = "timeDesc"
                }
                console.log(val)
                this.getData(val)
            },
            calculateRemainingTime(item) {
                var createTime = item.create_time
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
            }
        }
    }
</script>
<style>

</style>