<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">用户管理</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">用户列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
      <div style="margin-top: 15px;">
  <el-input placeholder="请输入关键字" v-model="query">
    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
  </el-input>
   <el-button type="success" plain @click="addUsers = true">用户添加</el-button>
</div>
    <!-- 表格 -->
    <el-table
    :data="usersList"
    style="width: 100%">
    <el-table-column
      label="姓名"
      width="180"
      prop="username">
    </el-table-column>
    <el-table-column
      label="邮箱"
      width="180"
      prop="email">
    </el-table-column>
    <el-table-column 
      label="电话"
      width="180"
      prop="mobile">
    </el-table-column>
    <el-table-column 
      label="状态"
      width="180">
      <!-- 自定义插槽 属性名可以任意 -->
      <template slot-scope="scope">
         <el-switch
          v-model="scope.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column 
      label="操作">
      <template slot-scope="scope">
         <el-button type="primary" icon="el-icon-edit" plain size="small"></el-button>
         <el-button type="danger" icon="el-icon-delete" plain size="small" @click="del(scope.row.id)"></el-button>
         <el-button type="success" icon="el-icon-check" plain size="small">分配角色</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页功能 -->
  <!-- :total分页插件的总页数 
       :page-size每页的条数
       current-change当页面改变时触发，可以拿到当前页val-->
     <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[2, 4, 6, 8]"
      :total="total"
      :page-size="pageSize"
      @current-change="handlePageChage"
      >
     </el-pagination>
    <!-- 添加用户弹出框 -->
    <el-dialog title="添加地址" :visible.sync="addUsers">
      <el-form
      label-position="right"
      label-width="80px">
        <el-form-item label="用户名称">
          <el-input autocomplete="off"></el-input>
        </el-form-item>
          <el-form-item label="密码">
          <el-input autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="邮箱">
          <el-input autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="地址">
          <el-input autocomplete="off"></el-input>
        </el-form-item>  
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUsers = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
   </el-dialog>
  </div>
</template>
<script>
// 引入axios
import axios from 'axios'
export default {
  data() {
    return {
      // 用户列表
      usersList: [],
      // 查询关键字
      query: '',
      // 当前页面
      currentPage: 1,
      // 页面的条数
      pageSize: 2,
      // 总页数
      total: 0,
      // 添加用户模态框属性值
      addUsers: false
    }
  },
  created() {
    this.getAxios()
  },
  methods: {
    // 页面改变事件
    handlePageChage(val) {
      // console.log(val)
      // 改变当前页
      this.currentPage = val
      // 再次渲染
      this.getAxios()
    },
    // 封装
    getAxios() {
      // 封装axios发送获取数据并且渲染
      axios({
        url: 'http://localhost:8888/api/private/v1/users',
        method: 'get',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        },
        // 注意发送axios时要加一请求头，加上token
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.meta.status === 200) {
          // 此时的usersList应该为返回值
          this.usersList = res.data.data.users
          // 更新total
          this.total = res.data.data.total
        }
      })
    },
    // 通过关键字搜索功能
    search() {
      this.currentPage = 1
      // 注意这里的query是双向数据绑定，所以直接发送请求渲染就行
      this.getAxios()
    },
    del(id) {
      // 点击删除弹出模态框
      this.$confirm('你确定要删除用户吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 按下确认键以后
          axios({
            url: `http://localhost:8888/api/private/v1/users/${id}`,
            method: 'delete',
            // 注意发送axios时要加一请求头，加上token
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }).then(res => {
            if (res.data.meta.status === 200) {
              console.log(res.data.meta.status)
              if (this.usersList.length === 0 && this.currentPage > 1) {
                this.currentPage--
              }
              // 弹出成功删除的信息
              this.$message.success('删除用户成功')
              // 渲染当前页
              this.getAxios()
            }
          })
        })
        .catch(() => {
          this.$message.error('取消删除')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  height: 60px;
  line-height: 60px;
}
.el-input {
  width: 400px;
  margin-bottom: 20px;
}
</style>
