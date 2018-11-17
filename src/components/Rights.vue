<template>
  <div class="rights">
  <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">权限管理</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
    </el-breadcrumb>
  <!-- 添加按钮 -->
   <el-button type="success" plain>添加按钮</el-button>
  <!-- 添加表格 -->
   <el-table
      :data="rightsList"
      style="width: 100%">
      <!-- 添加索引 -->
       <el-table-column
      type="index"
      width="50">
    </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="400">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="400">
      </el-table-column>
      <el-table-column
        prop="leve"
        label="层级">
        <template slot-scope="scope">
           <div v-if="scope.row.level === '0'">一级</div>
           <div v-else-if="scope.row.level === '1'">二级</div>
           <div v-else>三级</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  async created() {
    // 在此钩子函数阶段获取数据发送ajax请求
    let res = await this.axios.get('rights/list')
    // console.log(res)
    let { data, meta: { status } } = res
    if (status === 200) {
      this.rightsList = data
    }
  }
}
</script>
 
<style>
</style>
