<script setup>
const props = defineProps({
  modelValue: {
    type: [String, File, null],
    default: '',
  },
  placeholder: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event) => {
  if (props.type === 'file') {
    emit('update:modelValue', event.target.files[0])
  } else {
    emit('update:modelValue', event.target.value)
  }
}
</script>

<template>
  <div class="input-container">
    <input
      :type="type"
      :placeholder="placeholder"
      class="form-input"
      @input="handleInput"
      @change="handleInput"
    />
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
    color:#fff;

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