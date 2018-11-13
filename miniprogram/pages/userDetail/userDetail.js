const app = getApp();
import { $wuxToptips } from '../../dist/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    if(this.data.addText == '关注') {
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

      console.log(user1,user2)
      wx.cloud.callFunction({
        name: 'uploadFans',
        data: {
          openid: this.data.thisOpenid,
          val: user1
        },
        success(res) {
          console.log(res)
          wx.cloud.callFunction({
            name: 'uploadWatch',
            data: {
              openid: that.data.myOpenid,
              val: user2
            },
            success(res) {
              console.log(res)
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
      $wuxToptips().warn({
        hidden: true,
        text: '无法取消关注',
        duration: 2500,
        success() { },
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
    // console.log(options.id)

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
      // console.log(res.data.length);
      that.setData({
        travelNum: res.data.length,
      })
    })
  },
  // 获得收藏数量
  getStarNum(id) {
    let that = this;
    // console.log(options.id)

    let openid = id
    // let openid = 'W725rd2AWotkbRXB';

    let db = wx.cloud.database();
    // let _ = db.command;
    let travelData = db.collection('users').where({
      _openid: openid
    }).get();

    var mydata;

    var a = Promise.resolve(travelData).then(function (res) {
      that.setData({
        thisOpenid: res.data[0]._openid,
        myOpenid: wx.getStorageSync('openid'),
        starNum: res.data[0].starArr.length,
        fans: res.data[0].fans,
        watch: res.data[0].watch,
        userInfo: res.data[0].userInfo,
      })
      that.getMyInfo();

      for (var i = 0; i < res.data[0].fans.length; i++) {
        if (res.data[0].fans[i].openid == that.data.myOpenid) {
          that.setData({
            addText: '已关注'
          })
          return true;
        }
      }



      let newWhere = [];
      for (var s in res.data[0].userDetail.where) {
        newWhere.push(res.data[0].userDetail.where[s])
      }
      newWhere = newWhere.join('-')
      // newWhere = newWhere.split(',')
      console.log(res.data[0])

      that.setData({
        bgImg: res.data[0].backgroundImg.url,
        userDetail: res.data[0].userDetail,
        where: newWhere,
      })
      
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
    this.getTravelNum(options.id);
    this.getStarNum(options.id);
    // let db = wx.cloud.database();
    // db.collection('control').doc('W87jRg6qgQy38jbV').get().then(res => {
    //   console.log(res.data.showAdd.showAdd)
    //   if (res.data.showAdd.showAdd == 'none') {
    //     this.setData({
    //       showAdd: res.data.showAdd.showAdd,
    //       showStar: 'block'
    //     })
    //   } else {
    //     this.setData({
    //       showAdd: 'flex',
    //       showStar: 'none'
    //     })
    //   }


    // })
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