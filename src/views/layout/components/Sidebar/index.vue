<template>
  <scroll-bar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :unique-opened="true"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>


<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import ScrollBar from "@/components/ScrollBar";

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      let routes = this.$router.options.routes,
        item = [],
        routeItem = [];
      for (let i = 0; i < this.menuList.length; i++) {
        for (let j = 0; j < routes.length; j++) {
          if (
            routes[j].meta &&
            this.menuList[i].action_name === routes[j].meta.title
          ) {
            // console.log(
            //   "以及=======",
            //   this.menuList[i].action_name,
            //   routes[j].meta.title
            // );
            this.$set(routes[j], "hidden", false);
            item = this.menuList[i].child;
            routeItem = routes[j].children;
            // console.log("item=======", JSON.parse(JSON.stringify(item)));
            // console.log(
            //   "routeItem=======",
            //   JSON.parse(JSON.stringify(routeItem))
            // );
            for (let m = 0; m < item.length; m++) {
              for (let n = 0; n < routeItem.length; n++) {
                if (item[m].action_name === routeItem[n].meta.title) {
                  // console.log(
                  //   "hidden=======",
                  //   item[m].action_name,
                  //   routeItem[n].meta.title
                  // );
                  this.$set(routes[j].children[n], "hidden", false);
                  break;
                }
              }
            }
            break;
          }
        }
      }
      return this.$router.options.routes;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  data() {
    return {
      menuList: []
    };
  },
  created() {
    let menu = sessionStorage.getItem("menuList");
    if (menu) {
      this.menuList = JSON.parse(menu);
    }
  }
};
</script>
