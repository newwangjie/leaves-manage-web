// 关闭当前窗口
export function closeCurWindow () {
  window.opener = null
  window.open('', '_self')
  window.close()
}

// 获取数据类型
export function dataType (data) { // 获取数据类型
  return ({}).toString.call(data).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 获取当前历史
export function getCurHistory () {
  return window.history.length
}

// 深拷贝
export function deepCopy (data) { // 深拷贝
  /* 参数：data-需要深拷贝的数据 */
  if (!data) { return data } // null, undefined values check
  var types = [ Number, String, Boolean ]
  var result
  // normalizing primitives if someone did new String('aaa'), or new Number('444');
  types.forEach(function (type) {
    if (data instanceof type) {
      result = type(data)
    }
  })
  if (typeof result === 'undefined') {
    if (Object.prototype.toString.call(data) === '[object Array]') {
      result = []
      data.forEach((child, index, array) => {
        result[index] = deepCopy(child)
      })
    } else if (typeof data === 'object') {
      // DOM
      if (data.nodeType && typeof data.cloneNode === 'function') {
        result = data.cloneNode(true)
      } else if (!data.prototype) { // check that this is a literal
        if (data instanceof Date) {
          result = new Date(data)
        } else {
          // it is an object literal
          result = {}
          for (var i in data) {
            result[i] = deepCopy(data[i])
          }
        }
      } else {
        // 取决于你在这里想要什么，只保留引用，或者创建新对象
        if (data.constructor) {
          result = new data.constructor()
        } else {
          result = data
        }
      }
    } else {
      result = data
    }
  }
  return result
}

// 获取url 的query参数的值
export function getUrlQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  } else { return null }
}

// 获取url解析后的对象
export function getUrlQuery (url) {
  let querys = window.location.search.slice(1).split('&')
  let params = {}
  for (let i = 0; i < querys.length; i++) {
    let item = querys[i].split('=')
    params[item[0]] = item[1]
  }
  return params
}

// 获取元素距离页面左边的距离
export function getEleOffsetLeft (element) {
  var leftDistance = element.offsetLeft // 子元素左边距离父元素左边距离
  var eleParents = element.offsetParent // 返回一个指向最近的包含该元素的定位元素。
  while (eleParents != null) {
    leftDistance += eleParents.offsetLeft
    eleParents = eleParents.offsetParent
  }
  return leftDistance
}

// 获取元素距离页面顶部的距离
export function getEleOffsetTop (element) {
  var topDistance = element.offsetTop // 子元素左边距离父元素左边距离
  var eleParents = element.offsetParent // 返回一个指向最近的包含该元素的定位元素。
  while (eleParents != null) {
    topDistance += eleParents.offsetTop
    eleParents = eleParents.offsetParent
  }
  return topDistance
}
// 获取前七天的时间
export function getNowDate () {
  let nowdate = new Date()
  let now = nowdate.getFullYear() + '-' + toDou((nowdate.getMonth() + 1)) + '-' + toDou(nowdate.getDate()) + ' ' + toDou(nowdate.getHours()) + ':' + toDou(nowdate.getMinutes()) + ':' + toDou(nowdate.getSeconds())
  let oneweekdate = new Date(nowdate - 7 * 24 * 3600 * 1000)
  let oneweek = oneweekdate.getFullYear() + '-' + toDou((oneweekdate.getMonth() + 1)) + '-' + toDou(oneweekdate.getDate()) + ' ' + toDou(nowdate.getHours()) + ':' + toDou(nowdate.getMinutes()) + ':' + toDou(nowdate.getSeconds())

  return [oneweek, now]
}

export function toDou (n) {
  return n < 10 ? '0' + n : n + ''
}
export default {
  // 关闭当前窗口
  closeCurWindow,
  // 获取数据类型
  dataType,
  // 获取当前历史
  getCurHistory,
  // 深拷贝
  deepCopy,
  // 获取url 的query参数的值
  getUrlQueryString,
  // 获取url解析后的对象
  getUrlQuery,
  // 获取元素距离页面左边的距离
  getEleOffsetLeft,
  // 获取元素距离页面顶部的距离
  getEleOffsetTop,
  // 获取时间
  getNowDate
}
