<template>
  <div class="roles">
  <!-- 面包屑导航 -->
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">权限管理</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 添加按钮 -->
  <el-button type="success" plain @click="showAddDialog">添加按钮</el-button>
  <!-- 添加表格 -->
  <el-table
    :data="rolesList"
    style="width: 100%"
    >
   <!-- 添加下拉框 -->
   <el-table-column type="expand">
      <template slot-scope="scope">
         <!-- 给下拉框添加内容 -->
         <el-row v-for="level1 in scope.row.children" :key="level1.id">
         <el-col :span="4">
           <el-tag closable @close="delRoles(scope.row,level1.id)">{{level1.authName}}</el-tag>
         </el-col>
         <el-col :span="20">
           <el-row v-for="level2 in level1.children" :key="level2.id" class="level2">
             <el-col :span="4">
               <el-tag type="success" closable @close="delRoles(scope.row,level2.id)">{{level2.authName}}</el-tag>
             </el-col>
             <el-col :span="20">
               <el-tag type="danger" v-for="level3 in level2.children" :key="level3.id" class="level3" closable @close="delRoles(scope.row,level3.id)">{{level3.authName}}</el-tag>
             </el-col>
           </el-row>
         </el-col>
         </el-row>
      </template>
    </el-table-column>
    <!-- 添加索引 -->
      <el-table-column
    type="index"
    width="50">
  </el-table-column>
    <el-table-column
      prop="roleName"
      label="角色名称"
      width="400">
    </el-table-column>
    <el-table-column
      prop="roleDesc"
      label="角色描述"
      width="400">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
         <!-- 放三个按钮 -->
         <!-- {{scope.row}} -->
        <el-button type="primary" icon="el-icon-edit" plain size="small" @click="addeditRoles(scope.row)"></el-button>
        <el-button type="danger" icon="el-icon-delete" plain size="small" @click="delRoless(scope.row.id)"></el-button>
        <el-button type="success" icon="el-icon-check" plain size="small" @click="showRights(scope.row)">分配角色</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 搞一个弹出框 -->
  <el-dialog
  title="分配权限"
  :visible.sync="assignDialogVisible"
  width="40%">
   <!-- 搞个树形图 -->
  <el-tree
    ref="tree"
    :data="rightsList"
    show-checkbox
    node-key="id"
    default-expand-all
    :props="defaultProps">
  </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="assignDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="assignRights">确 定</el-button>
    </span>
  </el-dialog>
     <!-- 添加用户弹出框 -->
    <el-dialog title="添加角色" :visible.sync="addRoles">
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" placeholder="请输入用户名"></el-input>
        </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入密码" v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoles = false">取 消</el-button>
        <el-button type="primary" @click="addRoless">确 定</el-button>
      </div>
   </el-dialog>
     <!-- 编辑用户弹出框 -->
         <el-dialog title="修改角色" :visible.sync="editRoles">
      <!-- 数据分析
       v-model="addFrom"获取整个表单中全部的数据 
       ref="addForm" 获整个dome元素
       :rlues="rlues"表单验证-->
      <el-form
      label-width="80px"
      :model="editFrom"
      ref="editFrom"
      :rules="rules"
      status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editFrom.roleName" placeholder="请输入用户名"></el-input>
        </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入密码" v-model="editFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoles = false">取 消</el-button>
        <el-button type="primary" @click="editRoless">确 定</el-button>
      </div>
   </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 所有的权限
      rightsList: [],
      // 所有的角色列表
      rolesList: [],
      // 用户id
      roleId: '',
      // 弹出对话框
      assignDialogVisible: false,
      defaultProps: {
        children: 'children',
        // 用于渲染名字对应的属性，这个名字对应要渲染的名字
        label: 'authName'
      },
      // 添加表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 表单验证
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      // 显示和隐藏对话框
      addRoles: false,
      // 编辑表单数据
      editFrom: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      // 显示和隐藏对话框
      editRoles: false
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    // 获取角色
    async getRoles() {
      let res = await this.axios('roles')
      console.log(res)
      let { data, meta: { status } } = res
      if (status === 200) {
        this.rolesList = data
      }
    },
    // 获取全部权限
    async getRights() {
      let res = await this.axios('rights/tree')
      let { data, meta: { status } } = res
      if (status === 200) {
        this.rightsList = data
      }
    },
    // 删除权限
    async delRoles(row, rightId) {
      let res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
      // console.log(res)
      let { data, meta: { status } } = res
      if (status === 200) {
        // 发出删除成功的信息
        this.$message.success = '删除成功'
        // 只渲染当前用户children下的权限
        row.children = data
      }
    },
    // 获取权限列表
    async showRights(row) {
      // 先把用户id存起来
      this.roleId = row.id
      // 获取所有的权限，并且渲染起来（此时权限全部出现）
      this.getRights()
      // 显示对话框
      this.assignDialogVisible = true
      // 点击弹出对话框的时候，dom结构还没有出现，用$nextTick可以保证立即获取到dom元素
      this.$nextTick(() => {
        let tmp = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              tmp.push(l3.id)
              // 把3级id全部存起来
            })
          })
        })
        // 设置默认选中项
        this.$refs.tree.setCheckedKeys(tmp)
      })
    },
    // 分配权限
    async assignRights() {
      // 先获取全部选中权限的id，包括全选id和半选id
      // 全选id
      let checked = this.$refs.tree.getCheckedKeys()
      // 半选id
      let halfchecked = this.$refs.tree.getHalfCheckedKeys()
      // 把两部分id整合起来
      let allId = [...checked, ...halfchecked]
      // 发送ajax请求
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids: allId.join()
      })
      console.log(res)
      let { data, meta: { status } } = res
      if (status === 200) {
        // 权限更新成功
        this.$message.success = '权限更新成功'
        // 关闭对话框
        this.assignDialogVisible = false
        // 渲染
        this.getRoles()
      }
    },
    // 点击删除用户
    async delRoless(id) {
      try {
        // 1.弹出确认框
        await this.$confirm('确定要删除吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 2.发送ajax请求
        let res = await this.axios.delete(`roles/${id}`)
        let { data, meta: { status } } = res
        if (status === 200) {
          // 3.发送成功后提示删除成功
          this.$message.success('删除成功')
          // 4.重新渲染
          this.getRoles()
        }
      } catch (e) {
        this.$message.error('删除取消')
      }
    },
    // 点出showAddDialog对话框
    showAddDialog() {
      // 显示对话框
      this.addRoles = true
    },
    // 添加用户
    addRoless() {
      // 1.进行表单验证
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios.post('roles', this.addForm)
        let { data, meta: { status } } = res
        if (status === 201) {
          // 5.重置对话框
          this.$refs.addForm.resetFields()
          // 2.请求发送成功，关闭对话框
          this.addRoles = false
          // 3.刷新页面
          this.getRoles()
          // 4.弹出添加成功的信息
          this.$message.success('添加用户成功')
        }
      })
    },
    // 点击出现编辑对话框
    addeditRoles(role) {
      this.editRoles = true
      this.editFrom.id = role.id
      this.editFrom.roleName = role.roleName
      this.editFrom.roleDesc = role.roleDesc
    },
    // 点击编辑按钮
    editRoless() {
      // 1进行表单验证
      this.$refs.editFrom.validate(async valid => {
        if (!valid) return false
        let res = await this.axios.put(
          `roles/${this.editFrom.id}`,
          this.editFrom
        )
        let { data, meta: { status } } = res
        if (status === 200) {
          // 5.重置对话框
          this.$refs.editFrom.resetFields()
          // 2.请求发送成功，关闭对话框
          this.editRoles = false
          // 3.刷新页面
          this.getRoles()
          // 4.弹出添加成功的信息
          this.$message.success('修改用户成功')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.level2 {
  margin-bottom: 10px;
}
.level3 {
  margin-right: 5px;
}
</style>
