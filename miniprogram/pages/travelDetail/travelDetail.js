const util = require('../../utils/util.js');
import {
  $wuxToptips
} from '../../dist/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    travelObj: {},
    likeBol: false,
    travelId: '',
    userData: '',
    likeArr: [],
    chatData: '',
    chatBol: true,
    pText: '留下你的评论呀~',
    chatsBol: false,
    chatsIndex: 0,
    chatsName: '',
    showAdd: 'none',
    paixu: 'shun'
  },

  changePaixu() {
    if(this.data.paixu == 'shun') {
      this.setData({
        paixu: 'fan'
      });
      let obj = this.data.travelObj;
      let list = obj.data.list;
      let list1 = list.reverse();
      obj.data.list = list1;
      this.setData({
        travelObj: obj
      })

    }
    else {
      this.setData({
        paixu: 'shun'
      })
      let obj = this.data.travelObj;
      let list = obj.data.list;
      let list1 = list.reverse();
      obj.data.list = list1;
      this.setData({
        travelObj: obj
      })
    }
  },

  touserDetail() {
    // console.log(this.data.userData._id)
    wx.navigateTo({
      url: '../userDetail/userDetail?id='+this.data.travelObj._openid,
    })
  },
  // 评论头像点击
  toUsers(e) {
    wx.navigateTo({
      url: '../userDetail/userDetail?id=' + e.currentTarget.dataset.openid,
    })
  },
  //获取当前时间
  getThisTime() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month <= 9 ? month = '0' + month : month;
    day <= 9 ? day = '0' + day : day;
    hour <= 9 ? hour = '0' + hour : hour;
    minute <= 9 ? minute = '0' + minute : minute;
    second <= 9 ? second = '0' + second : second;
    let fullTimes = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return fullTimes;
  },
  // 评论内容
  getChat(e) {
    this.setData({
      chatData: e.detail.value
    })
  },
  //回复评论
  uploadChat() {
    let that = this;
    if (!wx.getStorageSync('openid')) {
      $wuxToptips().error({
        hidden: true,
        text: '请先登录',
        duration: 2500,
        success() { },
      })
      return;
    }

    if (this.data.chatData == '') {
      wx.showToast({
        image: '../../images/error.png',
        title: '请输入内容',
      })
    } 
    else {
      wx.showLoading({
        mask: true,
        title: '正在评论',
      })
      let info = wx.getStorageSync('userInfo');
      let thisTime = this.getThisTime();

      //楼中楼
      if(this.data.chatsBol) {
        let val = {
          index: this.data.chatsIndex,
          name: info.nickName,
          avatar: info.avatarUrl,
          text: this.data.chatData,
          time: thisTime,
          chatName: this.data.chatsName,
          openid: wx.getStorageSync('openid')
        }
        wx.cloud.callFunction({
          name: 'uploadChats',
          data: {
            id: that.data.travelId,
            val: val
          },
          success(res) {
            // console.log(res)
            wx.hideLoading();
            wx.showToast({
              title: '评论成功'
            })
            that.setData({
              chatData: ''
            })
          },
          fail(res) {
            // console.log(res)
          },
          complete(res) {
            // console.log(res);
            that.initData(that.data.travelId);
            that.initUser();
          }
        })    
      }
      //正常评论
      else {
        let val = {
          name: info.nickName,
          avatar: info.avatarUrl,
          text: this.data.chatData,
          time: thisTime,
          openid: wx.getStorageSync('openid'),
        }

        wx.cloud.callFunction({
          name: 'uploadChat',
          data: {
            id: that.data.travelId,
            val: val
          },
          success(res) {
            // console.log(res)
            wx.hideLoading();
            wx.showToast({
              title: '评论成功'
            })
            that.setData({
              chatData: ''
            })
          },
          fail(res) {
            // console.log(res)
          },
          complete(res) {
            // console.log(res);
            that.initData(that.data.travelId);
            that.initUser();
          }
        })        
      }
    }

  },
  //楼中楼
  chattochat(e) {
    // wx.showToast({
    //   title: '即将开放',
    // })
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.name;
    this.setData({
      chatsIndex: index,
      chatsName: name,
      chatData: '',
      pText: '回复：'+ name,
      chatsBol: true
    })

  },
  //取消楼中楼
  cancelChats() {
    this.setData({
      chatData: '',
      pText: '留下你的评论呀~',
      chatsBol: false
    })
  },
  //查看标题大图
  showBgImg() {
    let copy = this.data.travelObj;

    wx.previewImage({
      urls: [copy.data.headerImg],
      current: copy.data.headerImg,
      success: function(res) {
        // console.log(res)
      }
    })
  },
  // 查看大图
  showImg(e) {
    let index = e.currentTarget.dataset.index;
    let copy = this.data.travelObj;

    wx.previewImage({
      urls: copy.data.list[index].imgs,
      // current: copy.data.list[index].imgs[e.currentTarget.dataset.smIndex],
      current: e.currentTarget.dataset.url,
      success: function(res) {
        // console.log(res)
      }
    })
  },
  // 初始化点赞图标
  initLikeArr() {
    let copy = this.data.userData.likeArr;
    let copy1 = this.data.travelObj;
    let arr = this.data.likeArr;
    let bol = false;
    // // console.log(copy)
    if (copy.length == 0) {
      // for (var i = 0; i < copy1.length; i++) {
      arr[0] = 0;
      // }
    } else {
      // for (var i = 0; i < copy1.length; i++) {
      bol = copy.some(function(item, index) {
        if (copy1['_id'] == item) {
          arr[0] = 1;
          return true;
        } else {
          arr[0] = 0;
          return false;
        }
      })
      // }
    }
    // // console.log(arr);

    this.setData({
      likeArr: arr
    });

    wx.stopPullDownRefresh();

  },
  addLike: util.throttle(function(e) {
    if (!wx.getStorageSync('openid')) {
      $wuxToptips().error({
        hidden: true,
        text: '请先登录',
        duration: 2500,
        success() { },
      })
      return;
    }
    let index = 0;
    let copy = this.data.userData.likeArr;
    let copy1 = this.data.travelObj;
    let pushId;
    let haveIndex = 0;
    let res;
    if (copy.length == 0) {
      pushId = copy1['_id']
      res = false;
    } else {
      res = copy.some(function(item, index) {
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
      let travelCopy = this.data.travelObj.data.like;
      travelCopy += 1;
      copy1.data.like = travelCopy;
      this.setData({
        travelObj: copy1
      })

      this.sqlChange(index, copy, 'like', 'add')
    } else {
      copy.splice(haveIndex, 1);

      let travelCopy = this.data.travelObj.data.like;
      travelCopy -= 1;
      copy1.data.like = travelCopy;
      this.setData({
        travelObj: copy1
      })

      this.sqlChange(index, copy, 'like', 'min')
    };

    // // console.log(copy)

    let copyAll = this.data.userData;
    copyAll.likeArr = copy;


    this.setData({
      userData: copyAll
    })
    this.initLikeArr();

  }, 3000),
  sqlChange(val, arr, types, what) {
    // console.log(val, arr, types, what)
    let id = this.data.travelObj['_id'];
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
            // console.log(res)
            $wuxToptips().success({
              hidden: true,
              text: '点赞成功',
              duration: 2500,
              success() {},
            })
          }
        })
      } else {
        wx.cloud.callFunction({
          name: 'uploadTravel',
          data: {
            types: 'like',
            change: 'min',
            id: id
          },
          success(res) {
            // console.log(res)
            $wuxToptips().warn({
              hidden: true,
              text: '取消点赞',
              duration: 2500,
              success() {},
            })
          }
        })
      }
    } else if (types == 'star') {
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
          }
        })
      } else {
        wx.cloud.callFunction({
          name: 'uploadTravel',
          data: {
            types: 'star',
            change: 'min',
            id: id
          },
          success(res) {
            // console.log(res)
          }
        })
      }
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '正在加载',
    })
    let that = this;

    let myid = options.id;
    this.setData({
      travelId: myid
      // travelId: 'W8nS5Z25dhqgTLLt'
    })
    wx.cloud.callFunction({
      name: 'uploadSee',
      data: {
        id: myid
        // id: 'W8nS5Z25dhqgTLLt'
      },
      success(res) {
        // console.log(res)
        that.setData({
          chatBol: false
        })
      },
      complete(res) {
        that.initData(myid);
        // that.initData('W8nS5Z25dhqgTLLt')
        that.initUser();
      }
    })

    if (wx.getStorageSync('show')) {
      this.setData({
        showAdd: wx.getStorageSync('show'),
      })
    }
    else {
      this.setData({
        showAdd: 'none',
      })
    }

  },
  initData(myid) {
    let that = this;
    let db = wx.cloud.database();
    // let _ = db.command;
    let travelData = db.collection('travel').where({
      _id: myid
    }).get();

    var mydata;

    var a = Promise.resolve(travelData).then(function(res) {
      mydata = res.data[0]
      // console.log(mydata);
      that.setData({
        travelObj: mydata
      })
      wx.setNavigationBarTitle({
        title: that.data.travelObj.data.title
      })
      wx.hideLoading();
    })
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
    Promise.resolve(userData1).then(function(res) {
      mydata = res.data[0]
      // // console.log(res.data[0]);
      that.setData({
        userData: mydata
      });
      that.initLikeArr();
      // that.initStarArr();
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // let db = wx.cloud.database();
    // let _ = db.command;
    // db.collection('travel').doc(this.data.travelId).where({

    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this;
    that.initData(that.data.travelId);
    that.initUser();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})