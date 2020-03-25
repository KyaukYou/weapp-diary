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
          plan: _.push(event.val)
        },
      })
  } catch (e) {
    console.error(e)
  }
  // return event;
}