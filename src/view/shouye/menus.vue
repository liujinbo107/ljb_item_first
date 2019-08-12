<template>
  <div>

    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
    <el-container>
      <el-aside  width="200px" style="background-color: rgb(238, 241, 246)">
    <el-tree
      :data="menuData"
      class="filter-tree"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      :filter-node-method="filterNode"
      highlight-current
      :props="defaultProps"
      @node-click="nodeclick"
    >
    </el-tree>
      </el-aside>
<!--      <template>-->
<!--        <el-table-->
<!--          :data="tableData"-->
<!--          style="width: 20%">-->
<!--          <el-table-column-->
<!--            prop="menuName"-->
<!--            label="4级权限"-->
<!--            width="180">-->
<!--          </el-table-column>-->
<!--        </el-table>-->
<!--      </template>-->
      <el-dialog
        :title="title"
        :visible.sync="addRoleFormVisible"
        width="30%">
        <el-button type="primary" @click="addforms()" icon="el-icon-circle-plus" :disabled="disb" circle></el-button>
        <el-button type="primary" @click="updateforms()" icon="el-icon-edit" circle></el-button>
        <el-button type="danger" @click="delforms()" icon="el-icon-delete" circle></el-button>
        <el-button type="warning" icon="el-icon-star-off" circle></el-button>
        <hr>
        <br>
        <el-form :model="menuForm" label-width="130px" label-position="left" :hidden="addform">
          +添加子菜单<br><br>
          当前菜单等级&nbsp;:&nbsp;&nbsp;<span>{{menuForm.leval}}</span> &nbsp;&nbsp;当前菜单名称&nbsp;:&nbsp;&nbsp;<span>{{menuForm.menuName}}</span><br><br>
          当前菜单ID:&nbsp;&nbsp;&nbsp;&nbsp;<span>{{menuForm.id}}</span><br><br>

          <el-form-item label="新添加子菜单名称" >
            <el-input v-model="chmenu.menuName"></el-input>
          </el-form-item>
            <el-form-item label="菜单访问URL" v-if="menuForm.leval=='3'||menuForm.leval=='2'">
              <el-input v-model="chmenu.url"></el-input>
            </el-form-item>

        </el-form>

        <el-form :model="menuForm" ref="menuForm" label-width="130px" label-position="left" :hidden="updateform">
          修改当前菜单<br><br>
          当前菜单等级&nbsp;:&nbsp;&nbsp;<span>{{menuForm.leval}}</span> &nbsp;&nbsp;当前菜单名称&nbsp;:&nbsp;&nbsp;<span>{{menuForm.menuName}}</span><br><br>
          当前菜单ID:&nbsp;&nbsp;&nbsp;&nbsp;<span>{{menuForm.id}}</span><br><br>

          <el-form-item label="修改菜单名称" >
            <el-input v-model="menuForm.menuName"></el-input>
          </el-form-item>
          <el-form-item label="菜单访问URL">
            <el-input v-model="menuForm.url"></el-input>
          </el-form-item>
        </el-form>

        <el-form :model="menuForm" ref="menuForm" label-width="130px" label-position="left" :hidden="delform">
          -删除当前菜单<br><br>
          当前菜单等级&nbsp;:&nbsp;&nbsp;<span>{{menuForm.leval}}</span> &nbsp;&nbsp;当前菜单名称&nbsp;:&nbsp;&nbsp;<span>{{menuForm.menuName}}</span><br><br>
          当前菜单ID:&nbsp;&nbsp;&nbsp;&nbsp;<span>{{menuForm.id}}</span><br><br><br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你确定要删除此菜单么?
        </el-form>

        <span slot="footer" class="dialog-footer">
      <el-button @click="quxiao()">取 消</el-button>
      <el-button type="primary" @click="tijiao()" >提 交</el-button>
      </span>
      </el-dialog>
    </el-container>
    <div >

    </div>
  </div>
</template>

<script>
    export default {
        name: "menus",
      data(){
        return{
          defaultProps:{
            children:'menuInfoList',
            label:'menuName',
            code:'leval'
          },
          title:"",
          menuData:[],
          url:this.domain.serverpath,
          filterText:'',
          tableData:[],
          addRoleFormVisible:false,
          menuForm:{},
          addform:false,
          updateform:true,
          delform:true,
          chmenu:{},
          fas:1,
          disb:false,
          ids:[]
        }
      },
      mounted() {
        this.getlist();
      },
      watch: {
        filterText(val) {
          this.$refs.tree.filter(val);
        }
      },
      methods:{
          getlist(){
            this.$axios.post(this.url + "tofindallmenu").then((res) => {
              this.menuData = res.data.result;
            })
          },
        nodeclick(node,data,value){
          this.menuForm = node;
          this.lll = data;
          if(node.leval=='4'){
            this.updateforms();
            this.disb=true
          }
          this.addRoleFormVisible=true;
          this.title="当前操作菜单名称："+node.menuName;
        },
        addforms(){
          this.addform=false;
          this.updateform=true;
          this.delform=true;
          this.fas=1
        },
        updateforms(){
          this.addform=true;
          this.updateform=false;
          this.delform=true;
          this.fas =2
        },
        delforms(){
          this.addform=true;
          this.updateform=true;
          this.delform=false;
          this.fas=3;
          setTimeout(() => {
            this.$refs.tree.setCheckedKeys([this.menuForm.id]), 0
          })

        },
        resetChecked() {
          this.$refs.tree.setCheckedKeys([]);
        },
        quxiao(){
            this.addRoleFormVisible=false
          this.disb=false
          this.resetChecked();
        },
        tijiao(){
          if(this.fas==1){
            this.addmenu();
          }
          if(this.fas==2){
            this.updatemenu();
          }
          if(this.fas==3){
            this.delmenu();
          }
          this.disb=true
          this.resetChecked();
        },
        addmenu(){
            this.chmenu.parentId=this.menuForm.id;
            this.chmenu.leval = this.menuForm.leval+1;
            this.$axios.post(this.url+"toaddmenu",this.chmenu).then((res)=>{
              if(res.data.code=='200'){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getlist();
              }else{
                this.$message({
                  type: 'error',
                  message: '删除失败!'
                });
              }
            }).catch(()=>{
              this.$message({
                type: 'warning',
                message: '你没有权限操作!'
              });
            })
          this.addRoleFormVisible=false;
          this.addforms();
          this.chmenu={}
        },
        updatemenu(){
          this.$axios.post(this.url+"toupdatemenu",this.menuForm).then((res)=>{
            if(res.data.code=='200'){
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.getlist();
            }else{
              this.$message({
                type: 'error',
                message: '修改失败!'
              });
            }
          }).catch(()=>{
            this.$message({
              type: 'warning',
              message: '你没有权限操作!'
            });
          })
          this.addRoleFormVisible=false;
          this.addforms();
          this.chmenu={}
        },
        delmenu(){
            this.ids = this.$refs.tree.getCheckedKeys();
          this.$axios.post(this.url+"todelmenu",this.ids).then((res)=>{
            if(res.data.code=='200'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getlist();
            }else{
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
          }).catch(()=>{
            this.$message({
              type: 'warning',
              message: '你没有权限操作!'
            });
          })
          this.addRoleFormVisible=false;
          this.addforms();
          this.chmenu={}
        },
        filterNode(value, data) {
          if (!value) return true;
          return data.menuName.indexOf(value) !== -1;
        }
      }
    }
</script>

<style scoped>

</style>
