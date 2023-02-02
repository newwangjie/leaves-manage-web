import { deepCopy } from './Feedback.js'

// 对象空值过滤函数
export const filterNull = object => {
  if (!object) { return {} }
  if (Object.prototype.toString.call(object) === '[object String]') { // 对象-递归
    object = JSON.parse(object)
  }
  for (var key in object) {
    // console.log('filterNull: ', key, object[key])
    // if (object[key] === null) {
    //   delete object[key]
    // }
    if (Object.prototype.toString.call(object[key]) === '[object String]') { // 字符串去除两边空格
      object[key] = object[key].trim()
    } else if (Object.prototype.toString.call(object[key]) === '[object Object]') { // 对象-递归
      object[key] = filterNull(object[key])
    } else if (Object.prototype.toString.call(object[key]) === '[object Array]') {
      object[key] = arrayFilterNull(object[key])
    }
  }
  return object
}
// 对象空字符串过滤函数
export const filterStringNull = object => {
  if (!object) { return {} }
  if (Object.prototype.toString.call(object) === '[object String]') { // 对象-递归
    object = JSON.parse(object)
  }
  for (var key in object) {
    // console.log('filterNull: ', key, object[key])
    if (object[key] === '') {
      delete object[key]
    }
    if (Object.prototype.toString.call(object[key]) === '[object String]') { // 字符串去除两边空格
      object[key] = object[key].trim()
    } else if (Object.prototype.toString.call(object[key]) === '[object Object]') { // 对象-递归
      object[key] = filterNull(object[key])
    } else if (Object.prototype.toString.call(object[key]) === '[object Array]') {
      object[key] = arrayFilterNull(object[key])
    }
  }
  return object
}

// 数组空值过滤
export const arrayFilterNull = array => {
  if (array.length === 0) { return [] }
  for (var i = 0; i < array.length; i++) {
    if (Object.prototype.toString.call(array[i]) === '[object String]') { // 字符串去除两边空格
      array[i] = array[i].trim()
    } else if (Object.prototype.toString.call(array[i]) === '[object Array]') {
      array[i] = arrayFilterNull(array[i])
    } else if (Object.prototype.toString.call(array[i]) === '[object Object]') { // 对象-递归
      array[i] = filterNull(array[i])
    }
  }
  return array.filter(item => item !== null)
}
// 排序
// export const arrayObjectOrder = (array, basis) => {
//   // array:[{}]格式数组;basis:排序依据
//   // console.log(judgeType(basis, 'string') && judgeType(array, 'array'))
//   if (judgeType(basis, 'string') && judgeType(array, 'array')) {
//     let order
//     for (let i = 0; i < array.length - 1; i++) {
//       for (let j = i + 1; j <= array.length - 1; j++) {
//         // console.log(array[i][basis], array[j][basis])
//         if (array[i][basis] > array[j][basis]) {
//           order = array[i]
//           array[i] = array[j]
//           array[j] = order
//         }
//       }
//     }
//     // console.log(array)
//     return array
//   } else {
//     console.log('请传入正确的参数')
//   }
// }
export const arrayItemMoveFirst = (value, array) => {
  if (array.indexOf(value) === -1) return
  var index = array.indexOf(value)
  array.splice(index, 1)
  array.unshift(value)
  return array
}

// 删除对象多余的属性
export const delObjSurplusAttr = (data, condition) => {
  /*
    参数：object是对象，condition是数组
  */
  // if (object.constructor !== Object) { return }
  // if (condition.constructor !== Array) { return }
  if (!condition) { return data }
  var object = deepCopy(data)
  for (var i = 0; i < condition.length; i++) {
    delete object[condition[i]]
  }
  return object
}

// 解析被特殊字符分隔的字符串-返回数组
export const analysisSpecialStrSeparate = nameStr => {
  /* 参数：nameStr-字符串 */
  var specialKey = "[`~!#$^&*()（）=|{}':;',\\[\\].<>/?~！#￥……&*（）--——|{}【】‘；：”“'。，、？] -+‘'《》"
  for (var i = 0; i < specialKey.length; i++) {
    if (nameStr.indexOf(specialKey[i]) !== -1) {
      return nameStr.split(specialKey[i]) // 如
    }
  }
  return nameStr
}

// 去除空格
export const removeSpace = str => {
  /* str */
  if (str.constructor !== String) { return }
  var strArr = str.split(' ')
  var newStr = ''
  for (let i = 0; i < strArr.length; i++) {
    newStr = newStr + strArr[i]
  }
  return newStr
}

// 转为字符串容易读取的方法:easysee(数字),type:array(数组形式)-string(字符串形式),numsub(区别分段),connectors(连接符)
export const readableString = (readable, type, numsub, connectors) => {
  // $DatahandleMethod.easyseeString(123123, 'array', 4, ['万', '亿', '千亿', '万亿', '千万亿'])
  let arr = []
  if (type === 'array') { // 判断是不是数组
    if (connectors.constructor === Array) {
      arr = connectors
    } else {
      return 'connectors连接符参数应为数组'
    }
  }
  if (type === 'string') { // 判断是不是字符串
    if (connectors.constructor !== String) { return 'connectors连接符参数应为字符串' }
  }
  let array = []
  let str = readable.toString()
  let length = str.length
  let int = parseInt(length / numsub) // 取整
  let remainder = length - (int * numsub) // 余数
  let ceil = Math.ceil(length / numsub) // 向上取整
  // let reverse = amount.toString().split('').reverse().join('')

  // console.log('余数:' + remainder, '取整:' + int, '向上取整:' + ceil)
  if (type === 'array') {
    if (arr.length < ceil) { return 'connectors数组过短' }
  }
  for (let i = 0; i < ceil; i++) {
    if (remainder !== 0) {
      if (i === 0) {
        array.push(str.slice(0, remainder))
      } else {
        array.push(str.slice(remainder + numsub * (i - 1), remainder + numsub * i))
      }
    } else {
      array.push(str.slice(numsub * i, numsub * (i + 1)))
    }
  }
  array = array.reverse()
  console.log(array)
  let returnstr = ''
  if (type === 'array') {
    for (let o = 0; o < array.length; o++) {
      returnstr = array[o] + arr[o] + returnstr
    }
  }
  if (type === 'string') {
    returnstr = array.join(connectors)
  }
  // console.log(returnstr)
  return returnstr
}

export const upDigit = n => { // 钱数转换为大写
  var fraction = ['角', '分']
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
  var head = n < 0 ? '欠' : ''
  n = Math.abs(n)
  var s = ''
  for (var i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    var p = ''
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.) * 零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '')
}
export const removeRepeat = (array, contrast) => {
  // 数组去重：使用于普通数组和对象对称数组
  /*
    说明：array是[1, 2, 3]数组和[{}, {}, {}], 当时用[{}, {}, {}]类型数组时，contrast为对比去重的{}项的字段
  */
  // console.log(array, contrast)
  if (array.length !== 0) {
    var res = [array[0]]
    for (var o = 1; o < array.length; o++) {
      var repeat = false
      for (var t = 0; t < res.length; t++) {
        if (contrast !== undefined) {
          if (array[o][contrast] === array[t][contrast]) {
            repeat = true
            break
          }
        } else {
          if (array[o] === array[t]) {
            repeat = true
            break
          }
        }
      }
      if (!repeat) {
        res.push(array[o])
      }
    }
    // console.log(res)
    return res
  } else {
    return array
  }
}

// byte转换
export const byteConvert = byteSize => {
  if (byteSize === 0) return '0 B'
  var KB = 1024
  var byteUnit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var power = Math.floor(Math.log(byteSize) / Math.log(KB)) // log() 方法可返回一个数的自然对数
  // console.log(Math.log(byteSize), Math.log(KB))
  // console.log(power)
  // console.log((byteSize / Math.pow(KB, power)).toPrecision(4) + ' ' + byteUnit[power])
  // Math.pow(x, y)-x 的 y 次幂
  return (byteSize / Math.pow(KB, power)).toPrecision(4) + ' ' + byteUnit[power] // toPrecision() 方法可在对象的值超出指定位数时将其转换为指数计数法
  // 另一种方法------------------------------------------------
  // var convert = byteSize
  // for (var i = 0; i < byteUnit.length; i++) {
  //   if (convert > KB) {
  //     convert = convert / KB
  //     console.log(convert)
  //   } else {
  //     convert = Math.floor((convert * 100)) / 100
  //     console.log(convert)
  //     return convert + ' ' + byteUnit[i]
  //   }
  // }
}
// 转换时间格式为:YYYY-MM
export const switchDateYYMM = dateValue => {
  if (!dateValue) { return '-' }
  // 把Date对象的值转换为YYYY-MM-DD日期类型
  var date = new Date(dateValue)
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month < 10) { month = '0' + month }
  if (strDate < 10) { strDate = '0' + strDate }
  var currentdate = date.getFullYear() + '-' + month
  return currentdate
}
// 转换时间格式为:YYYY-MM-DD
export const switchDateYYTM = dateValue => {
  if (!dateValue) { return '-' }
  // 把Date对象的值转换为YYYY-MM-DD日期类型
  var date = new Date(dateValue)
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month < 10) { month = '0' + month }
  if (strDate < 10) { strDate = '0' + strDate }
  var currentdate = date.getFullYear() + '-' + month + '-' + strDate
  return currentdate
}
// 转换时间格式为:YYYY-MM-DD hh:mm:ss
export const switchDateYYTMhms = dateValue => {
  if (!dateValue) { return '-' }
  // 把Date对象的值转换为YYYY-MM-DD hh:mm:ss日期类型
  var date = new Date(dateValue)
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  var seconds = date.getSeconds()
  var minutes = date.getMinutes()
  var hours = date.getHours()
  if (month < 10) { month = '0' + month }
  if (strDate < 10) { strDate = '0' + strDate }
  if (seconds < 10) { seconds = '0' + seconds }
  if (minutes < 10) { minutes = '0' + minutes }
  if (hours < 10) { hours = '0' + hours }
  var currentdate = date.getFullYear() + '-' + month + '-' + strDate + ' ' + hours + ':' + minutes + ':' + seconds
  return currentdate
}

// 间隔时间戳转换为时分秒
export const intervalTimeStampYYTMhms = timeStamp => {
  if (timeStamp === 0) return '0s'
  var days = parseInt(timeStamp / (1000 * 60 * 60 * 24))
  var hours = parseInt((timeStamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  var minutes = parseInt((timeStamp % (1000 * 60 * 60)) / (1000 * 60))
  var seconds = (timeStamp % (1000 * 60)) / 1000

  return (days === 0 ? '' : days + '天') +
    (hours === 0 ? '' : hours + ' 小时 ') +
    (minutes === 0 ? '' : minutes + ' 分钟 ') +
    (seconds === 0 ? '' : seconds + ' 秒 ')
}
export const getTimeInfo = dateValue => { // 获取时间信息-返回对象
  if (!dateValue) { return {} }
  var date = new Date(dateValue)
  var month = date.getMonth() + 1 // 月份
  var day = date.getDate() // 日期
  if (month < 10) { month = '0' + month }
  if (day < 10) { day = '0' + day }
  var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  var weekArray = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

  var dateInfo = {
    year: date.getFullYear(), // 年
    month: month,
    day: day,
    hours: date.getHours(), // 时
    minutes: minutes,
    seconds: seconds,
    week: weekArray[date.getDay()]
  }
  return dateInfo
}

// 从字符串中解析出url
export const strAnalyseURL = str => {
  // "这是一个字符串 https://www.baidu.com/ http://www.baidu.com/?fdsajlkfd/#dfdaslfd/fdsaf 里面有这个网址 http://fanyi.baidu.com"
  let urlRegex = /(http|https|ftp|rtsp|mms):\/\/\S*/g
  let matchArray = []
  let isUrl = str.search(urlRegex) !== -1 // 是否存在url
  let execArray
  let lastIndex = 0
  // console.log(isUrl)
  while ((execArray = urlRegex.exec(str)) !== null) {
    // let matchLength = execArray[0].length
    // let endIndex = Number(execArray.index) + matchLength
    let lastContent = str.slice(lastIndex, execArray.index)
    matchArray.push({ init_index: execArray.index, end_index: urlRegex.lastIndex, url: execArray[0], last_content: lastContent })
    lastIndex = urlRegex.lastIndex
  }
  let cullStr = str.replace(/\s*(http|https|ftp|rtsp|mms):\/\/\S*/g, req => {
    /* eslint-disable no-return-assign */
    return req = ''
  }) // 剔除后的字符串
  return {
    macth: matchArray, // 匹配的解析结果
    cull: cullStr, // 裁剪后的字符串
    init: str, // 初始字符串
    is_url: isUrl // 是否存在url
  }
}

// startDate-开始时间, endDate-结束时间, effectNum-影响数(用来做为判断天数是否超出此数字)
export const getDateDifferInfor = (startDate, endDate, effectNum) => {
  var startTime = new Date(startDate).getTime() // 开始时间时间戳
  var endTime = new Date(endDate).getTime() // 结束时间时间戳
  let intervalTimeStamp = Math.abs(startTime - endTime) // 间隔时间戳

  let daysTimeStampMeta = 1000 * 60 * 60 * 24 // 一天的时间戳元位
  let hoursTimeStampMeta = 1000 * 60 * 60 // 一小时的时间戳元位
  let effectNumStampMeta = effectNum * daysTimeStampMeta

  let intervalDays = Math.floor(intervalTimeStamp / daysTimeStampMeta) // 获取间隔天数
  // 获取间隔小时:'2017-12-04 09:49:12', '2017-12-22 08:00:12', 20:interval_hour:22.183333333333334
  let intervalHour = Math.round((intervalTimeStamp - intervalDays * daysTimeStampMeta) / hoursTimeStampMeta)

  let overstepDays = 0 // 超出effectNum影响数的天数，超出部分是正数，未超出部分是负数，可通过 0< 和 >0 来区分
  let overstepHour = 0 // 超出天数之下的超出小时
  let surplusDays = 0 // 剩余天数
  let surplusHour = 0 // 剩余小时
  // if (effectNum) {
  //   overstepDays = Number(intervalDays - effectNum).toFixed() // 差几个小时的间隔天数：19.916666666666668 - 影响数20天，间隔天数为0
  //   // overstepDays = Number(((intervalTimeStamp / daysTimeStampMeta) - effectNum).toFixed()) // 差几个小时的间隔天数：19.916666666666668 - 影响数20天，间隔天数为0
  //   overstepHour = intervalHour === 0 ? 0 : 24 - intervalHour
  // }
  if (intervalTimeStamp > effectNumStampMeta) {
    overstepDays = intervalDays - effectNum
    overstepHour = Math.round((intervalTimeStamp - effectNumStampMeta - overstepDays * daysTimeStampMeta) / hoursTimeStampMeta)
  } else {
    surplusDays = Math.floor((effectNumStampMeta - intervalTimeStamp) / daysTimeStampMeta)
    surplusHour = 24 - intervalHour
  }
  return {
    interval_days: intervalDays, // 间隔天数
    interval_hour: intervalHour, // 间隔小时
    overstep_days: overstepDays, // 超出effectNum影响数的天数
    overstep_hour: overstepHour, // 超出天数之下的超出小时
    surplus_days: surplusDays, // 剩余天数
    surplus_hour: surplusHour // 剩余小时
  }
  // 测试数据
  // getDateDifferInfor('2017-12-04 09:49:12', new Date(), 20)
  // getDateDifferInfor('2017-12-04 09:49:12', '2017-12-22 08:00:12', 20)
}

// 获取随机整数不定数组，前一个和后一个不同
export const getRandomIntIndefiniteArray = (min, max, length) => {
  // 调用getRandomIntIndefiniteArray(0, 9, 10)
  if (!(min < max)) {
    return new Error('max一定要大于min')
  }
  function getRandomInt (last, min, max) {
    let randomNum = Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)
    // console.log(last, randomNum)
    if (randomNum !== last) {
      return randomNum
    } else {
      return getRandomInt(last, min, max)
    }
  }
  var a = []
  for (var i = 0; i < length; i++) {
    let rannum = getRandomInt(a.length ? a[a.length - 1] : max, min, max)
    a.push(rannum)
  }
  return a
}

export const getDaysTimestamp = (days) => { // 获取天数的时间戳
  return 1000 * 60 * 60 * 24 * days
}

export const getDaysAfterTimestamp = (time, days) => { // 获取当前时间多少天数之后的时间戳
  return (new Date(time).getTime()) + getDaysTimestamp(days)
}

// base64转换为Blob
export const bs64toBlob = (bs64Data, contentType, sliceSize) => {
  contentType = contentType || ''
  sliceSize = sliceSize || 512

  var byteCharacters = window.atob(bs64Data) // WindowOrWorkerGlobalScope.atob() 对用base-64编码过的字符串进行解码，基本兼容所有浏览器
  var byteArrays = []

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize)

    var byteNumbers = new Array(slice.length)
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    var byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  var blob = new Blob(byteArrays, { type: contentType })
  return blob
}

export default {
  // 对象空值过滤函数
  filterNull,
  // 数组空值过滤
  arrayFilterNull,
  arrayItemMoveFirst,
  // 删除对象多余的属性
  delObjSurplusAttr,
  // 解析被特殊字符分隔的字符串-返回数组
  analysisSpecialStrSeparate,
  // 去除空格
  removeSpace,
  // 转为字符串容易读取的方法:easysee(数字),type:array(数组形式)-string(字符串形式),numsub(区别分段),connectors(连接符)
  readableString,
  // 钱数转换为大写
  upDigit,
  // 数组去重：使用于普通数组和对象对称数组
  removeRepeat,
  // byte转换
  byteConvert,
  // 转换时间格式为:YYYY-MM-DD
  switchDateYYTM,
  // 转换时间格式为:YYYY-MM
  switchDateYYMM,
  // 转换时间格式为:YYYY-MM-DD hh:mm:ss
  switchDateYYTMhms,
  // 间隔时间戳转换为时分秒
  intervalTimeStampYYTMhms,
  // 获取时间信息-返回对象
  getTimeInfo,
  // 从字符串中解析出url
  strAnalyseURL,
  // startDate-开始时间, endDate-结束时间, effectNum-影响数(用来做为判断天数是否超出此数字)
  getDateDifferInfor,
  // 获取随机整数不定数组，前一个和后一个不同
  getRandomIntIndefiniteArray,
  // 获取天数的时间戳
  getDaysTimestamp,
  // 获取当前时间多少天数之后的时间戳
  getDaysAfterTimestamp,
  // base64转换为Blob
  bs64toBlob
}
