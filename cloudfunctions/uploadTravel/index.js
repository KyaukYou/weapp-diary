const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {

  // 判断like还是star
  // 再判断add还是min
  if (event.types == 'like') {

    if (event.change == 'add') {
      try {
        return await db.collection('travel').doc(event.id).update({
          data: {
            data: {
              like: _.inc(1)
            }
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
    else if (event.change == 'min') {
      try {
        return await db.collection('travel').doc(event.id).update({
          data: {
            data: {
              like: _.inc(-1)
            }
          }
        })
      } catch (e) {
        console.error(e)
      }
    }

  }

  else if (event.types == 'star') {
    if (event.change == 'add') {
      try {
        return await db.collection('travel').doc(event.id).update({
          data: {
            data: {
              star: _.inc(1)
            }
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
    else if (event.change == 'min') {
      try {
        return await db.collection('travel').doc(event.id).update({
          data: {
            data: {
              star: _.inc(-1)
            }
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  }

}