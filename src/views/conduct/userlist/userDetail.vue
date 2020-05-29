<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="用户基本信息" name="first">
        <el-main>
          <el-row>
            <el-col :span="24">
              <div class="grid-content">用户基本信息</div>
              <div class="t-content">
                <el-col :span="4">
                  <div class="demo-type">
                    <img v-if="userInfo.avatar" :src="userInfo.avatar |previewPicture" />
                    <img v-else src="@/assets/images/icon_sign.jpg" />
                  </div>
                  <span class="phone">{{userInfo.mobile}}</span>
                </el-col>
                <el-col :span="20" style="padding-bottom: 30px;padding-top: 10px;">
                  <div class="user">
                    <ul>
                      <li>
                        <span class="user_info">用户编号：</span>
                        <span class="user_item">{{userInfo.id}}</span>
                      </li>
                      <li>
                        <span class="user_info">用户昵称：</span>
                        <span class="user_item">{{userInfo.nick_name}}</span>
                      </li>
                      <li>
                        <span class="user_info">姓名：</span>
                        <span
                          class="user_item"
                        >{{signAccount.status === 1? signAccount.name:signAccount.company_name}}</span>
                      </li>
                      <li>
                        <span class="user_info">账户余额：</span>
                        <span
                          class="user_item"
                          v-if="userInfo.user_account"
                        >{{userInfo.user_account.money}}</span>
                      </li>
                      <li>
                        <span class="user_info">生日：</span>
                        <span class="user_item">{{userInfo.birthday | ymdFilter}}</span>
                      </li>
                      <li>
                        <span class="user_info">联系地址：</span>
                        <span class="user_item">{{userInfo.address}}</span>
                      </li>
                      <li>
                        <span class="user_info">联系电话：</span>
                        <span class="user_item">{{userInfo.mobile}}</span>
                      </li>
                      <li>
                        <span class="user_info">QQ：</span>
                        <span class="user_item"></span>
                      </li>
                      <li>
                        <span class="user_info">注册时间：</span>
                        <span class="user_item">{{userInfo.reg_time}}</span>
                      </li>
                      <li>
                        <span class="user_info">微信：</span>
                        <span class="user_item"></span>
                      </li>
                      <li>
                        <span class="user_info">用户来源：</span>
                        <span class="user_item"></span>
                      </li>
                      <li>
                        <span class="user_info">email：</span>
                        <span class="user_item">{{userInfo.email}}</span>
                      </li>
                    </ul>
                  </div>
                </el-col>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top:30px;">
            <el-col :span="24">
              <template>
                <div class="header">银行卡管理</div>
                <div class="bankall">
                  <el-table :data="bankInfo" border style="width: 100%">
                    <el-table-column prop="bankname" label="开户行名称" align="center" />
                    <el-table-column prop="banknumber" label="银行卡账号" align="center" />
                    <el-table-column prop="name" label="开户户名" align="center" />
                    <el-table-column prop="branch" label="开户行支行名称" align="center" />
                    <el-table-column label="银行卡类型" align="center">
                      <template slot-scope="scope">
                        <span v-if="scope.row.status==1">个人银行卡</span>
                        <span v-else>对公银行卡</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="添加时间" align="center">
                      <template slot-scope="scope">{{scope.row.created_at}}</template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px;" v-if="signAccount.name">
            <el-col :span="24">
              <div class="grid-content">实名认证（个人）</div>
              <div class="user-person">
                <p>
                  <span>姓名：</span>
                  {{signAccount.name}}
                </p>
                <p>
                  <span>身份证号码：</span>
                  {{signAccount.idno}}
                </p>
                <p>
                  <span>手机号：</span>
                  {{signAccount.mobile}}
                </p>
                <p>
                  <span>合同功能：</span>
                  {{signAccount.has_contract}}
                </p>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-tab-pane>
      <el-tab-pane label="账户资金明细" name="second">
        <template>
          <el-table :data="moneyList" border style="width: 100%">
            <el-table-column label="操作时间" min-width="100" align="center">
              <template slot-scope="scope">{{scope.row.created_at}}</template>
            </el-table-column>
            <el-table-column prop="order_sn" label="订单编号" min-width="110" align="center" />
            <el-table-column label="交易项目" align="center" min-width="140">
              <template slot-scope="scope">{{scope.row.trade_item}}</template>
            </el-table-column>
            <el-table-column label="交易类型" min-width="80" align="center">
              <template slot-scope="scope">{{scope.row.trade_type}}</template>
            </el-table-column>
            <el-table-column label="交易金额" align="center" min-width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.money_status=='0'">- ￥{{scope.row.trade_money}}</span>
                <span v-else>￥{{scope.row.trade_money}}</span>
              </template>
            </el-table-column>
            <el-table-column label="账户余额" min-width="120" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.account_money">￥{{scope.row.account_money}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="trade_note" label="交易说明" align="center" min-width="300"></el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              :current-page="form.page"
              background
              :page-sizes="[10, 20, 50, 100]"
              :page-size="form.pageSize"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="用户邀请明细" name="three">
        <template>
          <div class="grid-content">用户邀请明细</div>
          <el-table :data="inviDetail" border style="width: 100%">
            <el-table-column prop="user_id" label="用户ID" min-width="100" align="center" />
            <el-table-column prop="nick_name" label="用户昵称" min-width="150" align="center" />
            <el-table-column prop="mobile" label="用户手机号" align="center" min-width="130" />
            <el-table-column prop="invite_all" label="已邀请好友数" min-width="120" align="center" />
            <el-table-column prop="invite_over" label="好友完成开店数" align="center" min-width="120" />
            <el-table-column
              prop="invite_reward"
              label="累计奖励技术费免费额度"
              align="center"
              min-width="200"
            />
          </el-table>
          <div class="grid-content mt_20">数据列表</div>
          <el-table :data="inviList" border style="width: 100%">
            <el-table-column prop="invitee_id" label="用户ID" min-width="100" align="center"></el-table-column>
            <el-table-column prop="nick_name" label="用户昵称" min-width="150" align="center" />
            <el-table-column prop="mobile" label="用户手机号" align="center" min-width="130"></el-table-column>
            <el-table-column prop="reg_time" label="注册时间" min-width="160" align="center"></el-table-column>
            <el-table-column prop="first_open_at" label="首次开通店铺时间" align="center" min-width="160"></el-table-column>
            <el-table-column label="状态" min-width="100" align="center">
              <template slot-scope="scope">
                <!-- //0 已注册，1 已完成 -->
                <span>{{scope.row.status === 1?'已完成':'已注册'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="reward" label="奖励免费技术费额度" align="center" min-width="150">
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              :current-page="inviForm.page"
              background
              :page-sizes="[10, 20, 50, 100]"
              :page-size="inviForm.pageSize"
              :total="inviTotal"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleInviSizeChange"
              @current-change="handleInviPageChange"
            />
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { formatDate } from "@/utils/date";
import { accountDetail, userDetail, inviteDetail } from "@/api/conduct/conduct";

export default {
  name: "userDetail",
  data() {
    return {
      activeName: "first",
      moneyList: [],
      form: {
        page: 1,
        pageSize: 20
      },
      inviForm: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      userId: 0,
      signAccount: {},
      userInfo: {},
      bankInfo: [],
      inviList: [],
      inviDetail: [],
      inviTotal: 0
    };
  },
  created() {
    //获取传递过来的id
    const { id = 0, type = "" } = this.$route.query;
    this.userId = id;
    this.activeName = type;
    if (type === "second") {
      this.getDetail();
    } else if (type === "three") {
      this.getInviteDetail();
    } else {
      this.getUserDetail();
    }
  },
  methods: {
    handleClick(tab, event) {
      if (this.activeName == "first") {
        this.getUserDetail();
      } else if (this.activeName === "three") {
        this.getInviteDetail();
      } else {
        this.getDetail();
      }
    },
    getDetail() {
      accountDetail(this.userId, this.form)
        .then(res => {
          const {total = 0 ,data=[]} = res;
          this.moneyList = data;
          this.total = total;
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    },
    getUserDetail() {
      userDetail(this.userId)
        .then(res => {
          if (res.code) {
            return;
          }
          this.userInfo = res;
          this.bankInfo = res.get_user_bank_info;
          this.signAccount = res.sign_account || {};
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    },
    getInviteDetail() {
      inviteDetail(this.userId,this.form)
        .then(res => {
          const {
            details,
            list: { data = [], total = 0 }
          } = res;
          this.inviList = data;
          this.inviTotal = total;
          this.inviDetail = details ? [details] :[];
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    },
    handleSizeChange(val) {
      //分页器：页大小变更
      this.form.pageSize = val;
      this.form.page = 1;
      this.getDetail();
    },
    handlePageChange(val) {
      //分页器：页码变更
      this.form.page = val;
      this.getDetail();
    },
    handleInviSizeChange(val) {
      //分页器：页大小变更
      this.inviForm.pageSize = val;
      this.inviForm.page = 1;
      this.getInviteDetail();
    },
    handleInviPageChange(val) {
      //分页器：页码变更
      this.inviForm.page = val;
      this.getInviteDetail();
    }
  },
  filters: {
    statusFilter(status) {
      const statuses = {
        "1": "任务标题",
        "2": "服务标题",
        "3": "增资服务名称",
        "4": "工具市场工具名称",
        "5": "提现到银行卡",
        "6": "充值",
        "7": "线索名称",
        "8": "任务标题退款"
      };
      return statuses[status];
    },
    statusFilter1(status) {
      const statu = {
        "1": "购买服务",
        "2": "购买增值服务",
        "3": "托管赏金",
        "4": "充值",
        "5": "提现",
        "6": "订单退款",
        "7": "购买工具服务",
        "8": "购买线索",
        "9": "购买上刊画面",
        "10": "购买案例",
        "11": "购买传记",
        "12": "收入结算"
      };
      return statu[status];
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.mt_20 {
  margin-top: 20px;
}
.app-container {
  .grid-content {
    background: #cccccc;
    line-height: 40px;
    text-indent: 10px;
  }
  .el-main {
    padding: 0;

    .el-row {
      .t-content {
        background: #f2f2f2;
        overflow: auto;

        .demo-type {
          margin: auto;
          margin-top: 42px;
          text-align: center;
          width: 100px;
          height: 100px;

          img {
            border-radius: 50%;
            width: 99%;
            height: 99%;
            padding: 5px;
            background: #ccc;
          }
        }

        .phone {
          text-align: center;
          display: inherit;
          margin-top: 20px;
          font-size: 14px;
        }

        .user {
          ul {
            list-style: none;
            display: flex;
            flex-wrap: wrap;

            li {
              width: 49%;
              border-left: 1px solid #797979;
              border-top: 1px solid #a1a1a1;

              .user_info {
                float: left;
                display: inline-block;
                width: 33%;
                border-right: 1px solid #a1a1a1;
                text-align: center;
                line-height: 32px;
              }

              .user_item {
                float: left;
                display: inline-block;
                width: 67%;
                text-align: left;
                text-indent: 10px;
                line-height: 32px;
              }
            }

            li:nth-child(even) {
              border-right: 1px solid #797979;
            }

            li:nth-child(11) {
              border-bottom: 1px solid #a1a1a1;
            }

            li:last-child {
              border-bottom: 1px solid #a1a1a1;
            }
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
        background: #f2f2f2;
        padding: 15px 0;

        p {
          margin: 0;
          font-size: 14px;
          line-height: 30px;
          color: #333333;

          span {
            display: inline-block;
            width: 130px;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
