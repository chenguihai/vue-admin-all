<template>
  <div>
    <el-table :data="list" border>
      <el-table-column prop="created_at" label="序号" min-width="100" align="center"/>
      <el-table-column label="因素" min-width="200">
        <template slot-scope="scope">
          <el-input class="w_150" placeholder="抬头名称" v-model="form.company_name" clearable/>
          <span>{{scope.row.invoice_type}}</span>
        </template>
      </el-table-column>
      <el-table-column label="权重" min-width="200" align="center">
        <template slot-scope="scope">
          <el-input class="w_150" placeholder="抬头名称" v-model="form.company_name" clearable/>
          <span>{{scope.row.invoice_type}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="deleteHttp(scope.$index,scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
    export default {
        name: "weightSet",
        data() {
            return {
                form: {
                    company_name: ''
                }
            }
        },
        methods: {
            deleteHttp(index, id) {

            }
        }
    }
</script>

<style scoped>

</style>
