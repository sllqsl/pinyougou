<template>
  <el-container class="home">
  <el-header>
    <div class="logo"></div>
    <div class="logout">
      欢迎光临
      <a href="javascript:;">退出</a>
    </div>
    <h1 class="title">电商管理系统</h1>
  </el-header>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-main>Main</el-main>
  </el-container>
</el-container>
</template>

<script>
export default {}
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
    }
    .el-main {
      background-color: #d4dfe4;
    }
  }
}
</style>
