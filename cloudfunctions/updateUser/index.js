// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('todos').doc('doc-id').update({
      data: {
        tags: _.push(['mini-program', 'cloud'])
      }
    })
  } catch (e) {
    console.error(e)
  }
}