<template>
  <div>
    <a v-if="imageUrl" :href="imageUrl | imgPrefixF" target="_blank">
      <el-image class="imgCover" fit="cover" :src="imageUrl | completePicture">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </a>
    <el-image v-else class="imgCover" fit="cover" :src="imageUrl | completePicture">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
  </div>
</template>

<script>
  export default {
    name: "previewPictures",
    props: ['href'],
    data() {
      return {
        imageUrl: this.href
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
