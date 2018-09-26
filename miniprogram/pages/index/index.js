//index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    travelList: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.cloud.callFunction({
    //   name: 'login',
    //   success(res) {
    //     console.log(res)
    //   },
    //   fail(res) {
    //     console.log(res)
    //   }
    // })
    var that = this;
    wx.cloud.callFunction({
      name: 'getTravel',
      success(res) {
        console.log(res)
        that.setData({
          travelList: res.result.data
        })
        console.log(that.data.travelList[0])
      },
      fail(res) {
        console.log(res)
      }
    })

    
    const db = wx.cloud.database();
    db.collection('travel').add({
      data: {
        list: {
          date: "2018.10.01",
          dayNum: 9,
          headerImg: "xx",
          seeNum: 999,
          star: 888,
          time: "10:25",
          title: "啦啦啦啦",
          where: "宇宙"
        },
        user: {
          name: "哈哈",
          avatar: "xxx"
        }
      },
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
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