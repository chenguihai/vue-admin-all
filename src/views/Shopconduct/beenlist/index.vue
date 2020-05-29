<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" size="small" class="headerForm">
      <el-form-item label="入驻类型">
        <el-select class="w_100" v-model="listQuery.type" clearable>
          <el-option
            v-for="item in listdata"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺状态">
        <el-select class="w_100" v-model="listQuery.status" clearable>
          <el-option
            v-for="item in listdata1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开通时间">
        <el-date-picker
          v-model="Openingdate"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="店铺名称" v-model="listQuery.store_name" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="店铺所有者" v-model="listQuery.owner" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input class="w_150" placeholder="注册手机号" v-model="listQuery.mobile" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border>
      <el-table-column label="用户注册手机号" width="120" align="center">
        <template slot-scope="scope">{{scope.row.user_phone}}</template>
      </el-table-column>
      <el-table-column label="入驻类型" width="100" align="center">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.type_id == '1' ? 'danger' : 'success'"
            disable-transitions
          >{{scope.row.type_id == '1' ? '个人' : '企业'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="店铺名称" min-width="200" align="center">
        <template slot-scope="scope">{{scope.row.store_name}}</template>
      </el-table-column>
      <el-table-column label="店铺基础等级" width="120" align="center">
        <template slot-scope="scope">{{scope.row.growth_value}}</template>
      </el-table-column>
      <el-table-column label="店铺付费等级" width="120" align="center">
        <template slot-scope="scope">{{scope.row.member_level_id}}</template>
      </el-table-column>
      <el-table-column label="店铺所有者" min-width="220" align="center">
        <!--          `type_id` '店铺类型：1  个人店铺 显示 p_name   2 企业店铺 显示 c_name-->
        <template slot-scope="scope">
          <div v-if="scope.row.p_name">{{scope.row.p_name}}</div>
          <div v-if="scope.row.c_name">{{scope.row.c_name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="店铺状态" width="100" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.status==1">已开通</div>
          <div v-else>
            <p>已关闭</p>
            <p v-if="scope.row.close_reason">关闭原因：{{scope.row.close_reason}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="店铺推荐" width="100" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_recommend"
            @change="handleStatusChange(scope.$index,scope.row)"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="开通时间" width="160" align="center">
        <template slot-scope="scope">{{scope.row.check_time}}</template>
      </el-table-column>
      <el-table-column label="已缴纳保证金" width="140" align="center">
        <template slot-scope="scope">{{scope.row.cat_money}}</template>
      </el-table-column>
      <el-table-column label="技术费率免费额度" width="140" align="center">
        <template slot-scope="scope">{{scope.row.free_amount}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleViewDetail(scope.$index, scope.row)">详情</el-button>
          <el-button
            v-if="scope.row.status==1"
            @click="handlequota(scope.row)"
            type="text"
            size="small"
          >设置免费额度</el-button>
          <el-button
            v-if="scope.row.status==-2"
            @click="handleClick(scope.row)"
            type="text"
            size="small"
          >开通店铺</el-button>
          <el-button
            v-if="scope.row.status==1"
            @click="handleClick1(scope.row)"
            type="text"
            size="small"
          >关闭店铺</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.page"
        :page-size="listQuery.pageSize"
        :page-sizes="[15,30,50]"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 技术费率弹窗 -->
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
        :rules="rules"
        label-position="right"
        label-width="135px"
        ref="nologyform"
        size="small"
      >
        <el-form-item prop="free_amount" label="技术费免费额度：">
          <el-input
            type="free_amount"
            v-model.number="nologyform.free_amount"
            placeholder="技术费免费额度"
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="quotaopen('nologyform')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 关闭店铺弹窗 -->
    <el-dialog title="关闭店铺" :visible.sync="centerDialogVisible" width="500px">
      <el-form
        :model="closeform"
        status-icon
        :rules="rules"
        label-position="right"
        label-width="90px"
        ref="nologyform"
      >
        <el-form-item label="关闭原因：">
          <el-input
            type="textarea"
            maxlength="30"
            v-model="closeform.close_note"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="30字以内"
            autocomplete="off"
            clearable
          />
          <span style="text-align:center;display: block;padding:15px 0;">关闭店铺后，店铺相关功能将不可用，确认关闭吗？</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeshop">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from "@/utils/date";
import {
  beenList,
  recommend,
  freeAmount,
  Closeshop,
  Openshop
} from "@/api/beenlist/index";

const defaultListQuery = {
  type: "",
  status: "",
  store_name: null,
  start_time: null,
  end_time: null,
  page: 1,
  pageSize: 15,
  mobile: "",
  owner: ""
};
export default {
  name: "beenlist",
  data() {
    return {
      Openingdate: [],
      rules: {
        reason: [
          { required: true, trigger: "change", message: "原因不能为空" }
        ],
        account: [{ required: true, trigger: "change", message: "请输入金额" }],
        free_amount: [
          { required: true, trigger: "change", message: "额度不能为空" },
          {
            type: "number",
            message: "额度为数字值"
          }
        ]
      },
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      //技术费率
      nologyform: {
        store_id: null,
        free_amount: null
      },
      //关闭店铺
      closeform: {
        id: null,
        type: 3,
        close_note: ""
      },
      //开通店铺
      openform: {
        id: null,
        type: 4
      },
      dialogTitle: "",
      dialogFormVisible: false,
      centerDialogVisible: false,
      total: null,
      listdata: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "企业",
          value: 2
        },
        {
          label: "个人",
          value: 1
        }
      ],
      listdata1: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "已开通",
          value: 1
        },
        {
          label: "已关闭",
          value: -2
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formatTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatStatus(status) {
      for (let i = 0; i < defaultStatusOptions.length; i++) {
        if (status === defaultStatusOptions[i].value) {
          return defaultStatusOptions[i].label;
        }
      }
    }
  },
  methods: {
    getList() {
      this.listQuery.start_time =
        this.Openingdate && this.Openingdate.length > 0
          ? this.Openingdate[0]
          : null;
      this.listQuery.end_time =
        this.Openingdate && this.Openingdate.length > 1
          ? this.Openingdate[1]
          : null;
      beenList(this.listQuery)
        .then(response => {
          this.list = response.data;
          this.total = response.total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //技术费率
    handlequota(row) {
      this.dialogTitle = "设置额度";
      this.dialogFormVisible = true;
      this.nologyform.store_id = row.id;
      this.nologyform.free_amount = row.free_amount;
    },
    //确认技术费率
    quotaopen(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          freeAmount(this.nologyform)
            .then(result => {
              this.$message({
                showClose: true,
                type: "success",
                message: "免费额度设置成功!"
              });
              this.getList();
            })
            .catch(err => {
              console.log(err);
            });
          this.dialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //开通店铺
    handleClick(row) {
      this.openform.id = row.id;
      Openshop(this.openform).then(response => {
        this.$message({
          showClose: true,
          message:
            "您的店铺开通申请已提交，管理员会在5个工作日内完成审核，请耐心等待!",
          type: "success"
        });
        this.getList();
      });
    },
    //关闭店铺
    handleClick1(row) {
      this.centerDialogVisible = true;
      this.closeform.id = row.id;
      this.closeform.close_note = "";
    },
    //确认关闭店铺
    closeshop() {
      Closeshop(this.closeform).then(res => {
        if (res.code === 1) {
          this.$message.success("关闭成功");
        } else {
          this.$message.error(res.data);
        }
        this.getList();
      });
      this.centerDialogVisible = false;
    },
    //修改状态
    handleStatusChange(index, row) {
      let param = {
        id: row.id,
        type: row.is_recommend
      };
      recommend(param)
        .then(res => {
          if (res.code === 1) {
            this.$message.success("状态修改成功");
          } else {
            this.$message.error(res.data);
          }
        })
        .catch(err => {
          this.getList();
        });
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    //查看详情
    handleViewDetail(index, row) {
      if (row.type_id == "1") {
        //个人
        this.$router.push({
          path: "/Shopconduct/beenShopDetail",
          query: { id: row.id, type: "first" }
        });
      } else {
        //企业
        this.$router.push({
          path: "/Shopconduct/beencompanyDetail",
          query: { id: row.id, type: "first" }
        });
      }
    },
    handleSizeChange(val) {
      this.listQuery.page = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },

    /**
     * 表单关闭时事件
     */
    handleClose() {
      //this.$refs.nologyform.resetFields();
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>


