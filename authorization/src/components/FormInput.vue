<script setup>
const props = defineProps({
    placeholder:{
        type: String,
        required: true
    },
    type:{
        type:String,
        required:true,
        default:"text",
    }
})
</script>

<template>
    <div class="input-container">
        <input :type="type" :placeholder="placeholder" class="form-input">
    </div>
</template>

<style lang="scss" scoped>
.input-container{
    width: 100%;
}
.form-input{
    width: 100%;
    padding: 0.6em;
    border-radius: 0.4rem;
    background-color: #5f5f5f;
    border: 2px solid #5f5f5f;
    transition: 500ms;

    &:focus{
        border: 2px solid #16d384;
        caret-color: #16d384;
        color: #ffffff;
        font-size: 1.1vw;
    }

    &::placeholder{
        color: #fff;
    }

    &:hover{
        font-size: 1.1vw;
    }
}
</style>