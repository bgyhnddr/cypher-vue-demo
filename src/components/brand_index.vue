<template>
    <div>
		<group>
			<cell title="新代理加盟" value=">" inline-desc="查看或生成申请下级代理的分享链接"
                 @click="showModel">
               <span class="demo-icon" slot="icon" style="color:#F70968">&#xe633;</span>
			</cell>
		</group>
	</div>
</template>

<script>
    import {
        Cell,
        Group
    } from 'vux'
    export default {
        components: {
            Cell,
            Group
        },
        data() {
            return {}
        },
        methods:{
            showModel() {
                console.log("打开选择代理弹出层")
            }
        }
    }
</script>