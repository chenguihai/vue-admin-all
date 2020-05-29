<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>当前角色：{{selectItem.role_name}}</span>
        <el-checkbox v-model="permission_id" class="twoName pl_20">是超级管理员</el-checkbox>
      </div>
      <ul class="roleBox">
        <li class="oneRole">
          <span class="oneName pl_20">一级</span>
          <span class="twoBox pl_20">二级</span>
          <span class="threeName pl_20">子功能项</span>
        </li>
        <li v-for="(item,index) in listData" :key="item.id">
          <div class="oneRole">
            <span class="oneName pl_20">{{item.action_name}}</span>
            <div class="twoBox">
              <div
                class="twoRole"
                v-for="(twoItem,twoIndex) in (item.children || [])"
                :key="twoItem.id"
              >
                <span class="twoName pl_20">{{twoItem.action_name}}</span>
                <div class="threeBox pl_20">
                  <el-checkbox :disabled="permission_id"
                    @change="threeChange(threeItem,index,twoIndex)"
                    v-model="threeItem.isSelect"
                    class="threeName"
                    v-for="threeItem in (twoItem.children || [])"
                    :label="threeItem.action_name"
                    :key="threeItem.id"
                  >{{threeItem.action_name}}</el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="tc btn_box">
        <el-button type="primary" :loading="isLoading" @click="handleSubmit">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { requestPermission, requestSetAuth } from "@/api/power/role";
export default {
  name: "roleSet",
  data() {
    return {
      listData: [],
      checkedCities: [],
      selectItem: {},
      permission_id: false,
      form: {
        role_id: "", //	是	int	角色id
        is_super: "", //	否	int	超级管理员：1是，0否
        permission_id: false //	否	int	权限id，用逗号隔开（超级管理员时可为空）
      },
      isLoading: true
    };
  },
  created() {
    this.getList();
    let role = sessionStorage.getItem("role");
    if (role) {
      this.selectItem = JSON.parse(role);
      this.permission_id = !!this.selectItem.is_super;
    }
  },
  methods: {
    handleSubmit() {
      let permissionId = "";
      if (!this.permission_id) {
        permissionId = this.filterSelectData(this.listData);
      }
      this.form = {
        role_id: this.selectItem.id, //	是	int	角色id
        is_super: this.permission_id?1:0, //	否	int	超级管理员：1是，0否
        permission_id: permissionId //	否	int	权限id，用逗号隔开（超级管理员时可为空）
      };
      this.setAuth();
    },
    threeChange(val, one, two) {
      let oneItem = this.listData[one];
      let threeItem = oneItem.children[two].children;
      if (val.id === 0) {
        //选中全选
        for (let j = 1; j < threeItem.length; j++) {
          threeItem[j].isSelect = val.isSelect;
        }
      } else {
        // 判断三级是否全部选中
        threeItem[0].isSelect = this.isSelectAll(threeItem);
      }
      this.$set(this.listData, one, oneItem);
    },
    getList() {
      this.isLoading = true;
      requestPermission()
        .then(res => {
          this.isLoading = false;
          this.listData = this.dataCommonFun(res);
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    },
    setAuth() {
      this.isLoading = true;
      requestSetAuth(this.form)
        .then(res => {
          if (res.code === 1) {
            this.$router.push("/power/role");
          } else {
            this.$message.error("设置失败");
          }
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        }).finally(()=>this.isLoading = false);
    },
    filterSelectData(res) {
      let item = {},
        twoItem = {},
        filterList = [];
      //一级
      for (let i = 0; i < res.length; i++) {
        item = res[i].children;
        //二级
        for (let j = 0; j < item.length; j++) {
          twoItem = item[j].children;
          if (!twoItem) {
            //有些没有三级
            continue;
          }
          filterList = filterList.concat(twoItem);
        }
      }
      return filterList
        .filter(item => item.id !== 0 && item.isSelect)
        .map(item => item.id)
        .toString();
    },
    dataCommonFun(res) {
      let item = {},
        twoItem = {},
        threeItem = {},
        heightVal = this.selectItem.permission_id.split(",").map(item => +item);
      //一级
      for (let i = 0; i < res.length; i++) {
        item = res[i].children;
        //二级
        for (let j = 0; j < item.length; j++) {
          twoItem = item[j].children;
          if (!twoItem) {
            //有些没有三级
            continue;
          }
          //三级
          for (let m = 0; m < twoItem.length; m++) {
            //之前选中的值
            twoItem[m].isSelect = false;
            for (let n = 0; n < heightVal.length; n++) {
              //判断三级有那些选中
              if (twoItem[m].id === heightVal[n]) {
                twoItem[m].isSelect = true;
                continue;
              }
            }
          }
          twoItem.unshift({
            id: 0,
            action_name: "全选",
            isSelect: false
          });
        }
      }
      return res;
    },
    isSelectAll(data) {
      return data.filter(item => item.id).every((item, index) => item.isSelect);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$lh_40: 40px;
.btn_box {
  margin: 20px;
}
.tc {
  text-align: center;
}
.roleBox {
  font-size: 14px;
  border: 1px solid #ccc;
  min-height: 400px;
}
.pl_20 {
  padding-left: 20px;
}
.box-card {
  margin-bottom: 20px;
}
.oneRole {
  display: flex;
  line-height: $lh_40;
  border-bottom: 1px solid #ccc;
  .oneName {
    min-width: 150px;
    width: 10%;
  }
}
.twoBox,
.threeBox {
  flex: 1;
}
.twoRole {
  line-height: $lh_40;
  display: flex;
  border-left: 1px solid #ccc;
  &:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
  .twoName {
    min-width: 200px;
    width: 20%;
  }
}
.threeBox {
  border-left: 1px solid #ccc;
}
.oneName,
.twoName,
.threeBox {
  &:hover {
    background-color: #efefef;
  }
}
.threeName {
  line-height: $lh_40;
  flex: 1;
  margin-right: 20px;
}
</style>