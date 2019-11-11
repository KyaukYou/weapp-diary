const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.templateMessage.send({
      touser: cloud.getWXContext().OPENID, // 通过 getWXContext 获取 OPENID
      page: 'page/test/test',
      data: {
        keyword1: {
          value: event.text1
        },
        keyword2: {
          value: event.text2
        },
        keyword3: {
          value: event.text3
        },
        keyword4: {
          value: event.text4
        },
        keyword5: {
          value: event.text5
        },
        keyword6: {
          value: event.text6
        },
        keyword7: {
          value: event.tt
        }
      },
      templateId: 'FNTxrAmR0dx186LHXZryLoHdohcgc1CRRKOL2cKwOH4',
      formId: event.formId,
      emphasisKeyword: 'God'
    })
    // result 结构
    // { errCode: 0, errMsg: 'openapi.templateMessage.send:ok' }
    return result
  } catch (err) {
    // 错误处理
    // err.errCode !== 0
    throw err
  }
}