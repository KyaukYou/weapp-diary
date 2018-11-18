import { $wuxToptips } from '../../dist/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myData: [],
    textArr: [],
    id: ''
  },
  toUsers(e) {
    wx.navigateTo({
      url: '../userDetail/userDetail?id=' + e.currentTarget.dataset.openid,
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
        wx.hideLoading();
        // wx.showToast({
        //   title: '加载成功',
        // })
        let result = res.result.data[0].watch
        that.setData({
          myData: result
        })
        wx.stopPullDownRefresh();
        var arr = [];

        for(var i=0; i<that.data.myData.length; i++) {

          // let result = res.result.data[0].watch.some(function(item,index) {
          //   if (that.data.myData[i].openid == item.openid) {
          //     return true;
          //   }
          // })
          // if(result) {
          //   arr[i] = '已关注'
          // }else {
          //   arr[i] = '关注'
          // }
          arr[i] = '已关注'

        }
        console.log(arr)
        that.setData({
          textArr: arr
        })


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

      // console.log(user1, user2)
      wx.cloud.callFunction({
        name: 'uploadFans',
        data: {
          openid: heOpenid,
          val: user1
        },
        success(res) {
          console.log(res)
          wx.cloud.callFunction({
            name: 'uploadWatch',
            data: {
              openid: myOpenid,
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
              that.getData(that.data.id)
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
    this.getData(this.data.id)
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