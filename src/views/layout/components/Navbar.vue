<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <!-- <img class="user-avatar" :src="avatar"> -->
        <span style="margin-right:2px;">当前用户：</span>{{nickname}}
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="handleLogout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Breadcrumb from '@/components/Breadcrumb'
    import Hamburger from '@/components/Hamburger'
    import {logout} from '@/api/login'

    export default {
        name: 'navBar',
        components: {
            Breadcrumb,
            Hamburger
        },
        data() {
            let name = sessionStorage.getItem('nickname')
            return {
                nickname: name || '请登录'
            }
        },
        computed: {
            ...mapGetters([
                'sidebar',
            ])
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('ToggleSideBar')
            },
            handleLogout() {
                let userId = sessionStorage.getItem('userId')
                if (userId) {
                    logout(userId).then(res => {
                        sessionStorage.clear();
                      localStorage.clear();
                      this.$router.push({path: '/login'});
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    sessionStorage.clear();
                  localStorage.clear();
                    this.$router.push({path: '/login'});
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;

    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }

    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }

    .avatar-container {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 35px;

      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 19px;
          font-size: 12px;
        }
      }
    }
  }
</style>

