//app.js
App({
  onLaunch: function() {
    var that = this;

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'nightess-0809',
        traceUser: true,
      })
    }

  },
  getOpenId() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })

    wx.cloud.callFunction({
      name: 'login',
      success(res) {
        //获取openid
        that.globalData.openid = res.result.openid
        wx.setStorageSync('openid', res.result.openid);
        that.getLoginInfo();
      },
      fail(res) {
        console.log(res)
      },
      complete(res) {
        // console.log(res)
      }
    })
  },
  getLoginInfo(res) {
    var that = this;
    wx.login({
      success(res) {
        // console.log(res);
        wx.getUserInfo({
          success(res) {
            // console.log(res);
            that.globalData.userInfo = res.userInfo
            wx.setStorageSync('userInfo', res.userInfo);

            //判断openid是否在其中
            wx.cloud.callFunction({
              name: 'haveOpenid',
              data: {
                 data: "users"
              },
              success(res) {
                console.log(res);
                let ifHave = false;
                if(res.result.total == 0) {
                  ifHave = false;
                }else {
                  let data = res.result.data;
                  for (var i = 0; i < data.length; i++) {
                    if (data[i]['_openid'] == that.globalData.openid) {
                      console.log('有');
                      ifHave = true;
                      break;
                    }
                  }
                }

                if (ifHave) {
                  // 已经有了不添加
                  // console.log('不需要添加')
                  wx.hideLoading();
                  wx.showToast({
                    title: '欢迎回来',
                  });
                  that.globalData.login = true
                } else {
                  // 添加openid，userInfo
                  console.log('添加完成')
                  let db = wx.cloud.database();
                  db.collection('users').add({
                    data: {
                      userInfo: that.globalData.userInfo,
                      userDetail: {},
                      travelArr: [],
                      likeArr: [],
                      starArr: [],
                      fans: [],
                      watch: [],

                    },
                    success(res) {
                      console.log(res);
                      wx.hideLoading();
                      wx.showToast({
                        title: '注册成功',
                      });
                      that.globalData.login = true
                    },  
                    fail(res) {
                      console.log(res)
                    }
                  })
                }
              },
              fail(res) {
                console.log(res)
              }
            })

          },
          fail(res) {
            wx.hideLoading();
            wx.showToast({
              title: '加载失败',
            })
            that.globalData.login = false
          },
          complete(res) {

          }
        })
      },
      fail(res) {

      },
      complete(res) {

      }
    })
  },
  globalData: {
    openid: '',
    userInfo: {},
    login: false,
    version: 'V0.13.1113'
  }
})