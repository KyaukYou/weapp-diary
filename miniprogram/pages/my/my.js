const app = getApp();
import { $wuxDialog } from '../../dist/index'
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
    fans: 0,
    watch: 0,
    version: '',
    showAdd: 'none',
    showStar: 'block',
    bgImg: ''
  },
  showVersion() {
    if(this.data.showAdd == 'block') {
      $wuxDialog().alert({
        resetOnClose: true,
        title: '更新日志(V0.13.1113)',
        content: `添加关注功能(测试版)
              添加个人信息编辑
              添加查看对方信息`,
        onConfirm(e) {
          // console.log('感谢上帝，你没吃鞋帮！')
        },
      })
    }else {

    }
  },
  // 修改背景图
  changeImg() {
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
  toMyDetail() {
    if (wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '../myInfo/myInfo',
      })
    } else {
      wx.showToast({
        title: '请先授权登录',
      })
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
        watch: res.data[0].watch
      })
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
          // console.log('2');
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
      wx.showToast({
        title: '请先授权登录',
      })
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