<template>
  <div class="login">
    <!--el-form表单组件  -->
    <!--:model="form" form对象用来收集所有的form的数据  -->
  <el-form ref="form" :model="form" label-width="80px" :rules="rules">
    <img src="../assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
       <el-form-item label="密  码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
</el-form>
  </div>
</template>

<script>
 import axios from 'axios'
 export default {
    data() {
      return {
        form: {
          username:'',
          password:''
        },
        rules: {
          // 对username进行验证
          username: [
            // 必填项
            {require:true,message:'用户名不能为空',trigger:'change'},
            {min:3,max:9,message:'长度在3到9个字符',trigger:'change'}
          ],
          // 对password进行验证
          password: [
            {require:true,message:'密码不能为空',trigger:'change'},
            {min:6,max:12,message:'长度在6到12位',trigger:'change'}
          ]
        }
      }
    },
    methods: {
      // 重置表单
      reset() {
        // 通过this.$refs.form获取整个表单元素
         this.$refs.form.resetFields()
      },
      // 登录处理
      login() {
         this.$refs.form.validate((valid) => {
          //  console.log(valid)
          // vaild值为判断表单验证是否通过，通过为true，不通过为false
          if(valid) {
            // 验证通过就发送ajax请求
            axios({
              url:'http://localhost:8888/api/private/v1/login',
              method:'post',
              data:this.form
              // 这个用箭头函数保证this指向vm
            }).then(res => {
              // console.log(res)
              if(res.data.meta.status==200) {
                console.log('登录成功')
                // 输出登录成功
                this.$message.success('用户登录成功')//消息提示组价固定语法
                // 存储token，进行登录拦截
                localStorage.setItem('token',res.data.data.token)
                // 通过路由跳转到home组件
                this.$router.push('/home')
              } else {
                // 登录失败
                this.$message.error(res.data.meta.msg)
              }
            })
          } else {
            // 表单验证没有提供
            console.log('表单验证没有通过')
            // 直接跳出
            return false
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
    .login {
      height: 100%;
      // 注意这里因为height不继承，所有父元素全部要加height：100%
      background-color: #2d434c;
      overflow: hidden;
    
      .el-form {
        width: 400px;
        margin: 200px auto;
        background-color: #fff;
        padding: 80px 30px 20px;
        border-radius: 10px;
        position: relative;

          img {
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
          border: 10px solid #fff;
        }

        .el-button:nth-child(2) {
          margin-left: 70px;
        }
      }
  
    }
</style>
