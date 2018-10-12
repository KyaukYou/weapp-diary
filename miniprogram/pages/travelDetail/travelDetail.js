Page({

  /**
   * 页面的初始数据
   */
  data: {
    travelObj: {},
    likeBol: false,
    travelId: ''
  },
  // 查看大图
  showImg(e) {
    let index = e.currentTarget.dataset.index;
    let copy = this.data.travelObj;

    wx.previewImage({
      urls: copy.data.list[index].imgs,
      current: e.currentTarget.dataset.url,
      success: function (res) {
        console.log(res)
      }
    })
  },
  // 初始化点赞图标
  initLikeArr() {
    let copy = this.data.travelObj;
    let num = 0;
    let openid = wx.getStorageSync('openid');
    let bol = false;
    var res = copy.data.like.some(function (item, index) {
      if (item == openid) {
        console.log(index)
        return true;
      } else {
        return false;
      }
    })
    if(res) {
      bol = true;
    }else {
      bol = false
    }
    this.setData({
      likeBol: bol
    })
  },
  //取消或者点赞
  addLike(e) {
    let id = this.data.travelObj['_id'];
    // let index = e.currentTarget.dataset.index;
    let copy = this.data.travelObj.data.like;
    let openid = wx.getStorageSync('openid');
    let haveIndex = 0;
    var res = copy.some(function (item, index) {
      if (item == openid) {
        haveIndex = index;
        return true;
      } else {
        return false;
      }
    })

    if (!res) {
      copy.push(openid);
      this.sqlChange(copy, 'like')
    }
    else {
      copy.splice(haveIndex, 1)
      this.sqlChange(copy, 'like')
    };

    let copyAll = this.data.travelObj;
    copyAll.data.like = copy;

    this.setData({
      travelObj: copyAll
    })
    this.initLikeArr();
  },
  sqlChange(arr, types) {
    let that = this;
    console.log(arr, types)
    let id = this.data.travelObj['_id'];
    // console.log(id)

    let db = wx.cloud.database();
    let _ = db.command;
      db.collection('travel').doc(
        id
      ).update({
        data: {
          data: {
            like: arr
          }
        },
        success(res) {
          console.log(res)
        },
        fali(res) {
          console.log(res)
        },
        complete(res) {
          console.log(res);
          // that.initData(that.data.travelId);
        }
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // console.log(options.id)

    let myid = options.id;
    this.setData({
      travelId: myid
    })
    // let myid = 'W725rd2AWotkbRXB';

    that.initData(myid);

  },
  initData(myid) {
    let that = this;
    let db = wx.cloud.database();
    // let _ = db.command;
    let travelData = db.collection('travel').where({
      _id: myid
    }).get();

    var mydata;

    var a = Promise.resolve(travelData).then(function (res) {
      mydata = res.data[0]
      console.log(mydata, res.data);
      that.setData({
        travelObj: mydata
      })
      that.initLikeArr();

      // console.log(that.data.travelObj)
      wx.setNavigationBarTitle({
        title: that.data.travelObj.data.title
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