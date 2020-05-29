<template>
  <div class="app-container">
    <el-tabs v-model="action" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="item in menuList" :key="item.value" :label="item.label" :name="item.value+''"/>
    </el-tabs>
    <component :is="currentTabComponent"/>
  </div>
</template>
<script>
    import CaseManage from './components/caseManage'
    import BiographyManage from './components/biographyManage'

    export default {
        name: "caseBiography",
        components: {CaseManage, BiographyManage},
        data() {
            return {
                menuList: [
                    {label: '媒体案例管理', value: '0'},
                    {label: '媒主传记管理', value: '1'},
                ],
                action: '0',
                currentTab: ['case-manage', 'biography-manage']
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
