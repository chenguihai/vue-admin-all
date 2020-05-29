<template>
  <div class="headerForm">
    <el-form :inline="true" :model="form" size="small">
      <el-form-item label="发布时间">
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
      <el-form-item label="需求标题">
        <el-input placeholder="需求标题" v-model="form.clue_title" clearable />
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select class="w_90" v-model="form.status" placeholder="审核状态" clearable>
          <el-option
            v-for="item in auditStatus"
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
    <el-table :data="list" style="width: 100%;" border>
      <!--      <el-table-column type="selection" min-width="60" align="center"></el-table-column>-->
      <el-table-column prop="id" label="补充编号" min-width="100" align="center" />
      <el-table-column prop="title" label="需求标题" min-width="200" align="center" />
      <el-table-column label="补充内容" min-width="390" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" :content="scope.row.content" width="500">
            <div slot="reference">
              <div class="threeRow">{{scope.row.content}}</div>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="发布时间" min-width="180" align="center" />
      <el-table-column label="审核状态" min-width="160" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="statusList[scope.row.status].type"
            size="mini"
          >{{statusList[scope.row.status].name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="210" align="center">
        <template slot-scope="scope">
          <div class="mb_10" v-if="scope.row.status === 0">
            <el-button size="mini" @click="handleExamine(scope.$index, scope.row.id,1)">审核通过</el-button>
            <el-button size="mini" @click="handleExamine(scope.$index, scope.row.id,2)">审核未通过</el-button>
          </div>
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
    <refusal-reasons
      v-if="refusalFlag"
      @emitSubmit="_handleEmitRefusal"
      @emitClose="_handleEmitClose"
    />
  </div>
</template>
<script>
import { formatSearchTime } from "@/utils/date";
import RefusalReasons from "@/components/RefusalReasons";
import {
  clueAppendList,
  clueAppendStatus,
  clueAppendBatch
} from "@/api/cms/demand";
import { examineData, examineStatus } from "@/utils/commonData";

export default {
  name: "clueSupple",
  components: { RefusalReasons },
  data() {
    return {
      timeArray: [],
      statusList: examineData,
      auditStatus: examineStatus,
      form: {
        clue_title: "", //	否	int	需求标题
        status: "", //	否	int	审核状态：0待审核 1通过 2未通过
        start_time: "", //	否	time	发布时间-起始
        end_time: "" //	否	time	发布时间-结束
      },
      list: [],
      total: 0,
      selectId: 0,
      selectIndex: 0,
      refusalFlag: false,
      multipleSelection: [],
      operateType: 1 //批量操作
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleExamine(index, id, type) {
      //审核通过和不通过
      this.selectId = id;
      this.selectIndex = index;
      if (type === 1) {
        this.clueAppendStatusHttp();
      } else {
        this.refusalFlag = true;
      }
    },
    handleSearchList() {
      const [startTime, endTime] = formatSearchTime(this.timeArray);
      this.form.start_time = startTime;
      this.form.end_time = endTime;
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
    getList() {
      clueAppendList(this.form)
        .then(res => {
          this.list = res.data;
          this.total = res.total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    _handleEmitRefusal(reason) {
      this.clueAppendStatusHttp(2, reason);
    },
    _handleEmitClose() {
      this.refusalFlag = false;
    },
    clueAppendBatchHttp() {
      //批量操作
      let ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id);
      }
      let params = {
        ids: ids, //	是	array	线索需求补充id
        status: this.operateType //	是	int	审核状态： 1通过 2未通过
      };
      clueAppendBatch(params)
        .then(res => {
          if (res.code === 1) {
            this.getList();
          } else {
            this.$message({
              type: "success",
              message: "审核失败"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    clueAppendStatusHttp(type = 1, reason = "") {
      //审核
      let params = {
        id: this.selectId, //	是	int	线索补充id
        status: type, //	是	int	审核状态： 1通过 2未通过
        reason: reason //	否	string	审核未通过原因
      };
      clueAppendStatus(params)
        .then(res => {
          if (res.code === 1) {
            if (type === 2) {
              this._handleEmitClose();
            }
            let data = this.list[this.selectIndex];
            data.status = type;
            this.$set(this.list, this.selectIndex, data);
            this.messageFun();
          } else {
            this.messageFun('error');
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    messageFun(type = "success") {
      if (type === "success") {
        this.$message.success("操作成功");
      } else {
        this.$message.error("操作失败");
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../../styles/mixin.scss";

.threeRow {
  @include ellipsis(3);
}
</style>
