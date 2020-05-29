<template> 
  <div class="app-container">
    <el-form :inline="true" :model="form" size="small">
      <el-form-item label="用户昵称">
        <el-input v-model="form.nickname" class="width_200" placeholder="用户昵称" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone" class="input-width" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="timeArray"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list"
              @selection-change="handleSelectionChange"
              border>
      <el-table-column type="selection" width="60" align="center"/>
      <el-table-column label="用户编号" width="160" align="center" prop="id"/>
      <el-table-column label="用户昵称" min-width="180" align="center" prop="nick_name"/>
      <el-table-column label="用户姓名" min-width="220" align="center">
        <template v-if="!!scope.row.type" slot-scope="scope">{{scope.row.type === 1 ? scope.row.name :
          scope.row.company_name}}
        </template>
      </el-table-column>
      <el-table-column label="手机号码" min-width="160" align="center" prop="mobile"/>
      <el-table-column label="可用余额" width="160" align="center">
        <template slot-scope="scope">
          <a v-if="scope.row.money" class="link" @click="handleViewDetail1(scope.$index,scope.row)">
            ￥{{scope.row.money}}
          </a>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="实名认证" min-width="120" align="center">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.audit_status != null ? 'success':'danger'"
                  disable-transitions>{{scope.row.audit_status != null ? '已认证':'未认证' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="第三方QQ" width="180" align="center" prop="qq_id"/>
      <el-table-column label="第三方微信" width="180" align="center" prop="wechat_id"/>
      <el-table-column label="已邀请好友数" width="120" align="center" prop="invite_all"/>
      <el-table-column label="好友完成开店数" width="120" align="center" prop="invite_over"/>
      <el-table-column label="累计励免费技术额度" width="160" align="center" prop="invite_reward"/>
      <el-table-column label="注册时间" width="160" align="center" prop="reg_time"/>
      <el-table-column label="状态是否禁用" width="120" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="handleStatusChange(scope.$index,scope.row)"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="100" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleViewDetail(scope.$index, scope.row)">查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作" clearable>
        <el-option
          v-for="item in operateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="form.page"
        :page-size="form.pageSize"
        :page-sizes="[15,30,50]"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {formatSearchTime} from '@/utils/date';
  import {fetchList, deleteApply, updateStatus} from '@/api/conduct/conduct';

  export default {
    name: 'userlist',
    data() {
      return {
        form: {
          page: 1,
          pageSize: 15,
          nickname: '',
          phone: '',
          start_time: '',
          end_time: '',
        },
        list: [],
        timeArray: [],
        total: 0,
        multipleSelection: [],
        operateType: 1,
        operateOptions: [
          {
            label: "批量删除",
            value: 1
          },
          {
            label: "批量停用",
            value: 2
          },
          {
            label: "批量启用",
            value: 3
          }
        ],
      }
    },
    created() {
      this.getList();
    },
    methods: {
      //修改状态
      handleStatusChange(index, row) {
        let param = {
          id: row.id,
          status: row.status == 1 ? 'P' : 'D'
        };
        updateStatus(param).then(res => {
          this.$message({message: '状态修改成功',type: 'success'});
        }).catch((err)=>{
          this.getList();
        });
      },
      getList() {
        fetchList(this.form).then(res => {
          const {data = [], total = 0} = res;
          this.total = total;
          this.list = data.map((item) => {
            item.status = item.status === 'P' ? 1 : 0
            return item
          });
        }).catch(err => {
          console.log(err) // 这里catch到错误timeout
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSearchList() {
        const [startTime, endTime] = formatSearchTime(this.timeArray);
        this.form.start_time = startTime;
        this.form.end_time = endTime;
        this.form.page = 1;
        this.getList();
      },
      //账户余额跳转
      handleViewDetail1(index, row) {
        this.$router.push({path: '/conduct/userDetail', query: {id: row.id, type: 'second'}})
      },
      //查看详情
      handleViewDetail(index, row) {
        this.$router.push({path: '/conduct/userDetail', query: {id: row.id, type: 'first'}})
      },
      handleBatchOperate() {
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: '请选择要操作的申请',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        var params = {
          ids: ids,
          type: this.operateType
        }
        if (this.operateType === 1) {
          //批量删除
          this.$confirm('是否要进行删除操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteApply(params).then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList();
            });
          })
        } else if (this.operateType === 2) {
          this.$confirm('是否要进行停用操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteApply(params).then(res => {
              this.$message({
                type: 'success',
                message: '停用成功!'
              });
              this.getList();
            });
          })
        } else {
          this.$confirm('是否要进行启用操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteApply(params).then(res => {
              this.$message({
                type: 'success',
                message: '启用成功!'
              });
              this.getList();
            });
          })
        }
      },
      handleSizeChange(val) {
        this.form.page = 1;
        this.form.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.form.page = val;
        this.getList();
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .input-width {
    width: 150px;
  }

  .width_200 {
    width: 200px;
  }

  .link {
    color: #409EFF;
  }
</style>


