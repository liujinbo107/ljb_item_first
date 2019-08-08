<template>
  <div>
    <el-form :inline="true" :model="mypage" class="demo-form-inline">
      <el-form-item label="角色名称">
        <el-input v-model="mypage.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="tianjia">添加角色</el-button>
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%">

      <el-table-column
        prop="id"
        label="序号"
        width="200">
      </el-table-column>

      <el-table-column
        label="角色名称"
        width="300">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>角色名称: {{ scope.row.roleName }}</p>
            <p>角色描述: {{ scope.row.miaoShu }}</p>
            <p>绑定用户:{{scope.row.userNames}}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.roleName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        prop="miaoShu"
        label="角色描述"
        width="300">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="open(scope.$index, scope.row)">删除</el-button>
          <el-button type="primary" @click="dakai(scope.row)">编辑绑定权限</el-button>
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
      title="添加角色"
      :visible.sync="dialogVisible"
      width="30%">

      <el-form :model="entityMod" :rules="rules" ref="ruleForm" label-width="80px">

        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="entityMod.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="miaoShu">
          <el-input v-model="entityMod.miaoShu"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm('ruleForm')">重 置</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')" >保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑角色"
      :visible.sync="addRoleFormVisible"
      width="30%">

      <el-form :model="entityMod" :rules="rules" ref="ruleForm" label-width="80px">

        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="entityMod.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="miaoShu">
          <el-input v-model="entityMod.miaoShu"></el-input>
        </el-form-item>

      </el-form>
      权限列表信息
      <el-tree
        :data="menuData"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>

      <span slot="footer" class="dialog-footer">
      <el-button @click="quxiao()">取 消</el-button>
      <el-button type="primary" @click="tijiao('ruleForm')" >保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "role",
      data(){
          return{
            tableData:[],
            entityMod:{},
            mypage:{
              roleName:'',
              pageNo:1,
              pageSize:5
            },
            url:this.domain.serverpath,
            total:10,
            ruleForm: {
              roleName: '',
              miaoShu: '',
            },
            dialogVisible:false,
            rules: {
              roleName: [
                { required: true, message: '请填写角色名称', trigger: 'change' }
              ],
              miaoShu: [
                {  required: true, message: '请填写角色描述', trigger: 'change' }
              ]
            },
            addRoleFormVisible:false,
            menuData:[],
            defaultProps:{
              children:'menuInfoList',
              label:'menuName',
              code:'leval'
            },
            updateform:{
              id:"",
              menuName:"",
              code:""
            },
            nodes:[]
          }
      },
      mounted() {
        this.getlist(this.mypage)
        this.$axios.post(this.url + "tofindallmenu").then((res) => {
          this.menuData = res.data.result;
        })
      },
      methods: {
        getlist(mypage) {
          this.$axios.post(this.url + "toRoleList", mypage).then((res) => {
            this.tableData = res.data.result.list;
            this.total = res.data.result.total;
          })
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
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
        toadd() {
            this.$axios.post(this.url + "toaddrole", this.entityMod).then((res) => {
              if (res.data.code == '200') {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                });
                this.dialogVisible = false;
                this.entityMod = {};
                this.getlist(this.mypage);
              } else if (res.data.code == '203') {
                alert("角色已存在")
              } else {
                this.$message({
                  type: 'success',
                  message: '添加失败!'
                });
              }
            }).catch((error) => {
              this.$message({
                type: 'info',
                message: '你没有权限操作！'
              });
            })
        },
        tianjia() {
          this.dialogVisible = true;
        },
        dakai(row) {
          this.entityMod = row;
          this.nodes = row.listMenuInfo.filter(item => item.leval == '4');
          this.addRoleFormVisible = true;
          setTimeout(() => {
            this.$refs.tree.setCheckedNodes(this.nodes), 0
          })
        },
        tijiao(){
          this.entityMod.listMenuInfo={};
          this.entityMod.mid=this.$refs.tree.getHalfCheckedKeys()+','+this.$refs.tree.getCheckedKeys();
          alert(this.entityMod)
          this.$axios.post(this.url+'tobdmenu',this.entityMod).then((res)=>{
            if(res.data.code=='200'){
              this.$message({
                type: 'success',
                message: '编辑成功!'
              });
              this.addRoleFormVisible = false;
              this.entityMod={}
            }else{
              this.$message({
                type: 'success',
                message: '编辑失败!'
              });
            }
          }).catch((error) => {
            this.$message({
              type: 'info',
              message: '你没有权限操作！'
            });
          })
          },
        quxiao(){
          this.addRoleFormVisible = false;
          this.nodes=[]
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
        onSubmit() {
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

</style>
