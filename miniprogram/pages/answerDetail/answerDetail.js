// pages/answerDetail/answerDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: ''
  },

  getThisTime() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month <= 9 ? month = '0' + month : month;
    day <= 9 ? day = '0' + day : day;
    hour <= 9 ? hour = '0' + hour : hour;
    minute <= 9 ? minute = '0' + minute : minute;
    second <= 9 ? second = '0' + second : second;
    let fullTimes = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return fullTimes;
  },

  changeText(e) {
    this.setData({
      text: e.detail.value
    })
  },

  upload() {
    let that = this;
    if(this.data.text.length <= 10) {
      wx.showToast({
        title: '内容过少',
      })
    }
    else {
      wx.showLoading({
        title: '正在提交',
      })
      let obj = {
        time: this.getThisTime(),
        name: wx.getStorageSync('userInfo').nickName,
        avatarUrl: wx.getStorageSync('userInfo').avatarUrl,  
        openid: wx.getStorageSync('userInfo').openId,
        answer: this.data.text
      }

      wx.cloud.callFunction({
        name: 'answer',
        data: {
          openid: wx.getStorageSync('openid'),
          id: that.data.id,
          answer: obj
        },
        success(res) {
          console.log(res)
          wx.hideLoading();
          if (res.result != false) {
            wx.showToast({
              title: '提交成功',
            })
            var timer1 = null;
            timer1 = setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
              clearTimeout(timer1)
            },300);
          }else {
            wx.showToast({
              title: '提交失败',
              image: '../../images/error.png'
            })
          }
        },
        fail(res) {
          wx.showToast({
            title: '提交失败',
            image: '../../images/error.png'
          })
        }
      })
    }
  },

  getMyBug(val) {
    let db = wx.cloud.database();
    let that = this;
    db.collection('bug').where({
      _id: val,
    })
      .get({
        success: function (res) {
          // console.log(res.data);
          
          if(res.data[0].answerObj) {
            that.setData({
              listArr: res.data[0],
              text: res.data[0].answerObj.answer
            })
          }
          else {
            that.setData({
              listArr: res.data[0]
            })
          }
          var timer = null;
          timer = setTimeout(function () {
            wx.stopPullDownRefresh();
            wx.hideLoading();
            clearTimeout(timer);
          }, 500)
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
    this.setData({
      id: options.id
    })
    this.getMyBug(options.id)
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
    // this.getMyBug();
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