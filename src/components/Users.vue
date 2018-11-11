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
          inactive-color="#ff4949"
          @change="changeState(scope.row)">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column 
      label="操作">
      <template slot-scope="scope">
         <el-button type="primary" icon="el-icon-edit" plain size="small" @click="showEdit(scope.row)"></el-button>
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
      @size-change="handleSizeChange"
      @current-change="handlePageChage"
      >
     </el-pagination>
    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addUsers">
      <!-- 数据分析
       v-model="addFrom"获取整个表单中全部的数据 
       ref="addForm" 获整个dome元素
       :rlues="rlues"表单验证-->
      <el-form
      label-width="80px"
      :model="addForm"
      ref="addForm"
      :rules="rules"
      status-icon>
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
          <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="addForm.password"></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="addForm.email"></el-input>
        </el-form-item>
         <el-form-item label="电话" prop="mobile">
          <el-input placeholder="电话" v-model="addForm.mobile"></el-input>
        </el-form-item>  
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUsers = false">取 消</el-button>
        <el-button type="primary" @click="addUserss">确 定</el-button>
      </div>
   </el-dialog>
    <!-- 用户编辑弹出框 -->
     <el-dialog title="修改用户" :visible.sync="editUsers">
      <!-- 数据分析
       v-model="addFrom"获取整个表单中全部的数据 
       ref="addForm" 获整个dome元素
       :rlues="rlues"表单验证-->
      <el-form
      label-width="80px"
      :model="editForm"
      ref="editForm"
      :rules="rules"
      status-icon>
        <el-form-item label="用户名称">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
        </el-form-item>
         <el-form-item label="电话" prop="mobile">
          <el-input placeholder="电话" v-model="editForm.mobile"></el-input>
        </el-form-item>  
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUsers = false">取 消</el-button>
        <el-button type="primary" @click="editUserss">确 定</el-button>
      </div>
   </el-dialog>
  </div>
</template>
<script>
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
      addUsers: false,
      // 添加用户的数据存储
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加编辑用户模态框属性
      editUsers: false,
      // 变价用户的数据存储
      editForm: {
        id: '',
        email: '',
        username: '',
        mobile: ''
      },
      // 表单验证开始
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确格式的邮箱', trigger: 'blur' }
        ],
        mobile: [
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getAxios()
  },
  methods: {
    // 页面改变事件
    handlePageChage(val) {
      console.log(val)
      // 改变当前页
      this.currentPage = val
      // 再次渲染
      this.getAxios()
    },
    // 每页条数发送变化的时候
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getAxios()
    },
    // 封装
    getAxios() {
      // 封装axios发送获取数据并且渲染
      this.axios({
        url: 'users',
        method: 'get',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      }).then(res => {
        // console.log(res)
        let { meta: { status }, data: { users, total } } = res
        // console.log(users, total)
        if (status === 200) {
          // 此时的usersList应该为返回值
          this.usersList = users
          // 更新total
          this.total = total
        }
      })
    },
    // 通过关键字搜索功能
    search() {
      this.currentPage = 1
      // 注意这里的query是双向数据绑定，所以直接发送请求渲染就行
      this.getAxios()
    },
    // 删除用户
    del(id) {
      // 点击删除弹出模态框
      this.$confirm('你确定要删除用户吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 按下确认键以后
          this.axios({
            url: `users/${id}`,
            method: 'delete'
          }).then(res => {
            let { meta: { status } } = res
            // console.log(res)
            if (status === 200) {
              // console.log(res.data.meta.status)
              if (this.usersList.length === 1 && this.currentPage > 1) {
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
    },
    // 改变状态
    changeState({ id, mg_state }) {
      // 解构赋值，直接获取其中的参数
      this.axios({
        url: `users/${id}/state/${mg_state}`,
        method: 'put'
      }).then(res => {
        // console.log(res)
        let { meta: { status } } = res
        if (status === 200) {
          this.$message.success('用户状态改变成功')
        } else {
          this.$message.error('用户状态改变失败')
        }
      })
    },
    // 添加用户
    addUserss() {
      this.$refs.addForm.validate(vaild => {
        // 如果校验不成功直接跳出
        if (!vaild) return false
        // 如果成功的话发送ajax请求
        this.axios({
          url: 'users',
          method: 'post',
          data: this.addForm
        }).then(res => {
          // console.log(res)
          // let { meta: { status } } = res
          // console.log(meta)
          let { meta: { status } } = res
          if (status === 201) {
            // 添加成功后应该渲染最后一页
            this.total++
            this.currentPage = Math.ceil(this.total / this.pageSize)
            this.getAxios()
            // 添加成功信息
            this.$message.success('添加用户成功')
            // 清空并且关闭对话框
            this.$refs.addForm.resetFields()
            this.addUsers = false
          }
        })
      })
    },
    // 显示编辑用户对话框
    showEdit(user) {
      console.log(user)
      this.editUsers = true
      // 改变属性，显示模态框
      this.editForm.username = user.username
      // 分别显示姓名、邮箱和电话
      this.editForm.mobile = user.mobile
      this.editForm.email = user.email
      // 注意这里虽然看不见但是要把id也要传进去，后面要用
      this.editForm.id = user.id
    },
    // 编辑用户
    editUserss() {
      // console.log('aha')
      this.$refs.editForm.validate(vaild => {
        if (!vaild) return false
        console.log(vaild)
        // 如果验证不通过直接返回
        this.axios({
          url: `users/${this.editForm.id}`,
          method: 'put',
          data: this.editForm
        }).then(res => {
          let { meta: { status } } = res
          // console.log(res)
          if (status === 200) {
            // 提示更新成功
            this.$message.success('更新用户信息成功')
            // 表单重置
            this.$refs.editForm.resetFields()
            // 对话框关闭
            this.editUsers = false
            // 重新渲染
            this.getAxios()
          } else {
            this.$message.error('更新失败')
          }
        })
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
