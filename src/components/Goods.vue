<template>
  <div class="goods">
    <!-- 添加按钮 -->
  <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <!-- 加入表格 -->
      <el-table
      :data="goodsData"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
         <el-table-column
        prop="add_time"
        label="创建时间">
      </el-table-column>
         <el-table-column
        label="操作">
        <template slot-scope="scope">
         <el-button type="primary" icon="el-icon-edit" plain size="small" ></el-button>
         <el-button type="danger" icon="el-icon-delete" plain size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6,8,10]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsData: [],
      query: '',
      pageSize: 10,
      currentPage: 1,
      total: 0
    }
  },
  methods: {
    // 渲染页面
    async getGoodsList() {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      console.log(res)
      let { data: { total, goods }, meta: { status } } = res
      if (status === 200) {
        this.goodsData = goods
        this.total = total
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      //  再次渲染
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      //  再次渲染
      this.getGoodsList()
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style>
</style>
