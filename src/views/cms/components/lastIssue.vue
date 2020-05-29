<template>
  <div class="headerForm">
    <el-form :inline="true" :model="form" size="small">
      <el-form-item label="媒体类型">
        <el-select class="w_120" v-model="form.media_type" placeholder="请选择" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in mediaList"
            :key="item.id"
            :label="item.type_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上刊领域">
        <el-select class="w_120" v-model="form.realm" placeholder="请选择" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in fieldLists"
            :key="item.id"
            :label="item.sr_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select class="w_120" v-model="form.status" placeholder="请选择" clearable>
          <el-option
            v-for="item in examineList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上架状态">
        <el-select class="w_120" v-model="form.on_sale" placeholder="请选择" clearable>
          <el-option
            v-for="item in shelfState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上刊名称">
        <el-input class="w_120" placeholder="上刊名称" v-model="form.journal_name" clearable/>
      </el-form-item>
      <el-form-item label="店铺名称">
        <el-input class="w_150" placeholder="店铺名称" v-model="form.store_name" clearable/>
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
      <el-table-column prop="store_name" label="店铺名称" min-width="140" align="center"/>
      <el-table-column label="上刊名称/缩略图" min-width="300" align="center">
        <template slot-scope="scope">
          <thumbnail-cpn :key="scope.row.id"
                         :item="{img:scope.row.image_s || scope.row.source_file,name:scope.row.name,cate_name:''}"></thumbnail-cpn>
        </template>
      </el-table-column>
      <el-table-column label="价格" min-width="120" align="center">
        <template slot-scope="scope">
          <span style="cursor: pointer;">￥{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sr_name" label="上刊领域" min-width="140" align="center"/>
      <el-table-column prop="type_name" label="媒体类型" min-width="140" align="center"/>
      <el-table-column label="审核状态" min-width="160" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | tagType" size="mini">
            {{scope.row.status | auditList}}
          </el-tag>
          <popover-cpn v-if="scope.row.status ===2" :key="scope.row.id" :reason="scope.row.reason"></popover-cpn>
        </template>
      </el-table-column>
      <el-table-column label="上架状态" min-width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.on_sale"
            @change="handleStatusChange(scope.$index,scope.row)"
            :active-value="1"
            :inactive-value="0"
            :disabled="scope.row.status !==1"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="220" align="center">
        <template slot-scope="scope">
          <div class="mb_10" v-if="scope.row.status === 0">
            <el-button size="mini"
                       @click="handleExamine(scope.$index, scope.row.id,1)">审核通过
            </el-button>
            <el-button size="mini"
                       @click="handleExamine(scope.$index, scope.row.id,2)">审核未通过
            </el-button>
          </div>
          <el-button size="mini" type="text">
            <a target="_blank" :href="(`/post/${scope.row.id}?type=${selectType}&sign=${sign}`) | prefixUrlF">
              详情
            </a>
          </el-button>
          <el-button size="mini" type="text">
            <a v-if="scope.row.source_file" target="_blank" :href="imgUrlPrefix+scope.row.source_file">
              {{selectType ===1?'查看原图':'查看视频'}}
            </a>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="batch-operate-container">
      <el-button
        style="margin-left: 7px"
        class="search-button"
        @click="handleBatchOperate"
        type="primary"
        size="small"
      >批量下架
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
    <audit-fail v-if="dialogFlag" @emitSubmit="emitSubmit" @emitClose="emitClose"></audit-fail>
  </div>
</template>
<script>
  import {journal, journalBatch, journalCheck} from "@/api/cms/lastIssue";
  import {shelfForm, examineStatus} from "@/utils/commonData";
  import AuditFail from "@/components/AuditFail";
  import PopoverCpn from "@/components/PopoverCpn";
  import ThumbnailCpn from "@/components/ThumbnailCpn";
  import {getRealm,getJournalType} from '@/api/common'
  // import {mediaType} from '@/api/system/mediaType'
  import {imgUrl} from '@/utils/commonData'

  export default {
    name: "lastIssue",
    components: {AuditFail, PopoverCpn, ThumbnailCpn},
    props: ['types'],
    data() {
      let sign = sessionStorage.getItem('sign');
      return {
        shelfState: shelfForm,
        examineList: examineStatus,
        imgUrlPrefix: imgUrl,
        selectType: +this.types,//	是	int	1图片，2视频
        form: {
          page: 1,
          pageSize: 15,
          media_type: '',//	否	int	媒体类型id
          realm: '',//	否	int	领域id
          status: '',//	否	int	状态:0待审核，1通过，2拒绝
          on_sale: '',//	否	int	上架状态：0未上架，1已上架
          journal_name: '',//	否	string	上刊画面名称
          store_name: '',//	否	string	店铺名称
        },
        list: [],
        fieldLists: [],
        mediaList: [],
        total: 0,
        selectId: 0,
        selectIndex: 0,
        multipleSelection: [],
        dialogFlag: false,
        sign:sign
      };
    },
    async created() {
     await this.getField();
     await this.getMedia();
      this.getList();
    },
    methods: {
      handleExamine(index, id, type) { //审核通过和不通过
        this.selectId = id;
        this.selectIndex = index;
        if (type === 1) {
          this.checkHttp(type);
        } else {
          this.dialogFlag = true
        }
      },
      handleStatusChange(index, item) { //修改状态
        this.selectIndex = index
        this.selectId = item.id
        this.statusHttp(item.on_sale);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSearchList() {
        this.form.page = 1;
        this.getList();
      },
      handleDetail(index, row) { //查看详情

      },
      handleBatchOperate() {
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: "至少选择一项",
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
          this.selectId = ids;
          this.statusHttp(0)
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
        journal(this.selectType, this.form).then(res => {
          this.list = res.data;
          this.total = res.total;
        }).catch(err => {
          console.log(err)
        });
      },
      statusHttp(types) {
        let params = {
          ids: this.selectId,//	是	int/array	案例传记id，多个传数组
          type: types,//	是	int	类型：	0下架，1上架
        }
        journalBatch(params).then(res => {
          if (res.code === 1) {
            if (Array.isArray(this.selectId)) {
              this.getList();
            }
            this.messageFun();
          } else {
            this.messageFun('error');
          }
        }).catch(err => {
           this.getList();
        });
      },
      checkHttp(types, reasons = '') {
        let params = {
          status: types,//	是	int	1通过，2不通过
          reason: reasons,//	否	string	审核未通过原因
        }
        journalCheck(this.selectId, params).then(res => {
          if (res.code === 1) {
            this.emitClose()
            let data = this.list[this.selectIndex]
            data.status = types;
            data.reason = reasons;
            this.$set(this.list, this.selectIndex, data)
            this.messageFun();
          } else {
            this.messageFun('error')
          }
        }).catch(err => {
          console.log(err)
        });
      },
      emitClose() { //emit
        this.dialogFlag = false
      },
      emitSubmit(failNote) { //emit
        this.checkHttp(2, failNote)
      },
      getField() {
        getRealm().then(res => {
          if (res.code === 1) {
            this.fieldLists = res.data
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getMedia() {
        getJournalType().then((res) => {
          if (res.code === 1) {
            this.mediaList = res.data;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      messageFun(type = 'success'){
          if(type === 'success'){
            this.$message({type: 'success', message: '操作成功'})
          }else{
            this.$message({type: 'error', message: '操作失败'})
          }
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>


