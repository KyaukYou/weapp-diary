// pages/myListDetail/myListDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getMyBug(val) {
    let db = wx.cloud.database();
    let that = this;
    db.collection('bug').where({
      _id: val,
    })
      .get({
        success: function (res) {
          console.log(res.data);
          that.setData({
            listArr: res.data[0]
          })
          var timer = null;
          timer = setTimeout(function() {
            wx.stopPullDownRefresh();
            wx.hideLoading();
            clearTimeout(timer);
          },500)

        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    })
    this.getMyBug(options.id);
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
    wx.showLoading({
      title: '正在加载',
    })
    this.getMyBug(options.id);
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