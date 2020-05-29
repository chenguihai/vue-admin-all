<template>
  <div class="app-container headerForm">
    <el-form :inline="true" :model="form" size="small">
      <el-form-item label="店铺">
        <el-input class="w_150" placeholder="店铺名称" v-model="form.store_name" clearable/>
      </el-form-item>
      <el-form-item label="分类">
        <el-select class="w_160" v-model="form.cate1" placeholder="请选择" @change="handleCategory" clearable>
          <el-option value="" label="全部"></el-option>
          <el-option
            v-for="item in cateList1"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select class="w_140" v-model="form.cate2" placeholder="请选择" @change="handleCat2" clearable>
          <el-option value="" label="全部"></el-option>
          <el-option
            v-for="item in cateList2"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select class="w_140" v-model="form.cate3" placeholder="请选择" clearable>
          <el-option value="" label="全部"></el-option>
          <el-option
            v-for="item in cateList3"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌">
        <el-input class="w_120" placeholder="品牌名称" v-model="form.brand_name" clearable/>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select class="w_120" v-model="form.status" placeholder="请选择" clearable>
          <el-option
            v-for="item in statusLists"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上架状态">
        <el-select class="w_90" v-model="form.shelf_status" placeholder="请选择" clearable>
          <el-option
            v-for="item in  shelfState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推荐标签">
        <el-select class="w_90" v-model="form.tag" placeholder="请选择" clearable>
          <el-option
            v-for="item in  tagsList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input class="w_150" placeholder="服务名称" v-model="form.service_name" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list"
              @selection-change="handleSelectionChange"
              border>
      <el-table-column type="selection" width="60" align="center"></el-table-column>
      <el-table-column prop="id" label="编号" min-width="80" align="center"/>
      <el-table-column label="服务名称/主图/分类" min-width="390" align="center">
        <template slot-scope="scope">
          <thumbnail-cpn :key="scope.row.id"
                         :item="{img:scope.row.img,name:scope.row.name,cate_name:scope.row.cate_name}"></thumbnail-cpn>
        </template>
      </el-table-column>
      <el-table-column label="品牌" min-width="130" align="center">
        <template slot-scope="scope">
          <a v-if="scope.row.brand_logo" :href="scope.row.brand_logo | imgPrefixF" target="_blank">
            <el-image class="imgCover" fit="cover" :src="scope.row.brand_logo | imgPrefixF">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </a>
        </template>
      </el-table-column>
      <el-table-column label="店铺" min-width="180" align="center">
        <template slot-scope="scope">{{scope.row.store_name}}</template>
      </el-table-column>
      <el-table-column label="价格" min-width="120" align="center">
        <template slot-scope="scope">
          <span style="cursor: pointer;">{{scope.row.price}}/{{scope.row.unit_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" min-width="160" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | tagType" size="mini">
            {{scope.row.status | auditList}}
          </el-tag>
          <!--          <div class="refuseReason">未通过原因：{{ scope.row.reason }}</div>-->
          <popover-cpn v-if="scope.row.status ===2" :key="scope.row.id" :reason="scope.row.reason"></popover-cpn>
        </template>
      </el-table-column>
      <el-table-column label="上架状态" min-width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.shelf_status"
            @change="handleStatusChange(scope.$index,scope.row,'shelf_status')"
            :active-value="1"
            :inactive-value="0"
            :disabled="scope.row.status !== 1"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="热门" min-width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_hot"
            @change="handleStatusChange(scope.$index,scope.row,'is_hot')"
            :active-value="1"
            :inactive-value="0"
            :disabled="scope.row.shelf_status === 0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="精选" min-width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_fine"
            @change="handleStatusChange(scope.$index,scope.row,'is_fine')"
            :active-value="1"
            :inactive-value="0"
            :disabled="scope.row.shelf_status === 0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="新品" min-width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_new"
            @change="handleStatusChange(scope.$index,scope.row,'is_new')"
            :active-value="1"
            :inactive-value="0"
            :disabled="scope.row.shelf_status === 0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="220" align="center">
        <template slot-scope="scope">
          <div class="mb_10" v-if="scope.row.status === 0">
            <el-button size="mini"
                       @click="handleExamine(scope.$index, scope.row.id,9)">审核通过
            </el-button>
            <el-button size="mini"
                       @click="handleExamine(scope.$index, scope.row.id,10)">审核未通过
            </el-button>
          </div>
          <el-button size="mini" type="text">
            <a target="_blank"
               :href="`/service/${scope.row.id}?id=${scope.row.store_id}&type=service&sign=${sign}` | prefixUrlF">详情</a>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="batch-operate-container">
      <span style="font-size:14px;color: #999;margin-right:5px;">批量操作</span>
      <el-select size="small" style="width:150px;" v-model="operateType" placeholder="上架" clearable>
        <el-option
          v-for="item in operateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        style="margin-left: 7px"
        class="search-button"
        @click="handleBatchOperate"
        type="primary"
        size="small"
      >确定
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
        :total="total"
      ></el-pagination>
    </div>
    <!-- 审核未通过弹窗 -->
    <audit-fail v-if="dialogFlag" @emitSubmit="_handleSubmit" @emitClose="_handleClose"></audit-fail>
  </div>
</template>
<script>
  import {examineStatus, shelfForm} from "@/utils/commonData";
  import {serviceList, serviceBatch} from "@/api/cms/service";
  import AuditFail from "@/components/AuditFail";
  import PopoverCpn from "@/components/PopoverCpn";
  import ThumbnailCpn from "@/components/ThumbnailCpn";
  import {serviceCat} from '@/api/common';

  export default {
    name: "serviceManage",
    components: {AuditFail, PopoverCpn, ThumbnailCpn},
    data() {
      let sign = sessionStorage.getItem('sign');
      return {
        sign,
        cateList1: [],  //分类数据
        cateList2: [],
        cateList3: [],
        statusLists: examineStatus,
        shelfState: shelfForm,
        tagsList: [
          {label: "全部", value: ""},
          {label: "热门", value: 1},
          {label: "精选", value: 2},
          {label: "新品", value: 3}
        ],
        form: {
          page: 1,
          pageSize: 15,
          service_name: '',//	否	string	服务名称
          store_name: '',//	否	string	店铺名称
          brand_name: '',//	否	string	品牌名称
          cate1: '',//	否	int	一级分类id
          cate2: '',//	否	int	二级分类id
          cate3: '',//	否	int	三级分类id
          status: '',//	否	int	审核状态：0未审核，1通过，2未过
          shelf_status: '',//	否	int	上架状态：0已下架，1已上架
          tag: '',//	否	int	推荐标签：1热门，2精品，3新品
        },
        list: [],
        total: 0,
        selectId: 0,
        selectIndex: 0,
        selectType: '',
        multipleSelection: [],
        operateType: 1,
        operateOptions: [
          {
            label: "上架",
            value: 1
          }, {
            label: "下架",
            value: 2
          }, {
            label: "热门",
            value: 3
          }, {
            label: "取消热门",
            value: 4
          }, {
            label: "精品",
            value: 5
          }, {
            label: "取消精品",
            value: 6
          }, {
            label: "新品",
            value: 7
          }, {
            label: "取消新品",
            value: 8
          }
        ],
        dialogFlag: false,
      };
    },
    created() {
      this.getList();
      this.serviceCatHttp('cat1', 0);
    },
    methods: {
      handleCategory(id) {
        this.form.cate2 = '';
        this.form.cate3 = '';
        this.serviceCatHttp('cat2', id);
      },
      handleCat2(id) {
        this.form.cate3 = '';
        this.serviceCatHttp('cat3', id);
      },
      handleExamine(index, id, type) { //审核通过和不通过
        this.selectId = id
        this.selectIndex = index
        if (type === 9) {
          this.serviceBatchHttp(type);
        } else {
          this.dialogFlag = true
        }
      },
      handleStatusChange(index, item, type) { //修改状态
        this.selectIndex = index
        this.selectId = item.id
        this.selectType = type
        let types = 0;
        if (type == 'shelf_status') {
          types = item[type] === 1 ? 1 : 2
        } else if (type == 'is_hot') {
          types = item[type] === 1 ? 3 : 4
        } else if (type == 'is_fine') {
          types = item[type] === 1 ? 5 : 6
        } else if (type == 'is_new') {
          types = item[type] === 1 ? 7 : 8
        }
        this.serviceBatchHttp(types);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSearchList() {
        this.form.page = 1;
        this.getList();
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
        this.$confirm("是否要进行该操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let ids = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id);
          }
          this.selectId = ids
          this.serviceBatchHttp(this.operateType)
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
        serviceList(this.form).then(res => {
          this.list = res.data;
          this.total = res.total;
        }).catch(err => {
          console.log(err)
        });
      },
      serviceBatchHttp(types, reasons = '') {
        let params = {
          ids: this.selectId,//	是	int/array	单个id或者多个
          type: types,//	是	int	类型：1上架， 2下架 3热门， 4取消热门 5精品， 6取消精品 7新品， 8取消新品 9审核通过 10不通过
          reason: reasons,//	否	string	审核未通过原因
        }
        serviceBatch(params).then(res => {
          if (res.code === 1) {
            this._handleClose()
            if (Array.isArray(this.selectId)) {
              this.getList();
            } else {
              let data = this.list[this.selectIndex]
              if (types < 9) {
                data[this.selectType] = types % 2 === 1 ? 1 : 0;
              } else {
                data.status = types === 10 ? 2 : 1;
                data.reason = reasons;
              }
              this.$set(this.list, this.selectIndex, data)
            }
          } else {
            this.$message.error('审核失败')
          }
        }).catch(err => {
          this.getList();
        });
      },
      _handleClose() { //emit
        this.dialogFlag = false
      },
      _handleSubmit(failNote) { //emit
        this.serviceBatchHttp(10, failNote)
      },
      serviceCatHttp(type, id) {
        if (id === '') { //点击clearable,阻止报错
          return;
        }
        serviceCat(id).then(res => {
          if (res.code === 1) {
            if (type === 'cat1') {
              this.cateList1 = res.data;
            } else if (type === 'cat2') {
              this.form.cate2 = ''
              this.form.cate3 = ''
              this.cateList2 = []
              this.cateList3 = []
              this.cateList2 = res.data;
            } else {
              this.form.cate3 = ''
              this.cateList3 = []
              this.cateList3 = res.data;
            }
          }
        }).catch(err => {
          console.log(err)
        })
      },
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>


