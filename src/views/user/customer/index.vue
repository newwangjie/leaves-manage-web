<template lang="html">
  <div class="app-container">
    <!-- search -->
    <local-search class="g-listpage-container p-down-space"
    :base="request.params" :powerBtn="power_btn" :loading="search.loading" @search="searchEvent" @reset="searchResetEvent"></local-search>
    <!-- table-lists -->
    <div style="margin: 10px 0;">
      <el-button icon="el-icon-circle-plus" size="small" type="primary" @click="getAddUer()">新增</el-button>
      <el-button icon="el-icon-delete-solid" size="small" type="danger" @click="getDelete()">批量删除</el-button>
    </div>
    <el-table @selection-change="handleSelectionChange" :data="aaa" v-loading="table.loading" size="small" stripe>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="is_new" label="ID"></el-table-column>
      <el-table-column align="center" prop="product_image" label="头像">
        <template slot-scope="scope">
          <div class="formImg">
            <img :src="scope.row.product_image" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="is_new" label="客户名称"></el-table-column>
      <el-table-column align="center" prop="product_priority" label="当前票数"></el-table-column>
      <el-table-column align="center" prop="product_priority" label="创建人"></el-table-column>
      <el-table-column align="center" prop="product_priority" label="创建时间"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div class="table-lists-operate">
            <el-button type="text" size="mini" @click="addticket">加票</el-button>
            <el-button type="text" size="mini" @click="editticket">减票</el-button>
            <el-button type="text" size="mini" style="color: #F56C6C;">删除用户</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <div class="g-pagination" style="text-align: right; marginTop: 20px;">
      <el-pagination @current-change="gotoPage" :current-page="curr_page" :total="total" :page-size="10"  layout="total, prev, pager, next, jumper" background></el-pagination>
    </div>
    <el-dialog :title="ticketType === 'add' ? '加票' : '减票'" v-if="dialogVisible" :visible.sync="dialogVisible" width="30%" top="30vh">
      <el-form ref="dataForm" :model="dataForm" label-width="80px"  :rules="rules">
        <el-form-item label="管理员" prop="role_name">
          <el-input type='text' size='small' v-model.trim="dataForm.role_name" placeholder="" style="width:100%">
          </el-input>
        </el-form-item>
        <el-form-item label="票数" prop="role_name">
          <el-input type='text' :maxlength="20" size='small' v-model.trim="dataForm.role_name" placeholder="" style="width:100%">
            <el-button slot="append">票</el-button>
          </el-input>
        </el-form-item>
        <div style="text-align: center;">
          <el-button @click="onSubmit" type='primary' size='small'>确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="客户信息" v-if="dialogVisibleUser" :visible.sync="dialogVisibleUser" width="30%" top="30vh">
      <el-form ref="dataForm" :model="dataForm" label-width="80px"  :rules="rules">
        <el-form-item label="客户名称" prop="role_name">
          <el-input type='text' size='small' v-model.trim="dataForm.role_name" placeholder="" style="width:100%">
          </el-input>
        </el-form-item>
        <el-form-item label="头像" prop="fjsl">
          <el-upload action="" list-type="picture-card" multiple accept="image/*" :before-upload="beforeUploadHandle" :on-exceed="handleExceed" :file-list="fileList">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
            </div>
          </el-upload>
        </el-form-item>
        <div style="text-align: center;">
          <el-button @click="onSubmit" type='primary' size='small'>确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import MixinsListpage from '../../mixin/mixin-listpage'
import LocalSearch from './search.vue'

export default {
  components: { LocalSearch },
  mixins: [MixinsListpage],
  data () {
    return {
      power_btn: '',
      change: true,
      id: null,
      loading_id: null,
      request: {
        url: 'product', // 请求接口
        method: 'get', // 请求方法
        params: {
          page: 0
        }, // 基础请求参数
        data: null // 请求发送参数
      },
      edit_loading: false,
      aaa: [
        {
          dds: 111, ss: 222
        }
      ],
      dialogVisible: false,
      dataForm: {},
      rules: {},
      ticketType: 'add',
      dialogVisibleUser: false,
      fileList: []
    }
  },
  created () {
  },
  methods: {
    addticket () {
      this.ticketType = 'add'
      this.dialogVisible = true
    },
    editticket () {
      this.ticketType = 'edit'
      this.dialogVisible = true
    },
    getAddUer () {
      this.dialogVisibleUser = true
    },
    beforeUploadHandle () {},
    handleExceed(files, fileList) {
      console.log('files->', files)
      console.log('fileList----->', fileList)
      this.$message.error("最多上传10个文件！");
      return false;
    },
    getStatusData (id) {
      this.$confirm('此操作将修改商品状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return new Promise((resolve, reject) => {
          this.$Axios.delete('product/' + id, {}).then((resp) => { // 请求成功
            if (resp.return_code === '0000') {
              this.gotoPage(this.curr_page)
            } else {
              this.$message({ message: resp.return_msg, duration: 5000, showClose: true, type: 'warning' })
            }
            resolve(resp)
          }).catch((error) => { // 请求失败
            this.$_requestInterceptor('error', error)
            reject(error)
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    onSubmit () {},
    getIsNew (o) {
      let obj = {
        is_new: o.is_new,
        table: 'product'
      }
      return new Promise((resolve, reject) => {
        this.$Axios.put('product_priority/' + o.id, obj).then((resp) => { // 请求成功
          if (resp.return_code === '0000') {
            this.$message({ type: 'success', message: '修改成功!' })
            this.gotoPage(this.curr_page)
          } else {
            this.$message({ message: resp.return_msg, duration: 5000, showClose: true, type: 'warning' })
          }
          resolve(resp)
        }).catch((error) => { // 请求失败
          this.$_requestInterceptor('error', error)
          reject(error)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .formImg{
    // width: 110px;
    height: 80px;
    border:1px solid #f5f7fa;
    border-radius: 2px;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
    img{
      width: 100%;
      height: 100%;
    }
  }
</style>
