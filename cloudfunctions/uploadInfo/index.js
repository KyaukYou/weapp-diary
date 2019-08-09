const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('users').doc(event.id)
      .update({
        data: {
          userInfo: event.userInfo
        }
      })
  } catch (e) {
    console.error(e)
  }
}