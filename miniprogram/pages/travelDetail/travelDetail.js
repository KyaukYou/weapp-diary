Page({

  /**
   * 页面的初始数据
   */
  data: {
    travelObj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options.id)
    let myid = options.id;

    let db = wx.cloud.database();
    // let _ = db.command;
    let travelData = db.collection('travel').where({
      _id: myid
    }).get();

    var mydata;

    var a = Promise.resolve(travelData).then(function (res) {
      mydata = res.data[0]
      console.log(mydata,res.data);
      that.setData({
        travelObj: mydata
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