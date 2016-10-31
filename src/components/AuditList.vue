<template>
  <div>
    <!--<button class="weui_btn weui_btn_mini weui_btn_default weui_btn_plain_default vux-center">返回</button>-->
    <!--<group>
      <cell v-for="item in items" title="Go to Radio" link="/component/radio" inline-desc='link='></cell>
    </group>-->
    <!--v-link="{path: '/test='+this.items[itemIndex].employment_guid}"-->
    <a v-for="item in items" >
        <div>{{item.employment.name}}</div>
        <div>{{item.employment.name}}</div>
        {{$index}}
        <div>授权编号：{{item.employment_guid}}</div>
        <div>申请状态：{{item.employment.status}}</div>
    </a>
  </div>
</template>

<script>
    import {
        Cell,
        Group
    } from 'vux'
    import employAPI from '../api/employment'
    export default {
        data() {
            return {
                items: []
            }
        },
        components: {
            Group,
            Cell
        },
        methods: {
            getdata() {
                var that = this
                employAPI.getAuditList().then(function(result) {
                        that.items = result
                            // console.log(666)
                    }).catch(function(err) {
                        console.log(err)
                        that.serveMsg = err
                    })
                    //   that.items = [
                    //       { message: 'Foo' },
                    //       { message: 'Bar' }
                    //   ]
            }
        },
        ready() {
            this.getdata();
        }
    }
</script>