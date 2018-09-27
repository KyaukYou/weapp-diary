// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // return event
  // const fileStream = fs.createReadStream(event.result)
  const fileStream = 'xxxxxxx.png'
  return event.result
  // return await cloud.uploadFile({
  //   cloudPath: fileStream,
  //   fileContent: event.result,
  // })
}