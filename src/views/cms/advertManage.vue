<template>
  <div class="app-container">
    <el-form :inline="true" :model="form" size="small" class="headerForm">
      <el-form-item label="提交时间">
        <el-date-picker
          v-model="timeArray"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="线索编号">
        <el-input class="w_150" placeholder="线索编号" v-model="form.clue_id" clearable />
      </el-form-item>
      <el-form-item label="一级类目">
        <el-select class="w_160" v-model="form.cate_id" placeholder="一级类目" clearable>
          <el-option
            v-for="item in cateList"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册手机号">
        <el-input class="w_150" placeholder="注册手机号" v-model="form.mobile" clearable />
      </el-form-item>
      <el-form-item label="联系人">
        <el-input class="w_150" placeholder="联系人" v-model="form.contact" clearable />
      </el-form-item>
      <el-form-item label="联系手机">
        <el-input class="w_150" placeholder="联系手机" v-model="form.contact_mobile" clearable />
      </el-form-item>
      <el-form-item label="是否需要客服包办">
        <el-select class="w_100" v-model="form.service" placeholder="是否需要客服包办" clearable>
          <el-option
            v-for="item in serviceList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select class="w_120" v-model="form.status" placeholder="审核状态" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" min-width="60" align="center"></el-table-column>
      <el-table-column prop="id" label="线索编号" min-width="130" align="center" />
      <el-table-column prop="cate_name" label="一级类目" min-width="140" align="center" />
      <el-table-column prop="title" label="线索标题" min-width="160" align="center" />
      <el-table-column prop="nickname" label="用户昵称" min-width="160" align="center" />
      <el-table-column prop="bind_mobile" label="注册手机号" min-width="110" align="center" />
      <el-table-column prop="name" label="联系人" min-width="140" align="center" />
      <el-table-column label="联系方式" min-width="200" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.mobile">联系手机： {{scope.row.mobile}}</div>
          <div v-if="scope.row.wechat">微信： {{scope.row.wechat}}</div>
          <div v-if="scope.row.email">邮箱： {{scope.row.email}}</div>
          <div v-if="scope.row.qq">qq： {{scope.row.qq}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="budget_money" label="投放预算" min-width="100" align="center" />
      <el-table-column prop="created_at" label="提交时间" width="100" align="center" />
      <el-table-column prop="end_time" label="截止购买时间" width="95" align="center" />
      <el-table-column label="审核状态" width="90" align="center">
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="scope.row.status |tagType"
          >{{scope.row.status | auditStatusLetter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否需要客服包办" width="90" align="center">
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="scope.row.service | isArrangedTag"
          >{{scope.row.service | isArranged}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="线索状态" width="90" align="center">
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="scope.row.clue_status |isArrangedTag"
          >{{scope.row.clue_status | clueStatus}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status_time" label="审核通过时间" width="100" align="center" />
      <!-- <el-table-column prop="status_time" label="线索关闭时间" min-width="160" align="center" /> -->
      <el-table-column fixed="right" label="操作" min-width="300" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.service ==='Y'"
            size="mini"
            type="primary"
            @click="arrangedClue(scope.$index, scope.row.id)"
          >包办线索</el-button>
          <el-button
            v-if="scope.row.clue_status ==='Y'"
            size="mini"
            type="text"
            @click="closeClue(scope.$index, scope.row.id)"
          >关闭线索</el-button>
          <template v-if="scope.row.status === 'N'">
            <el-button size="mini" @click="handleExamine(scope.$index, scope.row.id,'S')">审核通过</el-button>
            <el-button size="mini" @click="handleExamine(scope.$index, scope.row.id,'Y')">审核未通过</el-button>
          </template>
          <router-link :to="{path:'/oms/incrementOrder'}">
            <el-button size="mini" type="text">查看增值服务</el-button>
          </router-link>
          <router-link v-if="scope.row.status === 'S'" :to="{path:'/oms/thread'}">
            <el-button size="mini" type="text">购买列表</el-button>
          </router-link>
          <el-button size="mini" type="text">
            <a target="_blank" :href="`/clues/${scope.row.id}?sign=${sign}` | prefixUrlF">详情</a>
          </el-button>
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
        :page-sizes="[10,30,50]"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 审核未通过弹窗 -->
    <audit-fail v-if="dialogFlag" @emitSubmit="_handleSubmit" @emitClose="_handleClose"></audit-fail>
  </div>
</template>
<script>
import { formatSearchTime } from "@/utils/date";
import { clueList, clueCheck, clueClose } from "@/api/cms/clue";
import { servetype } from "@/api/cms/serve";
import AuditFail from "@/components/AuditFail";

export default {
  name: "advertManage",
  components: { AuditFail },
  data() {
    let sign = sessionStorage.getItem("sign");
    return {
      timeArray: [],
      statusList: [
        { label: "全部", value: "" },
        { label: "待审核", value: "N" },
        { label: "已通过", value: "S" },
        { label: "未通过", value: "Y" }
      ],
      serviceList: [
        { label: "全部", value: "" },
        { label: "否", value: "N" },
        { label: "是", value: "Y" }
      ],
      form: {
        page: 1,
        pageSize: 10,
        clue_id: "", //	否	int	线索id
        mobile: "", //	否	string	手机
        service: "", //	否	string	是否客服包办：N 否 Y 是
        status: "", //	否	string	审核状态：N 未审核 Y 不通过 S 通过
        start_time: "", //	否	string	提交时间-起始
        end_time: "", //	否	string	提交时间-结束
        cate_id: "", //	否	int	一级类目id
        contact: "", //否	string	联系人
        contact_mobile: "" //	否	string	联系手机
      },
      dialogFlag: false,
      list: [],
      total: 0,
      selectIndex: 0,
      selectId: 0,
      multipleSelection: [],
      operateType: 1, //批量操作
      sign,
      cateList: []
    };
  },
  created() {
    this.getList();
    this.serviceCatHttp(0);
  },
  methods: {
    serviceCatHttp(id) {
      //初始化一级分类数据
      servetype(id)
        .then(res => {
          if (res.code === 1) {
            this.cateList = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleExamine(index, id, type) {
      //审核通过和不通过
      this.selectId = id;
      this.selectIndex = index;
      if (type === "S") {
        this.clueCheckHttp();
      } else {
        this.dialogFlag = true;
      }
    },
    arrangedClue(index, id) {
      this.selectId = id;
      this.selectIndex = index;
      localStorage.setItem(
        "clueItem",
        JSON.stringify({ ...this.list[index], id })
      );
      this.$router.push("/cms/arrangedClue?page=" + this.form.page);
    },
    closeClue(index, id) {
      this.selectIndex = index;
      this.clueCloseHttp(id);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSearchList() {
      const [startTime, endTime] = formatSearchTime(this.timeArray);
      this.form.start_time = startTime;
      this.form.end_time = endTime;
      this.form.clue_id = this.form.clue_id ? +this.form.clue_id : "";
      this.form.page = 1;
      this.getList();
    },
    handleBatchOperate() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的申请",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.$confirm("是否要进行该操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.clueAppendBatchHttp();
      });
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
    _handleClose() {
      //emit
      this.dialogFlag = false;
    },
    _handleSubmit(failNote) {
      //emit
      this.clueCheckHttp("Y", failNote);
    },
    getList() {
      clueList(this.form)
        .then(res => {
          this.list = res.data;
          this.total = res.total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    clueCloseHttp(id) {
      //线索 - 关闭
      clueClose(id)
        .then(res => {
          if (res.code === 1) {
            this.$message({ type: "success", message: "操作成功" });
            this.getList();
          } else {
            this.$message({ type: "error", message: "审核失败" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    clueCheckHttp(state = "S", reasons = "") {
      //审核
      let params = {
        id: this.selectId, //	是	int	线索id
        status: state, //	是	int	Y 审核未通过 S 通过
        reason: reasons //	否	int	不通过原因
      };
      clueCheck(params)
        .then(res => {
          if (res.code === 1) {
            this.dialogFlag = false;
            this.getList();
            // let data = this.list[this.selectIndex]
            // data.status = state;
            // data.clue_status = 'Y';
            // this.$set(this.list, this.selectIndex, data)
            this.$message.success("操作成功");
          } else {
            this.$message({ type: "error", message: "审核失败" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
