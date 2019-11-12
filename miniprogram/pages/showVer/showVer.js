const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verData1: [
      {
        "ver": "V1.10.1112(2019-11-12)",
        "text": [
          "【优化】图标更新",
          "【优化】减少某些页面的网络请求次数",
          "【修复】修复wx:key警告错误"
        ]
      },
      {
        "ver": "V1.9.0809(2019-08-09)",
        "text": [
          "【修复】微信昵称等信息不同步的问题",
          "【修复】同步关注、粉丝头像昵称"
        ]
      },
      {
        "ver": "V1.9.0807(2019-08-07)",
        "text": [
          "【修复】授权登录后数据获取失败的问题",
          "【优化】位置信息授权逻辑",
          "【优化】优化页面代码显示逻辑，提高稳定性",
          "【新增】更换头像测试版"
        ]
      },
      {
        "ver": "V1.8.0805(2019-08-05)",
        "text": [
          "【优化】搜索框重写优化",
          "【优化】强迫症细节优化，优化加载速度"
        ]
      },
      {
        "ver": "V1.7.0802(2019-08-02)",
        "text": [
          "【优化】我的页面图标位置细节优化",
          "【优化】日记页面细节优化",
          "【优化】其他页面细节优化",
          "【修复】锁定的日记可以在收藏页面直接查看的BUG"
        ]
      },
      {
        "ver": "V1.7.0801(2019-08-01)",
        "text": [
          "【新增】同步日记删除功能",
          "【新增】取消关注功能",
          "【优化】固定顶部图片高度",
          "【优化】我的页面刷新按钮动画效果优化"
        ]
      },
      {
        "ver": "V1.6.0731(2019-07-31)",
        "text": [
          "【优化】布局优化",
          "【新增】旅行日记删除功能",
          "【需要新增】删除日记后，目前收藏，喜欢不能同步更新，后续会考虑解决方法"
        ]
      },
      {
        "ver": "V1.5.0308(2019-03-09)",
        "text": [
          "【变更】首页文章布局重构",
          "【修复】收藏中心锁定仍可点击的BUG",
          "【未知BUG】加载图片导致小程序白屏或者卡死"
        ]
      },
      {
        "ver": "V1.3.1121(2018-11-21)",
        "text": [
          "【修复】没有授权登录就能关注他人的BUG",
          "【优化】授权提示信息显示"
        ]
      },
      {
        "ver": "V1.2.1120(2018-11-20)",
        "text": [
          "【优化】例行更新，代码优化"
        ]
      },
      {
        "ver": "V1.2.1118(2018-11-18)",
        "text": [
          "【修复】我的收藏loading框一直存在的BUG",
          "【修复】我的关注粉丝加载界面loading框不显示文字的BUG",
          "【修复】查看他人信息无法显示的BUG",
          "【修复】关注他人显示错误的BUG",
          "【修复】他人自定义图片不显示的BUG",
          "【优化】评论取消按钮显示效果",
          "【优化】去除某些页面加载成功的提示",
          "【优化】关注按钮点击优化",
          "【新增】更新日志页面"
        ]
      },
      {
        "ver": "V1.1.1115(2018-11-15)",
        "text": [
          "【优化】整体颜色优化",
          "【优化】我的页面图标添加",
          "【优化】完善背景图片添加",
          "【新增】我的关注，我的粉丝页面"
        ]
      },
      {
        "ver": "V1.0.1114(2018-11-14)",
        "text": [
          "【新增】我的页面背景图添加(测试版)",
          "【优化】首页显示效果",
          "【优化】我的页面显示效果",
          "【优化】个人信息页面显示效果",
          "【优化】BUG页面代码优化",
          "【优化】评论功能数据添加"
        ]
      },
      {
        "ver": "V0.13.1113(2018-11-13)",
        "text": [
          "【新增】关注功能(测试版)",
          "【新增】我的信息编辑",
          "【新增】查看对方信息"
        ]
      }
    ],
    verData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let db = wx.cloud.database();
    db.collection('control').doc(app.globalData.controlId).get().then(res => {
      let data = JSON.parse(res.data.verData);
      this.setData({
        verData: data
      })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})