<template>
  <div class="add">
    <!-- 添加步骤栏 -->
    <el-steps :active="active" finish-status="success">
    <el-step title="步骤 1"></el-step>
    <el-step title="步骤 2"></el-step>
    <el-step title="步骤 3"></el-step>
    </el-steps>
    <!-- 添加tab栏 -->
    <el-tabs tab-position="left" @tab-click="changeActive" v-model="activeName">
      <el-tab-pane label="基本信息" name="basic">
        <el-form :model="addForm" label-width="80px">
           <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格"> 
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
            <el-form-item label="商品分类">
          <!-- 级联选择器 -->
            <el-cascader
              :props="props"
              :options="options"
              v-model="addForm.goods_cat">
            </el-cascader>
          </el-form-item>
          <!-- 单选框 -->
          <el-form-item label="是否促销">
            <el-radio v-model="addForm.is_promote" :label="true">是</el-radio>
            <el-radio v-model="addForm.is_promote" :label="false">否</el-radio>
          </el-form-item>
          <el-button style="margin-top: 12px;" @click="next(1,'pic')">下一步</el-button>
        </el-form>
      
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <!-- 图片上传 -->
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :on-success="handleSuccess"
          :headers="headers"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
          <el-button style="margin-top: 12px;" @click="next(2,'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <el-button type='primary' @click="addGood">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      tabPosition: 'left',
      //
      activeName: 'basic',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        is_promote: false,
        pics: [],
        goods_introduce: '',
        goods_cat: []
      },
      // 所有的分配的数据
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 上传图片需要设置token
      headers: { Authorization: localStorage.getItem('token') }
    }
  },
  methods: {
    changeActive(tab) {
      // console.log(tab)
      this.active = +tab.index
    },
    next(actve, activeName) {
      this.active = actve
      this.activeName = activeName
    },
    handleSuccess(res, file, fileList) {
      // console.log(res)
      let { data: { tmp_path: tmpath }, meta: { status } } = res
      if (status === 200) {
        this.addForm.pics.push({
          pic: tmpath
        })
        // console.log(this.addForm.pics)
      }
    },
    async addGood() {
      // this.addForm.goods_cat = this.addForm.goods_cat.join()
      let res = await this.axios.post('goods', {
        ...this.addForm,
        goods_cat: this.addForm.goods_cat.join()
      })
      let { meta: { status } } = res
      if (status === 201) {
        this.$router.push('/goods')
        this.$message.success('恭喜你，添加成功')
      }
    }
  },
  async created() {
    let res = await this.axios.get('categories?type=3')
    // console.log(res)
    let { data, meta: { status } } = res
    if (status === 200) {
      this.options = data
    }
  }
}
</script>

<style lang="less" scope>
.quill-editor {
  background-color: #fff;
  /deep/ .ql-editor {
    height: 500px;
  }
}
</style>
