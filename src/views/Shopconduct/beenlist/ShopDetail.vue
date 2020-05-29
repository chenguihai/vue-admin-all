<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <!--店铺资料-->
      <el-tab-pane label="店铺资料" name="first">
        <el-main>
          <!-- 店铺基本信息 -->
          <el-row>
            <el-col :span="24">
              <div class="grid-content">店铺基本信息</div>
              <div class="shop-content">
                <el-form ref="form" :model="sizeForm" label-width="100px" size="mini">
                  <el-form-item label="店铺类型：">
                    <span v-if="sizeForm.type_id==1">个人</span>
                    <span v-else-if="sizeForm.type_id==2">企业</span>
                  </el-form-item>
                  <el-form-item label="店铺名称：">
                    <span>{{sizeForm.store_name}}</span>
                  </el-form-item>
                  <el-form-item v-if="sizeForm.logo" label="店铺logo：">
                    <div class="block" style="width:200px;">
                      <preview-pictures :href="sizeForm.logo"/>
                    </div>
                  </el-form-item>
                  <el-form-item label="联系地址：">
                    <span>{{sizeForm.address}}</span>
                  </el-form-item>
                  <el-form-item label="姓名：">
                    <span>{{sizeForm.contacts_name}}</span>
                  </el-form-item>
                  <el-form-item label="联系电话：">
                    <span>{{sizeForm.phone}}</span>
                  </el-form-item>
                  <el-form-item label="电子邮箱：">
                    <span>{{sizeForm.email}}</span>
                  </el-form-item>
                  <el-form-item label="关于我们：">
                    <span>{{sizeForm.about_us}}</span>
                  </el-form-item>
                  <el-form-item label="审核状态：">
                    <span>{{sizeForm.status | auditStatus}}</span>
                  </el-form-item>
                  <el-form-item v-if="sizeForm.status==-1" label="未通过原因：">
                    <span class="span-item">{{sizeForm.remarks}}</span>
                  </el-form-item>
                  <el-form-item v-if="sizeForm.status==-2" label="关闭原因：">
                    <span class="span-item">{{sizeForm.close_reason}}</span>
                  </el-form-item>
                  <div v-if="sizeForm.status==-2" class="div_bottom">
                    <el-button size="medium" @click="open5(sizeForm,'sizeForm')" type="primary"
                               style="margin-left:25px;">开通店铺
                    </el-button>
                  </div>
                </el-form>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px;" v-if="mediulist.length > 0">
            <el-col :span="24">
              <template>
                <div class="header">媒介资质</div>
                <div class="mediumall">
                  <div class="mediumall_child" v-for="item in mediulist" :key="item.id">
                    <el-form label-width="130px" size="mini">
                      <el-form-item label="媒介资质类型：">
                        <span>{{item.type_id | aptitudeType}}</span>
                      </el-form-item>
                      <el-form-item v-if="item.type_id !== 0" label="代理时间：">
                        <span>{{item.begin_time|splitSpaceF}}至{{item.end_time|splitSpaceF}}</span>
                      </el-form-item>
                      <el-form-item label="资质图片：">
                        <ul>
                          <li v-for="(subItem,subIndex) in item.imgList || []" :key="subIndex">
                            <preview-pictures :href="subItem"/>
                          </li>
                        </ul>
                      </el-form-item>
                      <el-form-item label="审核状态：">
                        <span>{{item.status | auditStatus}}</span>
                      </el-form-item>
                      <el-form-item v-if="item.status !== 0" label="审核时间：">
                        <span>{{item.updated_at}}</span>
                      </el-form-item>
                      <el-form-item label="未通过原因：" v-if="item.status==-1">
                        <span>{{item.remarks}}</span>
                      </el-form-item>
                      <div class="div_bottom" v-if="item.status==0">
                        <el-button size="medium" type="primary" @click="open2(item,'medium')">审核通过</el-button>
                        <el-button size="medium" @click="open5(item,'medium')" type="primary"
                                   style="margin-left:25px;">审核未通过
                        </el-button>
                      </div>
                    </el-form>
                  </div>
                </div>
              </template>
            </el-col>
          </el-row>
          <!-- 隶属媒体-->
          <el-row style="margin-top:10px;" v-if="bankForm.company_name">
            <el-col :span="24">
              <div class="grid-content">隶属媒体公司</div>
              <div class="user-person">
                <div><span>公司姓名：</span>{{bankForm.company_name}}</div>
                <div>
                  <span>证件类型：</span>
                  <span class="span-item" v-if="bankForm.type_id==1">
                                    营业执照+工牌
                                </span>
                  <!--="bankForm.type_id==2"-->
                  <span class="span-item" v-else>
                                    营业执照+名片
                                </span>
                </div>
                <div class="p_one">
                  <span>证件图片：</span>
                  <ul>
                    <li v-for="(subItem,subIndex) in bankForm.imgList ||[]" :key="subIndex">
                      <preview-pictures :href="subItem"/>
                    </li>
                  </ul>
                </div>
                <div>
                  <span>审核状态：</span>
                  <span class="span-item">{{bankForm.status | auditStatus}}</span>
                </div>
                <div v-if="bankForm.status==-1">
                  <span>未通过原因：</span>
                  <i class="text span-item">{{bankForm.remarks}}</i>
                </div>
                <div v-if="bankForm.status==0" style="margin-top:20px;margin-left: 80px;padding-bottom: 10px;">
                  <el-button type="primary" @click="open2(bankForm,'company')">审核通过</el-button>
                  <el-button @click="open5(bankForm,'company')" type="primary" style="margin-left:25px;">
                    审核未通过
                  </el-button>
                </div>
              </div>
            </el-col>
          </el-row>
          <!-- 工作经历 -->
          <el-row style="margin-top:10px;" v-if="jobList.length>0">
            <el-col :span="24">
              <div class="grid-content">工作经历</div>
              <div class="jop-content">
                <div class="jop_child" v-for="(item, i) in jobList" :key="i">
                  <el-form label-width="100px" size="mini">
                    <el-form-item label="公司名称：">
                      <span>{{item.company_name}}</span>
                    </el-form-item>
                    <el-form-item label="在职时间：">
                      <span>{{item.begin_time|splitSpaceF}} 至 {{item.end_time|splitSpaceF}}</span>
                    </el-form-item>
                    <el-form-item label="公司性质：">
                      <span>{{item.nature_name}}</span>
                    </el-form-item>
                    <el-form-item label="公司规模：">
                      <span>{{item.scale_name}}</span>
                    </el-form-item>
                    <el-form-item label="部门：">
                      <span>{{item.department}}</span>
                    </el-form-item>
                    <el-form-item label="职位：">
                      <span>{{item.position}}</span>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-col>
          </el-row>
          <!-- 自传资质 -->
          <el-row style="margin-top:10px;" v-if="self_honors.length>0">
            <el-col :span="24">
              <div class="grid-content">自传资质</div>
              <div class="jop-content">
                <div class="jop_child" v-for="(item, i) in self_honors" :key="i">
                  <el-form label-width="100px" size="mini">
                    <el-form-item label="资质名称：">
                      <span>{{item.honor_name}}</span>
                    </el-form-item>
                    <el-form-item label="获得时间：">
                      <span>{{item.received_time}}</span>
                    </el-form-item>
                    <el-form-item label="资质图片：" v-if="item.honor_img">
                      <div class="block" style="width:200px;">
                        <preview-pictures :href="item.honor_img"/>
                      </div>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-tab-pane>
      <!--实名认证-->
      <el-tab-pane label="实名认证" name="second">
        <el-main>
          <el-row style="margin-top:20px;">
            <el-col :span="24">
              <div class="grid-content">实名认证（个人）</div>
              <div class="user-person">
                <div><span>姓名：</span>{{account.name}}</div>
                <div><span>身份证号码：</span>{{account.idno}}</div>
                <div><span>手机号：</span>{{account.mobile}}</div>
                <div class="p_one" v-if="account.identity_card_front">
                  <span>身份证图片：</span>
                  <ul>
                    <li>
                      <preview-pictures :href="account.identity_card_front"/>
                    </li>
                    <li>
                      <preview-pictures :href="account.identity_card_back"/>
                    </li>
                  </ul>
                </div>
                <div><span>第三方验证状态：</span><span class="span-item" v-if="account.name">已通过</span></div>
                <div>
                  <span>实名认证状态：</span>
                  <span class="span-item">{{account.audit_status | auditStatus}}</span>
                </div>
                <div v-if="account.audit_status==-1"><span>未通过原因：</span>{{account.remarks}}</div>
                <div v-if="account.audit_status==0" style="margin-top:20px;margin-left: 80px;padding-bottom: 60px;">
                  <el-button type="primary" @click="open2(account,'audit_status')">审核通过</el-button>
                  <el-button @click="open5(account,'audit_status')" type="primary"
                             style="margin-left:25px;">审核未通过
                  </el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-tab-pane>
      <!--实名认证-->
      <el-tab-pane label="入驻技能" name="third">
        <template>
          <el-table :data="tableData"
                    border
                    style="width: 100%">
            <el-table-column prop="cat_one" label="一级分类名称" min-width="130" align="center"/>
            <el-table-column label="二级分类名称" min-width="130" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.cat_two">
                            <span v-for="(item,i) in scope.row.cat_two" :key="i">
                                  {{item}}，
                            </span>
                </div>
                <span v-else></span>
              </template>
            </el-table-column>
            <el-table-column label="三级分类名称" min-width="350" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.cat_three">
                            <span v-for="(item,i) in scope.row.cat_three" :key="i">
                                  {{item}}，
                            </span>
                </div>
                <span v-else></span>
              </template>
            </el-table-column>
            <el-table-column prop="cat_money" label="保证金" min-width="100" align="center"/>
            <el-table-column label="保证金状态" width="110" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.cat_stast == '0' ? 'danger' : 'success'"
                  disable-transitions>{{scope.row.cat_stast == '0' ? '未缴纳' : '已缴纳'}}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
    </el-tabs>
    <!-- 审核未通过弹窗 -->
    <el-dialog :title="dialogTitle" width="500px" @close="handleClose" class="demo-ruleForm"
               :visible.sync="dialogFormVisible">
      <el-form :model="form" status-icon :rules="rules" label-position="right" label-width="120px" ref="ValidateForm"
               size="small">
        <el-form-item label="不通过原因：">
          <el-input :rows="3" type="textarea" maxlength="50" v-model="form.fail_note" placeholder="不通过原因"
                    clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="open1()">审核未通过</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {formatDate} from '@/utils/date';
  import {shopdetail, realverify, companyverify, shopinfoverify, mediumverify} from '@/api/shoplist/show';
  import {imgUrl} from '@/utils/commonData'

  export default {
    name: 'beenShopDetail',
    data() {
      return {
        rules: {},
        jobList: [],        //工作经历
        self_honors: [],//自传之资
        mediulist: [],//媒介资质
        bankForm: {//媒体公司
          company_name: '',
          type_id: '',
          status: null,
          img_certify: '',
          img_license: '',
          remarks: '',
        },
        sizeForm: {        //店铺基本信息
          type_id: null,
          store_name: '',
          contacts_name: '',
          phone: '',
          email: '',
          address: '',
          about_us: '',
          status: null,
          remarks: '',
          close_reason: ''
        },
        form: {        //审核未通过
          fail_note: '',
        },
        dialogtype: '',
        dialogTitle: '',
        dialogFormVisible: false,
        activeName: 'first',
        list: [],
        account: {        //实名认证
          name: '',
          mobile: '',
          idno: '',
          audit_status: null,
          identity_card_front: '',
          identity_card_back: '',
          remarks: '',
        },
        realdata: {        //实名认证审核未通过
          id: null,
          type: 0,
          fail_note: ''
        },
        tableData: [], //入驻技能
      };
    },
    created() {
      //获取传递过来的id
      const {id = 0, type = ''} = this.$route.query
      this.countid = id;
      this.activeName = type;
    },
    filters: {
      formatTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      statusFilter(status) {
        const statuses = {
          '1': '任务标题',
          '2': '服务标题',
          '3': '增资服务名称',
          '4': '工具市场工具名称',
          '5': '提现到银行卡',
          '6': '充值',
          '7': '线索名称',
          '8': '任务标题退款'
        }
        return statuses[status]
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.edit(this.countid)
      })
      console.log('======beenlist-shopdetail=======')
    },
    methods: {//初始化接口
      edit(id) {
        shopdetail(id).then((res) => {
          let {skills = [], media_aptitude = [], media_company = {}, work_experience=[]} = res;
          let imgArr = [];
          if (media_company == null) {
            media_company = {};
          }
          for (let i = 0; i < media_aptitude.length; i++) {
            const {img1, img2, img3} = media_aptitude[i];
            imgArr = [img1, img2, img3].filter(item => item)
            media_aptitude[i].imgList = imgArr;
            media_aptitude[i].preview = imgArr.map(item => imgUrl + item)
          }
          if (media_company.img_license) {
            const {img_license, img_certify} = media_company || {};
            let imgList = [img_license, img_certify]
            media_company.imgList = imgList;
            media_company.preview = imgList.map(item => imgUrl + item)
          } else {
            media_company.imgList = [];
            media_company.preview = []
          }
          this.tableData = skills;  //入驻技能
          this.sizeForm = {    //店铺基本资料
            logo: res.logo,
            type_id: res.type_id,
            store_name: res.store_name,
            contacts_name: res.contacts_name,
            phone: res.phone,
            email: res.email,
            address: res.address,
            about_us: res.about_us,
            status: res.status,
            remarks: res.remarks,
            close_reason: res.close_reason
          };
          //媒介资质
          this.mediulist = media_aptitude;
          //隶属媒体公司
          this.bankForm = Object.assign(this.bankForm, media_company);
          //工作经历
          this.jobList = work_experience;
          //自传资质
          this.self_honors = res.self_honors;
          //实名认证
          if (res.sign_account) {
            this.account.id = res.sign_account.id; //审核通过和不通过的id;
            if (res.sign_account.remarks) {
              this.account.remarks = res.sign_account.remarks;
            }
            this.account.name = res.sign_account.name;
            this.account.mobile = res.sign_account.mobile;
            this.account.accountid = res.sign_account.accountid;
            this.account.idno = res.sign_account.idno;
            this.account.audit_status = res.sign_account.audit_status;
            if (res.sign_account.sign_data) {
              this.account.identity_card_front = res.sign_account.sign_data.identity_card_front;
              this.account.identity_card_back = res.sign_account.sign_data.identity_card_back;
            } else {
              this.account.identity_card_front = '';
              this.account.identity_card_back = '';
            }
          }
          ;
        }).catch((err) => {
          console.log(err)
        })
      },
      handleClick(tab, event) {

      },
      //审核未通过
      open5(item, type) {
        this.dialogtype = type;
        if (type == 'sizeForm') {
          //开通店铺审核
          this.dialogTitle = '店铺审核';
          this.form.id = this.countid;
          this.form.fail_note = '';
        } else if (type == 'audit_status') {
          //实名认证审核未通过
          this.dialogTitle = '实名认证审核';
          this.form.id = item.id;
          this.form.fail_note = '';
        } else if (type == 'company') {
          //隶属媒体公司审核未通过
          this.dialogTitle = '隶属媒体公司审核';
          this.form.id = item.id;
          this.form.fail_note = '';
        } else if (type == 'medium') {
          //隶属媒体公司审核未通过
          this.dialogTitle = '媒介资质审核';
          this.form.id = item.id;
          this.form.fail_note = '';
        }
        this.dialogFormVisible = true;
      },
      //审核成功弹框
      open2(item, typestatus) {
        if (typestatus == 'audit_status') {
          //实名认证审核成功
          let param = {
            id: item.id,
            type: 1,
            fail_note: null
          }
          realverify(param).then((res) => {
            this.examineFun()
            this.edit(this.countid);
          }).catch((err) => {
            console.log(err)
          })
        } else if (typestatus == 'company') {
          //隶属媒体审核成功
          let param = {
            id: item.id,
            type: 1,
            fail_note: null
          }
          companyverify(param).then((res) => {
            this.examineFun()
            this.edit(this.countid);
          }).catch((err) => {
            console.log(err)
          })
        } else if (typestatus == 'sizeForm') {
          //开通店铺审核
          let param = {
            id: this.countid,
            type: 4,
            fail_note: null
          }
          shopinfoverify(param).then((res) => {
            this.$message({
              message: '您的店铺开通申请已提交，管理员会在5个工作日内完成审核，请耐心等待。',
              type: 'success'
            });
            this.edit(this.countid);
          }).catch((err) => {
            console.log(err)
          })
        } else if (typestatus == 'medium') {
          //媒介资质审核成功
          let param = {
            id: item.id,
            type: 1,
            fail_note: null
          }
          mediumverify(param).then((res) => {
            if (res.code === 1) {
              this.examineFun()
              this.edit(this.countid);
            } else {
              this.examineFun(res.data)
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      open1() {      //审核未通过
        this.$refs.ValidateForm.validate((valid) => {
          if (valid) {
            //调接口
            if (this.dialogtype == 'sizeForm') {
              //店铺基本信息审核未通过
              let param = {
                id: this.countid,
                type: 2,
                fail_note: this.form.fail_note
              }
              shopinfoverify(param).then((res) => {
                this.examineFun();
                this.edit(this.countid);
              }).catch((err) => {
                console.log(err)
              })
              this.dialogFormVisible = false;
            } else if (this.dialogtype == 'audit_status') {
              //实名认证审核未通过
              let param = {
                id: this.form.id,
                type: 0,
                fail_note: this.form.fail_note
              }
              realverify(param).then((res) => {
                this.examineFun();
                this.edit(this.countid);
              }).catch((err) => {
                console.log(err)
              })
              this.dialogFormVisible = false;
            } else if (this.dialogtype == 'company') {
              //隶属媒体公司审核未通过
              let param = {
                id: this.form.id,
                type: 0,
                fail_note: this.form.fail_note
              }
              companyverify(param).then((res) => {
                this.examineFun();
                this.edit(this.countid);
              }).catch((err) => {
                console.log(err)
              })
              this.dialogFormVisible = false;
            } else if (this.dialogtype == 'medium') {
              //媒介资质审核未通过
              let param = {
                id: this.form.id,
                type: 0,
                fail_note: this.form.fail_note
              }
              mediumverify(param).then((res) => {
                this.examineFun()
                this.edit(this.countid);
              }).catch((err) => {
                console.log(err)
              })
              this.dialogFormVisible = false;
            }

          } else {
            return false;
          }
        });
      },
      /**
       * 表单关闭时事件
       */
      handleClose() {
        //this.$refs.ValidateForm.resetFields();
      },
      examineFun(message) {
        if (message) {
          this.$message.error(message);
        } else {
          this.$message.success('操作成功');
        }
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .app-container {
    .el-main {
      padding: 0;

      .el-row {
        .grid-content {
          background: #cccccc;
          line-height: 40px;
          text-indent: 10px;
        }

        .shop-content {
          background: #f2f2f2;

          .el-form {
            padding: 10px 0;

            .el-form-item {
              margin-bottom: 0;
              padding: 3px 0;
            }

            .div_bottom {
              padding: 20px 0 20px 98px;
            }
          }
        }

        //媒介资质
        .mediumall {
          padding-bottom: 35px;
          background: #f2f2f2;
          overflow: auto;
          padding: 15px 0;

          .mediumall_child {
            margin-left: 20px;
            margin-right: 30px;
            border-bottom: 1px solid #d7d7d7;

            .el-form {
              .div_bottom {
                margin-left: 40px;
                padding-bottom: 10px;
              }

              ul {
                list-style: none;
                float: left;
                width: 550px;
                padding: 0;
                margin-top: 0;
                margin-bottom: 0;

                li {
                  float: left;
                  width: 180px;
                  padding: 4px;
                }
              }
            }
          }

          .mediumall_child:last-child {
            border-bottom: 0;
          }
        }

        //工作经历
        .jop-content {
          display: flex;
          flex-wrap: wrap;
          background: #f2f2f2;
          overflow: auto;

          .jop_child {
            padding-top: 15px;
            width: 49%;
            box-sizing: border-box;
            border-bottom: 1px solid #797979;
          }

          .jop_child:not(:nth-child(4n+4)) {
            border-right: 1px solid #797979;
          }

          .jop_child:nth-child(2n) {
            .el-form {
              padding-left: 20px;
            }
          }
        }

        //银行卡管理css
        .header {
          background: #cccccc;
          line-height: 40px;
          text-indent: 10px;
        }

        .bankall {
          padding-bottom: 30px;
          background: #f2f2f2;

          .el-table {
            background: #f2f2f2;
          }
        }

        //实名认证css
        .user-person {
          position: relative;
          background: #f2f2f2;
          padding: 15px 0;

          div {
            margin: 0;
            font-size: 14px;
            line-height: 30px;

            span {
              display: inline-block;
              width: 130px;
              text-align: right;
            }

            .span-item {
              text-align: left;
            }

            .text {
              font-style: normal;
            }
          }

          .p_one {
            overflow: auto;

            span {
              float: left;
            }

            ul {
              list-style: none;
              float: left;
              width: 550px;
              padding: 0;
              margin-top: 0;
              margin-bottom: 0;

              li {
                float: left;
                width: 108px;
                padding: 4px;
              }
            }
          }
        }
      }
    }
  }

</style>
