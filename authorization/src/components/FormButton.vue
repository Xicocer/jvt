<template>
    <div>
        <button class="btn second-bg-color body-color" type="button">{{ text }}</button>
    </div>
</template>

<script setup>

const props = defineProps({
    text:{
        type: String,
        required: true,
    }
})

</script>

<style lang="scss" scoped>
.btn{
    outline: none;
    border: none;
    margin: 1%;
    padding: 0.4em;
    border-radius: 0.2rem;
    width: 6vw;
    transition: 500ms;

    &:hover{
        font-size: 1.2vw;
        width: 8vw;
    }

    &:focus{
        font-size: 1.2vw;
        width: 8vw;
    }
}
</style>