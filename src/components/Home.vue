<template>
  <el-container class="home">
  <el-header>
    <div class="logo"></div>
    <div class="logout">
      欢迎光临
      <a href="javascript:;" @click="logout">退出</a>
    </div>
    <h1 class="title">电商管理系统</h1>
  </el-header>
  <el-container>
    <el-aside width="200px">
      <!-- 插入侧边栏 -->
      <!-- 注意 -->
      <!-- el-menu为菜单组件
           default-active默认选择的项
           el-submenu子菜单
           el-menu-item-group为子菜单分组
           el-menu-item：菜单项
           unique-opened：只能打开一个
           router：开启路由模式，当点击的时候发送路由跳转，跳转到对应的组件-->
        <el-menu
          :default-active="$route.path.slice(1).split('-')[0]"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router>
          <el-submenu :index="menus.path" v-for="menus in menusList" :key="menus.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menus.authName}}</span>
            </template>
            <el-menu-item :index="item.path" v-for="item in menus.children" :key="item.id">
                <i class="el-icon-menu"></i>
                <span slot="title">{{item.authName}}</span>
            </el-menu-item>
            </el-submenu>
       
        </el-menu>
   
        </el-aside>
        <el-main>
          <router-view></router-view>
          <!-- 配置嵌套路由的出口 -->
        </el-main>
      </el-container>
</el-container>
</template>

<script>
export default {
  data() {
    return {
      menusList: ''
    }
  },
  // 退出登录的事件
  methods: {
    // 退出事件
    logout() {
      // $confirm 弹出确认框  $message 弹出消息框
      this.$confirm('确定要退出登录', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message.success('退出成功')
          // 将token消除掉
          localStorage.removeItem('token')
          // 此时要要退出到登录页
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message.error('取消退出')
        })
    }
  },
  // 钩子函数
  async created() {
    let res = await this.axios.get('menus')
    console.log(res)
    let { data, meta: { status } } = res
    if (status === 200) {
      this.menusList = data
    }
  }
}
</script>
  
<style lang="less" scoped>
.home {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;

    .logo {
      width: 180px;
      height: 60px;
      float: left;
      background: url('../assets/logo.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    .logout {
      float: right;
      line-height: 60px;
      font-weight: bold;

      a {
        color: orange;
      }
    }
    .title {
      text-align: center;
      line-height: 60px;
      color: white;
      font-size: 30px;
    }
  }
  .el-container {
    .el-aside {
      background-color: #545c64;
      .el-submenu {
        width: 200px;
      }
    }
    .el-main {
      background-color: #d4dfe4;
    }
  }
}
</style>
