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
        title="当前操作的菜单名称"
        :visible.sync="addRoleFormVisible"
        width="30%">
        <el-button type="primary" icon="el-icon-circle-plus" circle></el-button>
        <el-button type="primary" icon="el-icon-edit" circle></el-button>
        <el-button type="danger" icon="el-icon-delete" circle></el-button>
        <el-button type="warning" icon="el-icon-star-off" circle></el-button>
        <hr>
        <br>
        <el-form :model="menuForm" ref="menuForm" label-width="130px" label-position="left">
          +添加子菜单<br><br>
          当前菜单等级&nbsp;:&nbsp;&nbsp;<span>{{menuForm.leval}}</span> &nbsp;&nbsp;当前菜单名称&nbsp;:&nbsp;&nbsp;<span>{{menuForm.menuName}}</span><br><br>
          当前菜单ID:&nbsp;&nbsp;&nbsp;&nbsp;<span>{{menuForm.id}}</span><br><br>

          <el-form-item label="新添加子菜单名称" prop="roleName">
            <el-input v-model="menuForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="菜单访问URL" prop="miaoShu">
            <el-input v-model="menuForm.miaoShu"></el-input>
          </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
      <el-button @click="quxiao()">取 消</el-button>
      <el-button type="primary" @click="tijiao('menuForm')" >保 存</el-button>
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
          menuData:[],
          url:this.domain.serverpath,
          filterText:'',
          tableData:[],
          addRoleFormVisible:false,
          menuForm:{}
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
            this.$axios.post(this.url + "toMenuList").then((res) => {
              this.menuData = res.data.result;
            })
          },
        nodeclick(node,data,value){
          this.menuForm = node;
          this.addRoleFormVisible=true;
        },
        quxiao(){
            this.addRoleFormVisible=false
        },
        tijiao(){

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
