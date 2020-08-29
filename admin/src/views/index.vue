<template>
    <van-checkbox-group v-model="result">
        <van-checkbox name="a">复选框 a</van-checkbox>
        <van-checkbox name="b">复选框 b</van-checkbox>
        <van-checkbox name="c">复选框 c</van-checkbox>
    </van-checkbox-group>
</template>

<script>
    export default {
        name: "index",
        data(){
            return{
                result: ['a', 'b']
            }
        },
        methods: {
            onChange(val) {
                console.log('onChange', val)
            }
        }
    }
</script>

<style scoped>

</style>