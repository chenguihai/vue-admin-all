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
                <el-form ref="form" :model="baseInfo" label-width="130px" size="mini">
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
                  <el-form-item label="企业名称：">
                    <span>{{baseInfo.company_name}}</span>
                  </el-form-item>
                  <el-form-item label="企业类型：">
                    <span>{{baseInfo.company_type_id}}</span>
                  </el-form-item>
                  <el-form-item label="公司规模：">
                    <span>{{baseInfo.scale_id}}</span>
                  </el-form-item>
                  <el-form-item label="公司所在地：">
                    <span>{{companyAddress}}</span>
                  </el-form-item>
                  <el-form-item label="详细地址：">
                    <span>{{baseInfo.address}}</span>
                  </el-form-item>
                  <el-form-item label="常用联系人姓名：">
                    <span>{{baseInfo.contacts_name}}</span>
                  </el-form-item>
                  <el-form-item label="常用联系电话：">
                    <span>{{baseInfo.phone}}</span>
                  </el-form-item>
                  <el-form-item label="常用电子邮箱：">
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
                  <div class="div_bottom" v-if="baseInfo.status==0">
                    <el-button size="medium" type="primary" @click="firstInfoSuccess">店铺审核通过
                    </el-button>
                    <el-button size="medium" @click="firstInfoFail" type="primary"
                               style="margin-left:25px;">店铺审核未通过
                    </el-button>
                  </div>
                </el-form>
              </div>
            </el-col>
          </el-row>
          <!--媒介资质-->
          <el-row style="margin-top:20px;" v-if="mediaList.length>0">
            <el-col :span="24">
              <template>
                <div class="header">媒介资质</div>
                <div class="mediumall">
                  <div class="mediumall_child" v-for="(item, i) in mediaList" :key="i">
                    <el-form label-width="130px" size="mini">
                      <el-form-item label="媒介资质类型：">
                        <span>{{item.type_id | aptitudeType}}</span>
                      </el-form-item>
                      <el-form-item label="代理时间：" v-if="item.type_id!== 0">
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
                      <el-form-item label="审核时间：" v-if="item.status !== 0">
                        <span>{{item.updated_at}}</span>
                      </el-form-item>
                      <el-form-item label="未通过原因：" v-if="item.status==-1">
                        <span>{{item.remarks}}</span>
                      </el-form-item>
                      <div v-if="item.status==0" class="div_bottom">
                        <el-button size="medium" type="primary" @click="firstMediaSuccess(item.id)">审核通过</el-button>
                        <el-button size="medium" @click="firstMediaFail(item.id)" type="primary"
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
          <el-row style="margin-top:10px;" v-if="selfHonors.length>0">
            <el-col :span="24">
              <div class="grid-content">自传资质</div>
              <div class="jop-content">
                <div class="jop_child" v-for="(item,index) in selfHonors" :key="index">
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
      <!--实名认证-->
      <el-tab-pane label="实名认证" name="second">
        <el-main>
          <!--实名认证-->
          <el-row>
            <el-col :span="24">
              <div class="grid-content">实名认证</div>
              <div class="user-person">
                <div class="user-main">
                  <div class="user-title">企业信息</div>
                  <p><span>公企名称：</span>{{signAccount.company_name}}</p>
                  <p><span>统一信任代码：</span>{{signAccount.company_codeusc}}</p>
                  <p><span>企业法人：</span>{{signAccount.name}}</p>
                  <p><span>营业执照所在地：</span>{{signData.addressName}}</p>
                  <p><span>营业执照详细地址：</span>{{signData.address}}</p>
                  <p v-if="signData.long_time ===1"><span>营业年限：</span>长期</p>
                  <p v-else><span>营业年限：</span>{{signData.begin_time|splitSpaceF}}--{{signData.end_time|splitSpaceF}}</p>
                  <p><span>经营范围：</span>{{signData.business_scope}}</p>
                  <p class="p_one" v-if="signData.business_license">
                    <span>三证合一附件：</span>
                    <preview-pictures :href="signData.business_license"/>
                  </p>
                  <p>
                    <span>第三方验证状态:</span>
                    <span class="span-item" v-if="signAccount.accountid">已通过</span>
                    <span class="span-item" v-else>未验证</span>
                  </p>
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
                  <p><span>手机号：</span>{{signAccount.mobile}}</p>
                  <p><span>姓名：</span>{{signAccount.name}}</p>
                  <p><span>身份证号码：</span>{{signAccount.idno}}</p>
                  <div class="p_two">
                    <span>身份证附件：</span>
                    <ul v-if="signData.identity_card_front">
                      <li>
                        <preview-pictures :href="signData.identity_card_front"/>
                      </li>
                      <li>
                        <preview-pictures :href="signData.identity_card_back"/>
                      </li>
                    </ul>
                  </div>
                  <p>
                    <span>第三方验证状态：</span>
                    <span class="span-item" v-if="signAccount.accountid">已通过</span>
                    <span class="span-item" v-else>未验证</span>
                  </p>
                </div>
              </div>
            </el-col>
          </el-row>
          <!-- 企业对公账户信息 -->
          <el-row>
            <el-col>
              <div class="account-main">
                <div class="account-title">企业对公账户信息</div>
                <el-form :model="signAccount" label-width="140px" size="mini">
                  <el-form-item label="对公账户名：">
                    <span>{{signAccount.company_name}}</span>
                  </el-form-item>
                  <el-form-item label="对公账户卡号：">
                    <span>{{signAccount.company_cardno}}</span>
                  </el-form-item>
                  <el-form-item label="开户行名称：">
                    <span>{{signAccount.company_bank}}</span>
                  </el-form-item>
                  <el-form-item label="开户支行全称：">
                    <span>{{signAccount.company_subbranch}}</span>
                  </el-form-item>
                  <el-form-item label="第三方验证状态：">
                    <span class="span-item" v-if="signAccount.accountid">已通过</span>
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
                  <span class="span-item">{{signAccount.audit_status | auditStatus}}</span>
                </p>
                <p v-if="signAccount.audit_status==-1">
                  <span>未通过原因：</span>
                  <span class="span-item" v-if="signAccount.failure_reasons==1">法人信息有误</span>
                  <span class="span-item" v-else-if="signAccount.failure_reasons==2">企业信息有误</span>
                  <span class="span-item" v-else>法人信息有误,企业信息有误</span>
                </p>
                <p v-if="signAccount.audit_status==-1">
                  <span>原因描述：</span>{{signAccount.remarks}}
                </p>
                <p v-if="signAccount.audit_status==0" style="margin-top:20px;margin-left: 80px;">
                  <el-button type="primary" @click="secondItemSuccess">审核通过</el-button>
                  <el-button @click="secondItemFail" type="primary"
                             style="margin-left:25px;">
                    审核未通过
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
            :data="skillsList"
            border
            style="width: 100%">
            <el-table-column prop="cat_one" label="一级分类名称" min-width="100" align="center"/>
            <el-table-column label="二级分类名称" min-width="160" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.cat_two">
                            <span v-for="(item,i) in scope.row.cat_two" :key="i">
                                  {{item}} <span>，</span>  
                            </span>
                </div>
                <span v-else></span>
              </template>
            </el-table-column>
            <el-table-column label="三级分类名称" min-width="460" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.cat_three">
                            <span v-for="(item,i) in scope.row.cat_three" :key="i">
                                  {{item}}<span>，</span>  
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
    <refusal-reasons
      v-if="refusalFlag"
      @emitSubmit="_handleRefusal"
      @emitClose="_handleClose"
    />
    <!-- 实名认证审核弹窗 -->
    <real-auth v-if="realFlag" @close="_handleClose" @submit="_handleRealFom"></real-auth>
  </div>

</template>
<script>
  import RefusalReasons from '@/components/RefusalReasons';
  import {shopdetail, realverify, companyverify, shopinfoverify, mediumverify} from '@/api/shoplist/show';
  import RealAuth from './realAuth';
  import {returnAddress} from '@/utils/commonData'
  import {imgUrl} from '@/utils/commonData';

  export default {
    name: 'companyDetail',
    components: {RealAuth, RefusalReasons},
    data() {
      return {
        signAccount: {}, //实名认证
        signData: {},
        selfHonors: [],//自传资质
        mediaList: [], //媒介资质
        skillsList: [], //入驻技能
        baseInfo: {}, //店铺基本资料
        mediaId: 0,
        //实名认证审核未通过弹框数据
        dialogType: '',
        refusalFlag: false, //拒绝原因
        realFlag: false, //实名认证
        activeName: 'first',
      };
    },
    created() {
      //获取传递过来的id
      this.countid = this.$route.query["id"];
      this.activeName = this.$route.query["type"];
      console.log('===========shoplist-companyDetail-=========')
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
      secondItemSuccess() {
        this.realVerifyHttp();
      },
      secondItemFail() {
        this.realFlag = true;
      },
      _handleRealFom(params) {
        this.realVerifyHttp(params, 0);
      },
      _handleClose() {
        this.realFlag = false;
        this.refusalFlag = false;
      },
      _handleRefusal(reason) {
        if (this.dialogType === 'info') {
          this.shopInfoVerifyHttp(2, reason);
        } else {
          this.mediumVerifyHttp(0, reason);
        }
      },
      detail(id) {   //初始化接口
        shopdetail(id).then((res) => {
          const {sign_account, media_aptitude, self_honors, skills} = res;
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
          this.baseInfo = res;//店铺基本资料
          this.signAccount = sign_account || {};//实名认证
          this.mediaList = media_aptitude || [];//媒介资质
          this.selfHonors = self_honors || [];//自传资质
          this.skillsList = skills || [];//入驻技能
          this.signData = returnAddress(sign_account.sign_data || {});
        }).catch((err) => {
          console.log(err)
        })
      },
      realVerifyHttp(item = {}, type = 1) { //实名认证
        let param = {
          ...item,
          id: this.signAccount.id,//	是	int	实名认证id
          type: type,//	是	int	1审核通过 0 审核未通过
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
      examineFun(message) {
        if (message) {
          this.$message.error(message);
        } else {
          this.$message.success('操作成功');
        }
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
      mediumVerifyHttp(type = 1, fail_note = '') {//媒介资质审核未通过
        let param = {
          id: this.mediaId,//int	媒介资质id
          type: type,//是	int	1审核通过 0 审核未通过
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
      handleClick(tab, event) {

      }
    },
    computed: {
      companyAddress() {
        const {province, city, district} = this.baseInfo;
        let params = {bl_province: province, bl_city: city, bl_district: district};
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
              color: #000;
              width: auto;
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
            float: left;
            padding-top: 15px;
            width: 49%;
            border-bottom: 1px solid #797979;

            .el-form {
              .el-image {
                width: 200px;
              }
            }
          }

          .jop_child:nth-child(4n+4) {
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

            & > p, & > div {
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
