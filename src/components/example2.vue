<template>
	<div>
		<group>
			<cell title="example2" link="/example2">
			</cell>
			<cell title="example1" value="Protected" link="/index">
			</cell>
			<cell title="Notifications" value="Enabled"></cell>
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
        }
    }
</script>