<template>
  <div class="app-container">
    <el-tabs v-model="action" type="card" @tab-click="handleClick">
      <el-tab-pane label="服务商已申请" name="1">
        <order-bill-list v-if="action === '1'" :types="action"></order-bill-list>
      </el-tab-pane>
      <el-tab-pane label="雇主已申请" name="2">
        <order-bill-list v-if="action === '2'" :types="action"></order-bill-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
    import orderBillList from './components/orderBillList';
    export default {
        name: 'orderBill',
        components: {orderBillList},
        data() {
            return {
                action: '1', //是	int	1服务商，2雇主
            }
        },
        created() {
        },
        methods: {
            handleClick(tab, event) {
                this.action = tab.name
            },
        },
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
