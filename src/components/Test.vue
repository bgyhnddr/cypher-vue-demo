<template>
    <button @click="random">change</button>
    <div v-if="test">1</div>
    <div v-if="!test">2</div>

</template>
<script>
    export default {
        data() {
            return {
                test: false
            }
        },
        methods: {
            random() {
                this.test = parseInt(Math.random() * 2) == 0
                window.alert(this.test)
            }
        }
    }
</script>