// import deepCopy from 'deep-copy.js'
import { deepCopy } from './public.js'

// 提交流程
// |-- 验证
//   |-- 验证成功
//     |-- 提交数据预览并核对
//       |-- 立即提交时问询提交
//         |-- 确认提交
//           |-- 提交之前-数据处理
//             |-- 提交之前异步
//               |-- 提交请求进行
//                 |-- 请求成功
//                   |-- 请求成功处理
//                     |-- 数据提交成功之后
//                 |-- 请求失败
//         |-- 取消提交
//     |-- 重新编辑或取消
//   |-- 验证失败

// 自定义提交加提示确认与验证
export default {
  data () {
    return {
      submit_loading: false
    }
  },
  methods: {
    /**
     * @param {String} refElement(必填)
     */
    resetForm (refElement) { // 重置form
      this.$refs[refElement].resetFields()
    },
    // cancelForm () { // 取消提交 离开form
    //   this.$router.go(-1)
    // },
    /**
     * @param {String} refElement(form ref: 必填)
     * @param {String} request(请求相关: 必填){url: String, method: String, params: Object, data: Object}
        - @param {String} url(请求接口: 必填)
        - @param {String} method(请求方式: 必填)
        - @param {Object} params(请求参数: 非必填)
        - @param {Object} data(请求发送的数据: 非必填)
     */
    submitFormData (refElement, request, isPreview = false) { // 提交数据 返回Promise
      if (refElement === undefined) {
        console.error('error submit!!!要被验证的元素不存在,')
        return
      }
      // console.log(this.mixin_submit_preview)
      this.validatorForm(refElement).then((valid) => { // 验证提交-成功
        this.validatorSuccess(request, isPreview)
      }).catch(() => { // 验证提交-失败
        this.validatorFail()
      })
    },
    /**
     * @param {String} refElement(必填)
     * @return {Promise}
     */
    validatorForm (refElement) { // 验证提交 返回Promise
      // return this.$refs[refElement].validate()
      return new Promise((resolve, reject) => {
        this.$refs[refElement].validate((valid) => {
          if (valid) {
            resolve(valid)
          } else {
            reject(valid)
          }
        })
      })
    },
    validatorSuccess (request, isPreview) { // 验证成功
      if (isPreview) {
        if (this.submitPreview) {
          this.submitPreview(request) // 预览
        }
      } else {
        this.submitRelevant(request) // 提交相关
      }
    },
    validatorFail () { // 验证未通过
      this.$message({ message: '数据验证未通过，您还不能进行相关操作', duration: 5000, showClose: true, type: 'info' })
    },
    submitRelevant (request) { // 提交相关
      // 问询提交
      this.submitInquire().then(() => {
        // 确定提交
        this.submitHandle(deepCopy(request))
      }).catch(() => {
        this.submitInquireCancel() // 取消提交
      })
    },
    /**
     * @return {Promise}
     */
    submitInquire () { // 问询提交 返回Promise
      return this.$confirm('请您确定是否提交数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    submitInquireCancel () { // 提交问询取消
      this.submit_loading = false
      this.$message({ message: '数据提交已取消', duration: 5000, showClose: true, type: 'info' })
    },
    /**
     * @param {String} request(请求相关: 必填){url: String, method: String, params: Object, data: Object}
     */
    submitHandle (request) { // 提交处理
      this.submit_loading = true // 请求加载
      let d = this.submitDataHandle(deepCopy(request.data)) // 处理请求发送的数据
      this.submitBefore(d).then((data) => {
        // 进行提交
        request.data = data
        this.submitBeIn(request)
      })
    },
    /**
     * @param {Object} data(请求发送的数据: 必填)
     * @return {Object}
     */
    submitDataHandle (data) { // 提交之前-数据处理
      // 自留用于设置提交之前进行的数据处理,比如删除某个不需要提交的数据
      return data
    },
    /**
     * @param {Object} data(请求发送的数据: 必填)
     * @return {Object}
     */
    submitBefore (data) { // 提交之前处理
      return new Promise((resolve, reject) => {
        resolve(data)
      })
    },
    /**
     * @param {String} request(请求相关: 必填){url: String, method: String, params: Object, data: Object}
     * @return {Promise}
     */
    // 想要自行处理提交内容或者log提交结果，请使用mixins命名同样的方法替换实现
    // submitBeIn (request) {
    //   console.log(request)
    //   this.submit_loading = false
    //   this.submitAfter({})
    // },
    submitBeIn (request) { // 提交进行
      this.submitParallel(request.data)
      // return this.$HttpAgent[reqMethod.toLowerCase()](api, params)
      return new Promise((resolve, reject) => {
        this.$Axios(request).then((resp) => { // 请求成功
          this.submit_loading = false
          this.submitRequestSuccess(resp)
          resolve()
        }).catch((error) => { // 请求失败
          this.submit_loading = false
          this.submitRequestError(error)
          reject(error)
        })
      })
    },
    /**
     * @param {Object} data(请求发送的数据: 必填)
     */
    submitParallel (data) {}, // 提交并行
    /**
     * @param {Object} resp(请求响应数据: 必填)
     */
    submitRequestSuccess (resp) {
      if (resp.status === 0 || resp.return_code === '0000') {
        // this.$alert('数据提交成功', '提示', {type: 'success'})
        this.$message({ message: '数据提交成功', duration: 5000, showClose: true, type: 'success' })
        this.submitAfter(resp)
      } else {
        this.$message({ message: resp.return_msg, duration: 5000, showClose: true, type: 'warning' })
      }
    },
    submitAfter (resp) {}, // 数据提交成功之后
    /**
     * @param {Object} error(请求出错数据: 必填)
     */
    submitRequestError (error) {
      this.$_requestInterceptor('error', error)
    }
  }
}

// 使用:
// this.submitFormData(formName, {url: 接口名, method: 请求方法, params: 请求参数, data: 请求数据})

// 预览问题:
// validatorSuccess () {
//   // 打开预览弹框
// }
// 弹框确认时，执行
// this.submitRelevant(request) // request: {url: 接口名, method: 请求方法, params: 请求参数, data: 请求数据}
