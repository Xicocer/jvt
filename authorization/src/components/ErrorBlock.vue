<script setup>
const props = defineProps({
    error:{
        type:String,
        requared: true,
    }
})
</script>

<template>
    <div>
        <div class="error" >{{ error }}</div>
    </div>
</template>

<style lang="scss" scoped>
.error{
    background-color: rgba(255, 128, 8, 0.501);
    border-left: 4px solid #ff7f08;
    padding: 1em;
    border-top-left-radius: 0.4rem;
    border-bottom-left-radius: 0.4rem;
}
</style>