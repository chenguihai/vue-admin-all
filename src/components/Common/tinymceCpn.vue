<template>
  <div :id="tinymceId"></div>
</template>

<script>
  import {uploadUrl} from '@/utils/commonData';
  import axios from 'axios'

  export default {
    name: "tinymceCpn",
    props: {
      id: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        hasChange: false,
        hasInit: false,
        tinymceId: 'vue-tinymce-' + new Date().getTime(),
        timer: false

      }
    },
    mounted() {
      this.initTiny()
    },
    watch: {
      value(val) {
        clearTimeout(this.timer); // 清除未执行的代码，重置回初始化状态
        this.timer = setTimeout(function () {
          if (!this.hasChange && this.hasInit) {
            this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val))
          }
        }, 500);
      }
    },
    methods: {
      initTiny() {
        let _this = this;
        tinymce.init({
          selector: `#${this.tinymceId}`,
          //skin:'oxide-dark',
          language: 'zh_CN',
          // lineheight advlist anchor autolink autosave codesample
          // directionality emoticons fullscreen hr image imagetools importcss insertdatetime
          // legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace
          // spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount
          plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table  hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern  emoticons autosave  lineheight',
          // charmap help bdmap indent2em autoresize formatpainter axupimgs
          // plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave bdmap indent2em autoresize lineheight formatpainter axupimgs',
          // | alignleft aligncenter alignright alignjustify outdent indent
          // formatselect
          toolbar: ['code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | bullist numlist | blockquote subscript superscript removeformat | table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | bdmap indent2em lineheight formatpainter axupimgs|styleselect fontselect fontsizeselect'],

          height: 650, //编辑器高度
          min_height: 400,
          /*content_css: [ //可设置编辑区内容展示的css，谨慎使用
              '/static/reset.css',
              '/static/ax.css',
              '/static/css.css',
          ],*/
          fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
          font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
          images_upload_url: process.env.BASE_API+'/uploadImage',
          images_upload_base_path: location.host,
          importcss_append: true,
          //自定义文件选择器的回调内容
          // file_picker_callback: function (callback, value, meta) {
          // debugger
          // if (meta.filetype === 'file') {
          //   callback('https://www.baidu.com/img/bd_logo1.png', { text: 'My text' });
          // }
          // if (meta.filetype === 'image') {
          //   callback('https://www.baidu.com/img/bd_logo1.png', { alt: 'My alt text' });
          // }
          // if (meta.filetype === 'media') {
          //   callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.baidu.com/img/bd_logo1.png' });
          // }
          // },
          images_upload_handler: function (blobInfo, success, failure) {        // 图片上传
            let formData = new FormData()
            formData.append('imgs', blobInfo.blob())
            axios.post(uploadUrl, formData).then(res => {
              const {code, data} = res.data;
              if (code === 1) {
                success(data.domain + '/' + data.file)
              } else {
                failure('上传失败！')
              }
            })
          },
          paste_data_images: true,//true 允许粘贴图像
          autosave_ask_before_unload: false,
          init_instance_callback: editor => {
            if (_this.value) {
              editor.setContent(_this.value)
            }
            _this.hasInit = true
            editor.on('NodeChange Change KeyUp SetContent', () => {
              this.hasChange = true
              this.$emit('input', editor.getContent())
            })
          }
        });

      },
      destroyTinymce() {
        if (window.tinymce.get(this.tinymceId)) {
          window.tinymce.get(this.tinymceId).destroy()
        }
      },
      destroyed() {
        clearTimeout(this.timer);
        this.destroyTinymce()
      }
    }
  }
</script>

<style scoped>

</style>
