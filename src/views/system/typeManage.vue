<template> 
  <el-container>
    <el-main>
      <el-header style="height:40px; padding:0;">
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-input placeholder="类目关键字" v-model="listQuery.cname" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearchList">搜索</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="primary" icon="el-icon-plus" @click="handleAddClick">添加类目</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <div class="table-container" style="margin-top:0;">
        <ul class="role-table">
          <li class="header_li">
            <div class="left left_frist">分类名称 <span @click="allfold()">{{openvalue}}</span></div>
            <div class="left left1">内容数量</div>
            <div class="left left2">首页导航栏显示规则</div>
            <div class="left left3">排序</div>
            <div class="left left2">首页楼层导航显示规则</div>
            <div class="left left3">排序</div>
            <div class="left left2">首页需求大厅展示</div>
            <div class="left left3">排序</div>
            <div class="right right1">技术费率</div>
            <div class="right right3">企业/个人保证金</div>
            <!--            <div class="right left2">是否需要结算申请</div>-->
            <div class="right right2 text_center">操作</div>
          </li>
          <div v-if="dataList.length==0"
               style="height:200px;text-align:center;line-height:200px;color:red;border-bottom:1px solid #e0e0e0;font-size:20px;letter-spacing: 5px;">
            搜索不对，无数据！！！
          </div>
          <li class="role_li" v-for="(item,index) in dataList" :key="item.id">
            <div class="left left_frist text_left">
              <i @click="togglefold(index,item)"
                 :class="{'el-icon-caret-right':openicon[index].folded,'el-icon-caret-bottom':!openicon[index].folded}"
                 v-cloak class="item-icon"></i>
              <span v-cloak>{{item.cate_name}}</span>
            </div>
            <div class="left left1">无</div>
            <div class="left left2">{{item.index_nav_show | statusFilter}}</div>
            <div class="left left3">{{item.index_nav_sort}}</div>
            <div class="left left2">{{item.floor_nav_show | floorFilter}}</div>
            <div class="left left3">{{item.floor_nav_sort}}</div>
            <div class="left left2">
              <el-switch
                v-model="item.index_needs_show"
                @change="handleStatusChange(item)"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </div>
            <div class="left left3">{{item.index_needs_sort}}</div>
            <div class="right right1">——</div>
            <div class="right right3">
              ￥<span style="color:red;margin-right:5px;margin-left:2px;">{{Number(item.min_deposit_enterprise)}}</span>
              /<span style="color:red;margin-left:5px;">{{Number(item.min_deposit_personal)}}</span>
            </div>
            <!--
            <div class="left left2">
              <el-switch
                v-model="item.index_needs_show"
                @change="handleStatusChange(item)"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </div>
            -->
            <div class="right right2">
              <el-button class="edit-but" @click="handlemanage(item)" type="text" size="small">编辑</el-button>
              <el-button @click="handlelower(item)" type="text" size="small">新增下级</el-button>
              <el-button @click="handleadver" type="text" size="small">设置广告图</el-button>
            </div>
            <!-- 二级数据 -->
            <div class="line"></div>
            <ul class="ul-child" v-show="isOpenItem[index] && isOpenItem[index].group">
              <li class="childrole_li" v-for="(itemchild,j) in item.children" :key="itemchild.id">
                <div class="left child_frist text_center">
                  <i @click="checkSecondItem(index,j,itemchild)"
                     :class="{'el-icon-caret-right':itemchild.folded,'el-icon-caret-bottom':!itemchild.folded}"
                     v-cloak class="item-icon"></i>
                  <span v-cloak>{{itemchild.cate_name}}</span>
                </div>
                <div class="left childleft1">无</div>
                <div class="left childleft2">{{itemchild.index_nav_show | statusFilter}}</div>
                <div class="left childleft3">{{itemchild.index_nav_sort}}</div>
                <div class="left childleft2">{{itemchild.floor_nav_show | floorFilter}}</div>
                <div class="left childleft3">{{itemchild.floor_nav_sort}}</div>
                <div class="left childleft2">
                  ——
                </div>
                <div class="left childleft3">{{itemchild.index_needs_sort}}</div>
                <div class="right childright1">——</div>
                <div class="right childright3">
                  ———
                </div>
                <div class="right childright2">
                  <el-button class="edit-but" @click="lowermanage(itemchild)" type="text" size="small">编辑</el-button>
                  <el-button @click="lowerclick(itemchild)" type="text" size="small">新增下级</el-button>
                </div>
                <!-- 三级级数据 -->
                <div class="line"></div>
                <ul class="ul-child-item" v-show="isOpenItem[index] && isOpenItem[index].child[j]">
                  <li class="last_role_li" v-for="(itemlast) in itemchild.children" :key="itemlast.id">
                    <div class="left last-child text_right">
                      <span style="margin-right:10px;">{{itemlast.cate_name}}</span>
                    </div>
                    <div class="left lastleft1">无</div>
                    <div class="left lastleft2">{{itemlast.index_nav_show | statusFilter}}</div>
                    <div class="left lastleft3">{{itemlast.index_nav_sort}}</div>
                    <div class="left lastleft2">{{itemlast.floor_nav_show | floorFilter}}</div>
                    <div class="left lastleft3">{{itemlast.floor_nav_sort}}</div>
                    <div class="left lastleft2">
                      ——
                    </div>
                    <div class="left lastleft3">{{itemlast.index_needs_sort}}</div>
                    <div class="right lastright1">{{itemlast.tech_rate}}%</div>
                    <div class="right lastright3">
                      ———
                    </div>
                    <div class="right lastright2">
                      <el-button class="edit-but" @click="handlemanagechild(itemlast,itemchild)" type="text"
                                 size="small">编辑
                      </el-button>
                    </div>
                  </li>
                  <div class="line"></div>
                </ul>
              </li>
              <div class="line"></div>
            </ul>
          </li>
        </ul>
      </div>
      <!-- 添加/编辑一级分类 -->
      <div v-if="dialogFormVisible">
        <el-dialog :title="dialogTitle" width="700px" @close="handleClose"
                   :visible.sync="dialogFormVisible">
          <el-form :model="nologyform" status-icon :rules="rules" label-position="right" label-width="155px"
                   ref="nologyform" size="small">
            <el-form-item style="margin-bottom: 16px;" prop="cate_name" label="分类名称：">
              <el-input style="width:60%;" v-model="nologyform.cate_name" placeholder="分类名称" clearable/>
            </el-form-item>
            <el-form-item prop="pid" label="上级分类：">
              <el-cascader
                style="width:60%;"
                v-model="nologyform.pid"
                :options="options"
                :props="{ checkStrictly: true }"
                clearable
                @change="handleChange">
                <template slot-scope="{ node, data }">
                  <span>{{ data.label }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
            <el-form-item prop="index_nav_show" style="margin-bottom: 16px;" label="首页导航栏显示：">
              <el-select
                style="width:60%;"
                v-model="nologyform.index_nav_show" clearable>
                <el-option
                  v-for="item in listdata"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom: 16px;" prop="index_nav_sort" label="排序：">
              <el-input style="width:60%;" v-model.number="nologyform.index_nav_sort" autocomplete="off"
                        placeholder="排序" clearable></el-input>
            </el-form-item>
            <el-form-item label="楼层导航栏显示：">
              <template>
                <el-radio v-model="nologyform.floor_nav_show" :label="1">是</el-radio>
                <el-radio v-model="nologyform.floor_nav_show" :label="0">否</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="排序：">
              <el-input style="width:60%;" v-model.number="nologyform.floor_nav_sort" autocomplete="off"
                        placeholer="排序" clearable></el-input>
            </el-form-item>
            <el-form-item label="首页需求大厅显示：">
              <template>
                <el-radio v-model="nologyform.index_needs_show" :label="1">是</el-radio>
                <el-radio v-model="nologyform.index_needs_show" :label="0">否</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="排序：">
              <el-input style="width:60%;" v-model.number="nologyform.index_needs_sort" autocomplete="off"
                        placeholder="排序" clearable></el-input>
            </el-form-item>
            <el-form-item label="特殊技术费率：">
              <el-input :disabled="tech_ratedisabled" style="width:30%"
                        v-model.number="nologyform.tech_rate"
                        autocomplete="off" placeholder="特殊技术费率" clearable>
                <template slot="append">%</template>
              </el-input>
              <span style="color:red;margin-left:5px;">注意:这个限制于三级类目</span>
            </el-form-item>
            <el-form-item label="企业最低缴纳保证金：">
              <el-input v-model="nologyform.min_deposit_enterprise" placeholder="企业最低缴纳保证金" clearable/>
            </el-form-item>
            <el-form-item label="个人最低缴纳保证金：">
              <el-input v-model="nologyform.min_deposit_personal" placeholder="个人最低缴纳保证金" clearable/>
            </el-form-item>
            <el-form-item label="分类关键词：">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                        v-model="nologyform.cate_keywords" placeholder="分类关键词"
                        clearable/>
              <div>关键词用于搜索引擎搜索，用"|"隔开，可输入多个</div>
            </el-form-item>
            <el-form-item label="分类描述：">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                        v-model="nologyform.cate_description" placeholder="分类描述"/>
            </el-form-item>
            <el-form-item label="分类图标：">
              <single-upload :url="nologyform.cate_icon" btn="浏览" @close="deleteUpload"
                             @emitSubmit="handleUpload"></single-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="manageopen('nologyform')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 编辑二级分类 -->
      <div v-if="dialogFormVisible1">
        <el-dialog :title="dialogTitle" width="700px" @close="handleClose1"
                   :visible.sync="dialogFormVisible1">
          <el-form :model="nologyform1" status-icon :rules="rules" label-position="right" label-width="155px"
                   ref="nologyform1" size="small">
            <el-form-item style="margin-bottom: 16px;" prop="cate_name" label="分类名称：">
              <el-input style="width:60%;" v-model="nologyform1.cate_name" placeholder="分类名称" clearable/>
            </el-form-item>
            <el-form-item prop="pid" label="上级分类：">
              <el-cascader
                disabled
                style="width:60%;"

                v-model="nologyform1.pid"
                :options="options"
                :props="{ checkStrictly: true }"
                clearable
                @change="handleChange">
                <template slot-scope="{ node, data }">
                  <span>{{ data.label }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
            <el-form-item prop="index_nav_show" style="margin-bottom: 16px;" label="首页导航栏显示：">
              <template>
                <el-radio v-model="nologyform1.index_nav_show" :label="1">是</el-radio>
                <el-radio v-model="nologyform1.index_nav_show" :label="0">否</el-radio>
              </template>
            </el-form-item>
            <el-form-item style="margin-bottom: 16px;" prop="index_nav_sort" label="排序：">
              <el-input style="width:60%;" v-model.number="nologyform1.index_nav_sort" autocomplete="off"
                        placeholder="排序" clearable></el-input>
            </el-form-item>
            <el-form-item label="首页楼层推荐：">
              <template>
                <el-radio v-model="nologyform1.floor_recommend" :label="1">是</el-radio>
                <el-radio v-model="nologyform1.floor_recommend" :label="0">否</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="排序：">
              <el-input style="width:60%;" v-model.number="nologyform1.floor_recommend_sort"
                        autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="分类图标：">
              <single-upload :url="nologyform1.cate_icon" btn="浏览" @close="closeUpload" @emitSubmit="emitUpload"/>
            </el-form-item>
            <el-form-item label="分类关键词：">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                        v-model="nologyform1.cate_keywords" placeholder="分类关键词"/>
              <div>关键词用于搜索引擎搜索，用"|"隔开，可输入多个</div>
            </el-form-item>
            <el-form-item label="分类描述：">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                        v-model="nologyform1.cate_description" placeholder="分类描述"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogFormVisible1= false">取 消</el-button>
            <el-button size="small" type="primary" @click="editmanage('nologyform1')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 编辑三级级分类 -->
      <div v-if="dialogFormVisible2">
        <el-dialog :title="dialogTitle" width="700px" @close="handleClose2"
                   :visible.sync="dialogFormVisible2">
          <el-form :model="nologyform2" status-icon :rules="rules" label-position="right" label-width="155px"
                   ref="nologyform2" size="small">
            <el-form-item style="margin-bottom: 16px;" prop="cate_name" label="分类名称：">
              <el-input style="width:60%;" v-model="nologyform2.cate_name" placeholder="分类名称" clearable/>
            </el-form-item>
            <el-form-item prop="pid" label="上级分类：">
              <el-cascader
                disabled
                style="width:60%;"

                v-model="nologyform2.pid"
                :options="options"
                :props="{ checkStrictly: true }"
                clearable
                @change="handleChange">
                <template slot-scope="{ node, data }">
                  <span>{{ data.label }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
            <el-form-item prop="index_nav_show" style="margin-bottom: 16px;" label="首页导航栏显示：">
              <template>
                <el-radio v-model="nologyform2.index_nav_show" :label="1">是</el-radio>
                <el-radio v-model="nologyform2.index_nav_show" :label="0">否</el-radio>
              </template>
            </el-form-item>
            <el-form-item style="margin-bottom: 16px;" prop="index_nav_sort" label="排序：">
              <el-input style="width:60%;" v-model.number="nologyform2.index_nav_sort" autocomplete="off"
                        placeholder="排序" clearable></el-input>
            </el-form-item>
            <el-form-item label="首页导航栏推荐：">
              <template>
                <el-radio v-model="nologyform2.index_nav_recommend" :label="1">是</el-radio>
                <el-radio v-model="nologyform2.index_nav_recommend" :label="0">否</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="首页楼层推荐：">
              <template>
                <el-radio v-model="nologyform2.floor_recommend" :label="1">是</el-radio>
                <el-radio v-model="nologyform2.floor_recommend" :label="0">否</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="首页导航栏标红：">
              <template>
                <el-radio v-model="nologyform2.index_nav_hot" :label="1">是</el-radio>
                <el-radio v-model="nologyform2.index_nav_hot" :label="0">否</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="技术费率：">
              <el-input style="width:60%;" placeholder="技术费率" v-model="nologyform2.tech_rate" clearable>
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="分类关键词：">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                        v-model="nologyform2.cate_keywords" placeholder="分类关键词"/>
              <div>关键词用于搜索引擎搜索，用"|"隔开，可输入多个</div>
            </el-form-item>
            <el-form-item label="分类描述：">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                        v-model="nologyform2.cate_description" placeholder="分类描述"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogFormVisible2= false">取 消</el-button>
            <el-button size="small" type="primary" @click="editLevel('nologyform2')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import {edittype, typeList, addmanage, editstatus, catecut} from '@/api/system/typemanage';
  import SingleUpload from "@/components/Upload/singleUpload";

  const defaultListQuery = {
    cname: null,
  };
  export default {
    name: 'typemanage',
    components: {SingleUpload},
    data() {
      return {
        dataList: [],
        pastDays: 0,
        rules: {
          cate_name: [{required: true, trigger: 'change', message: '名称不能为空'}, {
            min: 2, max: 20, message: '长度在 2 到 8 个字符', trigger: 'change'
          }],
          pid: [{required: true, trigger: 'change', message: '父级id不能为空'}],
          index_nav_show: [{required: true, trigger: 'change', message: '首页导航栏不能为空'}],
          index_nav_sort: [{required: true, trigger: 'change', message: '首页导航栏排序不能为空'}, {
            type: 'number',
            message: '首页导航栏排序为数字'
          }],
        },
        listQuery: Object.assign({}, defaultListQuery),
        dialogTitle: "添加分类",
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        //添加/编辑单位
        listdata: [{
          label: "首页导航栏左侧",
          value: 1
        }, {
          label: "首页导航栏右侧",
          value: 2
        }, {
          label: "不显示",
          value: 0
        }],
        nologyform: {
          id: null,
          pid: [0],
          cate_name: '',
          cate_icon: '',
          cate_description: '',
          cate_keywords: '',
          index_nav_show: null,
          index_nav_sort: null,
          floor_nav_show: 0,
          floor_nav_sort: null,
          index_needs_show: 0,
          index_needs_sort: null,
          min_deposit_enterprise: null,
          min_deposit_personal: null,
          tech_rate: null,
        },
        nologyform1: { //二级数据
          id: null,
          cate_name: '',
          pid: [0],
          index_nav_show: 0,
          index_nav_sort: null,
          cate_icon: '',
          cate_description: '',
          cate_keywords: '',
          floor_recommend: 0,
          floor_recommend_sort: null,
        },
        nologyform2: { //三级数据
          id: null,
          pid: [0],
          cate_name: '',
          cate_description: '',
          cate_keywords: '',
          index_nav_show: 0,
          index_nav_sort: null,
          index_nav_recommend: 0,
          floor_recommend: 0,
          index_nav_hot: 0,
          tech_rate: null,
        },
        openvalue: '全部收缩',
        isOpenItem: [],//控制每级面板的打开与折叠
        openicon: [],
        options: [],
        tech_ratedisabled: true,
      }
    },
    created() {
      this.gettype();
      this.getList();
    },
    methods: {
      allfold() {      //全部收缩
        let len = this.isOpenItem.length;
        if (this.openvalue == '全部收缩') {
          this.openvalue = '全部展开';
          for (let i = 0; i < len; i++) {
            this.$set(this.isOpenItem[i], 'group', false);
            this.$set(this.openicon[i], "folded", true);
          }
        } else {
          this.openvalue = '全部收缩';
          for (let i = 0; i < len; i++) {
            this.$set(this.isOpenItem[i], 'group', true);
            this.$set(this.openicon[i], "folded", false);
          }
        }
        this.$set(this.isOpenItem, 'group', !this.isOpenItem);
      },
      //点击展开或收缩
      togglefold(index, item) {
        if (typeof this.openicon[index].folded === "false") {
          this.$set(this.openicon[index], "folded", true);
        } else {
          this.openicon[index].folded = !this.openicon[index].folded;
        }
        this.$set(this.isOpenItem[index], 'group', !this.isOpenItem[index].group);
      },
      //二级展开或收缩
      checkSecondItem(firstIndex, secondIndex, item) {//展开或折叠第二层面板
        if (typeof item.folded === "undefined") {
          this.$set(item, "folded", true);
        } else {
          item.folded = !item.folded;
        }
        this.$set(this.isOpenItem[firstIndex].child, secondIndex, !this.isOpenItem[firstIndex].child[secondIndex]);
      },
      //初始化分类数据
      gettype() {
        catecut().then((result) => {
          this.options = result;
          this.options.splice(0, 0, {value: 0, label: '顶级分类'});
        }).catch((err) => {
          console.log(err)
        })
      },
      //上级分类事件
      handleChange() {
        if (this.nologyform.pid.length > 1) {
          this.tech_ratedisabled = false;
        } else {
          this.tech_ratedisabled = true;
        }
      },
      //初始化分类数据
      getList() {
        typeList(this.listQuery).then((result) => {
          this.dataList = result.data
          let len = this.dataList.length;
          for (let i = 0; i < len; i++) {
            //根据数据初始化折叠面板折叠状态
            this.isOpenItem.push([]);
            this.openicon.push([]);
            this.$set(this.isOpenItem[i], 'group', true);
            this.$set(this.isOpenItem[i], 'child', []);
            this.$set(this.openicon[i], 'folded', false);
            //设置第二层级的状态
            for (let j in this.dataList[i].children) {
              this.isOpenItem[i].child.push(true)
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //修改展示状态
      handleStatusChange(row) {
        let id = row.id;
        let param = {
          id: id,
          show: row.index_needs_show
        };
        editstatus(param).then(response => {
           this.getList();//新增更新页面
          this.$message({
            message: '状态修改成功',
            type: 'success'
          });
        });
      },
      //设置广告图事件
      handleadver(row) {
        this.$router.push({path: '/system/advertisement'})
      },
      handlelower(row) { //一级新增下级点击事件
        this.dialogFormVisible = true;
        this.dialogTitle = "编辑二级分类";
        this.nologyform.id = null;
        this.nologyform.pid = [row.id];
        this.tech_ratedisabled = true;
      },
      //一级编辑事件
      handlemanage(row) {
        this.dialogFormVisible = true;
        this.dialogTitle = "编辑一级分类";
        this.nologyform.id = row.id;
        this.nologyform.pid = [row.id];
        this.nologyform.cate_name = row.cate_name;
        this.nologyform.cate_icon = row.cate_icon;
        this.nologyform.cate_description = row.cate_description;
        this.nologyform.cate_keywords = row.cate_keywords;
        this.nologyform.index_needs_show = row.index_needs_show;
        this.nologyform.index_nav_show = row.index_nav_show;
        this.nologyform.index_nav_sort = row.index_nav_sort;
        this.nologyform.floor_nav_show = row.floor_nav_show;
        this.nologyform.floor_nav_sort = row.floor_nav_sort;
        this.nologyform.index_needs_sort = row.index_needs_sort;
        this.nologyform.min_deposit_enterprise = row.min_deposit_enterprise;
        this.nologyform.min_deposit_personal = row.min_deposit_personal;
      },
      lowerclick(row) {//二级新增下级事件
        this.dialogTitle = "编辑三级分类";
        this.dialogFormVisible = true;
        this.nologyform.id = null;
        this.nologyform.pid = [row.pid, row.id];
        this.tech_ratedisabled = false;
      },
      lowermanage(row) { //编辑二级分类
        this.dialogFormVisible1 = true;
        this.dialogTitle = "编辑二级分类";
        this.nologyform1.id = row.id;
        this.nologyform1.pid = [row.pid, row.id];
        this.nologyform1.cate_name = row.cate_name;
        this.nologyform1.cate_icon = row.cate_icon;
        this.nologyform1.cate_description = row.cate_description;
        this.nologyform1.cate_keywords = row.cate_keywords;
        this.nologyform1.index_nav_show = row.index_nav_show;
        this.nologyform1.index_nav_sort = row.index_nav_sort;
        this.nologyform1.floor_recommend = row.floor_recommend;
        this.nologyform1.floor_recommend_sort = row.floor_recommend_sort;
      },

      handlemanagechild(row, child) {//三级编辑事件
        this.dialogFormVisible2 = true;
        this.dialogTitle = "编辑三级分类";
        this.nologyform2.id = row.id;
        this.nologyform2.cate_name = row.cate_name;
        this.nologyform2.pid = [child.pid, row.pid, row.id];
        this.nologyform2.index_nav_show = row.index_nav_show;
        this.nologyform2.index_nav_sort = row.index_nav_sort;
        this.nologyform2.index_nav_recommend = row.index_nav_recommend;
        this.nologyform2.floor_recommend = row.floor_recommend;
        this.nologyform2.index_nav_hot = row.index_nav_hot;
        this.nologyform2.cate_keywords = row.cate_keywords;
        this.nologyform2.cate_description = row.cate_description;
        this.nologyform2.tech_rate = row.tech_rate;
      },
      handleSearchList() {
        this.getList();
      },
      handleAddClick() {
        this.dialogFormVisible = true;
        this.dialogTitle = "添加分类";
        this.nologyform.id = null;
        this.nologyform.pid = [0];
        this.nologyform.cate_name = '';
        this.nologyform.cate_icon = null;
        this.nologyform.cate_description = null;
        this.nologyform.cate_keywords = null;
        this.nologyform.index_nav_show = 0;
        this.nologyform.index_nav_sort = null;
        this.nologyform.floor_nav_show = 0;
        this.nologyform.floor_nav_sort = null;
        this.nologyform.index_needs_show = 0;
        this.nologyform.index_needs_sort = null;
        this.nologyform.min_deposit_enterprise = null;
        this.nologyform.min_deposit_personal = null;
        this.nologyform.tech_rate = null;
        this.tech_ratedisabled = true;
      },

      //添加、编辑一级分类
      manageopen(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let pid;
            if (this.nologyform.pid.length < 2) {
              pid = this.nologyform.pid[0];
            } else {
              pid = this.nologyform.pid[1];
            }
            ;
            if (this.nologyform.id) {//编辑
              //一级分类所有的pid为0
              this.nologyform.pid = 0;
              // if (!this.nologyform.cate_icon) {
              //     delete this.nologyform.cate_icon;
              // }
              if (!this.nologyform.cate_description) {
                delete this.nologyform.cate_description;
              }
              if (!this.nologyform.cate_keywords) {
                delete this.nologyform.cate_keywords;
              }
              delete this.nologyform.tech_rate;
              edittype(this.nologyform.id, this.nologyform).then((result) => {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.getList();//编辑更新页面
              }).catch((err) => {
                console.log(err)
              })
            } else {//新增
              this.nologyform.pid = pid;
              addmanage(this.nologyform).then(response => {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                });
                this.getList();//新增更新页面
              }).catch((err) => {
                console.log(err)
              })
            }
            this.dialogFormVisible = false;
          } else {
            return false;
          }
        });
      },
      //二级编辑确认事件
      editmanage(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let pid;
            //console.log(this.nologyform1.pid);
            pid = this.nologyform1.pid[0];
            //console.log(pid);
            this.nologyform1.pid = pid;
            // if (!this.nologyform1.cate_icon) {
            //     delete this.nologyform1.cate_icon;
            // }
            if (!this.nologyform1.cate_description) {
              delete this.nologyform1.cate_description;
            }
            if (!this.nologyform1.cate_keywords) {
              delete this.nologyform1.cate_keywords;
            }
            edittype(this.nologyform1.id, this.nologyform1).then((result) => {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              });
              this.getList();//编辑更新页面
            }).catch((err) => {
              console.log(err)
            })
            this.dialogFormVisible1 = false;
          } else {
            return false;
          }
        });
      },
      //三级编辑确认事件
      editLevel(formName) {
        let pid;
        //console.log(this.nologyform1.pid);
        pid = this.nologyform2.pid[1];
        //console.log(pid);
        this.nologyform2.pid = pid;
        if (!this.nologyform2.cate_description) {
          delete this.nologyform2.cate_description;
        }
        if (!this.nologyform2.cate_keywords) {
          delete this.nologyform2.cate_keywords;
        }
        edittype(this.nologyform2.id, this.nologyform2).then((result) => {
          this.$message({
            type: 'success',
            message: '编辑成功!'
          });
          this.getList();//编辑更新页面
        }).catch((err) => {
          console.log(err)
        })
        this.dialogFormVisible2 = false;
      },
      /**
       * 表单关闭时事件
       */
      handleClose() {
        // this.$refs.nologyform.resetFields();
      },
      //二级表单
      handleClose1() {
        // this.$refs.nologyform1.resetFields();
      },
      //三级表单
      handleClose2() {
        // this.$refs.nologyform2.resetFields();
      },
      handleUpload(url) {
        this.nologyform.cate_icon = url;
      },
      deleteUpload() {
        this.nologyform.cate_icon = '';
      },
      emitUpload(url) {
        this.nologyform1.cate_icon = url;
      },
      closeUpload() {
        this.nologyform1.cate_icon = '';
      },
    }
  }

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  // ul, li {
  //   list-style: none;
  // }

  .header_li {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ebeef5;
    background: #F8F8F9;
    text-align: center;
    color: #909399;
  }

  .role_li {
    line-height: 40px;
    //border-bottom: 1px solid #e7e7e7;
    text-align: center;

    .ul-child {
      padding-left: 0;
      overflow: auto;

      .childrole_li {
        overflow: auto;
        line-height: 40px;
        text-align: center;

        div {
          height: 40px;
        }

        .child_frist {
          width: 10%;
          min-width: 165px;
        }

        .childleft1 {
          width: 8%;
          min-width: 82px;
        }

        .childleft2 {
          width: 12%;
          min-width: 175px;
        }

        .childleft3 {
          width: 5%;
          width: 60px;
        }

        .childright {
          float: left;
        }

        .childright1 {
          width: 8%;
          min-width: 82px;
          border-right: 1px solid #ebeef5;
        }

        .childright2 {
          width: 13%;
          min-width: 250px;
          text-align: left;
        }

        .childright3 {
          width: 10%;
          min-width: 175px;
          border-right: 1px solid #ebeef5;
        }

        //三级样式
        .ul-child-item {
          padding-left: 0;
          overflow: auto;

          .last_role_li {
            overflow: auto;
            line-height: 40px;
            border-bottom: 1px solid #ebeef5;
            text-align: center;

            div {
              height: 40px;
            }

            .last-child {
              width: 10%;
              min-width: 165px;
            }

            .lastleft1 {
              width: 8%;
              min-width: 82px;
            }

            .lastleft2 {
              width: 12%;
              min-width: 175px;
            }

            .lastleft3 {
              width: 5%;
              width: 60px;
            }

            .lastright {
              float: left;
            }

            .lastright1 {
              width: 8%;
              min-width: 82px;
              border-right: 1px solid #ebeef5;
            }

            .lastright2 {
              width: 13%;
              min-width: 250px;
              text-align: left;
            }

            .lastright3 {
              width: 10%;
              min-width: 175px;
              border-right: 1px solid #ebeef5;
            }
          }

          .last_role_li:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }

  .role_li > div {
    height: 40px;
  }

  .left {
    float: left;
    user-select: none;
    cursor: pointer;
    border-right: 1px solid #ddd;
  }

  .left_frist {
    width: 10%;
    min-width: 165px;
  }

  //一级数据样式
  .left1 {
    width: 8%;
    min-width: 82px;
  }

  .left2 {
    width: 12%;
    min-width: 175px;
  }

  .left3 {
    width: 5%;
    width: 60px;
  }

  .right {
    float: left;
  }

  .right1 {
    width: 8%;
    min-width: 82px;
    border-right: 1px solid #ddd;
  }

  .right2 {
    width: 13%;
    min-width: 250px;
    text-align: left;
  }

  .right3 {
    width: 10%;
    min-width: 175px;
    border-right: 1px solid #ddd;
  }

  .one {
    padding-left: 20px;
  }

  .item-icon {
    margin-left: -5px;
    padding: 5px;
  }

  .line {
    clear: both;
    width: 100%;
    height: 1px !important;
    background: #ebeef5;
  }

  .h40 {
    height: 39px;
    line-height: 39px;
  }

  [v-cloak] {
    display: none;
  }

  //居左，居中，居右
  .text_left {
    text-align: left;
  }

  .text_center {
    text-align: center;
  }

  .text_right {
    text-align: right;
  }

  .edit-but {
    margin-left: 15px;
  }

  .el-upload-list {
    display: none;
  }

</style>
