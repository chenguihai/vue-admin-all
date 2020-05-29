<template>
  <el-container>
    <el-main>
      <el-form :inline="true" size="small" class="headerForm">
        <el-form-item label="播放周期">
          <div class="block">
            <el-date-picker
              v-model="timeArray"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-select
            class="w_90"
            v-model="form.is_show"
            clearable
          >
            <el-option
              v-for="item in isShows"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告位置">
          <el-select
            v-model="form.ad_position_id"
            clearable
          >
            <el-option value="" label="全部"></el-option>
            <el-option
              v-for="item in advertLocation"
              :key="item.id"
              :label="item.position"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告来源">
          <el-select
            class="w_100"
            v-model="form.ad_source"
            clearable
          >
            <el-option
              v-for="item in advertSource"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="广告名称" v-model="form.ad_name" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchList">搜索</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border>
        <el-table-column prop="id" label="广告编号" min-width="100" align="center"></el-table-column>
        <el-table-column min-width="110" prop="ad_name" label="广告名称" align="center"/>
        <el-table-column width="130" label="广告图" align="center">
          <template slot-scope="scope">
            <preview-pictures :key="scope.row.id" :href="scope.row.ad_img"/>
          </template>
        </el-table-column>
        <el-table-column width="130" label="广告背景图" align="center">
          <template slot-scope="scope">
            <preview-pictures :key="scope.row.id" :href="scope.row.ad_img_bg"/>
          </template>
        </el-table-column>
        <el-table-column label="广告位置" min-width="200" align="center">
          <template slot-scope="scope">
            <div v-for="(item) in scope.row.ad_position" :key="item.position_name">
              <span>{{item.position_name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="100" prop="start_time" label="开始日期" align="center"/>
        <el-table-column width="100" prop="end_time" label="结束日期" align="center"/>
        <el-table-column prop="click_num" min-width="100" label="点击次数" align="center"/>
        <el-table-column prop="sort" label="排序" width="60" align="center"/>
        <el-table-column label="是否显示" width="80" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_show"
              @change="handleStatusChange(scope.row)"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="ad_source" width="120" label="广告来源" align="center"/>
        <el-table-column prop="ad_img_link" min-width="170" label="图片链接" align="center"/>
        <el-table-column fixed="right" width="150" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
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
      <advert-cpn v-if="showFlag" :title="dialogTitle" :item="selectItem" :address="advertLocation"
                  @submit="_handleSubmit"
                  @close="_handleClose"></advert-cpn>
    </el-main>
  </el-container>
</template>
<script>
  import {
    advertiseList,
    addadvertise,
    deleteadverltise,
    editadvertise,
    getPosition,
    editstatus,
  } from "@/api/system/advertise";
  import AdvertCpn from "./components/advertCpn";
  import {formatSearchTime} from '@/utils/date';
  import {isShow} from "@/utils/commonData";

  export default {
    name: "advertisement",
    components: {AdvertCpn},
    data() {
      return {
        showFlag: false,
        advertSource: [
          {
            label: "全部",
            value: ''
          },
          {
            label: "平台上传",
            value: 1
          },
          {
            label: "用户购买",
            value: 2
          }
        ],
        isShows: isShow, //isShow 0 不显示 / 1 显示
        advertLocation: [], //广告位置
        form: {
          page: 1,
          pageSize: 10,
          start_time: '',//	否	datetime	开始时间
          end_time: '',//	否	datetime	结束时间
          is_show: '',//	否	int	是否显示：0否，1是
          ad_source: '',//	否	int	广告来源：1平台上传，2用户购买
          ad_position_id: '',//	否	int	广告位置id
          ad_name: '',//	否	string	广告名称
        },
        tableData: [],
        timeArray: [],
        total: 0,
        selectId: 0,
        selectItem: {},
        dialogTitle: "添加广告",
      };
    },
    created() {
      this.getadposition();
      this.getList();
    },
    methods: {
      _handleClose() { //emit
        this.showFlag = false
      },
      _handleSubmit(params) { //emit
        if (this.selectId === 0) {
          this.addHttp(params);
        } else {
          this.editHttp(params);
        }
      },
      getadposition() { //获取广告位置数据
        getPosition().then(result => {
          this.advertLocation = result
        }).catch(err => {
          console.log(err)
        });
      },
      getList() {
        advertiseList(this.form).then(res => {
          const {data = [], total=0} = res
          this.tableData = data;
          this.total = total;
        }).catch(err => {
          console.log(err);
        });
      },
      handleStatusChange(row) { //修改展示状态
        let param = {
          id: row.id,
          show: row.is_show
        };
        editstatus(param).then(res => {
          if (res.code === 1) {
            this.$message({message: "状态修改成功", type: "success"});
          } else {
            this.$message({message: res.data, type: "error"});
          }
        }).catch((err)=>{
           this.getList();
        });
      },
      handleSearchList() {
        const [startTime, endTime] = formatSearchTime(this.timeArray);
        this.form.start_time = startTime;
        this.form.end_time = endTime;
        this.form.page = 1;
        this.getList();
      },
      handleAdd() {
        this.showFlag = true;
        this.dialogTitle = "添加广告";
        this.selectId = 0;
        this.selectItem = {};
      },
      handleEdit(row) {
        this.showFlag = true;
        this.dialogTitle = "编辑广告";
        this.selectId = row.id;
        this.selectItem = row;
      },
      editHttp(params) {
        editadvertise(this.selectId, params).then(res => {
          if (res.code === 1) {
            this.$message({type: "success", message: "编辑成功!"});
            this._handleClose();
            this.getList(); //新增更新页面
          } else {
            this.$message({type: "error", message: res.data});
          }
        }).catch(err => {
          console.log(err);
        });
      },
      addHttp(params) { //新增
        addadvertise(params).then(res => {
          if (res.code === 1) {
            this.$message({type: "success", message: "新增成功!"});
            this._handleClose();
            this.getList(); //新增更新页面
          } else {
            this.$message({type: "error", message: res.data});
          }
        }).catch(err => {
          console.log(err);
        });
      },
      deleteHttp() {
        deleteadverltise(this.selectId).then(res => {
          if (res.code === 1) {
            this.$message({type: "success", message: "删除成功!"});
            this._handleClose();
            this.getList(); //删除更新页面
          } else {
            this.$message({type: "error", message: res.data});
          }
        }).catch(e => {
          console.log(err);
        });
      },
      handleDelete(id) {
        this.selectId = id;
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.deleteHttp();
        }).catch(() => {
          this.$message({type: "info", message: "已取消删除"});
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
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .el-picker-panel__footer {
    .el-button--text {
      display: none;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .ad_img {
    width: 100px;
    height: 60px;
  }
</style>
