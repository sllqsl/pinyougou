<template>
  <div class="categories">
     <!-- 添加按钮 -->
   <el-button type="success" plain @click="showDal">添加分类</el-button>
     <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading">
      <el-table-tree-column
        prop="cat_name"
        label="分类名称"
        width="300"
        tree-key="cat_id"
        parent-key="cat_pid"
        level-key="cat_level">
      </el-table-tree-column>
      <el-table-column
        prop="cat_deleted"
        label="是否删除"
        width="300">
        <template slot-scope="scope"> 
            {{scope.row.cat_deleted? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_level"
        label="排序"
        width="300">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete" @click="delCats(scope.row.cat_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 插入分页功能 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>
   
    <!-- 弹出对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="40%">
  <el-form :model="catform" :rules="rules" label-width="80px" ref="catform" status-icon>
    <el-form-item label="分类名称" prop="cat_name">
      <el-input v-model="catform.cat_name"></el-input>
    </el-form-item>
    <el-form-item label="父级名称" prop="cat_pid">
       <!-- 级联选择器 -->
         <el-cascader
          :props="props"
          :options="options"
          v-model="catform.cat_pid"
          change-on-select
          clearable>
        </el-cascader>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCat">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogFormVisible: false,
      catform: {
        cat_name: '',
        cat_pid: []
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      options: [],
      // 级联菜单的属性配置
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      loading: true
    }
  },
  methods: {
    async gettableData() {
      this.loading = true
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      // console.log(res)
      let { data: { result, total }, meta: { status } } = res
      console.log(res)
      console.log(result, total)
      if (status === 200) {
        this.tableData = result
        this.total = total
        // console.log(this.tableData)
        setTimeout(() => {
          this.loading = false
        }, 500)
      }
    },
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val
      this.gettableData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.gettableData()
    },
    async delCats(id) {
      // console.log(id)
      try {
        await this.$confirm('是否要删除该分类', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`categories/${id}`)
        // console.log(res)
        let { data, meta: { status } } = res
        console.log(status)
        if (status === 200) {
          this.$message.success('删除成功')
          this.gettableData()
        }
      } catch (e) {
        this.$message.error('取消删除')
      }
    },
    async showDal() {
      this.dialogFormVisible = true
      // 获取分类的数据，获取2级
      let res = await this.axios.get('categories?type=2')
      let { meta: { status }, data } = res
      if (status === 200) {
        this.options = data
        console.log(this.options)
      }
    },
    addCat() {
      this.$refs.catform.validate(async vaild => {
        if (!vaild) return false
        let { cat_name: catName, cat_pid: catPid } = this.catform
        let res = await this.axios.post(`categories`, {
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_name: catName,
          cat_level: catPid.length
        })
        // console.log(res)
        let { data, meta: { status } } = res
        if (status === 201) {
          this.dialogFormVisible = false
          this.gettableData()
          this.$refs.catform.resetFields()
          this.$message.success('恭喜你，添加分类成功')
        }
      })
    }
  },
  created() {
    this.gettableData()
  }
}
</script>

<style>
</style>
