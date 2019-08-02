const app = getApp();
import { $wuxDialog } from '../../dist/index'
import { $wuxToptips } from '../../dist/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    userInfo: {},
    userGender: '',
    travelNum: 0,
    starNum: 0,
    fans: [],
    watch: [],
    version: '',
    showAdd: 'none',
    showStar: 'block',
    bgImg: '',
    animationSlow: 'animationSlow-pause',
    timer: null
  },
  // 我的关注
  toWatch(e) {
    wx.navigateTo({
      url: '../myWatch/myWatch?id=' + wx.getStorageSync('openid'),
    })
  },
  // 我的粉丝
  toFans(e) {
    wx.navigateTo({
      url: '../myFans/myFans?id=' + wx.getStorageSync('openid'),
    })
  },
  showVersion() {
    if (this.data.showAdd == 'block' || this.data.showAdd == 'flex') {
      wx.navigateTo({
        url: '../showVer/showVer',
      })
      // $wuxDialog().alert({
      //   resetOnClose: true,
      //   title: '更新日志',
      //   content: `V1.1.1115(2018-11-15)
      //             1.【优化】整体颜色优化
      //             2.【优化】我的页面图标添加
      //             3.【优化】完善背景图片添加
      //             4.【新增】我的关注，我的粉丝页面
      //             \n
      //             V1.0.1114(2018-11-14)
      //             1.【新增】我的页面背景图添加(测试版)
      //             2.【优化】首页显示效果
      //             3.【优化】我的页面显示效果
      //             4.【优化】个人信息页面显示效果
      //             5.【优化】BUG页面代码优化
      //             6.【优化】评论功能数据添加
      //             \n
      //             V0.13.1113(2018-11-13)
      //             1.【新增】关注功能(测试版)
      //             2.【新增】我的信息编辑
      //             3.【新增】查看对方信息`,
      //   onConfirm(e) {
      //   },
      // })
    }else {

    }
  },
  // 修改背景图
  changeImg() {
    if (!wx.getStorageSync('openid')) {
      $wuxToptips().error({
        hidden: true,
        text: '请先登录',
        duration: 2500,
        success() { },
      })
      return;
    }

    let that = this;
    wx.chooseImage({
      count: 1,
      success(res) {
        console.log(res.tempFilePaths[0]);

        let filePath = res.tempFilePaths[0];
        let pattern = /\.{1}[a-z]{1,}$/;
        let cc = filePath.slice(0, pattern.exec(filePath).index);
        cc = cc.slice(11);
        let openid = wx.getStorageSync('openid');
        let cloudPath = 'user/' + openid + '/backgroundImg/' + cc + filePath.match(/\.[^.]+?$/)[0];
        console.log(filePath,cloudPath)
        wx.showLoading({
          title: '正在上传...',
          mask: true
        })
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success(res) {
            console.log(res.fileID);
            wx.cloud.callFunction({
              name: 'uploadBgImg',
              data: {
                openid: openid,
                url: res.fileID
              },
              success(res) {
                wx.hideLoading();
                wx.showToast({
                  title: '上传成功',
                });

                wx.cloud.callFunction({
                  name: 'getDetail',
                  data: {
                    openid: openid
                  },
                  success(res) {
                    let result = res.result.data[0].backgroundImg;
                    that.setData({
                      bgImg: result.url
                    })
                  }
                })
              },
              fail(res) {
                wx.hideLoading();
                wx.showToast({
                  image: '../../images/error.png',
                  title: '上传失败',
                })
              }
            })
          },
          fail(res) {
            wx.hideLoading();
            wx.showToast({
              image: '../../images/error.png',
              title: '上传失败',
            })
          }

        })

      },
      fail(res) {
        console.log(res)
      }
    })
  },
  toInfo() {
    wx.showToast({
      title: '尽请期待!',
    })
  },
  toMyTravel() {
    wx.navigateTo({
      url: '../myTravel/myTravel',
    })
  },
  toMyStar() {
    wx.navigateTo({
      url: '../myStar/myStar',
    })
  },

  createTime() {
    let timer1 = new Date();
    let y = timer1.getFullYear();
    let m = timer1.getMonth() + 1;
    let d = timer1.getDate();
    let h = timer1.getHours();
    let m1 = timer1.getMinutes();
    let s = timer1.getSeconds();
    y = this.addZero(y);
    m = this.addZero(m);
    d = this.addZero(d);
    h = this.addZero(h);
    m1 = this.addZero(m1);
    s = this.addZero(s);
    return `${y}-${m}-${d} ${h}:${m1}:${s}`;
  },

  addZero(num) {
    let addNum;
    if (num <= 9) {
      addNum = "0" + num;
    } else {
      addNum = num;
    }
    return addNum;
  },

  toMyDetail() {
    let that = this;
    if (wx.getStorageSync('openid')) {
      

      wx.getLocation({
        type: 'wgs84',
        altitude: true,
        success(res) {
          console.log(res)
          const latitude = res.latitude;
          const longitude = res.longitude;
          wx.request({
            url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=RAHBZ-KLP3O-HCJWQ-SVU4O-EHKB3-SLFZA&get_poi=1`,
            data: {},
            header: {
              'Content-Type': 'json'
            },
            method: 'GET',
            success(res) {
              console.log(res);
              let getAddress = res.data.result;
              let db = wx.cloud.database();
              let myDetails = db.collection('users').where({
                _openid: wx.getStorageSync('openid')
              }).get();  

              Promise.resolve(myDetails).then(function(res){
                console.log(res);
                let detail = res.data[0].userDetail;

                detail.finalLogin.unshift({
                  time: that.createTime(),
                  address: getAddress.address_component,
                  trueAddress: `${latitude},${longitude}`
                })
                if(detail.ifFirst == true) {
                  detail.where = [getAddress.address_component.province, getAddress.address_component.city, getAddress.address_component.district]
                }

                wx.cloud.callFunction({
                  name: 'uploadDetails',
                  data: {
                    openid: res.data[0]._openid,
                    detail: detail
                  },
                  success(res) {
                    console.log(res)
                    wx.navigateTo({
                      url: '../myInfo/myInfo',
                    })
                  },
                  fail(res) {
                    console.log(res)
                    wx.navigateTo({
                      url: '../myInfo/myInfo',
                    })
                  }
                })
                // db.collection('users').where({
                //   _id: res.data[0]._id
                // }).update({
                //   data: {
                //     userDetail: detail
                //   },
                //   success(res) {
                //     console.log(res)
                //     wx.navigateTo({
                //       url: '../myInfo/myInfo',
                //     })
                //   }
                // })
              })

            },
            fail(res) {
              console.log(res);
            }
          })


        },
      })

    } else {
      if (!wx.getStorageSync('openid')) {
        $wuxToptips().error({
          hidden: true,
          text: '请先登录',
          duration: 2500,
          success() { },
        })
        return;
      }
    }
  },
  // 获得旅行数量
  getTravelNum() {
    let that = this;
    // console.log(options.id)

    let openid = wx.getStorageSync('openid');
    // let openid = 'W725rd2AWotkbRXB';

    let db = wx.cloud.database();
    // let _ = db.command;
    let travelData = db.collection('travel').where({
      _openid: openid
    }).get();

    var mydata;

    var a = Promise.resolve(travelData).then(function (res) {
      // mydata = res.data[0]
      // console.log(res.data.length);
      that.setData({
        travelNum: res.data.length
      })
    }) 
  },
  // 获得收藏数量
  getStarNum() {
    let that = this;
    // console.log(options.id)

    let openid = wx.getStorageSync('openid');
    // let openid = 'W725rd2AWotkbRXB';

    let db = wx.cloud.database();
    // let _ = db.command;
    let travelData = db.collection('users').where({
      _openid: openid
    }).get();

    var mydata;

    var a = Promise.resolve(travelData).then(function (res) {
      // mydata = res.data[0]
      // console.log(res.data.starArr);
      that.setData({
        starNum: res.data[0].starArr.length,
        bgImg: res.data[0].backgroundImg.url,
        fans: res.data[0].fans,
        watch: res.data[0].watch, 
      })
      that.data.timer = setTimeout(function() {
        if (that.data.animationSlow == '') {
          that.setData({
            animationSlow: 'animationSlow-pause'
          })
          $wuxToptips().success({
            hidden: true,
            text: '刷新成功',
            duration: 1500,
            success() { },
          })
        }
        clearTimeout(that.data.timer);
      },2000);
      // wx.stopPullDownRefresh()
    })
  },

  onGotUserInfo(e) {
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
          let timer1 = null;
          clearInterval(timer1);
          timer1 = setInterval(function () {
            if (app.globalData.login) {
              that.getMyInfo();
              clearInterval(timer1);
            }
          }, 200)

        } else {
          that.setData({
            shouquan: false
          })
        }
      }
    })
  },
  getMyInfo() {
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        hasUserInfo: true,
        userInfo: wx.getStorageSync('userInfo')
      })

      if (this.data.userInfo.gender == 1) {
        this.setData({
          userGender: '../../images/boy.png'
        })
      }
      else if (this.data.userInfo.gender == 2) {
        this.setData({
          userGender: '../../images/girl.png'
        })
      }

    } else {
      this.setData({
        hasUserInfo: false
      })
    }
  },
  tobug() {
    if (wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '../uploadBug/uploadBug',
      })
    }else {
      if (!wx.getStorageSync('openid')) {
        $wuxToptips().error({
          hidden: true,
          text: '请先登录',
          duration: 2500,
          success() { },
        })
        return;
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyInfo();

    let db = wx.cloud.database();
    db.collection('control').doc('W87jRg6qgQy38jbV').get().then(res => {
      console.log(res.data.showAdd.showAdd)
      if (res.data.showAdd.showAdd == 'none') {
        this.setData({
          showAdd: res.data.showAdd.showAdd,
          showStar: 'block'
        })
      }else {
        this.setData({
          showAdd: 'flex',
          showStar: 'none'
        })
      }


    })
  },
  shuaxin() {
    this.setData({
      animationSlow: ''
    })
    this.getTravelNum();
    this.getStarNum();
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
    this.getTravelNum();
    this.getStarNum();
    this.setData({
      version: app.globalData.version
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
    this.getTravelNum();
    this.getStarNum();
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
