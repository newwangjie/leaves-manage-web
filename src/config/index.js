export default {
  projectName: 'mjmh-manage-admin', // 项目名称
  title: '美家美货',
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: '/api/admin/v1/', // 开发环境前缀
    pro: '/api/admin/v1/' // 生产环境前缀
  },
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   * 如果不使用，则需要在路由中给需要在菜单中展示的路由设置 meta: {title: 'xxx'} 用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  },
  /**
   * @description socket前缀
   */
  websocketUrlPrefix: '/sockjs/conn',
  /**
   * @description 验证码地址前缀
   */
  captchaUrl: '/api/mall/admin/',
  /**
   * @description action-上传的地址
   */
  uploadUrl: '/api/admin/v1/upload',
  uploadLogisticsUrl: '/api/mall/warehouse/zdj_order_logistics_import?op=imp',
  /**
   * @description 文件存入地址
   */
  getFileUrl: '/api/mall/admin/sfile/'
}

// render (h) {
//   return (
//     <div
//       // normal attributes or component props.
//       id="foo"
//       // DOM properties are prefixed with `domProps`
//       domPropsInnerHTML="bar"
//       // event listeners are prefixed with `on` or `nativeOn`
//       onClick={this.clickHandler}
//       nativeOnClick={this.nativeClickHandler}
//       // other special top-level properties
//       class={{ foo: true, bar: false }}
//       style={{ color: 'red', fontSize: '14px' }}
//       key="key"
//       ref="ref"
//       // assign the `ref` is used on elements/components with v-for
//       refInFor
//       slot="slot">
//     </div>
//   )
// }
