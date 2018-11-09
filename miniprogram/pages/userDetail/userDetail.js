Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userDetail: {},
    fans: [],
    watch: []
  },
  getData: function () {
    var that = this;
    let openid = wx.getStorageSync('openid')
    wx.showLoading({
      title: '正在加载...',
    })
    wx.cloud.callFunction({
      name: 'getDetail',
      data: {
        openid: openid
      },
      success(res) {
        wx.hideLoading();
        wx.showToast({
          title: '加载成功',
        })
        let result = res.result.data[0].userDetail
        let newAge = [];
        let newRegion = [];
        for (var k in result.age) {
          newAge.push(result.age[k])
        }
        for (var s in result.where) {
          newRegion.push(result.where[s])
        }

        that.setData({
          userInfo: res.result.data[0].userInfo,
          fans: res.result.data[0].fans,
          watch: res.result.data[0].watch,
          userDetail: res.result.data[0].userDetail
        })

      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '未知错误',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.getData();
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