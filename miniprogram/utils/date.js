// 获取间隔天数
function getDays(day1, day2) {
  // 获取入参字符串形式日期的Date型日期
  var st = day1.getDate();
  var et = day2.getDate();

  var retArr = [];

  // 获取开始日期的年，月，日
  var yyyy = st.getFullYear(),
    mm = st.getMonth(),
    dd = st.getDate();

  // 循环
  while (st.getTime() != et.getTime()) {
    retArr.push(st.getYMD());

    // 使用dd++进行天数的自增
    st = new Date(yyyy, mm, dd++);
  }

  // 将结束日期的天放进数组
  retArr.push(et.getYMD());

  // console.log(retArr); // 或可换为return ret;
  retArr.shift();
  return retArr;
}

// 给Date对象添加getYMD方法，获取字符串形式的年月日
Date.prototype.getYMD = function () {

  // 将结果放在数组中，使用数组的join方法返回连接起来的字符串，并给不足两位的天和月十位上补零
  return [this.getFullYear(), fz(this.getMonth() + 1), fz(this.getDate())].join("-");
}

// 给String对象添加getDate方法，使字符串形式的日期返回为Date型的日期
String.prototype.getDate = function () {
  var strArr = this.split('-');
  return new Date(strArr[0], strArr[1] - 1, strArr[2]);
}

// 给月和天，不足两位的前面补0
function fz(num) {
  if (num < 10) {
    num = "0" + num;
  }
  return num
}

module.exports = {
  getDays: getDays
}
