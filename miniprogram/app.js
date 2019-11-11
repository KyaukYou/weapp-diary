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
        // console.log(res)
      },
      complete(res) {
        // // console.log(res)
      }
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
  sxTX(openid,val) {
    let db = wx.cloud.database();
    let that = this;
    let d = db.collection('users').where({
      _openid: openid
    }).get();
    Promise.resolve(d).then(function (res) {
      // console.log(res)

      let getInfo = res.data[0].userInfo;
      getInfo.city = val.city;
      getInfo.country = val.country;
      getInfo.gender = val.gender;
      getInfo.nickName = val.nickName;
      getInfo.language = val.language;
      getInfo.province = val.province;
      // 判断是否自定义头像
      if(getInfo.avatarUrl.substr(0,5) == 'cloud') {
        // 是
      }
      else {
        // 否
        // 更新
        getInfo.avatarUrl = val.avatarUrl;
      }

      that.updateWX(res.data[0]._id,getInfo)

      wx.setStorageSync('userInfo', getInfo);
    })
  },
  updateWX(id,val) {
    let db = wx.cloud.database();
    db.collection('users').doc(id).update({
      data: {
        userInfo: val
      },
      success(res) {
        // console.log(res)
      }
    })
      
  },
  getLoginInfo(res) {
    var that = this;
    wx.login({
      success(res) {
        // // console.log(res);
        wx.getUserInfo({
          success(res) {
            // // console.log(res);
            that.globalData.userInfo = res.userInfo
            wx.setStorageSync('userInfo', res.userInfo);

            // 更新信息
            // that.updateWX(that.globalData.openid);

            that.sxTX(that.globalData.openid, res.userInfo)

            //判断openid是否在其中
            wx.cloud.callFunction({
              name: 'haveOpenid',
              data: {
                 data: "users"
              },
              success(res) {
                // console.log(res);
                let ifHave = false;
                if(res.result.total == 0) {
                  ifHave = false;
                }else {
                  let data = res.result.data;
                  for (var i = 0; i < data.length; i++) {
                    if (data[i]['_openid'] == that.globalData.openid) {
                      // console.log('有');
                      ifHave = true;
                      break;
                    }
                  }
                }

                if (ifHave) {
                  // 已经有了不添加
                  // // console.log('不需要添加')
                  wx.hideLoading();
                  // wx.showToast({
                  //   title: '欢迎回来',
                  // });
                  that.globalData.login = true
                } else {
                  // 添加openid，userInfo
                  // console.log('添加完成')
                  let db = wx.cloud.database();
                  db.collection('users').add({
                    data: {
                      userInfo: that.globalData.userInfo,
                      userDetail: {
                        birth: '1990-01-01',
                        where: { "0": "江苏省", "1": "无锡市", "2": "锡山区" },
                        ifFirst: true,
                        finalLogin: []
                      },
                      travelArr: [],
                      likeArr: [],
                      starArr: [],
                      fans: [],
                      watch: [],
                      backgroundImg: {
                        url: ''
                      },
                      createdTime: that.createTime()
                    },
                    success(res) {
                      // console.log(res);
                      wx.hideLoading();
                      wx.showToast({
                        title: '注册成功',
                      });
                      that.globalData.login = true
                    },  
                    fail(res) {
                      // console.log(res)
                    }
                  })
                }
              },
              fail(res) {
                // console.log(res)
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
    controlId: 'W87jRg6qgQy38jbV',
    version: 'V1.9.0809'
  }
})