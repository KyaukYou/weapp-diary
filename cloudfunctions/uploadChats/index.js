const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {

  try {
    return await db.collection('travel').doc(event.id).update({
      data: {
        data: {
          chats: _.push(event.val)
        }
      }
    })
  } catch (e) {
    console.error(e)
  }

}