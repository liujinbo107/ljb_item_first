<template>
  <div>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">

        <el-form :inline="true" :model="mypage" class="demo-form-inline">
          <el-form-item label="用户名">
            <el-input v-model="mypage.userName" placeholder="用户名"></el-input>
          </el-form-item>

          <el-form-item label="创建时间">
            <el-date-picker
              v-model="mypage.sta"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>--
            <el-date-picker
              v-model="mypage.sto"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="性别">
            <el-select v-model="mypage.sex" >
              <el-option label="全部" value=""></el-option>
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="tianjia">添加新用户</el-button>
        <el-button @click="exportData" type="success" size="min" icon="el-icon-download">导出数据</el-button>
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%">

          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column
            label="用户名"
            width="120">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>用户名: {{ scope.row.userName }}</p>
                <p>登录名: {{ scope.row.loginName }}</p>
                <p v-if="scope.row.sex==1">性别：男</p>
                <p v-if="scope.row.sex==2">性别：女</p>
                <p v-if="scope.row.roleInfo!=null">角色:{{scope.row.roleInfo.roleName}}</p>
                <el-image
                  style="width: 60px; height: 60px"
                  :src="vhosturl+scope.row.touxiang+smallurl"
                ></el-image>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.userName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            prop="loginName"
            label="登录名"
            width="120">
          </el-table-column>

          <el-table-column
            label="性别"
            width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.sex==1">男</span>
              <span v-if="scope.row.sex==2">女</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="tel"
            label="电话"
            width="120">
          </el-table-column>

          <el-table-column
            label="图片"
            width="120">
            <template slot-scope="scope">
              <el-image
                style="width: 60px; height: 60px"
                :src="vhosturl+scope.row.touxiang+smallurl"
                :preview-src-list="[vhosturl+scope.row.touxiang+nomalurl]"
              ></el-image>
            </template>
          </el-table-column>

          <el-table-column
            label="已绑定角色"
            width="120"
            prop=""
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>角色名: {{ scope.row.roleInfo.roleName}}</p>
                <p>角色描述: {{ scope.row.roleInfo.miaoShu }}</p>
                <el-button size="mini" @click="delbdrole(scope.row.id)" v-if="scope.row.roleInfo.id!='1908131117520000'&&scope.row.roleInfo.level>userInfo.roleInfo.level">解除绑定</el-button>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{scope.row.roleInfo.roleName}}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope" v-if="scope.row.roleInfo.level>userInfo.roleInfo.level">

              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="open(scope.$index, scope.row)">删除</el-button>
              <el-button type="primary" @click="dakai(scope.row)">绑定角色</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="mypage.pageNo"
          :page-sizes="[2, 3, 5, 7]"
          :page-size="mypage.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total">
        </el-pagination>

        <el-dialog
          title="编辑用户"
          :visible.sync="dialogVisible"
          width="30%">

          <el-form :model="entityMod" :rules="rules" ref="ruleForm" label-width="80px">

            <el-form-item label="用户名" prop="userName">
              <el-input v-model="entityMod.userName"></el-input>
            </el-form-item>

            <el-form-item label="登录名" prop="loginName">
              <el-input v-model="entityMod.loginName"></el-input>
            </el-form-item>

            <el-form-item label="电话" prop="tel">
              <el-input v-model="entityMod.tel"></el-input>
            </el-form-item>

            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="entityMod.sex" >
                <el-radio-button label="1" >男</el-radio-button>
                <el-radio-button label="2" >女</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="entityMod.email"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="entityMod.password"></el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="repassword">
              <el-input type="password" v-model="entityMod.repassword"></el-input>
            </el-form-item>

            <el-form-item label="头像图片">
              <el-upload
                class="avatar-uploader"
                action="http://localhost:10000/api/manger/touploaduser"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

          </el-form>

          <span slot="footer" class="dialog-footer">
      <el-button @click="guanbi()">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')" >确 定</el-button>
      </span>
        </el-dialog>

        <el-dialog title="绑定权限" :visible.sync="addRoleFormVisible">
          <el-form :model="roleForm" status-icon>
            <el-select v-model="roleForm.roleId" filterable placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addRoleFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="doAddUserRole">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane label="批量添加" name="second">
        <div style="float: left;"><el-button style="margin-left: 10px;" size="small" type="warning" @click="downloadTemplate">下载模板</el-button></div>
        <el-upload
          class="upload-demo"
          :headers="this.header"
          ref="upload"
          action="https://localhost:10000/api/manger/toaddusers"
          :on-preview="handlePreview"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
        </el-upload>

      </el-tab-pane>
      <el-tab-pane label="用户活跃量" name="third">
        <div id="huo" style="width: 650px;height: 400px;"></div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
    export default {
      name: "user",
      data(){
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.entityMod.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        var validPhone=(rule, value,callback)=>{
          const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
          if (!value) {
            return callback(new Error('电话号码不能为空'))
          }
          setTimeout(() => {
            // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
            // 所以我就在前面加了一个+实现隐式转换
            if (!Number.isInteger(+value)) {
              callback(new Error('请输入数字值'))
            } else {
              if (phoneReg.test(value)) {
                callback()
              } else {
                callback(new Error('电话号码格式不正确'))
              }
            }
          }, 100)
        }
        return{
          dialogVisible:false,
          header:{
            token:this.$store.state.token
          },
          jl:{
            name:'',
            titlelevel:'中级'
          },
          value: '',
          activeName: 'first',
          tableData:[],
          role:{},
          entityMod:{},
          vhosturl:"http://49.232.19.36:8888/group1/",
          smallurl:"_100x100.jpg",
          nomalurl:".jpg",
          mypage:{
            userName:"",
            sex:"",
            sta:"",
            sto:"",
            pageNo:1,
            pageSize:5,
          },
          url:this.domain.serverpath,
          total:10,
          dialogVisible:false,
          imageUrl:"",
          ruleForm: {
            userName: '',
            loginName: '',
            sex: '',
            password: '',
            repassword: '',
            tel:'',
            email:''
          },
          srcList:"",
          rules: {
            userName: [
              { required: true, message: '请填写用户名', trigger: 'change' }
            ],
            loginName: [
              {  required: true, message: '请填写登录名', trigger: 'change' }
            ],
            sex: [
              {  required: true, message: '请选择性别', trigger: 'change' }
            ],
            password: [
              { required: true, message: '请填写密码', trigger: 'change' }
            ],
            repassword: [
              { validator: validatePass2, trigger: 'change' }
            ],
            tel:[
              { validator:validPhone, trigger: 'change' }
            ],
            email:[
              { required: false, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ]
          },
          repassword:'',
          roleList:[],
          addRoleFormVisible:false,
          roleForm:{
            roleId:'',
            userId:''
          },
          userInfo:this.$store.state.userInfo,
          charts: '',
          /*  opinion: ["1", "3", "3", "4", "5"],*/
          opinionData:[],
          arr:[],
        }
      },
      watch: {
        opinionData(a,b){
          this.drawLine('huo')
        }
      },
      mounted() {
        this.getlist(this.mypage);
        this.$nextTick(function() {
          for(var i = -6; i < 1 ; i++) {
            this.arr.push(this.getBeforeDate(i));
          }
            this.drawLine('huo')
        })
        this.getUserAccess();
      },
      methods:{
        getUserAccess(){
          this.$axios.post(this.url+"getUserAccess").then((res)=>{
            //alert(res.data.result)
            this.opinionData = res.data.result;
          })
        },
        downloadTemplate(){
          //下载模板
          var that = this;
          let listData = [];
          require.ensure([], () => {
            const { export_json_to_excel } = require('@/excel/export2Excel'); //这里必须使用绝对路径，使用@/+存放export2Excel的路径
            const tHeader = ['id','用户名','登录名','父id','密码','性别','电话','头像','邮箱']; // 导出的表头名信息
            const filterVal = "" // 导出的表头字段名，需要导出表格字段名
            const list = listData;
            const data = that.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, '批量添加模板excel');// 导出的表格名称，根据需要自己命名
          })
        },
        //格式转换，直接复制即可
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => v[j]))
        },
        drawLine(id) {
          this.charts = this.echarts.init(document.getElementById(id))
          this.charts.setOption({
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['近七日用户活跃度']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },

            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              name: '日期',
              boundaryGap: false,
              data: this.arr,
            },
            yAxis: {
              type: 'value',
              name: '用户量/次',
            },
            series: [{
              name: '近七日用户活跃度',
              type: 'line',
              stack: '总量',
              data: this.opinionData
            }]
          })
        },
        getBeforeDate(n) {
          var n = n;
          console.log(n);//
          var d = new Date();
          var year = d.getFullYear();
          var mon = d.getMonth() + 1;
          var day = d.getDate();
          if(day <= n) {
            if(mon > 1) {
              mon = mon - 1;
            } else {
              year = year - 1;
              mon = 12;
            }
          }
          d.setDate(d.getDate() + n); //很重要，+n取得是前一天的时间
          year = d.getFullYear();
          mon = d.getMonth() + 1;
          day = d.getDate();
          var s = (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
          return s;
        },
        submitUpload() {
          this.$refs.upload.submit();
          this.$message({
            type: 'success',
            message: '导出成功!'
          });
        },
        delbdrole(id){
          this.$confirm('此操作将永久解除该用户的角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.$axios.post(this.url+"todelbdrole",{id:id}).then((res)=>{
              if(res.data.code){
                this.$message({
                  type: 'success',
                  message: '解除成功!'
                });
                this.getlist(this.mypage);
              }
            }).catch(()=>{
              this.$message({
                type: 'warning',
                message: '你没有权限操作！'
              });
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePreview(file) {
          console.log(file);
        },
        exportData(){
          this.$axios.post(this.url+"toexport").then((res)=>{
            if(res.data.code='200'){
              this.$message({
                type: 'success',
                message: '导出成功!'
              });
            }else{
              this.$message({
                type: 'success',
                message: '导出失败!'
              });
            }
          }).catch((error)=>{
            this.$message({
              type: 'info',
              message: '你没有权限操作！'
            });
          })

        },
        getlist(mypage){
          this.$axios.post(this.url+"toUserList",mypage).then((res)=>{
            this.tableData = res.data.result.list;
            this.total = res.data.result.total;
          })
        },
        handleClick(tab, event) {

        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.toadd();
            } else {
              return false;
            }
          });
        },
        tianjia(){
          this.dialogVisible=true;
        },
        toadd(){
          if(this.entityMod.id!=null){
            this.$axios.post(this.url+"toupdateuser",this.entityMod).then((res)=>{
              if(res.data.code=='200'){
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                this.dialogVisible=false;
                this.entityMod = {};
                this.getlist(this.mypage);
              }else if(res.data.code=='203'){
                alert("登录名已存在")
              }else{
                this.$message({
                  type: 'success',
                  message: '修改失败!'
                });
              }
            }).catch((error)=>{
              this.$message({
                type: 'info',
                message: '你没有权限操作！'
              });
            })
          } else{
            this.$axios.post(this.url+"toadduser",this.entityMod).then((res)=>{
              if(res.data.code=='200'){
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                });
                this.dialogVisible=false;
                this.entityMod = {};
                this.getlist(this.mypage);
              }else if(res.data.code=='203'){
                alert("登录名已存在")
              }else{
                this.$message({
                  type: 'success',
                  message: '添加失败!'
                });
              }
            }).catch((error)=>{
              this.$message({
                type: 'info',
                message: '你没有权限操作！'
              });
            })
            }
        },
        dakai(row){
          this.$axios.post(this.url+"tofindallrole",{leval:this.userInfo.roleInfo.level}).then((res)=>{
            this.roleList = res.data.result;
          })
          if(row.roleInfo!=null){
            this.roleForm.roleId = row.roleInfo.id;
          }
          this.roleForm.userId = row.id;
          this.addRoleFormVisible=true;
        },
        doAddUserRole(){
          this.$axios.post(this.url+"tobdrole",this.roleForm).then((res)=>{
            if(res.data.code=='200'){
              this.$message({
                type: 'success',
                message: '绑定成功!'
              });
              this.addRoleFormVisible=false;
              this.roleForm={}
              this.getlist(this.mypage);
            }else{
              this.$message({
                type: 'success',
                message: '绑定失败!'
              });
            }
          }).catch((error)=>{
            this.$message({
              type: 'info',
              message: '你没有权限操作！'
            });
          })
        },
        handleAvatarSuccess(res, file) {
          this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
          this.tupian = file.name;
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;
          this.entityMod.touxiang = file.name;
          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
        },
        onSubmit() {
          if(this.mypage.sta==null){
            this.mypage.sta=="";
          }
          if(this.mypage.sto==null){
            this.mypage.sto=="";
          }
          this.getlist(this.mypage);
        },
        handleSizeChange(val) {
          this.mypage.pageSize = val;
          this.getlist(this.mypage)
        },
        handleCurrentChange(val) {
          this.mypage.pageNo = val;
          this.getlist(this.mypage);
        },
        handleEdit(index, row) {
          this.dialogVisible=true;
          this.entityMod = row;
          this.entityMod.password = "";
          this.imageUrl = 'http://49.232.19.36:8888/group1/'+row.touxiang+'.jpg';
        },
        guanbi(){
          this.dialogVisible=false;
          this.entityMod = {};
        },
        open(index,row) {
          this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.$axios.post(this.url+"todeluser",{id:row.id}).then((res)=>{
              if(res.data.code){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getlist(this.mypage);
              }
            }).catch(()=>{
              this.$message({
                type: 'warning',
                message: '你没有权限操作！'
              });
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
      }
    }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  #huo {
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
