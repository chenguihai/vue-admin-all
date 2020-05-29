<template>
  <el-dialog
    :title="dialogTitle"
    width="500px"
    @close="handleClose"
    class="unit_dialog"
    :destroy-on-close="true"
    :visible.sync="showFlag"
  >
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      label-position="right"
      label-width="130px"
      ref="form"
      size="small"
    >
      <el-form-item prop="ad_name" label="广告名称：">
        <el-input v-model="form.ad_name" placeholder="广告名称" clearable />
      </el-form-item>
      <el-form-item prop="ad_position_id" label="广告位置：">
        <el-select
          style="width:100%;"
          v-model="form.ad_position_id"
          clearable
          @change="changePosition"
        >
          <el-option
            v-for="item in advertLocation"
            :key="item.id"
            :label="item.position"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="需求分类：" v-if="form.cate_id || isShow">
        <el-select style="width:100%;" v-model="form.cate_id" clearable>
          <el-option
            v-for="item in cateList"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="start_time" label="开始日期：">
        <!--        :picker-options="startDateDisabled"-->
        <!--        @change="startChange"-->
        <el-date-picker
          v-model="form.start_time"
          type="datetime"
          :editable="false"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="end_time" label="结束日期：">
        <!--        :picker-options="endDateDisabled"-->
        <el-date-picker
          v-model="form.end_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="广告图：" prop="ad_img">
        <single-upload :url="form.ad_img" @close="_deleteUpload" @emitSubmit="_handleUpload"></single-upload>
      </el-form-item>
      <el-form-item label="广告图背景：" prop="ad_img_bg">
        <single-upload :url="form.ad_img_bg" @close="deleteUploadBg" @emitSubmit="handleUploadBg"></single-upload>
      </el-form-item>
      <el-form-item prop="sort" label="排序：">
        <el-input v-model.number="form.sort" placeholder="排序" clearable />
      </el-form-item>
      <el-form-item prop="is_show" label="显示：">
        <span style="margin-right: 5px;">NO</span>
        <el-switch v-model="form.is_show" :active-value="1" :inactive-value="0"></el-switch>
        <span style="margin-left: 5px;">YES</span>
      </el-form-item>
      <el-form-item label="广告联系人电话：" prop="contact_phone">
        <el-input v-model="form.contact_phone" placeholder="广告联系人电话" clearable />
      </el-form-item>
      <el-form-item label="广告联系人昵称：">
        <el-input v-model="form.contact_nickname" placeholder="昵称" clearable />
      </el-form-item>
      <el-form-item label="图片跳转链接：">
        <el-input v-model="form.ad_img_link" placeholder="图片跳转链接" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getNickname, getCateByPosition } from "@/api/system/advertise";
import SingleUpload from "@/components/Upload/singleUpload";
import { phoneRegExp } from "@/utils/validate";

export default {
  name: "advertCpn",
  components: { SingleUpload },
  props: ["title", "item", "address"],
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      if (!phoneRegExp(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        this.getNicknameHttp(value);
        callback();
      }
    };
    const validateImg = (rule, value, callback) => {
      if (!value) {
        callback(new Error("必须上传广告图"));
      } else {
        callback();
      }
    };
    const adBgImg = (rule, value, callback) => {
      if (!value) {
        callback(new Error("必须上传广告图背景"));
      } else {
        callback();
      }
    };
    const {
      ad_name,
      ad_position = [],
      cate_id,
      start_time,
      end_time,
      is_show,
      ad_img,
      ad_img_bg,
      ad_img_link,
      sort,
      contact_phone,
      contact_nickname
    } = this.item;
    const [first = {}] = ad_position;
    return {
      showFlag: true,
      dialogTitle: this.title,
      advertLocation: this.address,
      form: {
        ad_name: ad_name || "", //	是	string	广告名称
        ad_position_id: first.position_id || "", //	是	int	广告位置id
        start_time: start_time || "", //	是	datetime	开始时间：格式“2019-08-20 09:30”
        end_time: end_time || "", //	是	datetime	结束时间：格式“2019-08-20 09:30”
        is_show: is_show || "", //	是	int	是否显示：0否，1是
        ad_img: ad_img || "", //	是	string	广告图
        ad_img_bg: ad_img_bg || "", //	是	string	广告图背景
        ad_img_link: ad_img_link || "", //_link	否	string	广告图链接
        sort: sort || "", //	是	int	排序
        contact_phone: contact_phone || "", //	否	string	广告联系人手机
        contact_nickname: contact_nickname || "", //	否	string	广告联系人昵称
        cate_id: cate_id || "" //否	int	一级分类id
      },
      rules: {
        ad_name: [
          { required: true, trigger: "change", message: "广告名称不能为空" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "change"
          }
        ],
        ad_position_id: [
          { required: true, trigger: "change", message: "广告位置不能为空" }
        ],
        start_time: [
          { required: true, trigger: "change", message: "时间不能为空" }
        ],
        end_time: [
          { required: true, trigger: "change", message: "时间不能为空" }
        ],
        is_show: [
          { required: true, trigger: "change", message: "必须选择显示" }
        ],
        ad_img: [{ required: true, trigger: "change", validator: validateImg }],
        // ad_img_bg: [{ required: true, trigger: "change", validator: adBgImg }],
        sort: [
          { required: true, trigger: "change", message: "排序不能为空" },
          {
            type: "number",
            message: "排序必须为数字值"
          }
        ],
        contact_phone: [
          { required: false, trigger: "change", validator: validatePhone }
        ]
      },
      // startDateDisabled: {
      //     disabledDate(time) {// 限制开始日期不能超过当前日期
      //         return time.getTime() < Date.now()
      //     }
      // },
      // endDateDisabled: {},
      cateList: [],
      selectPosition: cate_id || "",
      isShow: false
    };
  },
  created() {
    const { ad_position_id = "", cate_id = "" } = this.form;
    if (cate_id) {
      this.getList(ad_position_id);
    }
  },
  watch: {
    selectPosition: {
      handler(val) {
        switch (val) {
          case 5:
          case 6:
          case 9:
            this.isShow = true;
            break;
          default:
            this.isShow = false;
            break;
        }
      },
      deep: true
    }
  },
  methods: {
    changePosition(value) {
      this.selectPosition = value;
      this.getList(value);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("submit", this.form);
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.$emit("close");
    },
    // startChange() {
    //     this.endDateDisabled.disabledDate = (time) => {
    //         return time.getTime() - 1000 < new Date(this.form.start_time).getTime()
    //     }
    // },
    _handleUpload(url) {
      this.form.ad_img = url;
      this.rules.ad_img = [{ required: true, trigger: "change", message: "" }];
    },
    handleUploadBg(url) {
      this.form.ad_img_bg = url;
      this.rules.ad_img_bg = [
        { required: true, trigger: "change", message: "" }
      ];
    },
    _deleteUpload() {
      this.form.ad_img = "";
      this.rules.ad_img = [
        { required: true, trigger: "change", message: "必须上传广告图" }
      ];
    },
    deleteUploadBg() {
      this.form.ad_img_bg = "";
      this.rules.ad_img_bg = [
        { required: true, trigger: "change", message: "必须上传广告图背景" }
      ];
    },
    getNicknameHttp(mobile) {
      if (mobile.length !== 11) {
        return;
      }
      getNickname(mobile)
        .then(res => {
          this.form.contact_nickname = res || "";
        })
        .catch(err => {
          console.log(err);
          this.form.contact_nickname = "";
        });
    },
    getList(id) {
      getCateByPosition(id)
        .then(res => {
          this.cateList = res;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
</style>
