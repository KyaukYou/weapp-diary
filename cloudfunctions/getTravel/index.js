// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database();
exports.main = async (event, context) => {
  try {
    return await db.collection('travel').limit(100).get();
  }catch(e) {
    console.error(e);
  }
}

