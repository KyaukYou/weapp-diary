# 柴窝

+ 记录旅行
  - 需要图标 
    - 爱心，评论，点赞
    - 主页，我的，推荐

+ 2018.9.27
  - 初始化时获取用户openid,userInfo
  - 从数据库调用旅行数据
  - 图片上传一次测试完成

+ 2018.9.28
  - 用户上传页面框架完成50%
  - 主体样式确定
  - 添加主页悬浮按钮  

+ 2018.9.29
  - 数据格式 
      {
        title: 'xx',
        where: 'xx',
        sDate: '2018.9.29',
        eDate: '2018.9.30',
        time: '2018.10.01 12:02',
        see: 0,
        star: 0,
        like: 0,
        day: '5',
        list: [
          {
            imgs: [],
            trueImgs: [],
            text: 'xxx',
            date: '2018.9.29'
            show: true,
            like: 0,
            imgNum: 2
          },
          {
            imgs: [],
            trueImgs: [],
            text: 'xxx',
            date: '2018.9.29'
            show: true,
            like: 0,
            imgNum: 2
          }
        ]
      }
   - 页面优化
   - 日期列表优化
   - 日期选择优化
   - 添加删除图片
   - 独立的日期图片文字数组
   - 上传逻辑添加   

