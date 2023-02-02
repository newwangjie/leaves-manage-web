<template lang="html">
  <div class="g-search">
    <el-form class="g-search-form el-form-block" size="small" :inline="inline" ref="searchForm" :model="search" :rules="rules" label-width="100px">
      <div class="g-search-left">
        <el-form-item label="客户名称" prop="product_name">
          <el-input placeholder="请输入客户名称" v-model="search.product_name"></el-input>
        </el-form-item>
        <el-form-item label="所属管理员" prop="cate_id">
          <el-select v-model="search.cate_id" filterable placeholder="请选择分类">
            <el-option label="请选择所属管理员" value=""></el-option>
            <el-option v-for="item in categoryData" :key="item.id" :label="item.category_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 100px;">
          <el-button icon="el-icon-search" :loading="loading" type="primary" @click="searchFind('searchForm')">查询</el-button>
        </el-form-item>
      </div>
      <div class="g-search-right">
        <el-button-group>
          <el-button icon="el-icon-circle-plus" size="small" type="primary" @click="getAddData()">新增</el-button>
        </el-button-group>
      </div>
    </el-form>
  </div>
</template>

<script>
import MixinsSearch from '../../mixin/mixin-search.js'

export default {
  mixins: [MixinsSearch],
  props: {
    base: Object,
    powerBtn: String,
    loading: { type: Boolean, default: false }
  },
  data () {
    return {
      search: {
        product_name: '',
        product_number: '',
        product_tags: '',
        cate_id: '',
        is_gift_bag: '',
        brand_id: '',
        merchant_code: '',
        platform: ''
      },
      categoryData: [],
      brandData: [],
      merchantsData: [],
      rules: {},
      basedata: {
        status_list: []
      }
    }
  },
  created () {
  },
  methods: {
    getAddData () {
      this.$router.push('/product/list/add')
    },
    getBrandData () {
      return new Promise((resolve, reject) => {
        this.$Axios.get('product_brand', { params: { pagesize: 9999 } }).then((resp) => { // 请求成功
          if (resp.return_code === '0000') {
            this.brandData = resp.data.list
          }
          resolve(resp)
        }).catch((error) => { // 请求失败
          this.$_requestInterceptor('error', error)
          reject(error)
        })
      })
    },
    searchDataHandle (search) { // 提交之前-数据处理
      // 自留用于设置提交之前进行的数据处理,比如删除某个不需要提交的数据
      // console.log(search)
      if (search.name) {
        search.name = search.name.trim()
      }
      if (search.id) {
        search.id = search.id.trim()
      }
      return search
    }
  }
}
</script>

<style lang="scss">
.g-search {
  border: 20px solid #eee; padding: 10px 10px; margin-bottom: 30px;
  .g-search-form {
    display: flex; justify-content:space-between;
    .g-search-right {
      text-align: right; display: flex; align-items: center; min-width: 170px; justify-content: flex-end;
    }
    .el-form-item__content {
      min-width: 200px;
    }
    .el-date-editor { max-width: 240px; }
    // .input-with-select {
    //   .el-input-group__prepend {min-width: 120px;}
    // }
    .el-form-item {margin-bottom: 0px; padding: 5px 0;}
  }
  .g-search-btns {
    text-align: center;
    vertical-align: middle;
  }
}
.el-table__header-wrapper {
  background: #eee;
}
</style>
