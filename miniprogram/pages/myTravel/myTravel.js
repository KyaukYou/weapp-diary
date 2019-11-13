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
    starArr: [],
    likeArr: []
  },
  // 查看详情
  todetail(e) {
    let id = e.currentTarget.dataset.id
    // console.log(e)

    wx.navigateTo({
      url: '../editTravel/editTravel?id=' + id,
    })
  },


  // 同步删除收藏，喜欢
  syncData(id) {
    let db = wx.cloud.database();
    let allUser = db.collection('users').get();

    Promise.resolve(allUser).then(function(res) {
      // console.log(res);
      let likeArr1 = [];
      let starArr1 = [];
      let travelArr1 = [];
      let result = res.data;
      for(var i=0; i<result.length; i++) {
        // if(result[i])

        // 喜欢数组
        for(let j=0; j<result[i].likeArr.length; j++) {
          if (result[i].likeArr[j] == id) {
            result[i].likeArr.splice(j,1);
            likeArr1.push(i)
          }
        }

        // 收藏数组
        for (let k = 0; k < result[i].starArr.length; k++) {
          if (result[i].starArr[k] == id) {
            result[i].starArr.splice(k, 1);
            starArr1.push(i)
          }
        }

        // 我的旅行数组
        for (let x = 0; x < result[i].travelArr.length; x++) {
          if (result[i].travelArr[x] == id) {
            result[i].travelArr.splice(x, 1);
            travelArr1.push(i)
          }
        }
      }

      // // console.log(result);
      // // console.log(likeArr1,starArr1,travelArr1)
      // 或得需要更新的用户
      let conArr = (likeArr1.concat(starArr1)).concat(travelArr1)
      let conArr1 = [...new Set(conArr)]


      // 循环更新
      for(var a=0; a<conArr1.length; a++) {

        wx.cloud.callFunction({
          name: 'syncTravel',
          data: {
            id: result[conArr1[a]],
            likeArr: result[conArr1[a]].likeArr,
            starArr: result[conArr1[a]].starArr,
            travelArr: result[conArr1[a]].travelArr
          },
          success(res) {
            // console.log(res)
          }
        })  

        // db.collection('users').doc(result[conArr1[a]]._id).update({
        //   data: {
        //     likeArr: result[conArr1[a]].likeArr,
        //     starArr: result[conArr1[a]].starArr,
        //     travelArr: result[conArr1[a]].travelArr
        //   },
        //   success(res) {
        //     // console.log(res)
        //   },
        //   fail(res) {
        //     // console.log(res)
        //   }
        // })        
      }

    }) 


    
    // // console.log(allUser)
  },

  // 删除旅行
  delTravelId(e) {
    let db = wx.cloud.database();
    let that = this;
    // // console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '是否删除',
      content: '删除后不可恢复',
      success(res) {
        if(res.confirm) {
          // wx.cloud.callFunction({
          //   name: 'delTravelId',
          //   data: {
          //     id: id
          //   },
          //   success(res) {
          //     // console.log(res)
          //   },
          //   fail(res) {
          //     // console.log(res)
          //   }
          // })
          db.collection('travel').doc(id)
            .remove()
            .then(res => {
              // console.log(res);
              $wuxToptips().success({
                hidden: true,
                text: '删除成功',
                duration: 1500,
                success() { 

                  that.syncData(id);
                  
                  wx.showLoading({
                    mask: true,
                    title: '正在加载',
                  })
                  let db = wx.cloud.database();
                  let openid = wx.getStorageSync('openid');

                  let userData1 = db.collection('travel').where({
                    _openid: openid
                  }).get();

                  var mydata;
                  Promise.resolve(userData1).then(function (res) {
                    mydata = res.data
                    // console.log(res.data[0]);

                    var aa = [];
                    for (var i = 0; i < mydata.length; i++) {
                      aa.unshift(mydata[i])
                    }

                    that.setData({
                      travelList: aa
                    });
                    wx.hideLoading();
                    wx.stopPullDownRefresh();
                    var timer1 = null;
                    clearInterval(timer1);
                    timer1 = setInterval(function () {
                      if (app.globalData.login) {
                        that.initUser();
                        clearInterval(timer1);
                      }
                    }, 200)
                  })

                },
              })
            }).catch(res => {
              // console.log(res);
              $wuxToptips().error({
                hidden: true,
                text: '删除失败',
                duration: 1500,
                success() { },
              })
            })
        }
        else {

        }
      }
    })  
  },

  // 初始化点赞图标
  initLikeArr() {
    let copy = this.data.userData.likeArr;
    let copy1 = this.data.travelList;
    let arr = this.data.likeArr;
    let bol = false;
    // // console.log(copy)
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

      // if(bol)

    }
    // // console.log(arr);

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
    // // console.log(copy)
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
    // // console.log(arr);

    this.setData({
      starArr: arr
    })
    wx.hideLoading()
  },
  //删除旅行
  delTravel(e) {
    let that = this;
    let bol = e.currentTarget.dataset.lock;

    if (bol == false) {
      wx.showModal({
        title: '是否锁定',
        content: '锁定后他人将不能查看你的旅行日记',
        success(res) {
          if (res.confirm) {
            let db = wx.cloud.database();
            db.collection('travel').doc(e.currentTarget.dataset.id).update({
              data: {
                data: {
                  lock: !bol
                }
              },
              success(res) {
                var copy = that.data.travelList;
                var copyBol = copy[e.currentTarget.dataset.index].data.lock;
                copyBol = !bol;
                copy[e.currentTarget.dataset.index].data.lock = copyBol;
                that.setData({
                  travelList: copy
                })
                $wuxToptips().success({
                  hidden: true,
                  text: '锁定成功',
                  duration: 2500,
                  success() { },
                })
              }
            });
          } else {
            //none
          }
        }
      })
    } 
    else {
      wx.showModal({
        title: '是否解锁',
        content: '解锁后他人将能查看你的旅行日记',
        success(res) {
          if (res.confirm) {
            let db = wx.cloud.database();
            db.collection('travel').doc(e.currentTarget.dataset.id).update({
              data: {
                data: {
                  lock: !bol
                }
              },
              success(res) {
                var copy = that.data.travelList;
                var copyBol = copy[e.currentTarget.dataset.index].data.lock;
                copyBol = !bol;
                copy[e.currentTarget.dataset.index].data.lock = copyBol;
                that.setData({
                  travelList: copy
                })
                $wuxToptips().success({
                  hidden: true,
                  text: '解锁成功',
                  duration: 2500,
                  success() { },
                })
              }
            });
          } else {
            //none
          }
        }
      })
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this;
    // that.getInit();
    this.syncData();
    //show
    var that = this;
    wx.showLoading({
      mask: true,
      title: '正在加载',
    })
    let db = wx.cloud.database();
    let openid = wx.getStorageSync('openid');

    let userData1 = db.collection('travel').where({
      _openid: openid
    }).get();

    var mydata;
    Promise.resolve(userData1).then(function (res) {
      mydata = res.data
      // console.log(res.data[0]);

      var aa = [];
      for (var i = 0; i < mydata.length; i++) {
        aa.unshift(mydata[i])
      }

      that.setData({
        travelList: aa
      });
      wx.hideLoading();
      wx.stopPullDownRefresh();
      var timer1 = null;
      clearInterval(timer1);
      timer1 = setInterval(function () {
        if (app.globalData.login) {
          that.initUser();
          clearInterval(timer1);
        }
      }, 200)
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
      // console.log(res);
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
    let db = wx.cloud.database();
    let openid = wx.getStorageSync('openid');

    let userData1 = db.collection('travel').where({
      _openid: openid
    }).get();

    var mydata;
    Promise.resolve(userData1).then(function (res) {
      mydata = res.data
      var aa = [];
      for (var i = 0; i < mydata.length; i++) {
        aa.unshift(mydata[i])
      }

      that.setData({
        travelList: aa
      })
      wx.stopPullDownRefresh();
      let timer1 = null;
      clearInterval(timer1);
      timer1 = setInterval(function () {
        if (app.globalData.login) {
          that.initUser();
          clearInterval(timer1);
        }
      }, 200)
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