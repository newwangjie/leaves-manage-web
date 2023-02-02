<template lang="html">
  <div class="app-container">
    <!-- search -->
    <local-search class="g-listpage-container p-down-space"
    :base="request.params" :powerBtn="power_btn" :loading="search.loading" @search="searchEvent" @reset="searchResetEvent"></local-search>
    <!-- table-lists -->
    <el-table @selection-change="handleSelectionChange" :data="aaa" v-loading="table.loading" size="small" stripe>
      <el-table-column align="center" prop="is_new" label="ID"></el-table-column>
      <el-table-column align="center" prop="product_image" label="头像">
        <template slot-scope="scope">
          <div class="formImg">
            <img :src="scope.row.product_image" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="is_new" label="管理员账号"></el-table-column>
      <el-table-column align="center" prop="is_new" label="管理员名称"></el-table-column>
      <el-table-column align="center" prop="product_priority" label="描述"></el-table-column>
      <el-table-column align="center" prop="product_priority" label="创建时间"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div class="table-lists-operate">
            <el-button type="text" size="mini">密码重置</el-button>
            <el-button type="text" size="mini" style="color: #F56C6C;">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <div class="g-pagination" style="text-align: right; marginTop: 20px;">
      <el-pagination @current-change="gotoPage" :current-page="curr_page" :total="total" :page-size="10"  layout="total, prev, pager, next, jumper" background></el-pagination>
    </div>
    <!-- <el-dialog :title="ticketType === 'add' ? '新增票' : '减少票'" v-if="dialogVisible" :visible.sync="dialogVisible" width="30%" top="30vh">
      <el-form ref="dataForm" :model="dataForm" label-width="80px"  :rules="rules">
        <el-form-item label="票数" prop="role_name">
          <el-input type='text' :maxlength="20" size='small' v-model.trim="dataForm.role_name" placeholder="" style="width:100%">
            <el-button slot="append">票</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="所属管理" prop="role_code">
          <el-select v-model="dataForm.cate_id" filterable placeholder="请选择所属管理员" style="width: 100%;">
            <el-option label="请选择所属管理员" value=""></el-option>
          </el-select>
        </el-form-item>
        <div style="text-align: center;">
          <el-button @click="onSubmit" type='primary' size='small'>确定</el-button>
        </div>
      </el-form>
    </el-dialog> -->
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
      request: {
        url: 'product', // 请求接口
        method: 'get', // 请求方法
        params: {
          page: 0
        }, // 基础请求参数
        data: null // 请求发送参数
      },
      aaa: [
        {
          dds: 111, ss: 222
        }
      ],
      dialogVisible: true,
      dataForm: {},
      rules: {},
      ticketType: 'add'
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
