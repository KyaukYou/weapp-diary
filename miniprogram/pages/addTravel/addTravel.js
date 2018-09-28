import {
  $wuxCalendar
} from '../../dist/index'

const getDays = require('../../utils/date.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    where: '',
    value1: true,
    beginDate: [],
    endDate: [],
    day: 1,
    dayArr: [],
    textarea: ''
  },
  getTextarea(e) {
    this.setData({
      textarea: e.detail.value
    })
  },
  onchange1(e) {
    console.log(e);
    this.setData({
      value1: e.detail
    })
  },

  //输入标题
  addTitle(e) {
    // console.log(e)
    this.setData({
      title: e.detail
    })
  },
  //输入位置
  addWhere(e) {
    // console.log(e)
    this.setData({
      where: e.detail
    })
  },
  //选择位置
  chooseWhere() {
    let that = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        that.setData({
          where: res.name + '(' + res.address + ')'
        })
      },
      fail(res) {
        console.log('取消' + res)
      }
    })
  },
  // 选择开始时间
  chooseStart() {
    let that = this;
    $wuxCalendar().open({
      value: that.data.beginDate,
      onChange: (values, displayValues) => {
        // console.log('onChange', values, displayValues)
        that.setData({
          beginDate: displayValues,
        })
        that.changeDate();
      },
    })
  },
  // 选择结束时时间
  chooseEnd() {
    let that = this;
    let minDate = new Date()

    $wuxCalendar().open({
      value: that.data.endDate,
      onChange: (values, displayValues) => {
        console.log('onChange', values, displayValues)
        that.setData({
          endDate: displayValues,
        })
        that.changeDate();
      },
    })
  },
  changeDate() {
    // console.log(this.data.beginDate[0])
    // console.log(this.data.endDate[0])
    if (this.data.beginDate.length == 0) {
      // console.log('无效的日期')
      this.setData({
        day: 0
      })
    } else {

      if (this.data.endDate.length == 0) {

        //一天  
        this.setData({
          day: 1
        })
        this.addDayArr(1,0)

      } else {
        let arr1 = this.data.beginDate[0].split('-');
        let arr2 = this.data.endDate[0].split('-');
        // console.log(arr1, arr2)
        var date1 = new Date(arr1[0], arr1[1], arr1[2]).getTime();
        var date2 = new Date(arr2[0], arr2[1], arr2[2]).getTime();
        // console.log(date1, date2)
        if (date2 < date1) {

          //时间错误
          // console.log('错误')
          this.setData({
            day: 0
          })
          this.addDayArr(0,0)
        } else {

          //生成
          // console.log('ok')
          let day1 = new Date(date1).getTime();
          let day2 = new Date(date2).getTime();
          var c = day2 - day1;
          // console.log(c / 86400000)
          this.setData({
            day: c / 86400000 + 1
          })
          this.addDayArr(1, 2)
        }

      }

    }
  },
  addDayArr(a,b) {
    // console.log(a,b)
    if(a == 0) {
      this.setData({
        dayArr: []
      })
      return;
    }
    if(b == 0) {
      var d = this.data.beginDate[0].split('-').join('.')
      console.log(d)
      let arr = [];
      arr.push(d)
      this.setData({
        dayArr: arr
      })
    }else {
      if(this.data.day == 1) {
        var d1 = this.data.beginDate[0].split('-').join('.')
        let arr1 = [];
        arr1.push(d1)
        this.setData({
          dayArr: arr1
        })
      }else {
        var day1 = getDays.getDays(this.data.beginDate[0], this.data.endDate[0])
        day1.shift();

        this.setData({
          dayArr: day1
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    //  this.changeDate();
    // console.log(year + '-' + month + '-' + day)
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