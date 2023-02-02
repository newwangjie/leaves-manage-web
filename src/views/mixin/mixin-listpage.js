// import deepCopy from 'deep-copy.js'
import { deepCopy } from './public.js'

export default {
  watch: {
    '$route' (to, from) { // 用于 SPA 应用切换时，SPA 应用切换 created() 生命周期已过，url改变来用于数据的更新
      window.location.reload() // 刷新
    }
  },
  data () {
    return {
      is_lifecycle: true, // 是否执行mixin生命周期钩子中的方法
      request: {
        url: null, // 请求接口
        method: null, // 请求方法
        params: {
          page: 0
        }, // 基础请求参数
        data: {} // 请求发送参数
      }, // 请求
      shortcut: {}, // 快捷方式
      table: {
        lists: [], headers: [], columns: [], attr: {}, multi_selecte: [], selecteable: false, loading: false
      }, // 表格数据-lists：列表数据、columns：列表，attr：表格属性，loading：表格加载
      search: {
        form: [], result: {}, data: {}, rules: {}, loading: false
      }, // 搜索数据-result：搜索结果赋值，
      routepath: this.$route.path, // 路由路径
      total: 0, // 分页依据的总数量
      curr_page: 1 // 绑定当前页数,从1开始
    }
  },
  created () {
    if (this.is_lifecycle) {
      this.setBaseDataBefore().then(() => {
        this.setBaseData()
      })
    }
  },
  methods: {
    setBaseDataBefore () { // 设置基础默认数据-之前
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    setBaseData () { // 设置基础默认数据
      this.search.result = {}
      this.getBaseData(this.request) // 请求基础数据
      // 设置本地页数存储
      // if (this.$_localStore.get(this.routepath) === undefined) { // 本地页数存储不存在则设置
      //   this.$_localStore.set(this.routepath, { isUsedPageRecord: false, page: 1 })
      // }
      // if (this.$_localStore.get(this.routepath).isUsedPageRecord) { // 使用当前页面记录为true时，切换到当前页
      //   this.curr_page = this.$_localStore.get(this.routepath).page // 获取当前页
      //   this.gotoPage(this.curr_page) // 前往当前页
      // } else { // 使用当前页面记录为false时
      //   this.getBaseData(this.request) // 请求基础数据
      // }
      // 页面列表展示监听事件
      // var self = this
      // window.onunload = function () { // 关闭页面时删除当前页存储
      //   window.localStorage.removeItem(this.routepath)
      // }
      // window.onpopstate = function () { // 当url发生变化时把当前页显示打开
      //   self.$_localStore.set(self.routepath, { isUsedPageRecord: true, page: self.curr_page })
      // }
    },
    /**
     * @param {String} request(请求相关: 必填){url: String, method: String, params: Object, data: Object}
     * @return {Promise}
     */
    getBaseData (request) { // 请求基础数据
      this.table.loading = true // 开启表格加载
      return new Promise((resolve, reject) => {
        this.$Axios(request).then((resp) => { // 请求成功
          this.table.loading = false // 关闭表格加载
          if (resp.status === 0 || resp.return_code === '0000') {
            this.table.lists = deepCopy(resp.data.list) // 赋值
            this.table.headers = deepCopy(resp.table_headers) // 表头赋值
            this.total = resp.data.total // 总页数
            this.getBaseDataAfter(resp) // 基础数据请求完成之后
          } else {
            this.$message({ message: resp.message, duration: 5000, showClose: true, type: 'warning' })
          }
          resolve(resp)
        }).catch((error) => { // 请求失败
          this.table.loading = false // 关闭表格加载
          this.$_requestInterceptor('error', error)
          reject(error)
        })
      })
    },
    getBaseDataAfter (resp) {}, // 基础数据请求完成之后
    gotoPage (page) { // 请求当前页数
      return new Promise((resolve, reject) => {
        let request = deepCopy(this.request)
        request.params = Object.assign({}, deepCopy(this.request.params), deepCopy(this.shortcut), this.search.result)
        request.params.page = page - 1
        this.getBaseData(request).then((resp) => { // 请求成功
          // this.$_localStore.set(this.routepath, { isUsedPageRecord: false, page: page }) // 本地记录
          this.curr_page = page
          resolve(resp)
        }).catch((error) => { // 请求失败
          reject(error)
        })
      })
    },
    // 搜索相关-----------------------------------------------
    searchEvent (search) { // 搜索结果反馈事件
      console.log(search)
      return new Promise((resolve, reject) => {
        this.search.loading = true
        this.search.result = search // 把搜索组件返回的值，赋值给搜索元素
        this.gotoPage(1).then((resp) => { // 请求成功
        // this.getBaseData(request).then((resp) => { // 请求成功
          this.search.loading = false
          resolve(resp)
        }).catch((error) => { // 请求失败
          this.search.loading = false
          reject(error)
        })
      })
    },
    searchResetEvent () { // 搜索重置事件
      return new Promise((resolve, reject) => {
        this.search.result = {}
        this.gotoPage(1)
        // this.getBaseData(this.request) // 请求默认基础数据
      })
    },
    // 列表单项数据操作------------------------------------------------------------
    handleListItemInquire () { // 问询提交 返回Promise
      return this.$confirm('您确认要执行此操作吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    handleListItemData (request) { // 处理列表某一项数据修改
      return new Promise((resolve, reject) => {
        this.handleListItemInquire().then(() => {
          // console.log(api, params)
          this.$Axios(request).then((resp) => { // 请求成功
            if (resp.status === 0 || resp.return_code === '0000') {
              this.$message({ message: '操作成功', duration: 5000, showClose: true, type: 'success' })
            } else {
              this.$message({ message: resp.message, duration: 5000, showClose: true, type: 'warning' })
            }
            resolve(resp)
          }).catch((error) => { // 请求失败
            this.$_requestInterceptor('error', error)
            reject(error)
          })
        }).catch(() => {
          this.$message({ message: '您已取消此操作', duration: 5000, showClose: true, type: 'info' })
        })
      })
    },
    // 处理批量操作---------------------------------------------------------------
    handleSelectionChange (val) { // 获取开启el表格多选后选择的数组
      this.table.multi_selecte = val
    },
    handleBatchOperate (command) { // 处理批量操作
      let condition = this.handleBatchCondition(command)
      if (!this.$Judge.judgeIsNullObject(condition)) {
        this.$message({ message: '目前没有筛选条件，无法执行该操作', duration: 5000, showClose: true, type: 'warning' })
        // this.$confirm('目前没有筛选条件，请问您是要列表上所有数据执行该操作吗', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   this.chooseBatchWay(command, condition)
        // }).catch(() => {})
      } else {
        this.chooseBatchWay(command, condition)
      }
    },
    handleBatchCondition (command) { // 处理批量条件 参数command:批量指令 必须返回对象
      // let ids = this.table.multi_selecte.map(item => item.id)
      // return {idlist: ids}
      return {}
    },
    chooseBatchWay (command, condition) { // 选择批量方式
      if (command === 'export') { // 导出
        this.getBatchExporte(condition).then((data) => { this.handleBatchAfter(command, condition, data) })
      } else if (command === 'delete') { // 删除
        this.getBatchDelete(condition).then((data) => { this.handleBatchAfter(command, condition, data) })
      } else if (command === 'available') { // 上架
        this.getBatchAvailable(condition).then((data) => { this.handleBatchAfter(command, condition, data) })
      } else if (command === 'disable') { // 下架
        this.getBatchDisable(condition).then((data) => { this.handleBatchAfter(command, condition, data) })
      } else if (command === 'lable') { // 打标签
        this.getBatchLable(condition).then((data) => { this.handleBatchAfter(command, condition, data) })
      } else if (command === 'start') { // 启用
        this.getBatchStart(condition).then((data) => { this.handleBatchAfter(command, condition, data) })
      } else if (command === 'forbidden') { // 禁用
        this.getBatchForbidden(condition).then((data) => { this.handleBatchAfter(command, condition, data) })
      } else if (command === 'show') { // 显示
        this.getBatchShow(condition).then((data) => { this.handleBatchAfter(command, condition, data) })
      } else if (command === 'hide') { // 隐藏
        this.getBatchHide(condition).then((data) => { this.handleBatchAfter(command, condition, data) })
      }
    },
    handleBatchAfter (command, condition, data) { // 批量处理完成之后
      this.getBaseData(this.request) // 请求默认基础数据
    },
    getBatchExporte (condition) { // 批量导出
      return new Promise((resolve, reject) => {
        // let downurl = Object.keys(condition).map(key => key + '=' + condition[key]).join('&')
        // let suffix = (downurl && downurl !== '') ? '&' + downurl : ''
        // console.log(condition, downurl, suffix)
        // window.open(process.env.API_ADDR + '/asset' + '?' + 'type=capital_excel&pagesize=1000' + suffix)
        resolve()
      })
    },
    getBatchDelete (condition) { // 批量删除: 禁用统一
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    getBatchAvailable (condition) { // 批量上架
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    getBatchDisable (condition) { // 批量下架
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    getBatchLable (condition) { // 批量打标签
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    getBatchStart (condition) { // 批量启用
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    getBatchForbidden (condition) { // 批量禁用
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    getBatchShow (condition) { // 批量显示
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    getBatchHide (condition) { // 批量隐藏
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
}
