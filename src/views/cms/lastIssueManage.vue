<template>
  <div class="app-container">
    <el-tabs v-model="action" type="card" @tab-click="handleClick">
      <el-tab-pane label="上刊图片" name="1">
        <last-issue v-if="action === '1'" :types="action"></last-issue>
      </el-tab-pane>
      <el-tab-pane label="上刊视频" name="2">
        <last-issue v-if="action === '2'" :types="action"></last-issue>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import LastIssue from './components/lastIssue'


  export default {
    name: "lastIssueManage",
    components: {LastIssue},
    data() {
      return {
        action: '1',
      };
    },
    methods: {
      handleClick(tab, event) {
        this.action = tab.name
      },

    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
