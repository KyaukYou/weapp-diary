// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('bug').where({
      _id: event.id
    })
      .update({
        data: {
          answer: true,
          answerObj: event.answer
        },
      })
  } catch (e) {
    console.error(e)
  }
  // return event;
}