<template>
  <el-dialog
    title="查看授权委托"
    :visible.sync="showFlag"
    width="600px"
    :close-on-click-modal="false"
    :before-close="onClose"
  >
    <div class="exmine_wrap">
      <div class="title active">授权委托书：</div>
      <ul class="img_box">
        <!--        <preview-pictures v-for="(item,index) in detail.auth_img" :href="item" :key="index"/>-->
        <li v-for="(item,index) in detail.auth_img" class="img_li" alt="" :key="index">
          <img v-if="item.indexOf('.pdf') < 0 " class="img" :src="item |completePicture" alt=""/>
        </li>
        <li v-for="(item,index) in detail.auth_img" class="img_li_a" alt="" :key="index">
          <a class="img_a" v-if="item.indexOf('.pdf') >= 0 " :href="item|imgPrefixF" target="_blank">{{item.substring(item.lastIndexOf('/')+1)}}</a>
        </li>
      </ul>
      <div class="title">授权说明：</div>
      <p class="desc">{{detail.auth_explain}}</p>
    </div>
  </el-dialog>
</template>

<script>
  import {imgUrl} from '@/utils/commonData'
  import {settleDetail} from '@/api/oms/orderSettle';

  export default {
    name: 'ExamineApply',
    props: ['id'],
    data() {
      return {
        imgUrls: imgUrl,
        showFlag: true,
        selectId: this.id,
        detail: {},
        previewList: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      submitForm() { // 弹出窗口--添加分类
        this.$emit('submit')
      },
      onClose() {
        this.$emit('emitClose')
      },
      getList() {
        settleDetail(this.selectId).then(res => {
          this.detail = res
          this.previewList = res.auth_img.map(item => imgUrl + item)
        }).catch(err => {
          console.log(err)
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  %m_tb_20 {
    margin: 20px 0;
  }

  .exmine_wrap {
    .title {
      @extend %m_tb_20;

      &.active {
        margin-top: 0;
      }
    }

    /*
    .img_box {
      display: flex;
      height: 75px;
      @extend %m_tb_20;
      padding: 0;
      list-style: none;

      .img {
        margin-right: 10px;
        width: 89px;
        height: 75px;
        background: no-repeat center;
        background-size: cover;
      }
    }
     */

    .desc {
      @extend %m_tb_20;
    }

    .btn_upload {
      padding-left: 100px;
    }
  }

  .img_box {
    display: flex;
    @extend %m_tb_20;
    padding: 0;
    list-style: none;

    .img_li {
      margin-right: 10px;
      width: 89px;
      height: 75px;
    }

    .img {
      width: 89px;
      height: 75px;
    }

    .img_li_a {
      line-height: 30px;
    }

    .img_a {
      display: block;
      color: #337ab7;
    }
  }

</style>
