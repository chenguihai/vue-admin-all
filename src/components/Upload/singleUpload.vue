<template> 
  <div>
    <el-upload
      :action="fileAction"
      name="imgs"
      :headers="fileHeaders"
      list-type="picture"
      :multiple="false"
      :file-list="fileList"
      :limit="1"
      accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PBG,.GIF"
      :on-exceed="handleExceed"
      :before-remove="beforeRemove"
      :on-success="handleUploadSuccess"
    >
      <el-button size="small" type="primary">{{btn}}</el-button>
    </el-upload>
  </div>
</template>
<script>
  import {uploadUrl, imgUrl} from '@/utils/commonData';
  import {getToken} from '@/utils/auth';
  import {removeFile} from '@/api/common';

  export default {
    name: 'singleUpload',
    props: {
      url: {
        type: String,
        default: ''
      },
      btn: {
        type: String,
        default: '上传图片'
      }
    },
    data() {
      let imageUrl = this.url ? [{url: imgUrl + this.url + '?x-oss-process=image/resize,m_lfit,h_180,w_300'}] : [];
      return {
        fileAction: uploadUrl,
        fileHeaders: {'Authorization': 'Bearer ' + getToken()},
        form: {
          cover: this.url
        },
        fileList: imageUrl,
      };
    },
    methods: {
      handleUploadSuccess(res, file, fileList) {
        if (res.code === 0) {
          this.fileList = []
          this.$message.error(res.data)
        } else {
          this.form.cover = res.data.file
          this.$emit('emitSubmit', res.data.file)
        }
      },
      beforeRemove() {
        this.removeFileHttp();
        this.fileList = [];
        this.$emit('close')
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      removeFileHttp() {
        let {cover} = this.form
        if (!cover) {
          return
        }
        let params = {rmfile: cover};
        removeFile(params).then(res => {

        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .imgList {
    width: 160px;
    height: 90px;
    overflow: hidden;
    margin-top: 10px;
  }
</style>


