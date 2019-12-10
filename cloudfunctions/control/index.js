// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    if (event.openid != 'oRp3y0MvsGx3TW5zPRYg4iUcTTpI') {
      return false;
    }

    return await db.collection('control').where({
      _openid: event.openid
    })
      .update({
        data: {
          showAdd: event.showAdd
        },
      })
  } catch (e) {
    console.error(e)
  }

}