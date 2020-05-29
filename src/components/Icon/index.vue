<template>
  <span v-if="icon !== ''">
    <i v-if="/^el-icon-/.test(icon)" :class="icon"/>
    <svg-icon v-if="!/^el-icon-/.test(icon)" :icon-class="icon"/>
  </span>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    icon: {
      type: String,
      default: ''
    }
  }
}
</script>
