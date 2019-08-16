<template>
  <div class="bkc">
    <h1 style="margin-left: 600px">我爱编码安全中心</h1>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
      <el-form-item >
        <p>邮箱验证</p>
      </el-form-item>
      <el-form-item prop="loginName">
        <el-input v-model="ruleForm.loginName" placeholder="请输入登录名称">
          <el-button slot="prepend" icon="iconfont icon-guanliyuanrenzheng"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item >
        <el-button @click="submitForm('ruleForm')">点击验证</el-button>
      </el-form-item>
      </el-form>
  </div>
</template>

<script>
    export default {
        name: "password",
      data(){
          return{
            ruleForm:{
              loginName:''
            },
            rules:{
              loginName: [
                {  required: true, message: '请填写登录名', trigger: 'change' }
              ],
            },
            url:this.domain.ssoserverpath,
          }
      },
      methods:{
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.tosub();
            } else {
              return false;
            }
          });
        },
        tosub(){
          this.$axios.post(this.url+"tosendEmail",this.ruleForm).then((res)=>{
            if(res.data.code=='500'){
              alert("该用户不存在")
            }
            if(res.data.code=='505'){
              alert("该用户还未绑定邮箱,请通过其他验证方式验证")
            }
            if(res.data.code=='506'){
              alert("验证码发送失败，请稍后重试")
            }
            if(res.data.code=='200'){
              alert("验证成功发送到您的邮箱，请您注意查收")
            }
          })
        },
      }
    }
</script>

<style scoped>
  .ms-content{
    padding: 0px 600px;
  }
  .bkc{
    width: 100%;
    height: 100%;
    background:skyblue;
  }
</style>
