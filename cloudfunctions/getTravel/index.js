const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('travel').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('travel').where({ data: { show: true } }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }

  // const promise = db.collection('travel').where({ data:{show:true} }).get()
  // tasks.push(promise)

  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}


// const cloud = require('wx-server-sdk')
// cloud.init()
// const db = cloud.database()
// exports.main = async (event, context) => {
//   let skipNum = event.page * event.limit;
//   return await db.collection('travel')
//     .orderBy('createTime', 'desc')
//     .skip(skipNum) // 跳过结果集中的前 10 条，从第 11 条开始返回
//     .limit(event.limit) // 限制返回数量为 10 条
//     .get()
// }
