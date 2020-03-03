const app = getApp();
import { $wuxDialog } from '../../dist/index'
import { $wuxToptips } from '../../dist/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verBol: false,
    verData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      mask: true,
      title: '正在加载',
    })
    let db = wx.cloud.database();
    db.collection('control').doc(app.globalData.controlId).get().then(res => {
      let data = res.data.verObj;

      // 排序
      var reData = JSON.parse(JSON.stringify(data)).reverse();

      this.setData({
        verData: reData,
        verBol: true
      })
      var timer = null;
      timer = setTimeout(function () {
        wx.stopPullDownRefresh();
        wx.hideLoading();
        clearTimeout(timer);
      }, 400)
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
    wx.showLoading({
      mask: true,
      title: '正在加载',
    })
    let db = wx.cloud.database();
    db.collection('control').doc(app.globalData.controlId).get().then(res => {
      let data = res.data.verObj.reverse();
      this.setData({
        verData: data
      })
      wx.stopPullDownRefresh();
      wx.hideLoading();
    })
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