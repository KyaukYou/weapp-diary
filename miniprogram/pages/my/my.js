const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    userInfo: {},
    userGender: '',
    travelNum: 0,
    starNum: 0,
    fans: 0,
    version: ''
  },
  toInfo() {
    wx.showToast({
      title: '尽请期待!',
    })
  },
  toMyTravel() {
    wx.navigateTo({
      url: '../myTravel/myTravel',
    })
  },
  toMyStar() {
    wx.navigateTo({
      url: '../myStar/myStar',
    })
  },
  // 获得旅行数量
  getTravelNum() {
    let that = this;
    // console.log(options.id)

    let openid = wx.getStorageSync('openid');
    // let openid = 'W725rd2AWotkbRXB';

    let db = wx.cloud.database();
    // let _ = db.command;
    let travelData = db.collection('travel').where({
      _openid: openid
    }).get();

    var mydata;

    var a = Promise.resolve(travelData).then(function (res) {
      // mydata = res.data[0]
      // console.log(res.data.length);
      that.setData({
        travelNum: res.data.length
      })
    }) 
  },
  // 获得收藏数量
  getStarNum() {
    let that = this;
    // console.log(options.id)

    let openid = wx.getStorageSync('openid');
    // let openid = 'W725rd2AWotkbRXB';

    let db = wx.cloud.database();
    // let _ = db.command;
    let travelData = db.collection('users').where({
      _openid: openid
    }).get();

    var mydata;

    var a = Promise.resolve(travelData).then(function (res) {
      // mydata = res.data[0]
      // console.log(res.data.starArr);
      that.setData({
        starNum: res.data[0].starArr.length
      })
    })
  },

  onGotUserInfo(e) {
    console.log(e);
    this.getInit();  
  },
  getInit() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          // console.log('1');
          that.setData({
            shouquan: true
          });
          //加载
          app.getOpenId();
          let timer1 = null;
          clearInterval(timer1);
          timer1 = setInterval(function () {
            if (app.globalData.login) {
              that.getMyInfo();
              clearInterval(timer1);
            }
          }, 200)
        } else {
          // console.log('2');
          that.setData({
            shouquan: false
          })
        }
      }
    })
  },
  getMyInfo() {
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        hasUserInfo: true,
        userInfo: wx.getStorageSync('userInfo')
      })

      if (this.data.userInfo.gender == 1) {
        this.setData({
          userGender: '../../images/boy.png'
        })
      }
      else if (this.data.userInfo.gender == 2) {
        this.setData({
          userGender: '../../images/girl.png'
        })
      }

    } else {
      this.setData({
        hasUserInfo: false
      })
    }
  },
  tobug() {
    if (wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '../uploadBug/uploadBug',
      })
    }else {
      wx.showToast({
        title: '请先授权登录',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyInfo();
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
    this.getTravelNum();
    this.getStarNum();
    this.setData({
      version: app.globalData.version
    })
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