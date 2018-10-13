//index.js
const app = getApp()
const util = require('../../utils/util.js');
import { $wuxToptips } from '../../dist/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    travelList: {},
    userData: "",
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
    let sOpenid = wx.getStorageSync('openid')
    if (e.currentTarget.dataset.openid == sOpenid) {
      wx.navigateTo({
        url: '../travelDetail/travelDetail?id=' + id,
      })
    }else {
      if (e.currentTarget.dataset.lock) {
        wx.showToast({
          title: '已被锁定',
        })
      } else {
        wx.navigateTo({
          url: '../travelDetail/travelDetail?id=' + id,
        })
      }
    }
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
  addLike: util.throttle(function(e){
    var that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let copy = this.data.userData.likeArr;
    let copy1 = this.data.travelList[index];
    let pushId;
    let haveIndex = 0;
    let res;
    if(copy.length == 0) {
      pushId = copy1['_id']
      res = false;
    }else {
      res = copy.some(function (item, index) {
        if (item == copy1['_id']) {
          console.log(index)
          haveIndex = index;
          return true;
        } else {
          pushId = copy1['_id']
          return false;
        }
      })
    }

    if(!res) {
      copy.push(pushId);
      var copy2 = that.data.travelList;
      var travelCopy = that.data.travelList[index].data.like;
      travelCopy += 1;
      copy2[index].data.like = travelCopy;
      that.setData({
        travelList: copy2
      })

      this.sqlChange(index,copy,'like','add')
    }
    else {
      copy.splice(haveIndex,1);

      var copy2 = that.data.travelList;
      var travelCopy = that.data.travelList[index].data.like;
      travelCopy -= 1;
      copy2[index].data.like = travelCopy;
      that.setData({
        travelList: copy2
      })

      this.sqlChange(index,copy,'like','min')
    };

    console.log(copy)

    let copyAll = this.data.userData;
    copyAll.likeArr = copy;


    this.setData({
      userData: copyAll
    })
    this.initLikeArr();

  },3000),
  addStar: util.throttle(function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let copy = this.data.userData.starArr;
    let copy1 = this.data.travelList[index];
    let pushId;
    let haveIndex = 0;
    let res;
    if (copy.length == 0) {
      pushId = copy1['_id']
      res = false;
    } else {
      res = copy.some(function (item, index) {
        if (item == copy1['_id']) {
          console.log(index)
          haveIndex = index;
          return true;
        } else {
          pushId = copy1['_id']
          return false;
        }
      })
    }

    if (!res) {
      copy.push(pushId);
      var copy2 = that.data.travelList;
      var travelCopy = that.data.travelList[index].data.star;
      travelCopy += 1;
      copy2[index].data.star = travelCopy;
      that.setData({
        travelList: copy2
      })

      this.sqlChange(index, copy, 'star', 'add')
    }
    else {
      copy.splice(haveIndex, 1);

      var copy2 = that.data.travelList;
      var travelCopy = that.data.travelList[index].data.star;
      travelCopy -= 1;
      copy2[index].data.star = travelCopy;
      that.setData({
        travelList: copy2
      })

      this.sqlChange(index, copy, 'star', 'min')
    };

    console.log(copy)

    let copyAll = this.data.userData;
    copyAll.starArr = copy;


    this.setData({
      userData: copyAll
    })
    this.initStarArr();

  },3000),

  // 初始化点赞图标
  initLikeArr() {
    let copy = this.data.userData.likeArr;
    let copy1 = this.data.travelList;
    let arr = this.data.likeArr;
    let bol = false;
    // console.log(copy)
    if(copy.length == 0) {
      for (var i = 0; i < copy1.length; i++) {
        arr[i] = 0;
        // bol = false;
      }
    }else {

      for(var i=0; i<copy1.length; i++) {

        bol = copy.some(function(item,index) {
          if(copy1[i]['_id'] == item) {
            arr[i] = 1;
            return true;
          }else {
            arr[i] = 0;
            return false;
          }
        })        

      }

      // if(bol)

    }
    // console.log(arr);

    this.setData({
      likeArr: arr
    })

  },
  // 初始化收藏图标
  initStarArr() {
    let copy = this.data.userData.starArr;
    let copy1 = this.data.travelList;
    let arr = this.data.starArr;

    let bol = false;
    // console.log(copy)
    if (copy.length == 0) {
      for (var i = 0; i < copy1.length; i++) {
        arr[i] = 0;
        // bol = false;
      }
    } else {

      for (var i = 0; i < copy1.length; i++) {

        bol = copy.some(function (item, index) {
          if (copy1[i]['_id'] == item) {
            arr[i] = 1;
            return true;
          } else {
            arr[i] = 0;
            return false;
          }
        })

      }
    }  
    // console.log(arr);

    this.setData({
      starArr: arr
    })
  },
  sqlChange(val,arr,types,what) {
    console.log(val,arr,types,what)
    let id = this.data.travelList[val]['_id'];
    let openid = wx.getStorageSync('openid');
    // console.log(id)

    let db = wx.cloud.database();
    let _ = db.command;

    if(types == 'like') {
      // db.collection('users').where({
      //   _openid: openid
      // })
      //   .update({
      //     data: {
      //       likeArr: arr
      //     },
      //   })
      wx.cloud.callFunction({
        name: 'userArr',
        data: {
          openid: openid,
          arr: 'like',
          arrs: arr
        }
      })
      if(what == 'add') {
        wx.cloud.callFunction({
          name: 'uploadTravel',
          data: {
            types: 'like',
            change: 'add', 
            id: id
          },
          success(res) {
            console.log(res);
            $wuxToptips().success({
              hidden: true,
              text: '点赞成功',
              duration: 2500,
              success() { },
            })
          }
        })
      }
      else {
        wx.cloud.callFunction({
          name: 'uploadTravel',
          data: {
            types: 'like',
            change: 'min',
            id: id
          },
          success(res) {
            console.log(res);
            $wuxToptips().warn({
              hidden: true,
              text: '取消点赞',
              duration: 2500,
              success() { },
            })
          }
        })
      }
    }
    else if(types == 'star') {
      wx.cloud.callFunction({
        name: 'userArr',
        data: {
          openid: openid,
          arr: 'star',
          arrs: arr
        }
      })

      if (what == 'add') {
        wx.cloud.callFunction({
          name: 'uploadTravel',
          data: {
            types: 'star',
            change: 'add',
            id: id
          },
          success(res) {
            console.log(res)
            $wuxToptips().success({
              hidden: true,
              text: '收藏成功',
              duration: 2500,
              success() { },
            })
          }
        })
      }
      else {
        wx.cloud.callFunction({
          name: 'uploadTravel',
          data: {
            types: 'star',
            change: 'min',
            id: id
          },
          success(res) {
            console.log(res)
            $wuxToptips().warn({
              hidden: true,
              text: '取消收藏',
              duration: 2500,
              success() { },
            })
          }
        })
      }
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
        let timer1 = null;
        clearInterval(timer1);
        timer1 = setInterval(function () {
          if (app.globalData.login) {
            that.initUser();
            clearInterval(timer1);
          }
          // console.log(app.globalData.login)
        }, 200)
      }
    })

    // let timer1 = null;
    // clearInterval(timer1);
    // timer1 = setInterval(function () {
    //   if (app.globalData.login) {
    //     that.initUser();
    //     clearInterval(timer1);
    //   }
    //   console.log(app.globalData.login)
    // }, 200)

  },
  initUser() {
    let that = this;
    let openid = wx.getStorageSync('openid')
    let db = wx.cloud.database();

    // let _ = db.command;
    let userData1 = db.collection('users').where({
      _openid: openid
    }).get();

    var mydata;
    Promise.resolve(userData1).then(function (res) {
      mydata = res.data[0]
      // console.log(res.data[0]);
      that.setData({
        userData: mydata
      });
      that.initLikeArr();
      that.initStarArr();
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
        // that.initUser();
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