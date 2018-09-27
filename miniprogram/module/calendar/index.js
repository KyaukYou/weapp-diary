

Component({
  externalClasses: ['i-class'],
  options: {
    multipleSlots: true
  }, 
  /**
   * 组件的属性列表
   */
  properties: {
    
    selectedDate:{ //必传项
      type:String,
      value:'2018-09-18',
 
    },
    endDate: {
      type: String,
      value: '2100-12-31',

    },
    startDate: {
      type: String,
      value: '2000-01-01',
    },
    list:{
      type:Object,
      value:{}
    },
    isFlod:{
      type:Boolean,
      value:false
    },
    isWeek:{
      type:Boolean,
      value:false,
      observer: function (newVal, oldVal, changedPath) {
        this.initCalendar()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    date: ["日", "一", "二", "三", "四", "五", "六"],
    dateArr: [],
    nowDate: '',
     time : 0,
     touchDot : 0,//触摸时的原点
     interval : "",
  },


  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化日历
    initCalendar: function(date) {
      var curdate = date || new Date(this.data.selectedDate)
      if (this.data.isWeek){
        this.showWeek(curdate)
      }else{
        this.showMonth(curdate.getFullYear(), curdate.getMonth())
      }
    },
    showWeek:function(date){
      let stamp = 24 * 60 * 60 * 1000
      let curDay=date.getTime()
      let month=date.getMonth()
      let cur = date.getDay()
      let startTime = new Date(curDay - cur * stamp).getTime()
      var dataArr = []
      for (let i = 0; i < 7; i++) {
        let tmp = new Date(startTime + i * stamp)
        dataArr.push({
          dateNum: tmp.getDate(),
          isCurMonth: month == tmp.getMonth() ? true : false,
          date: this._formatTime(tmp),
          index: i,
        })
      }
      this.setData({
        dateArr: dataArr
      })
    },
    showMonth: function (year, month) {
      let stamp = 24 * 60 * 60 * 1000
      let monthBegin = new Date(year, month, 1).getTime()
      let monthEnd = new Date(year, month + 1, 0).getTime()
      //月初星期几
      let begin = new Date(year, month, 1).getDay();
      //月末星期几
      let end = new Date(year, month + 1, 0).getDay();

      let startTime = new Date(monthBegin - begin * stamp).getTime()
      let deadline = new Date(monthEnd + (6 - end) * stamp).getTime()
      let arrLength = new Date(year, month + 1, 0).getDate() + 6 + begin - end
      var dataArr = []
      for (let i = 0; i < arrLength; i++) {
        let tmp = new Date(startTime + i * stamp)
        dataArr.push({
          dateNum: tmp.getDate(),
          isCurMonth: month == tmp.getMonth() ? true : false,
          date: this._formatTime(tmp),
          index: i,
        })
      }
      this.setData({
        dateArr: dataArr
      })
     },
    // 选中某一日期
    clickDate: function(event) {
      let item = event.currentTarget.dataset.item
      let selectedDate = new Date(item.date)
      if (item.isCurMonth) {
        this.setData({
          selectedDate: item.date
        })
      } else {
        this.initCalendar(selectedDate)
        this.triggerEvent('changeMonth', { date: item.date }); 
        this.setData({
          selectedDate: item.date
        })
      }
      this.triggerEvent('changeDate', { date: item.date }); 
    },
    // 日期改变
    bindDateChange: function(e) {
      let preDate = new Date(this.data.selectedDate)
      let curDate = new Date(e.detail.value)
      if(curDate.getFullYear()!=preDate.getFullYear()||curDate.getMonth()!=preDate.getMonth()){
        this.initCalendar(curDate)
        this.triggerEvent('changeMonth', { date: curDate });
      }
      this.setData({
        selectedDate: e.detail.value
      })
      this.triggerEvent('changeDate', { date: e.detail.value }); 
    },
    // 触摸开始事件
    touchStart: function (e) {
      // 使用js计时器记录时间    
     let  interval = setInterval( () =>{
        this.setData({
          time: this.data.time++,
        })
      }, 100);
      this.setData({
        touchDot: e.touches[0].pageX,
        interval: interval
      })
    },
    // 触摸结束事件
    touchEnd: function (e) {

      let date = new Date(this.data.selectedDate)
      let curdate
      var touchMove = e.changedTouches[0].pageX;
      let touchDot = this.data.touchDot
      let time = this.data.time
      // 向左滑动   
      if (touchMove - touchDot <= -40 && time < 10 ) {
        //执行切换页面的方法
        if (this.data.isWeek) {
          curdate = new Date(date.getFullYear(), date.getMonth() , date.getDate()+7)
        } else {
          curdate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate())
        }
       
        this.initCalendar(curdate)
        this.triggerEvent('changeMonth', { date: curdate });
        this.setData({
          selectedDate: this._formatTime(curdate),
        })
      }
      // 向右滑动   
      if (touchMove - touchDot >= 40 && time < 10 ) {
        //执行切换页面的方法
        if (this.data.isWeek) {
          curdate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
        } else {
          curdate = new Date(date.getFullYear(), date.getMonth() -1, date.getDate())
        }
        this.initCalendar(curdate)
        this.triggerEvent('changeMonth', { date: curdate });
        this.setData({
          selectedDate: this._formatTime(curdate),
        })
      }
      
      clearInterval(this.data.interval); // 清除setInterval
      this.setData({
        time: 0
      })
    },
    _formatTime:function( date) {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return [year, month, day].map(this._formatNumber).join('-')
    },
    _formatNumber: function (n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
  },

  /**
   * 在组件实例进入页面节点树时执行，注意此时不能调用 setData
   */
  created: function() {

  },
  attached: function () {
    let nowDate = new Date()
    this.setData({
      nowDate: this._formatTime(nowDate),
      time:0
    })
   },
  ready: function () {
    let date = new Date(this.data.selectedDate) ? new Date(this.data.selectedDate) : new Date()
    this.initCalendar(date)
 
  },
});