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
      <el-form-item label="实名认证状态" label-width="100px">
        <el-select class="w_100" v-model="listQuery.sign_status" clearable>
          <el-option
            v-for="item in listdata1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="技能状态">
        <el-select class="w_100" v-model="listQuery.skill_status" clearable>
          <el-option
            v-for="item in listdata2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="保证金状态" label-width="90px">
        <el-select class="w_100" v-model="listQuery.deposit_status" clearable>
          <el-option
            v-for="item in listdata3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select class="w_100" v-model="listQuery.check_status" clearable>
          <el-option
            v-for="item in listdata4"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input class="w_150" placeholder="用户注册手机号" v-model="listQuery.mobile" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input class="w_200" placeholder="店铺名称" v-model="listQuery.store_name" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input class="w_200" placeholder="店铺所有者" v-model="listQuery.owner" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" style="width: 100%;" border>
      <el-table-column prop="nickname" label="用户昵称" min-width="170" align="center" />
      <el-table-column prop="user_phone" label="用户注册手机号" width="140" align="center" />
      <el-table-column prop="updated_at" label="申请入驻时间" width="180" align="center" />
      <el-table-column label="入驻类型" width="100" align="center">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.type_id == '1' ? 'danger' : 'success'"
            disable-transitions
          >{{scope.row.type_id == '1' ? '个人' : '企业'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="store_name" label="店铺名称" min-width="180" align="center" />
      <el-table-column label="店铺所有者" min-width="220" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.p_name || scope.row.c_name">{{scope.row.p_name}} <br/> {{scope.row.c_name}}</div>
          <div v-else>----</div>
        </template>
      </el-table-column>
      <el-table-column label="实名认证状态" min-width="120" align="center">
        <!--实名认证状态：0 待审核 1已通过 -1 未通过 null 未申请-->
        <template slot-scope="scope">
          <el-tag type="success" size="mini" v-if="scope.row.sign_status=='1'">已完成</el-tag>
          <el-tag size="mini" v-else-if="scope.row.sign_status=='0'">待审核</el-tag>
          <el-tag type="info" size="mini" v-else-if="scope.row.sign_status=='-1'">未通过</el-tag>
          <el-tag type="danger" size="mini" v-else>未申请</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="入驻技能状态" min-width="120" align="center">
        <!--入驻技能状态：大于0 已入驻 否则 未入驻-->
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.has_skill > 0 ? 'success' : 'danger'"
            disable-transitions
          >{{scope.row.has_skill > 0 ? '已入驻' : '未入驻'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="保证金状态" width="120" align="center">
        <!--保证金状态：大于0 已缴纳 否则 未缴纳-->
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.has_deposit >0  ? 'success' : 'danger'"
            disable-transitions
          >{{scope.row.has_deposit > 0 ? '已缴纳' : '未缴纳'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请审核状态" min-width="120" align="center">
        <template slot-scope="scope">
          <el-tag type="danger" size="mini" v-if="scope.row.status=='0'">待审核</el-tag>
          <el-tag type="info" size="mini" v-else>未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="100" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="handleViewDetail(scope.$index, scope.row)" type="text" size="mini">详情</el-button>
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
  </div>
</template>
<script>
import { formatDate } from "@/utils/date";
import { shopList } from "@/api/shoplist/show";

export default {
  name: "Shoplist",
  data() {
    return {
      listQuery: {
        page: 1,
        pageSize: 15,
        type: "",
        sign_status: "",
        skill_status: "",
        deposit_status: "",
        check_status: "",
        mobile: null,
        store_name: null,
        owner: ""
      },
      list: [],
      total: null,
      operateType: 1,
      listdata: [
        { label: "全部", value: "" },
        { label: "企业", value: 2 },
        { label: "个人", value: 1 }
      ],
      listdata1: [
        { label: "全部", value: "" },
        { label: "未申请", value: 2 },
        { label: "待审核", value: 0 },
        { label: "已完成", value: 1 },
        { label: "未通过", value: -1 }
      ],
      listdata2: [
        { label: "全部", value: "" },
        { label: "未入驻", value: 0 },
        { label: "已入驻", value: 1 }
      ],
      listdata3: [
        { label: "全部", value: "" },
        { label: "已缴纳", value: 1 },
        { label: "未缴纳", value: 0 }
      ],
      listdata4: [
        { label: "全部", value: "" },
        { label: "待审核", value: 0 },
        { label: "未通过", value: -1 }
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
      shopList(this.listQuery)
        .then(response => {
          this.list = response.data;
          this.total = response.total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //修改状态
    handleStatusChange(index, row) {
      let id = row.id;
      let param = {
        id: id,
        status: row.status
      };
      // updateStatus(param).then(response=>{
      //   this.$message({
      //     message: '状态修改成功',
      //     type: 'success'
      //   });
      // });
    },
    handleSearchList() {
      this.listQuery.page = 1;
      this.getList();
    },
    //查看详情
    handleViewDetail(index, row) {
      if (row.type_id == "1") {
        //个人
        this.$router.push({
          path: "/Shopconduct/ShopDetail",
          query: { id: row.id, type: "first" }
        });
      } else {
        //企业
        this.$router.push({
          path: "/Shopconduct/companyDetail",
          query: { id: row.id, type: "first" }
        });
      }
    },
    handleBatchOperate() {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的申请",
          type: "warning",
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
        statustype: this.operateType
      };
      if (this.operateType === 1) {
        //批量删除
        this.$confirm("是否要进行删除操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          // deleteApply(params).then(response=>{
          //   this.getList();
          //   this.$message({
          //     type: 'success',
          //     message: '删除成功!'
          //   });
          // });
        });
      } else if (this.operateType === 2) {
        this.$confirm("是否要进行停用操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          // deleteApply(params).then(response=>{
          //   this.getList();
          //   this.$message({
          //     type: 'success',
          //     message: '停用成功!'
          //   });
          // });
        });
      } else {
        this.$confirm("是否要进行启用操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          // deleteApply(params).then(response=>{
          //   this.getList();
          //   this.$message({
          //     type: 'success',
          //     message: '启用成功!'
          //   });
          // });
        });
      }
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    }
  }
};
</script>



