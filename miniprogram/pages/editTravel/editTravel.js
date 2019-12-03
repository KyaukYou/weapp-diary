import { $wuxToast } from '../../dist/index'

const getDays = require('../../utils/date.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    travelId: '',
    title: '',
    where: '',
    value1: true,
    beginDate: [],
    endDate: [],
    day: 1,
    dayArr: [],
    textarea: '',
    cImgNum: 0,
    fullImgNums: 0, 
    fullImgArr: [], 
    fullArr: [],
    uparr: [],
    upIndex: [],
    headerImgArr: [],
    uploadObj: {
      userInfo: {},
      title: '',
      where: '',
      sDate: '',
      eDate: '',
      show: true,
      sort: true,
      createTime: '',
      headerImgArr: [],
      headerImg: [],
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
    },
    chatData: '',
    chatBol: false,
    pText: '留下你的评论呀~',
    chatsBol: false,
    chatsIndex: 0,
    chatsName: ''    
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
        text: '请先授权',
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
      if (this.data.chatsBol) {
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
            //  // console.log(res);
            // that.initData(that.data.travelId);
            // that.initUser();
            that.getAllData(that.data.travelId)
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
          openid: wx.getStorageSync('openid')
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
            //  // console.log(res);
            // that.initData(that.data.travelId);
            // that.initUser();
            that.getAllData(that.data.travelId)
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
      pText: '回复：' + name,
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
  changeLock(e) {
     // console.log(e)
    let copy = this.data.uploadObj;
    let copyBol = copy.lock;
    copyBol = !copyBol;
    copy.lock = copyBol;

    this.setData({
      uploadObj: copy
    })
  },

  changeShow() {
    let copy = this.data.uploadObj;
    let copyBol = copy.show;
    copyBol = !copyBol;
    copy.show = copyBol;

    this.setData({
      uploadObj: copy
    })
  },

  changeSort() {
    let copy = this.data.uploadObj;
    let copyBol = copy.sort;
    copyBol = !copyBol;
    copy.sort = copyBol;
    let list = copy.list;
    let list1 = list.reverse();
    copy.list = list1;

    this.setData({
      uploadObj: copy
    })
  },

  autoSort() {
    // console.log(1)
    var sort = this.data.uploadObj.sort;
    if(!sort) {
      let copy = this.data.uploadObj;
      let list = copy.list;
      let list1 = list.reverse();
      copy.list = list1;
      this.setData({
        uploadObj: copy
      })
    }
  },

  headerimg() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],  
      success: function(res) {
        that.setData({
          headerImgArr: res.tempFilePaths
        })
      },
    })
  },
  //选择图片上传
  chooseImg(e) {
     // console.log(e.currentTarget.dataset.index)
    var that = this;
    wx.chooseImage({
      count: that.data.uploadObj.list[e.currentTarget.dataset.index].imgNum,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
         // console.log(res);
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
         // console.log(res);
      },
      complete: function(res) {
        //  // console.log(res);
      },
    })
  },
  //删除图片
  delImg(e) {
    //  // console.log(e.currentTarget.dataset.index);
    var main = e.currentTarget.dataset.main;
    var child = e.currentTarget.dataset.index;
    var copy = this.data.uploadObj;
    copy.list[main].trueImgs.splice(child, 1);
    copy.list[main].imgs.splice(child, 1);
    copy.list[main].imgNum += 1;
     // console.log(copy.list[main].trueImgs, copy.list[main].imgNum)
    this.setData({
      uploadObj: copy
    })
  },
  //查看大图
  showbgimg(e) {
     // console.log(e.currentTarget.dataset.url)
    var copy = this.data.uploadObj;
    var arr = copy.list[e.currentTarget.dataset.index].trueImgs;
    // arr.push(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: arr,
      current: e.currentTarget.dataset.url,
      success(res) {
         // console.log(res)
      },
      fail(res) {

      },
      complete(res) {

      },
    })
  },
  //编辑文字
  getTextarea(e) {
    //  console.log(e.currentTarget.dataset)
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
    //  // console.log(e)
    this.setData({
      title: e.detail
    })
  },
  //输入位置
  addWhere(e) {
    //  // console.log(e)
    this.setData({
      where: e.detail
    })
  },
  //选择位置
  chooseWhere() {
    let that = this;
    wx.chooseLocation({
      success: function(res) {
         // console.log(res)
        that.setData({
          where: res.name + '(' + res.address + ')'
        })
      },
      fail(res) {
         // console.log('取消' + res)
      }
    })
  },
  // 选择开始时间
  chooseStart(e) {
    //  // console.log(e)
    let that = this;
    let arr = [];
    arr.push(e.detail.value)
    this.setData({
      beginDate: arr
    })
    that.changeDate();
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

  },
  //选择日期后日期数组
  changeDate() {
    //  // console.log(this.data.beginDate[0])
    //  // console.log(this.data.endDate[0])
    if (this.data.beginDate.length == 0) {
      //  // console.log('无效的日期')
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
        //  // console.log(arr1, arr2)
        var date1 = new Date(arr1[0], arr1[1], arr1[2]).getTime();
        var date2 = new Date(arr2[0], arr2[1], arr2[2]).getTime();
        //  // console.log(date1, date2)
        if (date2 < date1) {

          //时间错误
          //  // console.log('错误')
          this.setData({
            day: 0
          })
          this.addDayArr(0, 0)
        } else {

          //生成
          //  // console.log('ok')
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
    //  // console.log(a,b)
    if (a == 0) {
      this.setData({
        dayArr: []
      })
      return;
    }
    if (b == 0) {
      var d = this.data.beginDate[0]
       // console.log(d)
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
    //  // console.log(val1.list)
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

    this.autoSort();

  },
  //上传全部！！！
  uploadAll() {
    var title = this.data.title;
    var where = this.data.where;
    var sDate = this.data.beginDate;
    var eDate = this.data.endDate;
    var hImg = this.data.headerImgArr;
    var that = this;
    //  // console.log(sDate)
    //  // console.log(title,where,sDate,eDate)

    if (title == '' || where == '' || sDate.length == 0 || eDate.length == 0 || hImg.length == 0) {
      // $wuxToast().show({
      //   type: 'cancel',
      //   duration: 1500,
      //   color: 'white',
      //   text: '请填写完整',
      //   success: () =>  // console.log('已完成')
      // });
      wx.showToast({
        image: '../../images/error.png',
        title: '请填写完整',
      })

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
      //  // console.log(year + '-' + month + '-' + day + ' ' + hour+':'+minute+':'+second)

      var copy = that.data.uploadObj;
      // console.log(copy)
      copy.title = title;
      copy.where = where;
      copy.sDate = sDate;
      copy.eDate = eDate;
      copy.createTime = fullTimes;
      copy.day = that.data.day;
      copy.headerImgArr = that.data.headerImgArr;
      copy.userInfo = wx.getStorageSync('userInfo');
      //  // console.log(sDate)
      that.setData({
        uploadObj: copy
      })
      //  // console.log(that.data.uploadObj)
      //上传到数据库
      // 图片上传
      //users数据库添加id
      //travel数据库添加uploadObj
      let fullImgNums = 0;
      let fullImgArr = [];
      let fullArr = [];
      for(var a = 0; a<this.data.uploadObj.list.length; a++) {

        fullImgNums += this.data.uploadObj.list[a].trueImgs.length;
        fullImgArr.push(this.data.uploadObj.list[a].trueImgs.length);
        for (var c = 0; c < this.data.uploadObj.list[a].trueImgs.length; c++) {
          fullArr.push(this.data.uploadObj.list[a].trueImgs[c])
        }
        this.setData({
          fullImgNums: fullImgNums, 
          fullImgArr: fullImgArr, 
          fullArr: fullArr
        })
      }

      let filePath = that.data.headerImgArr[0];
      let pattern = /\.{1}[a-z]{1,}$/;
      let cc = filePath.slice(0, pattern.exec(filePath).index);
      cc = cc.slice(11);

      let openid = wx.getStorageSync('openid');
      // var str = that.data.uploadObj.title.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, ""); 
      let timeStr = new Date(that.data.uploadObj.createTime).getTime();
  
      let cloudPath = 'travel/' + openid + '/' + timeStr +  '/header/' + cc + filePath.match(/\.[^.]+?$/)[0];

      //  // console.log(cloudPath)
      //  // console.log(filePath)
      //  // console.log(that.data.headerimg)

      let h = that.data.headerImgArr[0].substring(0,5);
      if(h == 'cloud') {
        wx.showLoading({
          title: '正在上传',
          mask: true
        })
        that.uploadTravelImg()
      }else {
        wx.showLoading({
          title: '上传标题图片',
          mask: true
        })
         // console.log(cloudPath,filePath)
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: filePath,
          success(res) {
             // console.log(res)
            let copy3 = that.data.uploadObj;
            copy.headerImg = res.fileID;
            that.setData({
              uploadObj: copy
            })

            let anum = that.data.cImgNum - 0 + 1;
            let title = '上传图片' + anum + '/' + fullImgNums;
             // console.log(anum, title)
            wx.showLoading({
              title: title,
              mask: true
            });
            that.uploadTravelImg()
          },
          fail(res) {
             // console.log(res)
          },
          complete(res) {
             // console.log(res)
          }
        })
      }
    }

  },
  //上传uploadObj中的图片,并且在uploadObj中添加图片链接
  uploadTravelImg() {
    var num, numarr, numlist;
    num = this.data.fullImgNums;
    numarr = this.data.fullImgArr;
    numlist = this.data.fullArr;
    var uparr = this.data.uparr;
    var that = this;
     // console.log(this.data.uparr)
    if (numlist.length <= 0) {
      //上传图片完成
      wx.hideLoading();
      wx.showLoading({
        title: '上传日记中',
        mask: true
      })

      //添加到数组
      let copy = that.data.uploadObj;
      //  // console.log(uparr, copy.list)
      for (var j = 0; j < copy.list.length; j++) {

        let s = uparr.splice(0, numarr[j]);
         // console.log(s);
        for (var i = 0; i < s.length; i++) {
          copy.list[j].imgs.push(s[i])
        }

      }
      that.setData({
        uploadObj: copy
      })
      // console.log(copy)
      let db = wx.cloud.database();
      db.collection('travel').doc(that.data.travelId).update({
        data: {
          data: {
            title: that.data.uploadObj.title,
            where: that.data.uploadObj.where,
            sDate: that.data.uploadObj.sDate,
            eDate: that.data.uploadObj.eDate,
            createTime: that.data.uploadObj.createTime,
            headerImgArr: that.data.uploadObj.headerImgArr,
            headerImg: that.data.uploadObj.headerImg,
            day: that.data.uploadObj.day,
            lock: that.data.uploadObj.lock,
            list: that.data.uploadObj.list,
            show: that.data.uploadObj.show,
            sort: that.data.uploadObj.sort
          }
        },
        success(res) {
          //  // console.log(res);
        },
        fail(res) {
           // console.log(res)
        },
        complete(res) {
          // that.addSql(res._id)
          wx.hideLoading();
          wx.showToast({
            title: '更新成功',
          })
          let timer = null;
          clearTimeout(timer);
          timer = setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
            clearTimeout(timer);
          }, 1500)
        }
      })

    }else {

    //  // console.log(num,numarr,numlist)
    if(this.data.cImgNum < num) {
      //  // console.log(this.data.cImgNum)
      let length = numlist.length
      let mLength = 0;
      // for(var s=0; s<numlist.length; s++) {

        function upfn() {
          if (mLength <= length - 1) {
            let hh = numlist[mLength].substring(0, 5);
            //  // console.log(hh)
            if (hh == 'cloud') {
              //  // console.log(filePath)
              var l = that.data.cImgNum += 1;
              that.setData({
                cImgNum: l
              });
              mLength++;
              upfn();
            }
            else {
              let filePath = numlist[that.data.cImgNum];
              //  // console.log(filePath)
              let pattern = /\.{1}[a-z]{1,}$/;
              let aa = filePath.slice(0, pattern.exec(filePath).index);
              aa = aa.slice(11);
              //  // console.log(aa)

              let openid = wx.getStorageSync('openid');
              // var str = that.data.uploadObj.title.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, ""); 
              let timeStr = new Date(that.data.uploadObj.createTime).getTime();

              let cloudPath = 'travel/' + openid + '/' + timeStr + '/' + aa + filePath.match(/\.[^.]+?$/)[0];
              //  // console.log(cloudPath)
              //  // console.log(filePath)
              wx.cloud.uploadFile({
                cloudPath: cloudPath,
                filePath: filePath,
                success(res) {
                   // console.log(res.fileID)
                  uparr.push(res.fileID);
                  that.setData({
                    uparr: uparr
                  })

                   // console.log(res)
                  var l = that.data.cImgNum += 1;
                  that.setData({
                    cImgNum: l
                  });
                   // console.log(l)
                  let anum = that.data.cImgNum - 0 + 1;
                  let title = '上传图片' + anum + '/' + that.data.fullImgNums;
                   // console.log(anum, title)
                  wx.showLoading({
                    title: title,
                    mask: true
                  })
                  mLength++;
                  upfn();
                },
                fail(res) {
                   // console.log(res)
                },
                complete(res) {
                }
              })
            }
          }
          else {
            var l = that.data.cImgNum += 1;
            that.setData({
              cImgNum: l
            });
             // console.log(that.data.cImgNum,num)
            that.uploadTravelImg();
          }
        }

        upfn();

      // }
      // that.uploadTravelImg();
      //  // console.log(cloudPath,filePath);
    }
    else {
      //上传图片完成
      wx.hideLoading();
      wx.showLoading({
        title: '上传日记中',
        mask: true
      })

      //添加到数组
      let copy = that.data.uploadObj;
      let copyNum = [];
       // console.log(uparr)
      // //  // console.log(uparr,copy.list)
      // for(var j=0; j<copy.list.length; j++) {
      //   let s = uparr.splice(0, numarr[j]); 
      //   //  // console.log(s);
      //   for(var i=0; i<s.length; i++) {
      //     copy.list[j].imgs.push(s[i])
      //   }
      //   //  // console.log(copy.list[j])
      // }

      for(var i=0; i<copy.list.length; i++) {
        if(copy.list[i].imgs.length == copy.list[i].trueImgs.length) {
          copyNum.push(0)
        }else {

          if (copy.list[i].imgs.length < copy.list[i].trueImgs.length) {
            let num = copy.list[i].trueImgs.length - copy.list[i].imgs.length;
             // console.log(num)
            copyNum.push(num);
          }
          else if (copy.list[i].imgs.length > copy.list[i].trueImgs.length) {
            let num = copy.list[i].trueImgs.length - copy.list[i].imgs.length;
             // console.log(num);
            copyNum.push(num);
          }
        }
      }
       // console.log(copyNum)

      for(var z=0; z<copyNum.length; z++) {
        if(copyNum[z] == 0) {

        }
        else if(copyNum[z] > 0){
           // console.log('大于', copyNum[z]);
          let s = uparr.splice(0,copyNum[z]);
           // console.log(s);
          for(var ss=0; ss<s.length; ss++) {
            copy.list[z].imgs.push(s[ss]);
          }

        }
        else if(copyNum[z] < 0) {
           // console.log('小于')
        }
      }
       // console.log(copy.list)

      that.setData({
        uploadObj: copy
      })

      let db = wx.cloud.database();
      db.collection('travel').doc(that.data.travelId).update({
        data: {
          data: {
            title: that.data.uploadObj.title,
            where: that.data.uploadObj.where,
            sDate: that.data.uploadObj.sDate,
            eDate: that.data.uploadObj.eDate,
            createTime: that.data.uploadObj.createTime,
            headerImgArr: that.data.uploadObj.headerImgArr,
            headerImg: that.data.uploadObj.headerImg,
            day: that.data.uploadObj.day,
            lock: that.data.uploadObj.lock,
            list: that.data.uploadObj.list,
            show: that.data.uploadObj.show,
            sort: that.data.uploadObj.sort
          }
        },
        success(res) {
           // console.log(res);
        },
        fail(res) {
           // console.log(res)
        },
        complete(res) {
           // console.log(res)  
          // that.addSql(res._id)
          wx.hideLoading();
          wx.showToast({
            title: '更新成功',
          })
          let timer = null;
          clearTimeout(timer);
          timer = setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
            clearTimeout(timer);
          }, 1500)
        }
      })
    }
    }

  },
  //uploadObj上传到数据库 travel和users
  addSql(id) {
    let db = wx.cloud.database();
    let _ = db.command;
    let myuser = db.collection('users').where({
      _openid: wx.getStorageSync('openid')
    }).get()
    var tarr;
    var a = Promise.resolve(myuser).then(function (res) {
      tarr = res.data[0]

      let copyarr = tarr.travelArr;
      copyarr.push(id)

      db.collection('users').doc(tarr['_id']).update({
        data: {
          travelArr: copyarr
        },
        success(res) {
           // console.log(res)
          wx.hideLoading();
            wx.showToast({
              title: '上传成功',
          })
          let timer = null;
          clearTimeout(timer);
          timer = setTimeout(function() {
            wx.switchTab({
              url: '../index/index',
            })
            clearTimeout(timer);
          },1500)
        },
        fail(res) {
           // console.log(res)
        }
      })
    })  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    let id = options.id;
  
    if (wx.getStorageSync('show')) {
      let shows = wx.getStorageSync('show');
      if (shows == 'none') {
        that.setData({
          show: false
        })
      }
      else {
        that.setData({
          show: true
        })

        that.getAllData(id)
      }
    }
    else {
      that.setData({
        show: false
      })
    }
  },
  getAllData(id) {
    let that = this;
    let db = wx.cloud.database();
    let openid = wx.getStorageSync('openid');
    let userData1 = db.collection('travel').doc(id).get();

    var mydata;
    Promise.resolve(userData1).then(function (res) {
       // console.log(res)
      mydata = res.data;
       // console.log(mydata);
      var copy = [];
      for (var ii = 0; ii < mydata.data.list.length; ii++) {
        copy.push(mydata.data.list[ii])
      }
      //  // console.log(mydata)
      //  // console.log(copy)

      for (var c = 0; c < copy.length; c++) {
        copy[c].trueImgs = [];
      }

      for (var i = 0; i < copy.length; i++) {
        for (var j = 0; j < copy[i].imgs.length; j++) {
          copy[i].trueImgs.push(copy[i].imgs[j]);
        }
      }
      //  // console.log(copy)
      mydata['data'].list = copy;
      //  console.log(mydata['data'])
      if (mydata['data'].sort != true && mydata['data'].sort != false) {
        mydata['data'].sort = true
      }
      that.setData({
        travelId: id,
        title: mydata.data.title,
        where: mydata.data.where,
        beginDate: mydata.data.sDate,
        endDate: mydata.data.eDate,
        day: mydata.data.day,
        headerImgArr: [mydata.data.headerImg],
        uploadObj: mydata['data']
      })
      that.changeDate();
      wx.setNavigationBarTitle({
        title: '编辑' + that.data.uploadObj.title
      })
      // that.autoSort();
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