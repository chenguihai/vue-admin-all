<template>
  <div class="app-container">
    <el-tabs v-model="action" type="card" @tab-click="handleClick">
      <el-tab-pane label="服务权重配置" name="1">
        <weight-set></weight-set>
        <!--        <order-bill-list v-if="action === '1'" :types="action"></order-bill-list>-->
      </el-tab-pane>
      <el-tab-pane label="店铺权重配置" name="2">
        <weight-set></weight-set>
        <!--        <order-bill-list v-if="action === '2'" :types="action"></order-bill-list>-->
      </el-tab-pane>
      <el-tab-pane label="线索权重配置" name="3">
        <weight-set></weight-set>
        <!--        <order-bill-list v-if="action === '2'" :types="action"></order-bill-list>-->
      </el-tab-pane>
    </el-tabs>
    <component :is="currentTabComponent"/>
  </div>
</template>
<script>
    // import weightSet from './components/weightSet';

    export default {
        name: 'searchSet',
        // components: {weightSet},
        data() {
            return {
                action: '0', //是	int	1服务商，2雇主
                currentTab: ['weight-set', 'weight-set']
            }
        },
        created() {
        },
        methods: {
            handleClick(tab, event) {
                this.action = tab.name
            },
        },
        computed: {
            currentTabComponent: function () {
                return this.currentTab[this.action]
            }
        },
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
