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
                <el-form ref="form" :model="sizeForm" label-width="130px" size="small">
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
                  <el-form-item label="企业名称：">
                    <span>{{sizeForm.company_name}}</span>
                  </el-form-item>
                  <el-form-item label="企业类型：">
                    <span>{{sizeForm.company_type_id}}</span>
                  </el-form-item>
                  <el-form-item label="公司规模：">
                    <span>{{sizeForm.scale_id}}</span>
                  </el-form-item>
                  <el-form-item label="公司所在地：">
                    <span>{{companyAddress}}</span>
                  </el-form-item>
                  <el-form-item label="详细地址：">
                    <span>{{sizeForm.address}}</span>
                  </el-form-item>
                  <el-form-item label="常用联系人姓名：">
                    <span>{{sizeForm.contacts_name}}</span>
                  </el-form-item>
                  <el-form-item label="常用联系电话：">
                    <span>{{sizeForm.phone}}</span>
                  </el-form-item>
                  <el-form-item label="常用电子邮箱：">
                    <span>{{sizeForm.email}}</span>
                  </el-form-item>
                  <el-form-item label="关于我们：">
                    <span>{{sizeForm.about_us}}</span>
                  </el-form-item>
                  <el-form-item label="店铺状态：">
                    <span v-if="sizeForm.status==1">已开通</span>
                    <span v-else-if="sizeForm.status==-2">店铺关闭</span>
                  </el-form-item>
                  <div class="div_bottom" v-if="sizeForm.status==1">
                    <el-button size="medium" @click="open5(sizeForm,'sizeForm')" type="primary"
                               style="margin-left:25px;">关闭店铺
                    </el-button>
                  </div>
                </el-form>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px;">
            <el-col :span="24" v-if="mediulist.length>0">
              <template>
                <div class="header">媒介资质</div>
                <div class="mediumall">
                  <div class="mediumall_child" v-for="(item, i) in mediulist">
                    <el-form label-width="130px" size="small">
                      <el-form-item label="媒介资质类型：">
                        <span>{{item.type_id | aptitudeType}}</span>
                      </el-form-item>
                      <el-form-item v-if="item.type_id !== 0" label="代理时间：">
                        <span>{{item.begin_time}}至{{item.end_time}}</span>
                      </el-form-item>
                      <el-form-item label="资质图片：">
                        <ul>
                          <li v-for="(subItem,subIndex) in item.imgList" :key="subIndex">
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
                      <div v-if="item.status==0" class="div_bottom">
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
          <!-- 自传资质 -->
          <el-row style="margin-top:10px;">
            <el-col :span="24" v-if="self_honors.length>0">
              <div class="grid-content">自传资质</div>
              <div class="jop-content">
                <div class="jop_child" v-for="(item, i) in self_honors">
                  <el-form label-width="100px" size="small">
                    <el-form-item label="资质名称：">
                      <span>{{item.honor_name}}</span>
                    </el-form-item>
                    <el-form-item label="获得时间：">
                      <span>{{item.received_time}}</span>
                    </el-form-item>
                    <el-form-item label="资质图片：">
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
          <el-row>
            <el-col :span="24">
              <div class="grid-content">实名认证</div>
              <div class="user-person">
                <div class="user-main">
                  <div class="user-title">企业信息</div>
                  <div><span>公企名称：</span>{{companyinfo.company_name}}</div>
                  <div><span>统一信任代码：</span>{{companyinfo.company_codeusc}}</div>
                  <div><span>企业法人：</span>{{companyinfo.name}}</div>
                  <div><span>营业执照所在地：</span>{{companyinfo.addressName}}</div>
                  <div><span>营业执照详细地址：</span>{{companyinfo.address}}</div>
                  <div v-if="companyinfo.long_time ===1"><span>营业年限：</span>长期</div>
                  <div v-else><span>营业年限：</span>{{companyinfo.begin_time|splitSpaceF}}--{{companyinfo.end_time|splitSpaceF}}
                  </div>
                  <div><span>经营范围：</span>{{companyinfo.business_scope}}</div>
                  <div class="p_one" v-if="companyinfo.business_license">
                    <span>三证合一附件：</span>
                    <preview-pictures :href="companyinfo.business_license"/>
                  </div>
                  <div>
                    <span>第三方验证状态：</span>
                    <span class="span-item" v-if="companyinfo.accountid">已通过</span>
                    <span class="span-item" v-else>未验证</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <!-- 媒体资质 -->
          <el-row>
            <el-col :span="24">
              <div class="user-person">
                <div class="user-main">
                  <div class="user-title">企业法人信息</div>
                  <div><span>手机号：</span>{{legalForm.mobile}}</div>
                  <div><span>姓名：</span>{{legalForm.name}}</div>
                  <div><span>身份证号码：</span>{{legalForm.idno}}</div>
                  <div class="p_two" v-if="legalForm.identity_card_front">
                    <span>身份证附件：</span>
                    <ul>
                      <li>
                        <preview-pictures :href="legalForm.identity_card_front"/>
                      </li>
                      <li>
                        <preview-pictures :href="legalForm.identity_card_back"/>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <span>第三方验证状态：</span>
                    <span class="span-item" v-if="companyinfo.accountid">已通过</span>
                    <span class="span-item" v-else>未验证</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <!-- 企业对公账户信息 -->
          <el-row>
            <el-col>
              <div class="account-main">
                <div class="account-title">企业对公账户信息</div>
                <el-form :model="accountform" label-width="140px" size="small">
                  <el-form-item label="对公账户名：">
                    <span>{{accountform.company_name}}</span>
                  </el-form-item>
                  <el-form-item label="对公账户卡号：">
                    <span>{{accountform.company_cardno}}</span>
                  </el-form-item>
                  <el-form-item label="开户行名称：">
                    <span>{{accountform.company_bank}}</span>
                  </el-form-item>
                  <el-form-item label="开户支行全称：">
                    <span>{{accountform.company_subbranch}}</span>
                  </el-form-item>
                  <el-form-item label="第三方验证状态：">
                    <span class="span-item" v-if="companyinfo.accountid">已通过</span>
                    <span class="span-item" v-else>未验证</span>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
          <!-- 实名认证状态 -->
          <el-row>
            <el-col>
              <div class="realname-main">
                <div class="real-title">实名认证状态</div>
                <p>
                  <span>实名认证状态：</span>
                  <span class="span-item">{{legalForm.audit_status |auditStatus}}</span>
                </p>
                <p v-if="legalForm.audit_status==-1">
                  <span>未通过原因：</span>
                  <span class="span-item" v-if="legalForm.failure_reasons==1">法人信息有误</span>
                  <span class="span-item" v-else-if="legalForm.failure_reasons==2">企业信息有误</span>
                  <span class="span-item" v-else>法人信息有误,企业信息有误</span>
                </p>
                <p v-if="legalForm.audit_status==-1">
                  <span>原因描述：</span>{{legalForm.remarks}}
                </p>
                <p v-if="legalForm.audit_status==0" style="margin-top:20px;margin-left: 80px;">
                  <el-button type="primary" @click="open2(legalForm,'audit_status')">审核通过</el-button>
                  <el-button @click="open5(legalForm,'audit_status')" type="primary"
                             style="margin-left:25px;">审核未通过
                  </el-button>
                </p>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-tab-pane>
      <!--入驻技能-->
      <el-tab-pane label="入驻技能" name="third">
        <template>
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column prop="cat_one" label="一级分类名称" min-width="100" align="center"/>
            <el-table-column label="二级分类名称" min-width="160" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.cat_two">
                            <span v-for="(item,i) in scope.row.cat_two">
                                  {{item}}，
                            </span>
                </div>
                <span v-else></span>
              </template>
            </el-table-column>
            <el-table-column label="三级分类名称" min-width="460" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.cat_three">
                            <span v-for="(item,i) in scope.row.cat_three">
                                  {{item}}，
                            </span>
                </div>
                <span v-else></span>
              </template>
            </el-table-column>
            <el-table-column prop="cat_money" label="保证金" min-width="100" align="center"/>
            <el-table-column label="保证金状态" min-width="100" align="center">
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
    <!-- 审核弹窗 -->
    <el-dialog :title="dialogTitle" width="500px" @close="handleClose" class="demo-ruleForm"
               :visible.sync="dialogFormVisible">
      <el-form :model="form" status-icon :rules="rules" label-position="right" label-width="120px" ref="ValidateForm">
        <el-form-item label="关闭原因：">
          <el-input :rows="3" type="textarea" v-model="form.fail_note" placeholder="关闭原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="open1()">审核未通过</el-button>
      </div>
    </el-dialog>
    <!-- 实名认证审核弹窗 -->
    <el-dialog :title="dialogTitle" width="500px" @close="handleClose" class="demo-ruleForm"
               :visible.sync="dialogFormVisible1">
      <el-form :model="formdata1" status-icon :rules="rules" label-position="right" label-width="120px"
               ref="ValidateForm" size="small">
        <el-form-item label="原因描述：">
          <el-checkbox-group v-model="formdata1.fail_reasons">
            <el-checkbox label="1">企业信息有误</el-checkbox>
            <el-checkbox label="2">法人信息有误</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="不通过原因：">
          <el-input :rows="3" type="textarea" v-model="formdata1.fail_note" placeholder="不通过原因"></el-input>
          <p>请描述具体的错误原因，以便用户修改。</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="open1()">审核未通过</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {formatDate} from '@/utils/date';
  import {shopdetail, realverify, companyverify, shopinfoverify, mediumverify} from '@/api/shoplist/show';
  import {businessverify} from '@/api/shoplist/company';
  import {returnAddress} from '@/utils/commonData'
  import {imgUrl} from '@/utils/commonData';

  export default {
    name: 'beencompanyDetail',
    data() {
      return {
        rules: {
          fail_note: [
            {required: true, message: "原因描述不能为空"}
          ],
          fail_reasons: [
            {required: true, message: "未通过原因不能为空"}
          ],
        },
        //企业对公账户信息
        accountform: {
          company_name: '',
          company_cardno: '',
          company_bank: '',
          company_subbranch: '',
        },
        //企业法人信息
        legalForm: {
          mobile: '',
          idno: '',
          name: '',
          identity_card_front: '',
          identity_card_back: '',
          id: null, //实名认证最后审核id
          audit_status: null,//实名认证审核状态验证
          failure_reasons: null, //未通过原因
          remarks: '', //原因描述
        },
        //企业信息
        companyinfo: {
          company_name: '',
          name: '',
          company_codeusc: '',
          address: '',
          begin_time: '',
          end_time: '',
          business_scope: '',
          business_license: '',
          accountid: '',
          long_time: null
        },
        //自传资质
        self_honors: [],
        //媒介资质
        mediulist: [],
        //店铺基本资料
        sizeForm: {
          type_id: null,
          store_name: '',
          logo: '',
          contacts_name: '',
          phone: '',
          email: '',
          address: '',
          about_us: '',
          status: null,
          remarks: '',
          company_type_id: '',
          scale_id: '',
          close_reason: '',
          company_name: ''
        },
        //店铺和媒介资质审核未通过弹框数据
        form: {
          fail_note: '',
        },
        //实名认证审核未通过弹框数据
        formdata1: {
          fail_reasons: null,
          fail_note: '',
        },
        dialogtype: '',
        dialogTitle: '',
        dialogFormVisible: false,
        dialogFormVisible1: false,
        activeName: 'first',
        tableData: [], //入驻技能
        imgurl: 'http://ltzm1.oss-cn-shenzhen.aliyuncs.com/',
        companyDetail: {}
      };
    },
    created() {
      //获取传递过来的id
      this.countid = this.$route.query["id"];
      this.activeName = this.$route.query["type"];
      console.log('---------beenlist-companyDetail-------------')
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
    },
    methods: {
      examineFun(message = '') {
        if (message) {
          this.$message.error(message);
        } else {
          this.$message.success('操作成功');
        }
      },
      edit(id) {      //初始化接口
        shopdetail(id).then((result) => {
          const {sign_account, media_aptitude, self_honors, skills} = result;
          let data = returnAddress(sign_account.sign_data || {});
          let imgArr = [];
          for (let i = 0; i < media_aptitude.length; i++) {
            const {img1, img2, img3} = media_aptitude[i];
            imgArr = [img1, img2, img3].filter(item => item)
            if (media_aptitude[i].begin_time) {
              media_aptitude[i].begin_time = media_aptitude[i].begin_time.split(' ')[0];
              media_aptitude[i].end_time = media_aptitude[i].end_time.split(' ')[0];
            }
            media_aptitude[i].imgList = imgArr;
            media_aptitude[i].preview = imgArr.map(item => imgUrl + item)
          }
          this.companyDetail = result;
          //店铺基本资料
          this.sizeForm = {
            type_id: result.type_id,
            store_name: result.store_name,
            logo: result.logo,
            contacts_name: result.contacts_name,
            phone: result.phone,
            email: result.email,
            address: result.address,
            about_us: result.about_us,
            status: result.status,
            remarks: result.remarks,
            close_reason: result.close_reason,
            company_type_id: result.company_type_id,
            scale_id: result.scale_id,
            company_name: result.company_name
          };
          if (sign_account) {
            //企业法人信息
            this.legalForm = {
              mobile: sign_account.mobile,
              idno: sign_account.idno,
              name: sign_account.name,
              id: sign_account.id, //实名认证最后审核id
              audit_status: sign_account.audit_status,//实名认证审核状态验证
              failure_reasons: sign_account.failure_reasons, //未通过原因
              remarks: sign_account.remarks, //原因描述
            };
            //企业信息
            this.companyinfo = {
              accountid: sign_account.accountid,
              company_name: sign_account.company_name,
              name: sign_account.name,
              company_codeusc: sign_account.company_codeusc,

              address: data.address,
              addressName: data.addressName,
              begin_time: data.begin_time,
              end_time: data.end_time,
              business_scope: data.business_scope,
              business_license: data.business_license,
              long_time: data.long_time
            };
            //企业对公账户信息
            this.accountform = {
              company_name: sign_account.company_name,
              company_cardno: sign_account.company_cardno,
              company_bank: sign_account.company_bank,
              company_subbranch: sign_account.company_subbranch,
            };
            if (data) {
              this.legalForm.identity_card_front = data.identity_card_front;
              this.legalForm.identity_card_back = data.identity_card_back;
            }
          }
          this.mediulist = media_aptitude;//媒介资质
          this.self_honors = self_honors;//自传资质
          this.tableData = skills; //入驻技能
        }).catch((err) => {
          console.log(err)
        })
      },
      //审核未通过
      open5(item, type) {
        this.dialogtype = type;
        if (type == 'sizeForm') {
          //关闭店铺审核
          this.dialogFormVisible = true;
          this.dialogTitle = '店铺审核';
          this.form.id = this.countid;
          this.form.fail_note = '';
        } else if (type == 'audit_status') {
          //实名认证审核未通过
          this.dialogFormVisible1 = true;
          this.dialogTitle = '实名认证审核';
          this.formdata1.id = item.id;
          this.formdata1.fail_reasons = null;
          this.formdata1.fail_note = '';
        } else if (type == 'medium') {
          //隶属媒体公司审核未通过
          this.dialogFormVisible = true;
          this.dialogTitle = '媒介资质审核';
          this.form.id = item.id;
          this.form.fail_note = '';
        }
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
          realverify(param).then((result) => {
            this.examineFun();
            this.edit(this.countid);
          }).catch((err) => {
            console.log(err)
          })
        } else if (typestatus == 'sizeForm') {
          //开通审核成功
          let param = {
            id: this.countid,
            type: 4,
            fail_note: null
          }
          shopinfoverify(param).then((result) => {
            this.examineFun();
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
          mediumverify(param).then((result) => {
            this.examineFun();
            this.edit(this.countid);
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      //审核未通过
      open1() {
        this.$refs.ValidateForm.validate((valid) => {
          if (valid) {
            //调接口
            if (this.dialogtype == 'sizeForm') {
              //关闭店铺
              let param = {
                id: this.countid,
                type: 3,
                fail_note: this.form.fail_note
              }
              shopinfoverify(param).then((result) => {
                this.examineFun()
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
              mediumverify(param).then((result) => {
                this.examineFun()
                this.edit(this.countid);
              }).catch((err) => {
                console.log(err)
              })
              this.dialogFormVisible = false;
            } else if (this.dialogtype == 'audit_status') {
              //实名认证审核未通过
              let {fail_reasons = [], fail_note = ''} = JSON.parse(JSON.stringify(this.formdata1));
              let param = {
                id: this.form.id,
                type: 0,
                fail_reasons: fail_reasons.toString(),
                fail_note: fail_note
              }
              businessverify(param).then((result) => {
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

      handleClick(tab, event) {

      },
      handleClose() {//表单关闭时事件
        //this.$refs.ValidateForm.resetFields();
      },
      handleClose1() {
        //this.$refs.ValidateForm1.resetFields();
      },
      handleClose2() {
        //this.$refs.ValidateForm2.resetFields();
      }
    },
    computed: {
      companyAddress() {
        const {province, city, district} = this.companyDetail;
        let params = {
          bl_province: province,
          bl_city: city,
          bl_district: district
        };
        let item = returnAddress(params);
        return item.addressName;
      }
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

        //实名认证状态
        .realname-main {
          background: #f2f2f2;
          padding: 0 12px 50px 12px;

          .real-title {
            margin-left: 10px;
            margin-bottom: 7px;
          }

          p {
            margin: 0;
            font-size: 14px;
            line-height: 30px;

            span {
              color: #606266;
              display: inline-block;
              width: 130px;
              text-align: right;
              margin-left: 17px;
              padding-right: 12px;
            }

            .span-item {
              width: auto;
              color: #000;
              text-align: left;
              margin-left: 0;
            }
          }
        }

        //企业对公账户信息
        .account-main {
          background: #f2f2f2;
          padding: 15px 12px;

          .account-title {
            margin-left: 10px;
            margin-bottom: 7px;
          }

          .el-form {
            border-bottom: 1px solid #797979;
            padding-left: 7px;
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

            .el-form {
              .el-image {
                width: 200px;
              }
            }
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

        //企业信息css
        .user-person {

          position: relative;
          background: #f2f2f2;
          padding: 15px 12px;

          .user-main {
            border-bottom: 1px solid #797979;

            .user-title {
              margin-left: 10px;
              font-size: 16px;
              line-height: 30px;
            }

            div {
              margin: 0;
              font-size: 14px;
              line-height: 30px;

              span {
                color: #606266;
                display: inline-block;
                width: 140px;
                text-align: right;
                margin-left: 17px;
                padding-right: 12px;
              }

              .span-item {
                text-align: left;
              }
            }

            .p_one {
              overflow: auto;

              span {
                float: left;
              }

              .el-image {
                float: left;
                width: 108px;
                padding: 4px;
              }
            }

            .p_two {
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
                  width: 180px;
                  padding: 4px;
                }
              }
            }
          }

        }
      }
    }
  }
</style>
