//index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    travelList: {},
    shouquan: false,
    lazyloadBol: true,
    rotateBol: false,
    listArr: [
      {
        name: '最近更新',
        color: 'rgb(239,37,15)'
      },
      {
        name: '时间正序',
        color: 'black'
      },
      {
        name: '浏览次数',
        color: 'black'
      },
      {
        name: '点赞最高',
        color: 'black'
      }
    ],
    listColor: ['rgb(239,37,15)','black','black','black']
  },
  // 修改list颜色
  changelistcolor(e) {
    let index = e.currentTarget.dataset.index;
    var copy = this.data.listArr;
    for(var i=0; i<copy.length; i++) {
      copy[i].color = 'black';
    }

    copy[index].color = 'rgb(239,37,15)';
    this.setData({
      listArr: copy
    })
    wx.showLoading({
      title: '正在加载',
      success: function() {
        wx.hideLoading();
      }
    })
  },
  // 查看详情
  todetail(e) {
    let id = e.currentTarget.dataset.id
    console.log(e)

    wx.navigateTo({
      url: '../travelDetail/travelDetail?id='+id,
    })
  },
  addTravel() {
    // 判断是否登录
    if(wx.getStorageSync('openid')) {
      // console.log('yes');
      wx.navigateTo({
        url: '../addTravel/addTravel',
      })
    }else {
      // console.log('no');
      wx.showToast({
        image: '../../images/error.png',
        title: '请先授权登录',
      })
    }
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
    var that = this;
    wx.cloud.callFunction({
      name: 'getTravel',
      success(res) {
        that.setData({
          travelList: res.result.data
        })
      },
      fail(res) {
        console.log(res)
      },
      complete(res) {
        wx.stopPullDownRefresh();
      }
    })
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
    var that = this;
    wx.cloud.callFunction({
      name: 'getTravel',
      success(res) {
        that.setData({
          travelList: res.result.data
        })
      },
      fail(res) {
        console.log(res)
      },
      complete(res) {
        wx.stopPullDownRefresh();
      }
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