Page({

  /**
   * 页面的初始数据
   */
  data: {
    textarea: ''
  },
  //获取当前时间
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
  changeValue(e) {
    // console.log(e)
    this.setData({
      textarea: e.detail.value
    })
  },
  uploadBug() {
    let that = this;
    if(this.data.textarea.length < 10) {
      wx.showToast({
        image: '../../images/error.png',
        title: '请正确填写',
      })
    }
    else {
      let thisTime = this.getThisTime();
      let userInfo = wx.getStorageSync('userInfo');
      let db = wx.cloud.database();
      wx.showLoading({
        mask: true,
        title: '正在提交',
      })
      db.collection('bug').add({
        data: {
          time: thisTime,
          name: userInfo.nickName,
          text: this.data.textarea
        },
        success(res) {
          // console.log(res);
          wx.hideLoading();
          wx.showToast({
            title: '提交成功',
          })
          that.setData({
            textarea: ''
          })
          let timer = null;
          clearTimeout(timer);
          timer = setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
            clearTimeout(timer);
          },1000)
        },
        fail(res) {
          // console.log(res);
        },
        complete(res) {

        }
      })
    }
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