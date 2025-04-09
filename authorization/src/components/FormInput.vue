<script setup>
const props = defineProps({
    placeholder:{
        type: String,
        required: true
    }
})
</script>

<template>
    <div class="input-container">
        <input type="email" :placeholder="placeholder" class="form-input">
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
        border: 2px solid #71d316;
        caret-color: #71d316;
        color: #b5ff6f;
        
    }

    &::placeholder{
        color: #fff;
    }
}
</style>