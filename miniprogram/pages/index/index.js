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
    listColor: ['rgb(239,37,15)','black','black','black'],
    starArr: [],
    likeArr: []
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
  addLike(e) {
    // console.log(e);
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let copy = this.data.travelList[index].data.like;
    let openid = wx.getStorageSync('openid');
    let haveIndex = 0;
    var res = copy.some(function(item,index) {
      if(item == openid) {
        console.log(index)
        haveIndex = index;
        return true;
      }else {
        return false;
      }
    })

    if(!res) {
      copy.push(openid);
      this.sqlChange(index,copy, 'like')
    }
    else {
      copy.splice(haveIndex,1)
      this.sqlChange(index,copy, 'like')
    };

    let copyAll = this.data.travelList;
    copyAll[index].data.like = copy;

    this.setData({
      travelList: copyAll
    })
    this.initLikeArr();
    // this.initStarArr();
    // console.log(res)

  },
  addStar(e) {
    // console.log(e);
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let copy = this.data.travelList[index].data.star;
    let openid = wx.getStorageSync('openid');
    let haveIndex = 0;
    var res = copy.some(function (item, index) {
      if (item == openid) {
        console.log(index)
        haveIndex = index;
        return true;
      } else {
        return false;
      }
    })

    if (!res) {
      copy.push(openid);
      this.sqlChange(index,copy,'star')
    }
    else {
      copy.splice(haveIndex, 1)
      this.sqlChange(index,copy,'star')
    };

    let copyAll = this.data.travelList;
    copyAll[index].data.star = copy;

    this.setData({
      travelList: copyAll
    })
    // this.initLikeArr();
    this.initStarArr();
    // console.log(res)
  },

  // 初始化点赞图标
  initLikeArr() {
    let copy = this.data.travelList;
    let num = 0;
    let openid = wx.getStorageSync('openid');
    let arr = [];
    for(var i=0; i<copy.length; i++) {
      if (copy[i].data.like.length == 0) {
        arr[i] = 0;
      }else {
        for (var j = 0; j < copy[i].data.like.length; j++) {
          if (copy[i].data.like[j] == openid) {
            arr[i] = 1;
          } else {
            arr[i] = 0;
          }
        }
      }  
    }
    this.setData({
      likeArr: arr
    })
    // console.log(arr);
  },
  // 初始化收藏图标
  initStarArr() {
    let copy = this.data.travelList;
    let num = 0;
    let openid = wx.getStorageSync('openid');
    let arr = [];
    for (var i = 0; i < copy.length; i++) {
      if (copy[i].data.star.length == 0) {
        arr[i] = 0;
      } else {
        for (var j = 0; j < copy[i].data.star.length; j++) {
          if (copy[i].data.star[j] == openid) {
            arr[i] = 1;
          } else {
            arr[i] = 0;
          }
        }
      }
    }
    // console.log(arr);
    this.setData({
      starArr: arr
    })
  },
  sqlChange(val,arr,types) {
    console.log(val,arr,types)
    let id = this.data.travelList[val]['_id'];
    console.log(id)

    let db = wx.cloud.database();
    let _ = db.command;

    if(types == 'like') {
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
          console.log(res)
        }
      });
    }else if(types == 'star') {
       db.collection('travel').doc(
        id
      ).update({
        data: {
          data: {
            star: arr
          },
          success(res) {
            console.log(res)
          },
          fali(res) {
            console.log(res)
          },
          complete(res) {
            console.log(res)
          }
        }
      });
    }




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
        that.initLikeArr();
        that.initStarArr();
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