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
                  :src="'http://localhost:8888/'+scope.row.touxiang"
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
                :src="'http://localhost:8888/'+scope.row.touxiang"
              ></el-image>
            </template>
          </el-table-column>

          <el-table-column
            label="已绑定角色"
            width="120"
            prop=""
          >
            <template slot-scope="scope">
              <span v-if="scope.row.roleInfo!=null"> {{scope.row.roleInfo.roleName}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
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
          <el-form :model="roleForm" status-icon :rules="rolerules" ref="updateForm">
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


        <el-upload
          style="display: inline"
          :show-file-list="false"
          :on-success="onSuccess"
          :on-error="onError"
          :before-upload="beforeUpload"
          :auto_upload="false"
          action="/system/basic/jl/import">
          <el-button slot="trigger" type="primary">选取文件</el-button>
          <el-button type="success" :disabled="!enabledUploadBtn" :icon="uploadBtnIcon">{{btnText}}</el-button>
        </el-upload>

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
        return{
          uploadBtnIcon:'el-icon-upload2',
          enabledUploadBtn:true,
          dialogVisible:false,
          btnText:'点击选择文件',
          jl:{
            name:'',
            titlelevel:'中级'
          },
          jls:[],
          tls: [{
            value: '员级',
            label: '员级'
          }, {
            value: '初级',
            label: '初级'
          }, {
            value: '中级',
            label: '中级'
          }, {
            value: '副高级',
            label: '副高级'
          }, {
            value: '正高级',
            label: '正高级'
          }],
          value: '',
          activeName: 'first',
          tableData:[],
          role:{},
          entityMod:{},
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
            tel:''
          },
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
              { required: true, message: '请填写电话', trigger: 'change' }
            ]
          },
          rolerules:{
            roleId:[
              {required: true, message: '请选择性别', trigger: 'change'}
            ]
          },
          repassword:'',
          roleList:[],
          addRoleFormVisible:false,
          roleForm:{
            roleId:'',
            userId:''
          }
        }
      },
      mounted() {
        this.getlist(this.mypage);
      },
      methods:{
        onSuccess(response,file,fileList){
          this.enabledUploadBtn=true;
          this.uploadBtnIcon="el-icon-upload2";
          this.btnText='数据导入';
          alert("数据导入成功！");
          this.initJls();
        },

        onError(err,file,fileList){
          this.enabledUploadBtn=true;
          this.uploadBtnIcon="el-icon-upload2";
          this.btnText='数据导入';
          alert("数据导入失败！请检查是否有重复数据,和网络连接状况！");
        },
        beforeUpload(file){
          this.enabledUploadBtn=false;
          this.uploadBtnIcon="el-icon-loading";
          this.btnText='正在导入';
        },
        initJls() {
          this.getRequest("/system/basic/jl/").then(resp => {
            if (resp) {
              this.jls = resp;
            }
          })
        },
        importData(){
          //1.查找到存放文件的元素
          let myfile=this.$refs.myfile;
          //2.钙元素内部有一个file数组，里面存放了所有选择的file。
          // 由于上传文件时，文件可以多选，因此这里拿到的files对象是一个数组
          let files=myfile.files;
          //3.从files对象中，获取自己要上传的文件（即数组中的第一项）
          let file=files[0];
          //4.构造一个FormData，用来存放上传的数据，注意FormData不可以使用链式配置
          var formData = new FormData();
          formData.append("file",file);
          formData.append("username","Kyokkk");
          //5.构造好FormData后，就可以直接上传数据了，FormData就是要上传的数据
          //6.文件上传注意两点，①请求方法为POST，②设置Content-Type为multipart/form-data
          this.uploadFileRequest("/system/basic/jl/import",formData).then(resp=>{
            if (resp) {
              alert(resp);
            }
          })
        },
        exportData(){
          /*表示在当前页面打开新地址*/
          window.open("/system/basic/jl/export","_parent");
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
          this.$axios.post(this.url+"tofindallrole").then((res)=>{
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
          this.imageUrl = 'http://localhost:8888/'+row.touxiang;
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
              }else{
                this.$message({
                  type: 'info',
                  message: '你没有权限操作！'
                });
              }
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
</style>
