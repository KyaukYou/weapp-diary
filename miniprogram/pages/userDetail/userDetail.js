const app = getApp();
import { $wuxToptips } from '../../dist/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    userInfo: {},
    userDetail: {},
    userGender: '',
    travelNum: 0,
    starNum: 0,
    fans: [],
    watch: [],
    bgImg: '',
    where: '',
    thisOpenid: '',
    myOpenid: '',
    addText: '关注',
    whatHe: '他'
  },
  addFans() {
    if (!wx.getStorageSync('openid')) {
      $wuxToptips().error({
        hidden: true,
        text: '请先登录',
        duration: 2500,
        success() { },
      })
      return;
    }

    if(this.data.addText == '关注') {
      let db = wx.cloud.database();
      
      let that = this;
      let userAll = wx.getStorageSync('userInfo');
      let user1 = {
        avatarUrl: userAll.avatarUrl, 
        gender: userAll.gender,
        nickName: userAll.nickName,
        openid: this.data.myOpenid
      }
      let user2 = {
        avatarUrl: that.data.userInfo.avatarUrl,
        gender: that.data.userInfo.gender,
        nickName: that.data.userInfo.nickName,
        openid: this.data.thisOpenid
      }

      // console.log(user1,user2)
      wx.cloud.callFunction({
        name: 'uploadFans',
        data: {
          openid: this.data.thisOpenid,
          val: user1
        },
        success(res) {
          // console.log(res)
          wx.cloud.callFunction({
            name: 'uploadWatch',
            data: {
              openid: that.data.myOpenid,
              val: user2
            },
            success(res) {
              // console.log(res)
              $wuxToptips().success({
                hidden: true,
                text: '关注成功',
                duration: 2500,
                success() { },
              })
              that.setData({
                addText: '已关注'
              })
              that.getStarNum(that.data.thisOpenid)
            }
          })

        }
      })
    }
    else {
      let db = wx.cloud.database();
      let that = this;

      let userAll = wx.getStorageSync('userInfo');
      let user1 = {
        avatarUrl: userAll.avatarUrl,
        gender: userAll.gender,
        nickName: userAll.nickName,
        openid: this.data.myOpenid
      }
      let user2 = {
        avatarUrl: that.data.userInfo.avatarUrl,
        gender: that.data.userInfo.gender,
        nickName: that.data.userInfo.nickName,
        openid: this.data.thisOpenid
      }

      wx.showModal({
        title: '是否取消',
        content: '是否取消关注',
        success(res) {
          if (res.confirm) {

            // 取消关注  
            let myData = db.collection('users').where({
              _openid: that.data.myOpenid
            }).get()

            Promise.resolve(myData).then(function (res) {
              // console.log(res);
              let data1 = res.data[0];
              for(var i=0; i<data1.watch.length; i++) {
                if (data1.watch[i].openid == that.data.thisOpenid) {
                  data1.watch.splice(i,1);
                }
              }
              // console.log(data1)
              db.collection('users').doc(data1._id).update({
                data: {
                  watch: data1.watch
                },
                success(res) {
                  // console.log(res);

                  //取消粉丝
                  wx.cloud.callFunction({
                    name: 'cancelFans',
                    data: {
                      thisOpenid: that.data.thisOpenid,
                      myOpenid: that.data.myOpenid
                    },
                    success(res) {
                      // console.log(res)

                      let data2 = res.result.data[0];
                      // console.log(data2)
                      for (var b = 0; b < data2.fans.length; b++) {
                        if (data2.fans[b].openid == that.data.myOpenid) {
                          data2.fans.splice(b, 1);
                        }
                      }

                      wx.cloud.callFunction({
                        name: 'cancelFans1',
                        data: {
                          thisOpenid: that.data.thisOpenid,
                          myOpenid: that.data.myOpenid,
                          dataId: data2._id,
                          dataFans: data2.fans
                        },
                        success(res) {
                          // console.log(res)
                          if(res.result.stats.updated == 1) {
                            $wuxToptips().warn({
                              hidden: true,
                              text: '取消成功',
                              duration: 2500,
                              success() { },
                            })
                            that.setData({
                              addText: '关注'
                            })
                            that.getTravelNum(that.data.id);
                            that.getStarNum(that.data.id);
                          }


                        },
                        fail(res) {
                          // console.log(res);
                        }
                      })

                    },
                    fail(res) {
                      // console.log(res);
                    }
                  })

                },
                fail(res) {
                  // console.log(res);
                }
              })

            })

          }
          else {

          }
        }  
      })
    }
  },
  toInfo() {
    wx.showToast({
      title: '尽请期待!',
    })
  },
  // 获得旅行数量
  getTravelNum(id) {
    let that = this;
    // // console.log(options.id)

    let openid = id
    // let openid = 'W725rd2AWotkbRXB';

    let db = wx.cloud.database();
    // let _ = db.command;
    let travelData = db.collection('travel').where({
      _openid: openid
    }).get();

    var mydata;

    var a = Promise.resolve(travelData).then(function (res) {
      // mydata = res.data[0]
      // // console.log(res.data.length);
      that.setData({
        travelNum: res.data.length,
      })
    })
  },
  // 获得收藏数量
  getStarNum(id) {
    let that = this;
    // // console.log(options.id)

    let openid = id
    // let openid = 'W725rd2AWotkbRXB';

    let db = wx.cloud.database();
    // let _ = db.command;
    let travelData = db.collection('users').where({
      _openid: openid
    }).get();

    var mydata;

    var a = Promise.resolve(travelData).then(function (res) {
      let newWhere = [];
      for (var s in res.data[0].userDetail.where) {
        newWhere.push(res.data[0].userDetail.where[s])
      }
      newWhere = newWhere.join('-');
      that.setData({
        thisOpenid: res.data[0]._openid,
        myOpenid: wx.getStorageSync('openid'),
        starNum: res.data[0].starArr.length,
        userInfo: res.data[0].userInfo,
        userDetail: res.data[0].userDetail,
        where: newWhere
      })

      that.setData({
        fans: res.data[0].fans,
        watch: res.data[0].watch,
      })
      if (res.data[0].backgroundImg) {
        // console.log('有')
        that.setData({
          bgImg: res.data[0].backgroundImg.url
        })
      }else {
        // console.log('没有')
      }
      that.getMyInfo();
      wx.stopPullDownRefresh()
      // console.log(res.data[0].fans)
      if (res.data[0].fans) {
        for (var i = 0; i < res.data[0].fans.length; i++) {
          if (res.data[0].fans[i].openid == that.data.myOpenid) {
            that.setData({
              addText: '已关注'
            })
            return true;
          }
        }
      }else {
        that.setData({
          addText: '关注'
        })
      }
    })
  },

  getMyInfo() {
      if (this.data.userInfo.gender == 1) {
        this.setData({
          userGender: '../../images/boy.png',
          whatHe: '他'
        })
      }
      else if (this.data.userInfo.gender == 2) {
        this.setData({
          userGender: '../../images/girl.png',
          whatHe: '她'
        })
      }else {
        this.setData({
          userGender: '../../images/girl.png',
          whatHe: '它'
        })
      }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
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
    this.getTravelNum(this.data.id);
    this.getStarNum(this.data.id);
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
    this.getTravelNum(this.data.id);
    this.getStarNum(this.data.id);
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
