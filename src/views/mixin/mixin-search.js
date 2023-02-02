// 搜索功能混入
// import deepCopy from 'deep-copy.js'
import { deepCopy } from './public.js'
export default {
  data () {
    return {
      inline: true,
      search: {},
      rules: {}
    }
  },
  methods: {
    searchFind (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var searchData = {}
          for (let keys in this.search) {
            if (this.search[keys] !== null && this.search[keys] !== '') {
              searchData[keys] = this.search[keys]
            }
          }
          var searchParams = Object.assign({}, searchData, this.base)
          var p = this.searchDataHandle(deepCopy(searchParams))
          this.searchBefore(p).then((search) => {
            this.$emit('search', search)
            this.searchAfter(search)
          })
        } else {
          return false
        }
      })
    },
    searchDataHandle (search) { // 提交之前-数据处理
      // 自留用于设置提交之前进行的数据处理,比如删除某个不需要提交的数据
      return search
    },
    searchBefore (search) { // 搜索之前
      return new Promise((resolve, reject) => {
        resolve(search)
      })
    },
    searchAfter (r) { // 搜索之后
    },
    searchReset (formName) { // 重置:重置-触发reset事件，父组件据此重新请求
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
      console.log(this.search)
      this.$emit('reset') // 重置事件
    }
  }
}
