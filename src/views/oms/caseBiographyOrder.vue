<template>
  <div class="app-container">
    <el-tabs v-model="action" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="item in menuList" :key="item.value" :label="item.label" :name="item.value+''"/>
    </el-tabs>
    <component :is="currentTabComponent"/>
  </div>
</template>
<script>
    import CaseOrder from './components/caseOrder'
    import BiographyOrder from './components/biographyOrder'
    export default {
        name: "caseBiographyOrder",
        components: {CaseOrder, BiographyOrder},
        data() {
            return {
                menuList: [
                    {label: '案例订单', value: '0'},
                    {label: '传记订单', value: '1'},
                ],
                action: '0',
                currentTab: ['case-order', 'biography-order']
            };
        },
        computed: {
            currentTabComponent: function () {
                return this.currentTab[this.action]
            }
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
