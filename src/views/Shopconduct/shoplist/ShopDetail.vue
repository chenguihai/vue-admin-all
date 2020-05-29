<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card">
      <!-- 店铺资料 -->
      <el-tab-pane label="店铺资料" name="first">
        <el-main>
          <!-- 店铺基本信息 -->
          <el-row>
            <el-col :span="24">
              <div class="grid-content">店铺基本信息</div>
              <div class="shop-content">
                <el-form ref="form" :model="baseInfo" label-width="100px" size="mini">
                  <el-form-item label="店铺类型：">
                    <span v-if="baseInfo.type_id==1">个人</span>
                    <span v-if="baseInfo.type_id==2">企业</span>
                  </el-form-item>
                  <el-form-item label="店铺名称：">
                    <span>{{baseInfo.store_name}}</span>
                  </el-form-item>
                  <el-form-item v-if="baseInfo.logo" label="店铺logo：">
                    <div class="block" style="width:200px;">
                      <preview-pictures :href="baseInfo.logo"/>
                    </div>
                  </el-form-item>
                  <el-form-item label="联系地址：">
                    <span>{{baseInfo.address}}</span>
                  </el-form-item>
                  <el-form-item label="姓名：">
                    <span>{{baseInfo.contacts_name}}</span>
                  </el-form-item>
                  <el-form-item label="联系电话：">
                    <span>{{baseInfo.phone}}</span>
                  </el-form-item>
                  <el-form-item label="电子邮箱：">
                    <span>{{baseInfo.email}}</span>
                  </el-form-item>
                  <el-form-item label="关于我们：">
                    <span>{{baseInfo.about_us}}</span>
                  </el-form-item>
                  <el-form-item label="审核状态：">
                    <span>{{baseInfo.status | auditStatus}}</span>
                  </el-form-item>
                  <el-form-item v-if="baseInfo.status==-1" label="未通过原因：">
                    <span class="span-item">{{baseInfo.remarks}}</span>
                  </el-form-item>
                  <el-form-item v-if="baseInfo.status==-2" label="关闭原因：">
                    <span class="span-item">{{baseInfo.close_reason}}</span>
                  </el-form-item>
                  <div v-if="baseInfo.status==0" class="div_bottom">
                    <el-button size="medium" type="primary" @click="firstInfoSuccess">店铺审核通过</el-button>
                    <el-button size="medium" @click="firstInfoFail" type="primary"
                               style="margin-left:25px;">店铺审核未通过
                    </el-button>
                  </div>
                </el-form>
              </div>
            </el-col>
          </el-row>
          <!-- 媒介资质 -->
          <el-row style="margin-top:20px;" v-if="mediaList.length > 0">
            <el-col :span="24">
              <template>
                <div class="header">媒介资质</div>
                <div class="mediumall">
                  <div class="mediumall_child" v-for="(item, i) in mediaList" :key="i">
                    <el-form label-width="130px" size="mini">
                      <el-form-item label="媒介资质类型：">
                        <span>{{item.type_id |aptitudeType}}</span>
                      </el-form-item>
                      <el-form-item label="代理时间：" v-if="item.type_id !== 0">
                        <span>{{item.begin_time |splitSpaceF}}至{{item.end_time|splitSpaceF}}</span>
                      </el-form-item>
                      <el-form-item label="资质图片：">
                        <ul>
                          <li v-for="(subItem,subIndex) in item.imgList ||[]" :key="subIndex">
                            <preview-pictures :href="subItem"/>
                          </li>
                        </ul>
                      </el-form-item>
                      <el-form-item label="审核状态：">
                        <span>{{item.status | auditStatus}}</span>
                      </el-form-item>
                      <el-form-item label="审核时间：" v-if="item.status !==0">
                        <span>{{item.updated_at}}</span>
                      </el-form-item>
                      <el-form-item label="未通过原因：" v-if="item.status==-1">
                        <span>{{item.remarks}}</span>
                      </el-form-item>
                      <div class="div_bottom" v-if="item.status==0">
                        <el-button size="medium" type="primary" @click="firstMediaSuccess(item.id)">审核通过</el-button>
                        <el-button size="medium" @click="firstMediaFail(item.id)" type="primary"
                                   style="margin-left:25px;">
                          审核未通过
                        </el-button>
                      </div>
                    </el-form>
                  </div>
                </div>
              </template>
            </el-col>
          </el-row>
          <!-- 隶属媒体-->
          <el-row style="margin-top:10px;" v-if="mediaCompany.company_name">
            <el-col :span="24">
              <div class="grid-content">隶属媒体公司</div>
              <div class="user-person">
                <div><span>公司姓名：</span>{{mediaCompany.company_name}}</div>
                <div>
                  <span>证件类型：</span>
                  <span class="span-item" v-if="mediaCompany.type_id==1">营业执照+工牌</span>
                  <span class="span-item" v-else>营业执照+名片</span>
                </div>
                <div class="p_one">
                  <span>证件图片：</span>
                  <ul>
                    <li v-for="(subItem,subIndex) in mediaCompany.imgList ||[]" :key="subIndex">
                      <preview-pictures :href="subItem"/>
                    </li>
                  </ul>
                </div>
                <div>
                  <span>审核状态：</span>
                  <span class="span-item">{{mediaCompany.status | auditStatus}}</span>
                </div>
                <div v-if="mediaCompany.status==-1">
                  <span>未通过原因：</span>
                  <i class="text span-item">{{mediaCompany.remarks}}</i>
                </div>
                <div v-if="mediaCompany.status==0" style="margin-top:20px;margin-left: 80px;padding-bottom: 10px;">
                  <el-button type="primary" @click="subMediaSuccess">审核通过</el-button>
                  <el-button @click="subMediaFail" type="primary" style="margin-left:25px;">审核未通过
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
          <el-row style="margin-top:10px;" v-if="selfHonors.length>0">
            <el-col :span="24">
              <div class="grid-content">自传资质</div>
              <div class="jop-content">
                <div class="jop_child" v-for="(item, i) in selfHonors" :key="i">
                  <el-form label-width="100px" size="mini">
                    <el-form-item label="资质名称：">
                      <span>{{item.honor_name}}</span>
                    </el-form-item>
                    <el-form-item label="获得时间：">
                      <span>{{item.received_time}}</span>
                    </el-form-item>
                    <el-form-item label="资质图片：">
                      <div class="block" style="width:200px;" v-if="item.honor_img">
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
      <!-- 实名认证 -->
      <el-tab-pane label="实名认证" name="second">
        <el-main>
          <el-row style="margin-top:20px;">
            <el-col :span="24">
              <div class="grid-content">实名认证（个人）</div>
              <div class="user-person">
                <div><span>姓名：</span>{{signAccount.name}}</div>
                <div><span>身份证号码：</span>{{signAccount.idno}}</div>
                <div><span>手机号：</span>{{signAccount.mobile}}</div>
                <div class="p_one">
                  <span>身份证图片：</span>
                  <ul v-if="signData.identity_card_front">
                    <li>
                      <preview-pictures :href="signData.identity_card_front"/>
                    </li>
                    <li>
                      <preview-pictures :href="signData.identity_card_back"/>
                    </li>
                  </ul>
                </div>
                <div><span>第三方验证状态：</span>
                  <span class="span-item" v-if="signAccount.accountid">已通过</span>
                  <span class="span-item" v-else>未验证</span>
                </div>
                <div>
                  <span>实名认证状态：</span>
                  <span class="span-item">{{signAccount.audit_status | auditStatus}}</span>
                </div>
                <div v-if="signAccount.audit_status==-1"><span>未通过原因：</span>{{signAccount.remarks}}</div>
                <div v-if="signAccount.audit_status==0" style="margin-top:20px;margin-left: 80px;padding-bottom: 60px;">
                  <el-button type="primary" @click="secondItemSuccess">审核通过</el-button>
                  <el-button @click="secondItemFail" type="primary" style="margin-left:25px;">审核未通过
                  </el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-tab-pane>
      <!-- 入驻技能 -->
      <el-tab-pane label="入驻技能" name="third">
        <template>
          <el-table
            :data="skillsList"
            border
            style="width: 100%">
            <el-table-column prop="cat_one" label="一级分类名称" min-width="160" align="center"/>
            <el-table-column label="二级分类名称" min-width="160" align="center">
              <template slot-scope="scope">
                {{scope.row.cat_two.toString()}}
              </template>
            </el-table-column>
            <el-table-column label="三级分类名称" min-width="160" align="center">
              <template slot-scope="scope">
                {{scope.row.cat_three.toString()}}
              </template>
            </el-table-column>
            <el-table-column prop="cat_money" label="保证金" min-width="100" align="center">
            </el-table-column>
            <el-table-column label="保证金状态" min-width="140" align="center">
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
    <refusal-reasons v-if="refusalFlag" @emitSubmit="_handleRefusal" @emitClose="_handleClose"/>
  </div>

</template>

<script>
  import RefusalReasons from '@/components/RefusalReasons';
  import {shopdetail, realverify, companyverify, shopinfoverify, mediumverify} from '@/api/shoplist/show';
  import {imgUrl} from '@/utils/commonData';

  export default {
    name: 'ShopDetail',
    components: {RefusalReasons},
    data() {
      return {
        jobList: [],//工作经历
        selfHonors: [], //自传之资
        mediaList: [],  //媒介资质
        baseInfo: {}, //店铺基本资料
        skillsList: [], //入驻技能
        signAccount: {},//实名认证
        signData: {},
        mediaCompany: {},//媒体公司
        dialogType: '',
        refusalFlag: false,
        activeName: 'first',
        mediaId: 0,
      };
    },
    created() {
      //获取传递过来的id
      const {id = 0, type = ''} = this.$route.query
      this.countid = id;
      this.activeName = type;
      console.log('------shoplist-shopdetail--------')

    },
    mounted() {
      this.$nextTick(() => {
        this.detail(this.countid)
      })
    },
    methods: {
      firstInfoSuccess() {
        this.shopInfoVerifyHttp();
      },
      firstInfoFail() {
        this.dialogType = 'info';
        this.refusalFlag = true;
      },
      firstMediaSuccess(id) {
        this.mediaId = id;
        this.mediumVerifyHttp()
      },
      firstMediaFail(id) {
        this.mediaId = id;
        this.refusalFlag = true;
        this.dialogType = 'media';
      },
      subMediaSuccess() {
        this.companyVerifyHttp()
      },
      subMediaFail() {
        this.refusalFlag = true;
        this.dialogType = 'company';
      },
      secondItemSuccess() {
        this.realVerifyHttp();
      },
      secondItemFail() {
        this.dialogType = 'real';
        this.refusalFlag = true;
      },
      _handleClose() {
        this.refusalFlag = false;
      },
      _handleRefusal(reason) {
        if (this.dialogType === 'info') {
          this.shopInfoVerifyHttp(2, reason);
        } else if (this.dialogType === 'real') {
          this.realVerifyHttp(0, reason);
        } else if (this.dialogType === 'company') {
          this.companyVerifyHttp(0, reason);
        } else {
          this.mediumVerifyHttp(0, reason);
        }
      },
      detail(id) {//初始化接口
        shopdetail(id).then((res) => {
          let {skills, media_aptitude, media_company = {}, work_experience, self_honors, sign_account} = res;
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
            const {img_license, img_certify} = media_company;
            let imgList = [img_license, img_certify]
            media_company.imgList = imgList;
            media_company.preview = imgList.map(item => imgUrl + item)
          } else {
            media_company.imgList = [];
            media_company.preview = []
          }
          this.baseInfo = res; //店铺基本资料
          this.skillsList = skills || []; //入驻技能
          this.mediaList = media_aptitude; //媒介资质
          this.mediaCompany = media_company || {};//隶属媒体公司
          this.jobList = work_experience || []; //工作经历
          this.selfHonors = self_honors; //自传资质
          this.signAccount = sign_account || {};//实名认证
          this.signData = this.signAccount.sign_data || {}
        }).catch((err) => {
          console.log(err)
        })
      },
      companyVerifyHttp(type = 1, fail_note = '') {
        let param = {
          id: this.mediaCompany.id,//	是	int	隶属媒体公司id
          type: type,//	是	int	1审核通过 审核未通过
          fail_note: fail_note,//	否	string	审核未通过原因
        }
        companyverify(param).then((res) => {
          if (res.code === 1) {
            this._handleClose();
            this.examineFun();
            this.detail(this.countid);
          } else {
            this.examineFun(res.data);
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      mediumVerifyHttp(type = 1, fail_note = '') {//媒介资质审核未通过
        let param = {
          id: this.mediaId,//int	媒介资质id
          type: type,//是	int	1审核通过  0 审核未通过
          fail_note: fail_note //否	string	审核未通过原因
        }
        mediumverify(param).then((res) => {
          if (res.code === 1) {
            this._handleClose();
            this.examineFun();
            this.detail(this.countid);
          } else {
            this.examineFun(res.data);
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      realVerifyHttp(type = 1, fail_note = '') { //实名认证
        let param = {
          id: this.signAccount.id,//	是	int	实名认证id
          type: type,//	是	int	1审核通过 0审核未通过
          fail_note: fail_note //审核未通过备注
        }
        realverify(param).then((res) => {
          if (res.code === 1) {
            this._handleClose();
            this.examineFun();
            this.detail(this.countid);
          } else {
            this.examineFun(res.data);
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      shopInfoVerifyHttp(type = 1, fail_note = '') {//店铺基本信息审核未通过
        let param = {
          id: +this.countid,//	是	int	店铺id
          type: type,//	是	int	1审核通过 2 审核未通过 3关闭店铺 4开通店铺
          fail_note: fail_note,//	否	string	审核未通过原因
          // close_note: '',//	否	string	关闭店铺原因
        }
        shopinfoverify(param).then((res) => {
          if (res.code === 1) {
            this._handleClose();
            this.examineFun();
            this.detail(this.countid);
          } else {
            this.examineFun(res.data);
          }
        }).catch((err) => {
          console.log(err)
        })
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

          .jop_child:nth-child(2n+1) {
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

          & > p, & > div {
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
