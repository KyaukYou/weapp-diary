const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {

  if (event.arr == 'like') {
    try {
      return await db.collection('users').where({
        _openid: event.openid
      })
        .update({
          data: {
            likeArr: event.arrs
          },
        })
    } catch (e) {
      console.error(e)
    }
  }else {
    try {
      return await db.collection('users').where({
        _openid: event.openid
      })
        .update({
          data: {
            starArr: event.arrs
          },
        })
    } catch (e) {
      console.error(e)
    }
  } 

}