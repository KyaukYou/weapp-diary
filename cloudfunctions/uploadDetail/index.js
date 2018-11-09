const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('users').where({
      _openid: event.openid
    })
      .update({
        data: {
          userDetail: {
            birth: event.birth,
            age: event.age,
            where: event.region,
            info: event.goodat
          }
        },
      })
  } catch (e) {
    console.error(e)
  }
}