import { $wuxToast } from '../../dist/index'

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
    textarea: '',
    uploadObj: {
      title: '',
      where: '',
      sDate: '',
      eDate: '',
      createTime: '',
      see: 0,
      star: 0,
      like: 0,
      day: 0,
      list: [
        // {
        //   imgs: [],
        //   trueImgs: [],
        //   text: '',
        //   date: '2018-09-29',
        //   show: true,
        //   like: 0,
        //   imgNum: 9
        // },
      ]
    }
  },
  //选择图片上传
  chooseImg(e) {
    console.log(e.currentTarget.dataset.index)
    var that = this;
    wx.chooseImage({
      count: that.data.uploadObj.list[e.currentTarget.dataset.index].imgNum,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res);
        let arr = res.tempFilePaths;
        var copy = that.data.uploadObj;

        for (var i = 0; i < arr.length; i++) {
          if (copy.list[e.currentTarget.dataset.index].imgNum <= 0) {
            copy.list[e.currentTarget.dataset.index].imgNum = 0;
          } else {
            copy.list[e.currentTarget.dataset.index].imgNum -= 1;
            copy.list[e.currentTarget.dataset.index].trueImgs.push(arr[i]);
          }
        }
        that.setData({
          uploadObj: copy
        })
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        // console.log(res);
      },
    })
  },
  //删除图片
  delImg(e) {
    // console.log(e.currentTarget.dataset.index);
    var main = e.currentTarget.dataset.main;
    var child = e.currentTarget.dataset.index;
    var copy = this.data.uploadObj;
    copy.list[main].trueImgs.splice(child, 1);
    copy.list[main].imgNum += 1;
    console.log(copy.list[main].trueImgs, copy.list[main].imgNum)
    this.setData({
      uploadObj: copy
    })
  },
  //查看大图
  showbgimg(e) {
    console.log(e.currentTarget.dataset.url)
    var copy = this.data.uploadObj;
    var arr = copy.list[e.currentTarget.dataset.index].trueImgs;
    // arr.push(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: arr,
      success(res) {
        console.log(res)
      },
      fail(res) {

      },
      complete(res) {

      },
    })
  },
  //编辑文字
  getTextarea(e) {
    console.log(e.currentTarget.dataset)
    let copy = this.data.uploadObj;
    copy.list[e.currentTarget.dataset.index].text = e.detail.value
    this.setData({
      uploadObj: copy
    })
  },
  //是否显示
  onchange1(e) {
    let copy = this.data.uploadObj;
    copy.list[e.currentTarget.dataset.index].show = e.detail
    this.setData({
      uploadObj: copy
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
  chooseStart(e) {
    // console.log(e)
    let that = this;
    let arr = [];
    arr.push(e.detail.value)
    this.setData({
      beginDate: arr
    })
    that.changeDate();
    // let that = this;
    // $wuxCalendar().open({
    //   value: that.data.beginDate,
    //   onChange: (values, displayValues) => {
    //     // console.log('onChange', values, displayValues)
    //     that.setData({
    //       beginDate: displayValues,
    //     })
    //     that.changeDate();
    //   },
    // })
  },
  // 选择结束时时间
  chooseEnd(e) {
    let that = this;
    let arr = [];
    arr.push(e.detail.value)
    this.setData({
      endDate: arr,
    });
    that.changeDate();
    // let that = this;
    // let minDate = new Date()

    // $wuxCalendar().open({
    //   value: that.data.endDate,
    //   onChange: (values, displayValues) => {
    //     console.log('onChange', values, displayValues)
    //     that.setData({
    //       endDate: displayValues,
    //     })
    //     that.changeDate();
    //   },
    // })
  },
  //选择日期后日期数组
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
        this.addDayArr(1, 0)

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
          this.addDayArr(0, 0)
        } else {

          //生成
          // console.log('ok')
          let day1 = new Date(date1).getTime();
          let day2 = new Date(date2).getTime();
          var c = day2 - day1;

          this.setData({
            day: c / 86400000 + 1
          })
          this.addDayArr(1, 2)
        }

      }

    }
  },
  addDayArr(a, b) {
    // console.log(a,b)
    if (a == 0) {
      this.setData({
        dayArr: []
      })
      return;
    }
    if (b == 0) {
      var d = this.data.beginDate[0]
      console.log(d)
      let arr = [];
      arr.push(d);
      this.setData({
        dayArr: arr
      });
      this.perfectArrChange(this.data.uploadObj.list, arr)

    } else {
      if (this.data.day == 1) {
        var d1 = this.data.beginDate[0]
        let arr1 = [];
        arr1.push(d1)
        this.setData({
          dayArr: arr1
        });
        this.perfectArrChange(this.data.uploadObj.list, arr1)
      } else {
        var day1 = getDays.getDays(this.data.beginDate[0], this.data.endDate[0])

        this.setData({
          dayArr: day1,
        })
        this.perfectArrChange(this.data.uploadObj.list, day1)

      }
    }
  },
  perfectArrChange(val1, val2) {
    var that = this;
    // console.log(val1.list)
    //判断默认数组长度
    if (val1.length <= 0) {
      let copy = this.data.uploadObj;
      let dArr = [];
      for (var i = 0; i < this.data.dayArr.length; i++) {
        var listObj = {
          imgs: [],
          trueImgs: [],
          text: '',
          date: this.data.dayArr[i],
          show: true,
          like: 0,
          imgNum: 9
        }
        dArr.push(listObj)
        copy.list = dArr;
      }
      this.setData({
        uploadObj: copy
      })

    } else {
      //创建提取数组
      var earr = []

      //第一步提取法
      function getSame(val1) {
        for (var i = 0; i < val2.length; i++) {
          for (var j = 0; j < val1.length; j++) {
            if (val1[j].date == val2[i]) {
              earr.push(val1[j]);
              val1.splice(j, 1);
              j -= 1;
            }
          }

        }
      }

      //第二步数据对比添加
      function putArr() {
        let a = new Date(earr[0].date.split('-')).getTime();
        let b = new Date(earr[earr.length - 1].date.split('-')).getTime();

        let a1 = new Date(val2[0].split('-')).getTime();
        let b1 = new Date(val2[val2.length - 1].split('-')).getTime();

        if (a > a1) {
          var r1 = getDays.getDays(val2[0], earr[0].date)
          r1.pop();
          let pArr;
          for (var i = r1.length - 1; i >= 0; i--) {
            pArr = {
                imgs: [],
                trueImgs: [],
                text: '',
                date: r1[i],
                show: true,
                like: 0,
                imgNum: 9
              },
              earr.unshift(pArr)
          }

        }

        if (b < b1) {
          var r = getDays.getDays(earr[earr.length - 1].date, val2[val2.length - 1])
          r.splice(0, 1);
          let pArr;
          for (var i = 0; i < r.length; i++) {
            pArr = {
                imgs: [],
                trueImgs: [],
                text: '',
                date: r[i],
                show: true,
                like: 0,
                imgNum: 9
              },
              earr.push(pArr)
          }
        }
        let copy3 = that.data.uploadObj;
        copy3.list = earr;
        that.setData({
          uploadObj: copy3
        })
      }

      getSame(val1);
      putArr();
    }

  },
  //上传全部！！！
  uploadAll() {
    // $wuxToast().show({
    //   type: 'success',
    //   duration: 1500,
    //   color: 'white',
    //   icon: 'md-sunny',
    //   text: '再点就打屎你',
    //   success: () => console.log('已完成')
    // })

    var title = this.data.title;
    var where = this.data.where;
    var sDate = this.data.beginDate;
    var eDate = this.data.endDate;
    var that = this;
    console.log(title,where,sDate,eDate)

    if(title == '' || where == '' || sDate.length == 0 || eDate.length == 0) {
      $wuxToast().show({
        type: 'cancel',
        duration: 1500,
        color: 'white',
        text: '填写完整啦',
        success: () => console.log('已完成')
      });
    }else {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();

      month <= 9 ? month = '0'+month : month;
      day <= 9 ? day = '0' + day : day;
      hour <= 9 ? hour = '0' + hour : hour;
      minute <= 9 ? minute = '0' + minute : minute;
      second <= 9 ? second = '0' + second : second;
      let fullTimes = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
      // console.log(year + '-' + month + '-' + day + ' ' + hour+':'+minute+':'+second)

      var copy = that.data.uploadObj;
      copy.title = title;
      copy.where = where;
      copy.sDate = sDate;
      copy.eDate = eDate;
      copy.createTime = fullTimes;
      copy.day = that.data.day;

      that.setData({
        uploadObj: copy
      })

      //上传到数据库
      // 图片上传
      //users数据库添加id
      //travel数据库添加uploadObj
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // let date = new Date();
    // let year = date.getFullYear();
    // let month = date.getMonth() + 1;
    // let day = date.getDate();
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