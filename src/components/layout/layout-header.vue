<template>
  <div
    id="layout-header"
    :class="{ fixed: fixed, hidden: hidden }"
    @click.stop="mobileShow = false"
  >
    <div class="site-logo">
      <router-link to="/">
        <img src="@/assets/site-logo.svg" alt="" />
        <p class="site-name">muke</p>
      </router-link>
    </div>

    <div class="menus-btn" @click.stop="mobileShow = !mobileShow">
      <img src="@/assets/折叠.svg" width="24px" alt="" />
    </div>

    <div
      class="site-menus"
      :class="{ mobileShow: mobileShow }"
      @click.stop="mobileShow = !mobileShow"
    >
      <div class="menu-item header-search"><header-search /></div>
      <div class="menu-item"><router-link to="/">首页</router-link></div>
      <div class="menu-item"><router-link to="/friend">友链</router-link></div>
      <div class="menu-item"><router-link to="/about">关于</router-link></div>
      <div class="menu-item" v-if="!$store.getters.token">
        <router-link to="/login">登录</router-link>
      </div>
      <div class="menu-item" v-if="!$store.getters.token">
        <router-link to="/register">注册</router-link>
      </div>
      <div class="menu-item hasChild" v-if="$store.getters.token">
        <el-avatar
          class="item-avatar"
          :size="36"
          :src="visitorInfo.avatar"
        ></el-avatar>
        <div class="childMenu">
          <!--  <a href="/user/info" class="sub-menu my-menu">个人中心</a> -->
          <div class="sub-menu my-menu" @click="logout">退出</div>
        </div>
        <div class="menu-item" @click="logout" :style="{visibility: logoutShow}">退出</div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/header-search";

export default {
  name: "layout-header",
  components: { HeaderSearch },
  data() {
    return {
      lastScrollTop: 0,
      fixed: false,
      hidden: false,
      category: [],
      mobileShow: false,
      logoutShow: 'hidden',
      /* 访客数据 */
      visitorInfo: this.$store.getters.visitorInfo,
    };
  },
  watch: {
    $route(newValue, oldValue) {
      // 判断路由中的token参数
      if (newValue.query && newValue.query.token) {
        // 设置token
        this.$store.commit("SET_TOKEN", newValue.query.token);
        this.$store.dispatch("getVisitor").then((res) => {
          this.visitorInfo = res;
        });
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.watchScroll);
    window.addEventListener("resize", this.windowWidth);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.watchScroll);
    window.removeEventListener("resize", this.windowWidth);
  },
  methods: {
    watchScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop === 0) {
        this.fixed = false;
      } else if (scrollTop >= this.lastScrollTop) {
        this.fixed = false;
        this.hidden = true;
      } else {
        this.fixed = true;
        this.hidden = false;
      }
      this.lastScrollTop = scrollTop;
    },
    /* 窗口宽度 */
    windowWidth() {
      let width = window.innerWidth
      if (width <= 590) {
        this.logoutShow = 'visible'
      } else {
        this.logoutShow = 'hidden'
      }
    },
    /* 访客退出 */
    logout() {
      this.$store.commit("SET_TOKEN", "");
      this.$store.commit("SET_VISITOR_INFO", {});
    },
  },
};
</script>

<style scoped lang="less">
#layout-header {
  position: fixed;
  top: 0;
  z-index: 9;
  width: 100%;
  height: 80px;
  padding: 0 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s all ease;
  -webkit-transition: 0.3s all ease;
  -moz-transition: 0.3s all linear;
  -o-transition: 0.3s all ease;
  -ms-transition: 0.3s all ease;
  &.hidden {
    top: -100px;
  }
  &.fixed {
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

.site-logo {
  text-align: center;

  img {
    width: 60px;
    height: 60px;
  }

  p.site-name {
    font-size: 15px;
    font-weight: bold;
    position: relative;
    top: -10px;
  }
}
.menus-btn {
  display: none;
  visibility: hidden;
}
.site-menus {
  display: flex;
  align-items: center;

  .phone-logout {
    display: none;
  }
  .menu-item {
    min-width: 60px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: relative;
    a {
      padding: 12px 10px;
      color: #545454;
      font-weight: 500;
      font-size: 16px;
      &:hover {
        color: #ff6d6d;
      }
    }
    &:not(:last-child) {
      margin-right: 15px;
    }
    &.hasChild:hover .childMenu {
      opacity: 1;
      visibility: visible;
      transform: translateY(-5px);
    }
    .item-avatar {
      margin-top: 9px;
    }
    .childMenu {
      width: 130px;
      background-color: #fdfdfd;
      border-radius: 3px;
      border: 1px solid #ddd;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      position: absolute;
      top: 55px;
      z-index: 2;
      .sub-menu {
        height: 40px;
        line-height: 40px;
        position: relative;
      }
      .my-menu {
        cursor: pointer;
        color: #545454;
        &:hover {
          color: #ff6d6d;
        }
      }
    }
  }
  .childMenu {
    width: 130px;
    background-color: #fdfdfd;
    border-radius: 3px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 55px;
    z-index: 2;
    opacity: 0;
    visibility: hidden;
    transition: 0.7s all ease;
    -webkit-transition: 0.6s all ease;
    -moz-transition: 0.6s all linear;
    -o-transition: 0.6s all ease;
    -ms-transition: 0.6s all ease;
    &:before,
    &:after {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 8px solid white;
      top: -8px;
      left: 20px;
    }
    &:before {
      top: -9px;
      border-bottom: 8px solid #ddd;
    }
    .sub-menu {
      height: 40px;
      line-height: 40px;
      position: relative;
      &:not(:last-child):after {
        /*position: absolute;*/
        content: "";
        width: 50%;
        height: 1px;
        color: #ff6d6d;
        bottom: 0;
        left: 25%;
        z-index: 99;
      }
    }
  }
}
@media (max-width: 960px) {
  #layout-header {
    padding: 0 20px;
  }
}
@media (max-width: 600px) {
  #layout-header {
    padding: 0 10px;
  }
  .menus-btn {
    display: block;
    visibility: visible;
  }
  .header-search {
    margin-right: 10px;
  }
  .site-menus {
    position: absolute;
    display: none;
    visibility: hidden;
    background-color: #f9f9f9;
    width: 100%;
    left: 0;
    top: 80px;
    z-index: -9;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .menu-item {
      position: relative;
      height: unset;
      &:not(:last-child) {
        margin-right: 0;
      }
    }
  }
  .site-menus.mobileShow {
    display: inline-block;
    visibility: visible;
    z-index: 99;
  }
}
</style>
