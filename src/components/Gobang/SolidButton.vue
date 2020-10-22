<template>
  <div :class="['solid-button', disabled ? 'disabled' : '']" @click="handelClick">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "solid-button",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods:{
      handelClick(){
          this.$emit('click')
      }
  }
}
</script>

<style lang="scss" scoped>
.solid-button {
  padding: 10px 20px;
  box-shadow: -8px -8px 16px -10px rgba(255, 255, 255, 1),
    8px 8px 16px -10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  border-radius: 10px;
  &:not(.disabled):active {
    box-shadow: -8px -8px 16px -10px rgba(255, 255, 255, 1) inset,
      8px 8px 16px -10px rgba(0, 0, 0, 0.15) inset;
  }
}
</style>
