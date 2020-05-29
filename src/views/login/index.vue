<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on"
               :model="loginForm"
               :rules="loginRules"
               ref="loginForm"
               label-position="left">
        <div style="text-align: center;margin-bottom: 24px;">
          <!-- <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon> -->
          <a class="login-img" href="javascript:void(0);" title="一站式全媒界大型媒体电商平台">
            <img :src="login_title" class="login_title">
          </a>
        </div>
        <el-form-item prop="username">
          <el-input name="username"
                    type="text"
                    v-model="loginForm.username"
                    autoComplete="on" clearable
                    placeholder="用户名">
          <span slot="prefix">
            <svg-icon icon-class="user" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password"
                    :type="pwdType"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.password"
                    autoComplete="on" clearable
                    placeholder="请输入密码">
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
            <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input name="password"
                    v-model="loginForm.captcha"
                    autoComplete="on" clearable
                    placeholder="请输入验证码">
            <template slot="append">
              <el-button v-if="!captchaImage" type="primary" @click="sendCode">发送验证码</el-button>
              <div v-else @click="sendCode" class="captcha_img"
                   :style="{backgroundImage: 'url('+captchaImage+')'}"></div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item style="">
          <el-button style="width: 100%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
        <div style="text-align: center;">
          <span class="return_home" @click="jumpUrl"
                title="返回前台">返回前台</span>
        </div>
      </el-form>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout">
  </div>
</template>

<script>
  import {isvalidUsername} from '@/utils/validate';
  import {login, getCaptcha} from '@/api/login'
  import login_center_bg from '@/assets/images/login_center_bg.png';
  import login_title from '@/assets/images/login_title.png';
import {
  validateURL,
  firstLetterRegExp,
  validateLowerCase,
  phoneRegExp,
  pwdRegExp
} from "@/utils/validate";
  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      };
      const validatePwd = (rule, value, callback) => {
         if (!value) {
            callback();
          }else if (!pwdRegExp(value)) {
            callback(new Error("密码包含字母、数字、特殊符号任意两种"));
          } else {
            callback();
          }
      };
      return {
        loginForm: {
          username: '',
          password: '',
          captcha: '',
          captcha_key: '',
        },
        loginRules: {
          username: [
            {required: true, trigger: 'change', validator: validateUsername}
            ],
          password: [
            {
            required: true,
            trigger: ["change",'blur'],
            message: "密码不能为空"
            },
            {
              min: 8,
              max: 32,
              message: "密码长度为8个到32个字符",
              trigger: "change"
            },
            {required: true, trigger: 'change', validator: validatePwd}
            ],
          captcha: [{required: true, trigger: 'change', message: '验证码不能为空'}]
        },
        loading: false,
        pwdType: 'password',
        login_center_bg,
        login_title,
        captchaImage: '',
        isLoading: false,
        menuList:[],
      }
    },
    created() {
      this.sendCode();
    },
    methods: {
      sendCode() {
        if (this.isLoading) {
          return
        }
        this.isLoading = true;
        getCaptcha(this.loginForm).then(res => {
          const {captcha_image_content = '', captcha_key = ''} = res
          this.captchaImage = captcha_image_content;
          this.loginForm.captcha_key = captcha_key;
        }).catch(err => {
          console.log(err)
        }).finally(() => this.isLoading = false)
      },
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      jumpUrl() {
        window.open(location.origin.replace('admin', 'www'))
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.loginForm))
            params.captcha = params.captcha.toLowerCase();
            login(params).then(res => {
              const  {user={},menu=[]} = res;
              this.menuList = menu;
              if (res.code === 0) {
                this.$message.error(res.data);
                return
              }
              const {api_token, id, username,sign=''} = user;
              sessionStorage.setItem('token', api_token)
              sessionStorage.setItem('userId', id)
              sessionStorage.setItem('nickname', username)
              sessionStorage.setItem('sign', sign)
              sessionStorage.setItem('menuList', JSON.stringify( menu))
              this.$router.push({path: '/home/homepage'})
            }).catch(err => {
              console.log(err)
            })
          } else {
            return false
          }
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    width: 360px;
    margin: 140px auto;
    border-top: 10px solid #409EFF;

  }

  .login-img {
    text-align: center;
    width: 100%;
    display: inline-block;
    background: #3a8ee6;
  }

  .login_title {
    width: 100%;
    padding: 10px;
  }

  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }

  .return_home {
    color: #DD2727;
    font-size: 14px;
    cursor: pointer;
  }

  .captcha_img {
    display: block;
    width: 112px;
    height: 38px;
    margin: 0 -20px;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
