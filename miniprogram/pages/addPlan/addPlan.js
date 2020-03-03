// pages/addPlan/addPlan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yearArr: [],
    yearArrIndex: 4,
    monthArr: [],
    monthArrIndex: 4,
    oneArr: [],
    twoArr: [],
    threeArr: [],
    fourArr: [],
    fiveArr: [],
    sixArr: [],
    ifAdd: true
  },

  // 初始化年份
  inityear(yearType,monthType) {
    // yearType是年份，init表示添加
    // monthType是月份，init表示添加
    if (yearType == 'init') {
      let date = new Date();
      let year = date.getFullYear();
      let arr = [];
      for (var i = 2016; i <= year; i++) {
        arr.push(i + '年')
      }
      this.setData({
        yearArr: arr
      })

      this.initMonth(monthType);
    }
    // 编辑
    else {

    }
  },


  // 初始化月份
  initMonth(monthType) {
    let chineseMonthArr = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    this.setData({
      monthArr: chineseMonthArr
    })
    // 初始化添加，所以我们获取当前月份
    if(monthType == 'init') {
      let date = new Date();
      let month = date.getMonth() + 1;
      let monthArr = [1,2,3,4,5,6,7,8,9,10,11,12];
      let index = 0;
      for(let i=0; i<monthArr.length; i++) {
        if(month == monthArr[i]) {
          index = i;
        }
      }
      this.setData({
        monthArrIndex: index
      })
    }
    //编辑添加，我们使用用户数据
    else {

    }

    this.getMonthDetail()
  },

  changeYear(e) {
    this.setData({
      yearArrIndex: e.detail.value
    })
    this.getMonthDetail()
  },
  changeMonth(e) {
    this.setData({
      monthArrIndex: e.detail.value
    })
    this.getMonthDetail()
  },

  // 获得当前月份详细天数
  getMonthDetail() {
    // 先得到当前月份，因为会变，所以使用index来确定
    let monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let monthIndex = this.data.monthArrIndex;
    let month = monthArr[monthIndex] - 1;

    // 获得年份，和上面一样
    let date1 = new Date();
    let thisYear = date1.getFullYear();
    let yearArr = [];
    for (var i = 2016; i <= thisYear; i++) {
      yearArr.push(i);
    }
    let yearIndex = this.data.yearArrIndex;
    let year = yearArr[yearIndex];

    //初始化当前年份，当前月份一号的date
    let date = new Date(year,month,1);

    // 获取是周几
    let day = date.getDay();

    if(day == 0) {
      this.initWeekJson(year,month,6)
    }
    else if(day == 1) {
      this.initWeekJson(year, month, 0)
    }
    else if (day == 2) {
      this.initWeekJson(year, month, 1)
    }
    else if (day == 3) {
      this.initWeekJson(year, month, 2)
    }
    else if (day == 4) {
      this.initWeekJson(year, month, 3)
    } 
    else if (day == 5) {
      this.initWeekJson(year, month, 4)
    }      
    else if (day == 6) {
      this.initWeekJson(year, month, 5)
    }

  },

  // 6行week数据生成
  initWeekJson(year,month,index) {
    let thisDay = new Date().getDate();
    let thisYear = new Date().getFullYear();
    let thisMonth = new Date().getMonth() + 1;

    let days = 0;
    let prevDays = 0;
    let nextDays = 0;
    let weekArr = [
    ]

    // 首先通过year,month确定上一个是几月份，有多少天
    // 判断是不是闰年

    /*开始获取本月天数*/
    days = this.getDays(year,month+1);
    /*获取到了本月天数*/


    /*开始获取上月天数*/
    prevDays = this.getDays(year, month);
    /*获取到了上月天数*/

    /*开始获取下月天数*/
    nextDays = this.getDays(year, month+2);
    /*获取到了下月天数*/

    console.log(prevDays,days,nextDays)

    // 我们需要利用index来进行数据添加
    // index = 6 取 上个月后6天
    // ...

    if (year == thisYear && month + 1 == thisMonth) {
      this.getDaysArr('first', index, prevDays, days, nextDays, thisDay,'yes');
    }
    else {
      this.getDaysArr('first', index, prevDays, days, nextDays, thisDay,'no');
    }
    

    // 先处理剩下天数
    let moreDays = days;
    let beginDay = 1;
    if(index == 6) {
      moreDays = days - 1;
      beginDay = 2;
    }

    if (index == 0) {
      moreDays = days - 7;
      beginDay = 8;
    }

    if (index == 1) {
      moreDays = days - 6;
      beginDay = 7;
    }

    if (index == 2) {
      moreDays = days - 5;
      beginDay = 6;
    }

    if (index == 3) {
      moreDays = days - 4;
      beginDay = 5;
    }

    if (index == 4) {
      moreDays = days - 3;
      beginDay = 4;
    }

    if (index == 5) {
      moreDays = days - 2;
      beginDay = 3;
    }

    // 有多少个整数周
    let weekLength = parseInt(moreDays / 7);
    // 最后还剩下几天
    let weekMoreDays = moreDays % 7;

    // 只有三排完整，最后两排搜需要合并处理
    if(weekLength == 3) {
      for (let a = 1; a <= weekLength; a++) {
        // console.log(a);
        if(year == thisYear && month+1 == thisMonth) {
          this.getDaysArr('normal', a, prevDays, days, nextDays, beginDay, thisDay, 'yes');
        }
        else {
          this.getDaysArr('normal', a, prevDays, days, nextDays, beginDay, thisDay, 'no');
        }
        
      }
      if (year == thisYear && month + 1 == thisMonth) {
        this.getDaysArr('special', index, prevDays, days, nextDays, weekMoreDays, thisDay,'yes');
        this.getDaysArr('next', index, prevDays, days, nextDays, weekMoreDays, thisDay,'yes');
      }
      else {
        this.getDaysArr('special', index, prevDays, days, nextDays, weekMoreDays, thisDay,'no');
        this.getDaysArr('next', index, prevDays, days, nextDays, weekMoreDays, thisDay,'no');
      }
      
    }
    // 四排完整
    else if(weekLength == 4) {
      for (let a = 1; a <= weekLength; a++) {
        // console.log(a);
        if (year == thisYear && month + 1 == thisMonth) {
          this.getDaysArr('normal', a, prevDays, days, nextDays, beginDay, thisDay,'yes');
        }
        else {
          this.getDaysArr('normal', a, prevDays, days, nextDays, beginDay, thisDay,'no');
        }
        
      }
      if (year == thisYear && month + 1 == thisMonth) {
        this.getDaysArr('last', index, prevDays, days, nextDays, weekMoreDays, thisDay,'yes');
      }
      else {
        this.getDaysArr('last', index, prevDays, days, nextDays, weekMoreDays, thisDay,'no');
      }
      
    }
    

  },

  getDays(year,month) {
    let days = 0;
    if (year % 4 == 0) {
      // 是
      if (month == 2) {
        days = 29;
      }
    }
    else {
      //不是
      if (month == 2) {
        days = 28;
      }
    }

    if (month == 1) {
      days = 31;
    }
    else if (month == 3) {
      days = 31;
    }
    else if (month == 4) {
      days = 30;
    }
    else if (month == 5) {
      days = 31;
    }
    else if (month == 6) {
      days = 30;
    }
    else if (month == 7) {
      days = 31;
    }
    else if (month == 8) {
      days = 31;
    }
    else if (month == 9) {
      days = 30;
    }
    else if (month == 10) {
      days = 31;
    }
    else if (month == 11) {
      days = 30;
    }
    else if (month == 12) {
      days = 31;
    }
    return days;
  },

  getDaysArr(type,index,prevDays,days,nextDays,beginDay,d,b) {
    let oneArr = [];
    let twoArr = [];
    let threeArr = [];
    let fourArr = [];
    let fiveArr = [];
    let sixArr = [];
    // let index = 0
    // type是用来判断是月初还是月底还是正常周
    if(type == 'first') {
      // 上个月末尾天数添加
      for (let i = 0; i < index; i++) {
        // console.log(i);
        let obj = {
          day: prevDays - i,
          show: 'hide',
          choose: false,
          planArr: []
        }
        oneArr.unshift(obj)
      }
      //本月月初天数添加
      for(let j=7; j>index; j--) {
        if(b == 'yes') {
          if (7 - j + 1 == d) {
            let obj = {
              day: 7 - j + 1,
              show: 'block',
              choose: true,
              planArr: []
            }
            oneArr.push(obj)
          }
          else {
            let obj = {
              day: 7 - j + 1,
              show: 'block',
              choose: false,
              planArr: []
            }
            oneArr.push(obj)
          }
        }else {
          let obj = {
            day: 7 - j + 1,
            show: 'block',
            choose: false,
            planArr: []
          }
          oneArr.push(obj)
        }
      }
      this.setData({
        oneArr: oneArr
      })
    }
    else if(type == 'normal') {
      // console.log(index)
      for (let i = beginDay + ((index - 1) * 7); i < beginDay + index * 7; i++) {
        let obj = {};
        if(b == 'yes') {
          if(i == d) {
            obj = {
              day: i,
              show: 'block',
              choose: true,
              planArr: []
            }
          }
          else {
            obj = {
              day: i,
              show: 'block',
              choose: false,
              planArr: []
            }
          }
        }
        else {
          obj = {
            day: i,
            show: 'block',
            choose: false,
            planArr: []
          }
        }

        
        if(index == 1) {
          twoArr.push(obj);
          this.setData({
            twoArr: twoArr
          })
        }
        else if (index == 2) {
          threeArr.push(obj);
          this.setData({
            threeArr: threeArr
          })
        }
        else if (index == 3) {
          fourArr.push(obj);
          this.setData({
            fourArr: fourArr
          })
        }
        else if (index == 4) {
          fiveArr.push(obj);
          this.setData({
            fiveArr: fiveArr
          })
        }
      }
    }
    else if(type == 'last') {
      // 这个月末尾天数添加
      for (let i = days - beginDay; i < days; i++) {
        if(b == 'yes') {
          if(d == i+1) {
            let obj = {
              day: i + 1,
              show: 'block',
              choose: true,
              planArr: []
            }
            sixArr.push(obj)
          }
          else {
            let obj = {
              day: i + 1,
              show: 'block',
              choose: false,
              planArr: []
            }
            sixArr.push(obj)
          }
        }
        else {
          let obj = {
            day: i + 1,
            show: 'block',
            choose: false,
            planArr: []
          }
          sixArr.push(obj)
        }
        
      }
      //下月月初天数添加
      for (let j = 1; j <= 7-beginDay; j++) {
        let obj = {
          day: j,
          show: 'hide',
          choose: false,
          planArr: []
        }
        sixArr.push(obj)
      }
      this.setData({
        sixArr: sixArr
      })
    }
    else if (type == 'special') {
      // 这个月末尾天数添加
      for (let i = days - beginDay; i < days; i++) {
        
        if(b == 'yes') {
          if(d == i+1) {
            let obj = {
              day: i + 1,
              show: 'block',
              choose: true,
              planArr: []
            }
            fiveArr.push(obj)
          }
          else {
            let obj = {
              day: i + 1,
              show: 'block',
              choose: false,
              planArr: []
            }
            fiveArr.push(obj)
          }
        }
        else {
          let obj = {
            day: i + 1,
            show: 'block',
            choose: false,
            planArr: []
          }
          fiveArr.push(obj)
        }

      }
      //下月月初天数添加
      for (let j = 1; j <= 7 - beginDay; j++) {
        let obj = {
          day: j,
          show: 'hide',
          choose: false,
          planArr: []
        }
        fiveArr.push(obj)
      }
      this.setData({
        fiveArr: fiveArr
      })
    }
    else if (type == 'next') {
      // 下月一周天数添加
      for (let i = 7 - beginDay; i < 7 - beginDay + 7; i++) {
        console.log(i);
        let obj = {
          day: i + 1,
          show: 'none',
          choose: false,
          planArr: []
        }
        sixArr.push(obj)
      }
      this.setData({
        sixArr: sixArr
      })
    }

    // console.log(oneArr, twoArr, threeArr, fourArr, fiveArr, sixArr);

  },

  changeChoose(e) {
    // console.log(e);
    let one = this.data.oneArr;
    let two = this.data.twoArr;
    let three = this.data.threeArr;
    let four = this.data.fourArr;
    let five = this.data.fiveArr;
    let six = this.data.sixArr;

    let arr = e.currentTarget.dataset.arr;
    let index = e.currentTarget.dataset.index;

    one = this.trueToFalse(one);
    two = this.trueToFalse(two);
    three = this.trueToFalse(three);
    four = this.trueToFalse(four);
    five = this.trueToFalse(five);
    six = this.trueToFalse(six);

    if(arr == 'oneArr') {
      one[index].choose = true; 
    }

    else if(arr == 'twoArr') {
      two[index].choose = true; 
    }

    else if (arr == 'threeArr') {
      three[index].choose = true; 
    }

    else if (arr == 'fourArr') {
      four[index].choose = true; 
    }

    else if (arr == 'fiveArr') {
      five[index].choose = true; 
    }

    else if (arr == 'sixArr') {
      six[index].choose = true; 
    }

    this.setData({
      oneArr: one,
      twoArr: two,
      threeArr: three,
      fourArr: four,
      fiveArr: five,
      sixArr: six,
    })

  },

  trueToFalse(arr) {
    for(var i=0; i<arr.length; i++) {
      arr[i].choose = false;
    }
    return arr;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.inityear('init','init');
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