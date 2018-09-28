//index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    travelList: {},
    shouquan: false
  },
  addTravel() {
    wx.navigateTo({
      url: '../addTravel/addTravel',
    })
  },
  bindGetUserInfo(e) {
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
        } else {
          // console.log('2');
          that.setData({
            shouquan: false
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.getInit();

    wx.cloud.callFunction({
      name: 'getTravel',
      success(res) {
        // console.log(res)
        that.setData({
          travelList: res.result.data
        })
        // console.log(that.data.travelList[0])
      },
      fail(res) {
        console.log(res)
      }
    })

    
    // const db = wx.cloud.database();
    // db.collection('travel').add({
    //   data: {
    //     list: {
    //       date: "2018.10.01",
    //       dayNum: 9,
    //       headerImg: "xx",
    //       seeNum: 999,
    //       star: 888,
    //       time: "10:25",
    //       title: "啦啦啦啦",
    //       where: "宇宙"
    //     },
    //     user: {
    //       name: "哈哈",
    //       avatar: "xxx"
    //     }
    //   },
    //   success(res) {
    //     console.log(res)
    //   },
    //   fail(res) {
    //     console.log(res)
    //   }
    // })


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