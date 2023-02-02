import Vue from 'vue'

// Vue.mixin 方式实质就是就是在 vue 初始化对象的时候，把 Vue.mixin 的参数 复制到了初始化对象中（具体可以参考源码）即和$data\$refs\$options
Vue.mixin({
  methods: {
    // this.$_requestInterceptor('error', err)
    $_requestInterceptor (status, data) { // 请求拦截器
      if (status === 'error') { // 错误请求处理
        // this.$message.error('接口服务异常')
        var error = data
        if (error.response) { // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          var response = error.response
          if (response.status === 401) {
            // this.$message.error('未登录')
            window.location.href = '/#/login'
          } else {
            this.$message.error('接口服务异常')
          }
        }
      }
    }
  }
})
