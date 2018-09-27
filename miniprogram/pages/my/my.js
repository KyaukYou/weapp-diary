Page({

  /**
   * 页面的初始数据
   */
  data: {
      length: 0,
      arr: []
  },
  uploadImg() {
    var that = this;
    wx.chooseImage({
      count: 9,
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res);
        wx.showLoading({
          title: '上传中',
        })
        var arr = res.tempFilePaths;
        console.log(arr)
        that.setData({
          length: 0,
          arr: arr
        })
        that.uploadImgs()

      },
      fail(res) {

      },
      complete(res) {

      }
    })
  },
  uploadImgs() {
    var that = this;
    console.log(that.data.arr)
    if(that.data.length < that.data.arr.length) {
      let filePath = that.data.arr[that.data.length];
      console.log(filePath)
      let pattern = /\.{1}[a-z]{1,}$/;
      let a = filePath.slice(0, pattern.exec(filePath).index);
      a = a.slice(11)
      // console.log(a)
      let cloudPath = a + filePath.match(/\.[^.]+?$/)[0];
      console.log(a,cloudPath)
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success(res) {
          console.log(res)
          // that.data.length++;
        },
        fail(res) {
          console.log(res)
        },
        complete(res) {
          var l = that.data.length+=1;
          that.setData({
            length: l
          });
          console.log(l)
          that.uploadImgs();
        }
      })
    }else {
      wx.hideLoading();
      wx.showToast({
        title: '上传完成',
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