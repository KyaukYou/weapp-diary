//index.js
const app = getApp()
const util = require('../../utils/util.js');
import { $wuxToptips } from '../../dist/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAdd: 'none',
    page: 0,
    limit: 5,
    travelAll: [],
    travelsAll: [],
    travelList: [],
    userData: "",
    shouquan: false,
    lazyloadBol: true,
    rotateBol: false,
    listIndex: 0,
    listArr: [
      {
        name: '最近更新',
        color: '#f47695'
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
    listColor: ['#f47695', 'black', 'black', 'black'],
    starArr: [],
    likeArr: [],
    timeArr: [],
    seeArr: [],
    dianzanArr: [],
    searchArr: [],
    timesArr: [],
    seesArr: [],
    dianzansArr: [],
    searchsArr: [],
    mainArr: [],
    searchVal: '',
    searchBol: false,
    whatBol: false
  },
  // 锁定&解锁
  delTravel(e) {
    let that = this;
    let bol = e.currentTarget.dataset.lock;
    let id = e.currentTarget.dataset.id
    let sOpenid = wx.getStorageSync('openid')

    if (e.currentTarget.dataset.openid == sOpenid) {
      if (bol == false) {
        wx.showModal({
          title: '是否锁定',
          content: '锁定后他人将不能查看你的旅行日记',
          success(res) {
            if (res.confirm) {
              let db = wx.cloud.database();
              db.collection('travel').doc(id).update({
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
              db.collection('travel').doc(id).update({
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
    }
    else {

    }

  },
  // 修改list颜色
  changelistcolor(e) {
    wx.showLoading({
      title: '正在加载',
    })
    let index = e.currentTarget.dataset.index;
    var copy = this.data.listArr;
    for (var i = 0; i < copy.length; i++) {
      copy[i].color = 'black';
    }

    copy[index].color = '#f47695';
    this.setData({
      listArr: copy,
      listIndex: index
    })
    this.setData({
      travelList: []
    })
    if (this.data.searchBol) {
      this.setData({
        whatBol: true
      })
    }else {
      this.setData({
        whatBol: false
      })
    }
    this.changeData(index)
  },
  changeData(index) {
    let that = this;
    if(this.data.whatBol) {
      let result = [];
      let result1 = [];
      let result2 = [];
      let result3 = [];
      for (var i = 0; i < this.data.mainArr.length; i++) {
        result.unshift(this.data.mainArr[i])
        result1.unshift(this.data.mainArr[i])
        result2.unshift(this.data.mainArr[i])
        result3.unshift(this.data.mainArr[i])
      };

      let results = result.filter(function (item, index) {
        if (item.data.title.match(that.data.searchVal)) {
          return true;
        }
      })

      let results1 = result1.filter(function (item, index) {
        if (item.data.title.match(that.data.searchVal)) {
          return true;
        }
      })

      let results2 = result2.filter(function (item, index) {
        if (item.data.title.match(that.data.searchVal)) {
          return true;
        }
      })

      let results3 = result3.filter(function (item, index) {
        if (item.data.title.match(that.data.searchVal)) {
          return true;
        }
      })

      this.setData({
        travelAll: results,
        timeArr: results1,
        seeArr: results2,
        dianzanArr: results3
      });

      if(index ==0) {
        this.getPageList();
      }
      else if(index == 1) {
        this.timeSort();
      }
      else if(index == 2) {
        this.seeSort();
      }
      else if(index == 3) {
        this.likeSort();
      }

    }else {

    if (index == 0) {
      let that = this;
      wx.cloud.callFunction({
        name: 'getTravel',
        success(res) {
          if (res.result.data.length != 0) {
            let result = [];
            for (var i = 0; i < res.result.data.length; i++) {
              result.unshift(res.result.data[i])
            }
            that.setData({
              travelAll: result,
            })
          }
        },
        fail(res) {
        },
        complete(res) {
          that.getPageList()
          wx.hideLoading()
        }
      })
    }
    else if (index == 1) {
      let that = this;
      wx.cloud.callFunction({
        name: 'getTravel',
        success(res) {
          if (res.result.data.length != 0) {
            let result = [];
            for (var i = 0; i < res.result.data.length; i++) {
              result.unshift(res.result.data[i])
            }
            that.setData({
              timeArr: result,
            })
          }
        },
        fail(res) {
        },
        complete(res) {
          that.timeSort()
          wx.hideLoading()
        }
      })
    }
    else if (index == 2) {
      let that = this;
      wx.cloud.callFunction({
        name: 'getTravel',
        success(res) {
          if (res.result.data.length != 0) {
            let result = [];
            for (var i = 0; i < res.result.data.length; i++) {
              result.unshift(res.result.data[i])
            }
            that.setData({
              seeArr: result,
            })
          }
        },
        fail(res) {
        },
        complete(res) {
          that.seeSort()
          wx.hideLoading()
        }
      })
    }
    else if (index == 3) {
      let that = this;
      wx.cloud.callFunction({
        name: 'getTravel',
        success(res) {
          if (res.result.data.length != 0) {
            let result = [];
            for (var i = 0; i < res.result.data.length; i++) {
              result.unshift(res.result.data[i])
            }
            that.setData({
              dianzanArr: result,
            })
          }
        },
        fail(res) {
        },
        complete(res) {
          that.likeSort()
          wx.hideLoading()
        }
      })
    }
    }
  },
  changeData1(index) {
    if (index == 0) {
      let that = this;
      wx.cloud.callFunction({
        name: 'getTravel',
        success(res) {
          if (res.result.data.length != 0) {
            let result = [];
            let result1 = [];
            for (var i = 0; i < res.result.data.length; i++) {
              result.unshift(res.result.data[i])
              result1.unshift(res.result.data[i])
            }
            that.setData({
              travelAll: result,
              mainArr: result1
            })
          }
        },
        fail(res) {
        },
        complete(res) {
          that.getPageList()
        }
      })
    }
  },
  // 查看详情
  todetail(e) {
    let id = e.currentTarget.dataset.id
    // console.log(e)
    let sOpenid = wx.getStorageSync('openid')
    if (e.currentTarget.dataset.openid == sOpenid) {
      wx.navigateTo({
        url: '../travelDetail/travelDetail?id=' + id,
      })
    } else {
      if (e.currentTarget.dataset.lock) {
        // wx.showToast({
        //   image: '../../images/error.png',
        //   title: '已被锁定',
        // })
        $wuxToptips().info({
          hidden: true,
          text: '已被锁定',
          duration: 2000,
          success() { },
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
    if (wx.getStorageSync('openid')) {
      // // console.log('yes');
      wx.navigateTo({
        url: '../addTravel/addTravel',
      })
    } else {
      // // console.log('no');
      $wuxToptips().error({
        hidden: true,
        text: '请先登录',
        duration: 2500,
        success() { },
      })
    }
  },
  bindGetUserInfo(e) {
    // // console.log(e);
    this.getInit();
  },
  getInit() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          // // console.log('1');
          that.setData({
            shouquan: true
          });
          //加载
          app.getOpenId();

        } else {
          // // console.log('2');
          that.setData({
            shouquan: false
          })
        }
      }
    })
  },
  addLike: util.throttle(function (e) {
    if (!wx.getStorageSync('openid')) {
      $wuxToptips().error({
        hidden: true,
        text: '请先登录',
        duration: 2500,
        success() { },
      })
      return;
    }
    var that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let copy = this.data.userData.likeArr;
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
          // console.log(index)
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
      var travelCopy = that.data.travelList[index].data.like;
      travelCopy += 1;
      copy2[index].data.like = travelCopy;
      that.setData({
        travelList: copy2
      })

      this.sqlChange(index, copy, 'like', 'add')
    }
    else {
      copy.splice(haveIndex, 1);

      var copy2 = that.data.travelList;
      var travelCopy = that.data.travelList[index].data.like;
      travelCopy -= 1;
      copy2[index].data.like = travelCopy;
      that.setData({
        travelList: copy2
      })

      this.sqlChange(index, copy, 'like', 'min')
    };

    // console.log(copy)

    let copyAll = this.data.userData;
    copyAll.likeArr = copy;


    this.setData({
      userData: copyAll
    })
    this.initLikeArr();

  }, 3000),
  addStar: util.throttle(function (e) {
    if (!wx.getStorageSync('openid')) {
      $wuxToptips().error({
        hidden: true,
        text: '请先登录',
        duration: 2500,
        success() { },
      })
      return;
    }
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
          // console.log(index)
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

    // console.log(copy)

    let copyAll = this.data.userData;
    copyAll.starArr = copy;


    this.setData({
      userData: copyAll
    })
    this.initStarArr();

  }, 3000),

  // 初始化点赞图标
  initLikeArr() {
    if (!app.globalData.login) {
      return false;
    }
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
    if (!app.globalData.login) {
      return false;
    }
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
            // // console.log(arr[i],item)
            return true;
          } else {
            arr[i] = 0;
            // // console.log(arr[i], item)
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
  sqlChange(val, arr, types, what) {
    // console.log(val, arr, types, what)
    let id = this.data.travelList[val]['_id'];
    let openid = wx.getStorageSync('openid');
    // // console.log(id)

    let db = wx.cloud.database();
    let _ = db.command;

    if (types == 'like') {
      wx.cloud.callFunction({
        name: 'userArr',
        data: {
          openid: openid,
          arr: 'like',
          arrs: arr
        }
      })
      if (what == 'add') {
        wx.cloud.callFunction({
          name: 'uploadTravel',
          data: {
            types: 'like',
            change: 'add',
            id: id
          },
          success(res) {
            // console.log(res);
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
            // console.log(res);
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
    else if (types == 'star') {
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
            // console.log(res)
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
            // console.log(res)
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
    let db = wx.cloud.database();
    db.collection('control').doc(app.globalData.controlId).get().then(res => {
      this.setData({
        showAdd: res.data.showAdd.showAdd
      })
      wx.setStorageSync('show', res.data.showAdd.showAdd)
    })
    that.changeData1(this.data.listIndex);
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
    let that = this;

    // that.changeData1(this.data.listIndex);
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            shouquan: true
          });
        }
        else {
          that.setData({
            shouquan: false
          })
        }
      }
    })
  },
  getTravelData() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getTravel',
      success(res) {
        // console.log(res)
        if (res.result.data.length == 0) {

        }
        else {
          let result = [];
          let result1 = [];
          let result2 = [];
          let result3 = [];
          let result4 = [];
          let result5 = [];
          for (var i = 0; i < res.result.data.length; i++) {
            result.unshift(res.result.data[i])
            result1.unshift(res.result.data[i])
            result2.unshift(res.result.data[i])
            result3.unshift(res.result.data[i])
            result4.unshift(res.result.data[i])
            result5.unshift(res.result.data[i])
          }

          that.setData({
            travelAll: result,
            timeArr: result1,
            seeArr: result2,
            dianzanArr: result3,
            searchArr: result4,
            mainArr: result5
          })
        }
      },
      fail(res) {
        // console.log(res)
      },
      complete(res) {
        wx.stopPullDownRefresh();
        that.getPageList()
        that.timeSort()
        that.seeSort()
        that.likeSort()
      }
    })
  },
  // 分页获取
  getPageList() {
    let that = this;
    // if(this.data.travelAll.length <= 4) {
    //   this.setData({
    //     travelList: this.data.travelAll
    //   })
    // }else {
    let five = this.data.travelAll.splice(0, 4);
    // console.log(five)
    this.setData({
      travelsAll: five
    })
    this.setData({
      travelList: this.data.travelsAll
    })
    // }
    let timer1 = null;
    clearInterval(timer1);
    timer1 = setInterval(function () {
      if (app.globalData.login) {
        that.initUser();
        clearInterval(timer1);
      }
    }, 200)
    wx.stopPullDownRefresh();
  },
  getPage() {
    let that = this;
    // // console.log(this.data.travelAll);
    if (that.data.travelAll.length <= 0) {
      // console.log('没有更多啦')
    } else {
      let add = that.data.travelAll.splice(0, 2);
      let copy = that.data.travelsAll;
      for (var i = 0; i < add.length; i++) {
        copy.push(add[i]);
      }
      that.setData({
        travelList: copy
      })
      that.initLikeArr();
      that.initStarArr();
    }
  },

  //时间正序
  timeSort() {
    let copy = this.data.timeArr;
    for (var i = 0; i < copy.length; i++) {
      let a = new Date(copy[i].data.createTime);
      copy[i].data.trueTime = a.getTime();
    }

    copy.sort(function (a, b) {
      return a.data.trueTime - b.data.trueTime;
    })
    let a = copy.splice(0, 4);
    this.setData({
      timeArr: copy,
      timesArr: a
    })
    this.setData({
      travelList: this.data.timesArr
    })
    this.initLikeArr();
    this.initStarArr();
    wx.stopPullDownRefresh();
  },
  timesSort() {
    let that = this;
    if (that.data.timeArr.length <= 0) {
      // console.log('没有更多啦')
    } else {
      let add = that.data.timeArr.splice(0, 2);
      let copy = that.data.timesArr;
      for (var i = 0; i < add.length; i++) {
        copy.push(add[i]);
      }
      that.setData({
        timesArr: copy
      })
      this.setData({
        travelList: this.data.timesArr
      })
      that.initLikeArr();
      that.initStarArr();
    }
  },
  //浏览次数
  seeSort() {
    let copy = this.data.seeArr;
    copy.sort(function (a, b) {
      return b.data.see - a.data.see;
    })
    let a = copy.splice(0, 4);
    this.setData({
      seeArr: copy,
      seesArr: a
    })
    this.setData({
      travelList: this.data.seesArr
    })
    this.initLikeArr();
    this.initStarArr();
    wx.stopPullDownRefresh();
  },
  seesSort() {
    let that = this;
    if (that.data.seeArr.length <= 0) {
      // console.log('没有更多啦')
    } else {
      let add = that.data.seeArr.splice(0, 2);
      let copy = that.data.seesArr;
      for (var i = 0; i < add.length; i++) {
        copy.push(add[i]);
      }
      that.setData({
        seesArr: copy
      })
      this.setData({
        travelList: this.data.seesArr
      })
      that.initLikeArr();
      that.initStarArr();
    }
  },
  //点赞最高
  likeSort() {
    let copy = this.data.dianzanArr;
    copy.sort(function (a, b) {
      return b.data.like - a.data.like;
    })
    let a = copy.splice(0, 4);
    this.setData({
      dianzanArr: copy,
      dianzansArr: a
    })
    this.setData({
      travelList: this.data.dianzansArr
    })
    this.initLikeArr();
    this.initStarArr();
    wx.stopPullDownRefresh();
  },
  likesSort() {
    let that = this;
    if (that.data.dianzanArr.length <= 0) {
      // console.log('没有更多啦')
    } else {
      let add = that.data.dianzanArr.splice(0, 2);
      let copy = that.data.dianzansArr;
      for (var i = 0; i < add.length; i++) {
        copy.push(add[i]);
      }
      that.setData({
        dianzansArr: copy
      })
      this.setData({
        travelList: this.data.dianzansArr
      })
      that.initLikeArr();
      that.initStarArr();
    }
  },
  delAllVal() {
    this.setData({
      searchBol: false,
      searchVal: ''
    })
  },
  changeSearch(e) {
    // console.log(e)
    if (e.detail.value == '') {
      this.setData({
        searchBol: false
      })
    } 
    else {
      this.setData({
        searchBol: true,
        searchVal: e.detail.value
      })
    }
  },
  //搜索
  getSearch(e) {
    if (this.data.searchVal == '') {
      this.setData({
        searchBol: false
      })
      wx.showLoading({
        mask: true,
        title: '正在加载',
      })
      this.searchSort(this.data.searchVal)
    } else {
      wx.showLoading({
        mask: true,
        title: '正在加载',
      })
      this.setData({
        searchBol: true
      })
      this.searchSort(this.data.searchVal)
    }

  },
  searchSort(val) {
    let copy = this.data.mainArr;
    //筛选
    let result = copy.filter(function (item, index) {
      if (item.data.title.match(val)) {
        return true;
      }
    })

    let a = result.splice(0, 4);
    this.setData({
      searchArr: result,
      searchsArr: a
    })
    this.setData({
      travelList: this.data.searchsArr
    })
    wx.hideLoading()
    this.initLikeArr();
    this.initStarArr();
  },
  searchsSort() {
    let that = this;
    if (that.data.searchArr.length <= 0) {
      // console.log('没有更多啦')
    } else {
      let add = that.data.searchArr.splice(0, 2);
      let copy = that.data.searchsArr;
      for (var i = 0; i < add.length; i++) {
        copy.push(add[i]);
      }
      that.setData({
        searchsArr: copy
      })
      this.setData({
        travelList: this.data.searchsArr
      })
      that.initLikeArr();
      that.initStarArr();
    }
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
      // // console.log(res.data[0]);
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
    let db = wx.cloud.database();
    db.collection('control').doc(app.globalData.controlId).get().then(res => {
      this.setData({
        showAdd: res.data.showAdd.showAdd
      })
      wx.setStorageSync('show', res.data.showAdd.showAdd)
    })

    var that = this;
    this.setData({
      searchBol: false,
      searchVal: '',
      whatBol: false
    })
    that.changeData(this.data.listIndex)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.searchBol) {
      this.searchsSort()
    }
    else {
      if (this.data.listIndex == 0) {
        this.getPage()
      }
      else if (this.data.listIndex == 1) {
        this.timesSort();
      }
      else if (this.data.listIndex == 2) {
        this.seesSort();
      }
      else if (this.data.listIndex == 3) {
        this.likesSort();
      }
    }   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})