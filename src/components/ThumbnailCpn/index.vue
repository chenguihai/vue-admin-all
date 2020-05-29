<template>
  <div class="box">
    <a :href="items.img | imgPrefixF" target="_blank">
      <el-image class="box_left" fit="cover" :src="items.img | completePicture">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </a>
    <div class="box_right" v-if="items.name">
      <h1>{{items.name}}</h1>
      <p>{{items.cate_name}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "thumbnailCpn",
    props: ['item'],
    data() {
      return {
        items: this.item
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .box {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;

    .box_left {
      width: 100px;
      height: 60px;
      overflow: hidden;
      margin-right: 10px;
    }

    .box_right {
      flex: 1;

      h1 {
        font-size: 14px;
        margin: 0;
        text-align: left;
      }

      p {
        text-align: left;
      }
    }
  }

</style>
