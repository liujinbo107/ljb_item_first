<template>
  <div class="bkc">
    <h1 style="margin-left: 600px">我爱编码安全中心</h1>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
      <el-form-item >
        <p>密码重置</p>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" placeholder="请输出新密码">
          <el-button slot="prepend" icon="iconfont icon-guanliyuanrenzheng"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item prop="repassword">
        <el-input type="password" v-model="ruleForm.repassword" placeholder="确认密码">
          <el-button slot="prepend" icon="iconfont icon-guanliyuanrenzheng"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item >
        <el-button @click="submitForm('ruleForm')">点击更改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    export default {
        name: "repassword",
      data(){
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.ruleForm.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
          return{
            ruleForm:{
              id:"",
              password:"",
              repassword:"",
            },
            rules:{
              password: [
                { required: true, message: '请填写密码', trigger: 'change' }
              ],
              repassword: [
                { validator: validatePass2, trigger: 'change' }
              ],
            },
            count:'',
            show:false
          }
      },
      mounted(){
        this.ruleForm.id = this.$route.query.id;
        let flag = this.$route.query.flag;
        this.$axios.post(this.domain.ssoserverpath+"toexpire",{flag:flag}).then((res)=>{
          if(res.data.code=="200"){
          }else{
            alert("您的链接已超时，请重新操作");
            this.$router.push({path:'/'});
          }
        })
      },
      methods:{
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.toupdate();
            } else {
              return false;
            }
          });
        },
        toupdate(){
          this.$axios.post(this.domain.ssoserverpath+"torepassword",this.ruleForm).then((res)=>{
            if(res.data.code=="200") {
              this.$message({
                type: 'success',
                message: '修改成功，即将跳转登陆页面!'
              });
              const TIME_COUNT = 3;
              if (!this.timer) {
                this.count = TIME_COUNT;
                this.show = false;
                this.timer = setInterval(() => {
                  if (this.count > 0 && this.count <= TIME_COUNT) {
                    this.count--;
                  } else {
                    this.show = true;
                    clearInterval(this.timer);
                    this.timer = null;
                    //跳转的页面写在此处
                    this.$router.push({path:'/'});
                  }
                }, 1000)
              }
            }else{
              alert("修改失败，请稍后再试")
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
