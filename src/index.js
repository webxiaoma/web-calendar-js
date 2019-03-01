import Calendar from './calendar.js'


var  timeLayout = new Calendar("#root",{
      value:'',  // 日期初始值
      format:'-', // 日期年月日分隔符
      isFillZero:true, // 月，日 是否补0, 默认补0
      nextMonthBtnText:'',  // 上一年按钮名字
      nextYearBtnText:'',
      prevMonthBtnText:'',
      nextMonthBtnText:'',
      max:'2019-2-28',
      min:'2019-1-28',
      change:function(val){ // 改变时触发
          console.log(val)
      },
      click:function(data){ // 点击回调函数
         console.log(data)
      },
      rightHandClick:function(day,e){ // 右键回调函数
        console.log(day)
      },
      beforeCreateDay:function(dayMsg){  // 天数创建之前
         console.log()
       },
      afterCreateDay:function(day){  // 天数创建之后
        //  console.log(day)
      },
})

// var input =  document.querySelector()

console.log(timeLayout)

export default Calendar;
