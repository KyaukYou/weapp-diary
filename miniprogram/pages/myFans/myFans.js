import { $wuxToptips } from '../../dist/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myData: [],
    textArr: [],
    id: '',
    bol: false,
    upArr: [],
    syncBol: false
  },
  toUsers(e) {
    wx.navigateTo({
      url: '../userDetail/userDetail?id=' + e.currentTarget.dataset.openid,
    })
  },

  waitUser(index) {
    let that = this;
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getSomeOne',
        data: {
          openid: that.data.myData[index].openid
        },
        success(res) {
          // console.log(res);
          let copy = that.data.upArr;
          let userObj = {
            avatarUrl: res.result.data[0].userInfo.avatarUrl,
            gender: res.result.data[0].userInfo.gender,
            nickName: res.result.data[0].userInfo.nickName,
            openid: res.result.data[0]._openid
          }
          copy.push(userObj)
          that.setData({
            upArr: copy
          })
          resolve(res);
        }
      })
    })
  },

  // 同步信息
  syncUser() {
    //先更新页面信息，再同步
    let that = this;
    let allLength = this.data.myData.length;
    let index = 0;
    async function getInfos() {
      if (index == allLength) {
        index = 0;
        that.setData({
          myData: that.data.upArr,
          bol: true
        })

        //同步服务器
        that.tongbu();
      }
      else {
        await that.waitUser(index);
        index++;
        getInfos();
      }

    }
    getInfos();

  },

  //同步
  tongbu() {
    let that = this;
    wx.cloud.callFunction({
      name: 'syncFans',
      data: {
        openid: that.data.id,
        fans: that.data.upArr
      },
      success(res) {
        // console.log(res);
        wx.hideLoading();
        that.setData({
          syncBol: true
        })
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '同步失败',
        })
      }
    })
  },

  // 获得数据
  getData(id) {
    let that = this;
    wx.cloud.callFunction({
      name: 'getDetail',
      data: {
        openid: id
      },
      success(res) {
        // wx.hideLoading();
        // wx.showToast({
        //   title: '加载成功',
        // })
        let result = res.result.data[0].fans
        that.setData({
          myData: result
        })
        wx.stopPullDownRefresh();
        var arr = [];

        for(var i=0; i<that.data.myData.length; i++) {

          let result = res.result.data[0].watch.some(function(item,index) {
            if (that.data.myData[i].openid == item.openid) {
              return true;
            }
          })
          if(result) {
            arr[i] = '已关注'
          }else {
            arr[i] = '关注'
          }

        }
        // console.log(arr)
        that.setData({
          textArr: arr
        })

        if (that.data.bol == false) {
          that.syncUser();
        }

      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '未知错误',
        })
        wx.stopPullDownRefresh();
      }
    })
  },
  // 添加关注
  addWatch(e) {
    if (!wx.getStorageSync('openid')) {
      $wuxToptips().error({
        hidden: true,
        text: '请先登录',
        duration: 2500,
        success() { },
      })
      return;
    }
    if(this.data.syncBol == false) {
      $wuxToptips().warn({
        hidden: true,
        text: '请等待同步完成',
        duration: 2500,
        success() { },
      })
    }
    else {
      if (this.data.textArr[e.currentTarget.dataset.index] == '关注') {
        let that = this;
        let userAll = wx.getStorageSync('userInfo');
        let myOpenid = wx.getStorageSync('openid');
        let heOpenid = e.currentTarget.dataset.openid;
        let user1 = {
          avatarUrl: userAll.avatarUrl,
          gender: userAll.gender,
          nickName: userAll.nickName,
          openid: myOpenid
        }
        let user2 = {
          avatarUrl: that.data.myData[e.currentTarget.dataset.index].avatarUrl,
          gender: that.data.myData[e.currentTarget.dataset.index].gender,
          nickName: that.data.myData[e.currentTarget.dataset.index].nickName,
          openid: heOpenid
        }

        // // console.log(user1, user2)
        wx.cloud.callFunction({
          name: 'uploadFans',
          data: {
            openid: heOpenid,
            val: user1
          },
          success(res) {
            // console.log(res)
            wx.cloud.callFunction({
              name: 'uploadWatch',
              data: {
                openid: myOpenid,
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
                that.getData(that.data.id)
              }
            })

          }
        })
      }
      else {
        let that = this;
        let db = wx.cloud.database();
        let userAll = wx.getStorageSync('userInfo');
        let myOpenid = wx.getStorageSync('openid');
        let thisOpenid = e.currentTarget.dataset.openid;
        wx.showModal({
          title: '是否取消',
          content: '是否取消关注',
          success(res) {
            if (res.confirm) {

              // 取消关注  
              let myData = db.collection('users').where({
                _openid: myOpenid
              }).get()

              Promise.resolve(myData).then(function (res) {
                // console.log(res);
                let data1 = res.data[0];
                for (var i = 0; i < data1.watch.length; i++) {
                  if (data1.watch[i].openid == thisOpenid) {
                    data1.watch.splice(i, 1);
                  }
                }
                // console.log(data1)
                db.collection('users').doc(data1._id).update({
                  data: {
                    watch: data1.watch
                  },
                  success(res) {
                    // console.log(res);

                    //取消关注
                    wx.cloud.callFunction({
                      name: 'cancelFans',
                      data: {
                        thisOpenid: thisOpenid,
                        myOpenid: that.data.myOpenid
                      },
                      success(res) {
                        console.log(res)

                        let data2 = res.result.data[0];
                        // console.log(data2)
                        for (var b = 0; b < data2.fans.length; b++) {
                          if (data2.fans[b].openid == myOpenid) {
                            data2.fans.splice(b, 1);
                          }
                        }

                        console.log(thisOpenid,data2)


                        // 取消粉丝
                        wx.cloud.callFunction({
                          name: 'cancelFans1',
                          data: {
                            thisOpenid: thisOpenid,
                            myOpenid: myOpenid,
                            dataId: data2._id,
                            dataFans: data2.fans
                          },
                          success(res) {
                            // console.log(res)
                            if (res.result.stats.updated == 1) {
                              $wuxToptips().warn({
                                hidden: true,
                                text: '取消成功',
                                duration: 2500,
                                success() { },
                              })
                              that.setData({
                                addText: '关注'
                              })
                              that.getData(that.data.id)
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
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      mask: true,
      title: '正在加载',
    })
    this.setData({
      id: options.id
    })
    this.getData(this.data.id)
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
    // this.getData(this.data.id)
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
    // this.setData({
    //   bol: false
    // })
    this.getData(this.data.id)
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