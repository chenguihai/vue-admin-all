size=small
<template>
  <el-container>
    <el-main>
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-input placeholder="广告位置" v-model="form.position" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchList">搜索</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="primary" icon="el-icon-plus" @click="handleAddClick">添加广告位置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border>
        <el-table-column prop="id" label="广告位置编号" min-width="120" align="center"></el-table-column>
        <el-table-column prop="position" label="广告位置" min-width="200" align="center" />
        <el-table-column prop="width" label="位置宽度" min-width="120" align="center" />
        <el-table-column prop="height" label="位置高度" min-width="120" align="center" />
        <el-table-column label="广告位描述" align="center" min-width="240">
          <template slot-scope="scope">
            <div class="threeLine">{{scope.row.description}}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" min-width="160">
          <template slot-scope="scope">
            <!-- <el-button size="mini"
            @click="handleEdit1(scope.$index, scope.row)">查看广告</el-button>-->
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper"
          :current-page.sync="form.page"
          :page-size="form.pageSize"
          :page-sizes="[15,30,50]"
          :total="total"
        ></el-pagination>
      </div>
      <!-- 添加/编辑单位 -->
      <el-dialog
        :title="dialogTitle"
        width="500px"
        @close="handleClose"
        class="demo-ruleForm"
        :visible.sync="dialogFormVisible"
      >
        <el-form
          :model="nologyform"
          status-icon
          size="small"
          :rules="rules"
          label-position="right"
          label-width="130px"
          ref="nologyform"
        >
          <el-form-item prop="position" label="广告位置：">
            <el-input v-model="nologyform.position" placeholder="广告位置" clearable />
          </el-form-item>
          <el-form-item prop="width" label="位置宽度：">
            <el-input-number
              v-model.number="nologyform.width"
              placeholder="位置宽度"
              :min="1"
              :max="2000"
              clearable
            />
          </el-form-item>
          <el-form-item prop="height" label="位置高度：">
            <el-input-number
              v-model.number="nologyform.height"
              placeholder="位置高度"
              :min="1"
              :max="2000"
              clearable
            />
          </el-form-item>
          <el-form-item label="广告位描述：">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="广告位描述"
              maxlength="300"
              show-word-limit
              v-model="nologyform.description"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="adverlocopen('nologyform')">确 定</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import {
  deleteadverloc,
  adverlocList,
  addadverloc,
  editadverloc
} from "@/api/system/adverloc";

export default {
  name: "managementlist",
  data() {
    return {
      rules: {
        position: [
          { required: true, message: "广告位置不能为空", trigger: "change" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "change"
          }
        ],
        width: [{ required: true, message: "宽度不能为空", trigger: "change" }],
        height: [{ required: true, message: "高度不能为空", trigger: "change" }]
      },
      form: {
        page: 1,
        pageSize: 15,
        position: ""
      },
      tableData: [],
      total: null,
      dialogTitle: "添加位置管理",
      dialogFormVisible: false,
      //添加/编辑单位
      nologyform: {
        position: "",
        width: null,
        height: null,
        description: ""
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      adverlocList(this.form)
        .then(res => {
          const { data = [], total = 0 } = res;
          this.tableData = data;
          this.total = total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSearchList() {
      this.form.page = 1;
      this.getList();
    },
    handleAddClick() {
      this.dialogFormVisible = true;
      this.dialogTitle = "添加位置管理";
      this.nologyform.id = null;
      this.nologyform.position = "";
      this.nologyform.width = null;
      this.nologyform.height = null;
      this.nologyform.description = "";
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.dialogTitle = "编辑位置管理";
      this.nologyform = row;
    },
    toEdit() {
      let adverjson = {
        position: this.nologyform.position,
        width: this.nologyform.width,
        height: this.nologyform.height,
        description: this.nologyform.description
      };
      editadverloc(this.nologyform.id, adverjson)
        .then(res => {
          if (res.code === 1) {
            this.$message({ type: "success", message: "编辑成功!" });
            this.getList(); //新增更新页面
          } else {
            this.$message({ type: "error", message: res.data });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toAdd() {
      addadverloc(this.nologyform)
        .then(res => {
          if (res.code === 1) {
            this.$message({ type: "success", message: "新增成功!" });
            this.getList(); //新增更新页面
          } else {
            this.$message({ type: "error", message: res.data });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //添加、编辑广告位置
    adverlocopen(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.nologyform.id) {
            this.toEdit(); //编辑
          } else {
            this.toAdd(); //新增
          }
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },

    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteadverloc(row.id)
            .then(response => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList(); //删除更新页面
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.form.page = 1;
      this.form.pageSize = val;
      this.getList();
    },
    /**
     * 表单关闭时事件
     */
    handleClose() {
      // this.$refs.nologyform.resetFields();
      this.$refs.nologyform.clearValidate();
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/mixin.scss";

.threeLine {
  @include ellipsis(3);
}
</style>
