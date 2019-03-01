/**
 * 日历插件
 */
import './assets/css/index.less'
import $ from './utils/jq-utils.js'
import Day from './day.js'
import opt from './options.js'
import {calendar} from  './utils/calendar.js'

function Calendar(el,options){
   this.options = Object.assign(opt,options);
   this.$el = $(el);
   this.current = {  // 当前年月日 阳历
       year:null,   
       month:null,  // 1 - 12
       day:null, 
   }
   this.selected = { // 选择的时间 阳历
       year:null,   
       month:null,  // 1 - 12
       day:null, 
   }
   this.$timePanl = null; // 日历对象
   this.days = [] // 存储天数
   this.years = [] // 存储年数
   this.maxYear = 2100; // 最大年份到 2100
   this.minYear = 1900; // 最小年份到 1900
   this.limitTime = {  // 存储用户限制的时间
       year:[null,null], // 第一位为最小限制， 第二位为最大限制
       month:[null,null],
       day:[null,null],
   }
   this.init()
}

Calendar.prototype.yearMouth = [31,28,31,30,31,30,31,31,30,31,30,31]; // 存储月份 默认第二月为28天（平年）

// 初始化
Calendar.prototype.init = function(){
   this.setLimitTime();// 初始化限制时间
   this.initInput()
   this.initTime() // 初始化时间
   this.layout() // 初始化结果
   this.addEvent() // 添加事件
   return this
}
// 初始化限制时间
Calendar.prototype.setLimitTime = function(){
    var max = this.options.max
    var min = this.options.min
    
    var maxDate = new Date(max)
    var minDate = new Date(min)

    var maxYear = maxDate.getFullYear()
    var maxMonth = maxDate.getMonth() + 1
    var maxDay = maxDate.getDate()
    var minYear = minDate.getFullYear()
    var minMonth = minDate.getMonth() + 1
    var minDay = minDate.getDate()

    if(maxYear&&maxMonth&&maxDay){
        this.limitTime.year[1] = maxYear;
        this.limitTime.month[1] = maxMonth;
        this.limitTime.day[1] = maxDay;
    }

    if(minYear&&minMonth&&minDay){
        this.limitTime.year[0] = minYear;
        this.limitTime.month[0] = minMonth;
        this.limitTime.day[0] = minDay;
    }
}
// 初始化时间
Calendar.prototype.initTime = function(year,month,day){
    if(year && month && day){ // 有默认时间
        this.selected = {
            year,
            month,
            day,
        }
        this.current = {
            year,
            month,
            day,
        }
    }else{
       // 默认初始时间为当地时间
        var currentTime = new Date()
        this.current.year = currentTime.getFullYear()
        this.current.month =  currentTime.getMonth() + 1;
        this.current.day =  currentTime.getDate();

        this.selected = {
            year:null,
            month:null,
            day:null,
        }
    }
}

// 框架
Calendar.prototype.layout = function(){
   this.$timePanl = $(`<div class="calendar-content-panel">
                        <div class="calendar-panel-heard">
                            <div class="calendar-panel-heard-day"></div>
                            <div class="calendar-panel-heard-month"></div>
                            <div class="calendar-panel-heard-year"></div>
                        </div> 
                        <div class="calendar-panel-body">
                           <div class="calendar-panel-body-day"></div>
                           <div class="calendar-panel-body-month"></div>
                           <div class="calendar-panel-body-year"></div>
                        </div>
                     </div>`)


   this.updataDays()
   $("body").append(this.$timePanl)
}

// 设置日历位置
Calendar.prototype.setPosition = function(){
    var domObj = this.$el[0];
    var height = domObj.clientHeight;

    var left = domObj.offsetLeft  + "px";
    var top = domObj.offsetTop + height + 10 + "px";
    
    // 日期插件宽高
    var calendarW = this.$timePanl[0].offsetWidth;
    var calendarH = this.$timePanl[0].offsetHeight;
    var winWidth = document.documentElement.clientWidth;
    var winHeight = document.documentElement.clientHeight;

    var calendarPsotionLeft = domObj.offsetLeft + calendarW;
    var calendarPsotionTop = domObj.offsetTop + calendarH + height;

    if(calendarPsotionLeft > winWidth){
        left = winWidth  - calendarW - 10 + "px";
    }

    if(calendarPsotionTop > winHeight){
        top = domObj.offsetTop - calendarH - height + "px"
    }

    var cssObj  = {
        left,
        top,
    }
    this.$timePanl.css(cssObj)
}


/**
 * 初始化每月天数（包含头部上月的天数，以及尾部下月的天数）
 **/ 
Calendar.prototype.createDayList = function(){

    // 判断当前年份是否是闰年
    if(this.current.year%4==0){
        this.yearMouth[1]=29; 
    }

    var currentMonth = this.current.month; // 当前月份(1-12)
    var currentYear = this.current.year
    this.days=[];
    
    // 创建当月展示天
    for(var i=0;i<this.yearMouth[currentMonth-1];i++){// 循环当前月份的天数 0代表一月
        // var _thisDay={
        //   year: this.current.year,
        //   month:currentMonth,
        //   day:(i+1), 
        //   flag:'current',
        //   nowTime:nowTime, // 今日时间
        // };
        //  // 阴历转换
        var _thisDay = calendar.solar2lunar(this.current.year,currentMonth,(i+1));
        _thisDay.flag = 'current';

        var createdDay = new Day(_thisDay,this) // 创建每天对象
        this.days.push(createdDay) // 将对象存储到this.days 数组中
    }

    // 创建上月展示天
    var currentMonth = this.current.month; // 当前月份(1-12)
    var currentYear = this.current.year
    if(this.days[0].dayMsg.nWeek !== 1){ // 判断每月第一天是否不是星期一(1-7)
        var week = this.days[0].dayMsg.nWeek - 1;

        // 当前月份（1-12）当currentMonth为一月时，上一月份为上一年12月份
        if(currentMonth-2 === -1){ 
            currentMonth = 12;
            currentYear = this.current.year-1; // 回退一年
        }else{
            currentMonth = currentMonth - 1;
        }

        for(var i = 0; i<week; i++){
            // var _thisDay={
            //     year:currentYear,
            //     month:currentMonth,
            //     day:this.yearMouth[currentMonth-1]-i,
            //     flag:'prev',
            //     nowTime:nowTime, // 今日时间
            // };
             // 阴历转换
            var currentDay = this.yearMouth[currentMonth-1]-i
            var _thisDay = calendar.solar2lunar(currentYear,currentMonth,currentDay);
            _thisDay.flag = 'prev';

            var createdDay = new Day(_thisDay,this) // 创建每天对象
            this.days.unshift(createdDay) // 将对象存储到this.days 数组中
        }
    }


    // 创建下月展示天
    var currentMonth = this.current.month; // 当前月份(1-12)
    var currentYear = this.current.year
    if(currentMonth === 12){
        currentMonth = 1;
        currentYear = this.current.year + 1;

    }else{
        currentMonth++;
    }
    
    var  nextDay = 0; 
    // 保证整好有六行，如果不到五行，后面补
    while(this.days.length/7 !== 6){
          nextDay++;
        //   var _thisDay = {
        //        year:currentYear,
        //        month:currentMonth,
        //        day:nextDay,
        //        flag:'next',
        //        nowTime:nowTime, // 今日时间
        //   };

          // 阴历转换
          var _thisDay = calendar.solar2lunar(currentYear,currentMonth,nextDay);
          _thisDay.flag = 'next';
        
          var createdDay = new Day(_thisDay,this) // 创建每天对象
          this.days.push(createdDay) // 将对象存储到this.days 数组中
    }

}

// 刷新天数
Calendar.prototype.updataDays = function(){
    this.createDayList() // 初始化所有天数数据
    var calendarHeader = `<div class="calendar-heard-day">
                             <a href="javascript:;" class="prev-year-btn header-day-btn ${this.options.nextMonthBtnText?this.options.nextMonthBtnText:'prev-year-style'}">${this.options.nextMonthBtnText}</a> 
                             <a href="javascript:;" class="prev-month-btn header-day-btn ${this.options.prevMonthBtnText?this.options.prevMonthBtnText:'prev-month-style'}">${this.options.prevMonthBtnText}</a> 
                             <span class="select-year-btn header-day-btn">${this.current.year}年</span> 
                             <span class="select-month-btn header-day-btn">${this.current.month}月</span> 
                             <a href="javascript:;" class="next-month-btn header-day-btn ${this.options.nextMonthBtnText?this.options.nextMonthBtnText:'next-month-style'}">${this.options.nextMonthBtnText}</a> 
                             <a href="javascript:;" class="next-year-btn header-day-btn ${this.options.nextYearBtnText?this.options.nextYearBtnText:'next-year-style'}">${this.options.nextYearBtnText}</a>
                          </div>`
    var tdAry = [];
    var trAry = [];
    for(var i = 0,len = this.days.length;i<len;i++){
        var td = document.createElement("td")
        td.appendChild(this.days[i].$el[0])
        tdAry.push(td)
        if((i+1)%7 === 0){  // 整除时为一周
            var tr = document.createElement("tr")
            tr.className = "calendar-tr-row"
            tdAry.forEach(dom=>{
                tr.appendChild(dom)
            })
            trAry.push(tr)
            tdAry = [];
        }
    }
    var $calendarBody = $(`<table cellspacing="0" cellpadding="0" class="calendar-table-day">
                            <tbody class="calendar-tbody">
                               <tr class="calendar-week"><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr>
                            </tbody>
                         </table>`);
   
    trAry.forEach(item=>{
        $calendarBody.find(".calendar-tbody")[0].appendChild(item)
    })

    this.$timePanl.find(".calendar-panel-heard .calendar-panel-heard-day").html(calendarHeader).show()
    this.$timePanl.find(".calendar-panel-body .calendar-panel-body-day").html("").append($calendarBody).show()
    
}

// 刷新月数
Calendar.prototype.updataMonths = function(){
    var calendarHeader = `<div class="calendar-heard-month">
                            <span class="month-return-year">${this.current.year}年</span> 
                         </div>`
    var calendarBody = ""
    for(var i = 0,len = 12; i<len;i++){
    calendarBody += `<div class="month-module">
                       <a href="javascript:;" class="select-month-btn"  data-month="${i+1}">${i+1}月</a>
                     </div>`
    }
    this.$timePanl.find(".calendar-panel-heard .calendar-panel-heard-month").html(calendarHeader).show()
    this.$timePanl.find(".calendar-panel-body .calendar-panel-body-month").html(calendarBody).show()
}

// 刷新年数
Calendar.prototype.updataYears = function(year){
    var startYear = null;
    var endYear = null;
    if(year){
        startYear = year;
       if(year > this.maxYear){ // 年份不能超过最大值目前2100
         startYear = this.maxYear
       }
       if(year < this.minYear){  // 年份不能小于最小值目前1900
         startYear = this.minYear
       }
       
       endYear = (startYear + 9) > this.maxYear
                 ?this.maxYear
                 :startYear + 9;

    }else{
        startYear = this.current.year;
        endYear = (this.current.year + 9) > this.maxYear
                  ?this.maxYear
                  :this.current.year + 9;
    }
    var calendarHeader = `<div class="calendar-heard-year">
                            <a href="javascript:;" class="prev-year-btn header-year-btn prev-year-style"></a> 
                            <span class="before-year">${startYear}年</span> -
                            <span class="after-year">${endYear}年</span> 
                            <a href="javascript:;" class="next-year-btn header-year-btn next-year-style"></a> 
                        </div>`

    var calendarBody = ""
    for(var i = 0,len = endYear-startYear; i<=len;i++){
        calendarBody += `<div class="year-module">
                           <a href="javascript:;" class="select-year-btn"  data-year="${startYear + i}">${startYear + i}</a>
                         </div>`
    }
    this.$timePanl.find(".calendar-panel-heard .calendar-panel-heard-year").html(calendarHeader).show()
    this.$timePanl.find(".calendar-panel-body .calendar-panel-body-year").html(calendarBody).show()

}

/**
 * @msg  事件处理
 */

// 添加事件
Calendar.prototype.addEvent = function(){
      var $timePanl = this.$timePanl
        /**
         * @msg 天数展示时的各个事件
         * 
         */
      // 展示每月天数时，头部添加事件
      $timePanl.find(".calendar-panel-heard .calendar-panel-heard-day")[0].addEventListener("click",(e)=>{
            var classNameAry = e.target.className.split(" ")
            if(classNameAry.indexOf('prev-year-btn')>-1){ // 点击的上一年
                this.prevOrNextYears("prev")
                return
            }
            if(classNameAry.indexOf('next-year-btn')>-1){ // 点击的下一年
                this.prevOrNextYears("next")
                return
            }

            if(classNameAry.indexOf('prev-month-btn')>-1){ // 点击的上一月
                this.prevOrNextMonth("prev")
                return
            }

            if(classNameAry.indexOf('next-month-btn')>-1){ // 点击的下一月
                this.prevOrNextMonth("next")
                return
            }


            if(classNameAry.indexOf('select-year-btn')>-1){ // 点击选择年份
                // 天数隐藏
                $timePanl.find(".calendar-panel-heard .calendar-panel-heard-day").hide()
                $timePanl.find(".calendar-panel-body .calendar-panel-body-day").hide()
                // 年份显示
                this.updataYears()
                return
            }

            if(classNameAry.indexOf('select-month-btn')>-1){ // 点击选择月份
                 // 天数隐藏
                 $timePanl.find(".calendar-panel-heard .calendar-panel-heard-day").hide()
                 $timePanl.find(".calendar-panel-body .calendar-panel-body-day").hide()
                 // 月份显示
                 this.updataMonths()
                 return
            }
      })
     
    /**
     * @msg 年数展示时的各个事件
     * 
     */

    // 展示年数时，头部添加事件
    $timePanl.find(".calendar-panel-heard .calendar-panel-heard-year")[0].addEventListener("click",(e)=>{

        var classNameAry = e.target.className.split(" ")
        if(classNameAry.indexOf('prev-year-btn')>-1){ // 点击的上一年
             this.headerYearClick("prev")
            return
        }
        if(classNameAry.indexOf('next-year-btn')>-1){ // 点击的下一年
            this.headerYearClick("next")
            return
        }
    })
    // 选择年份事件
    $timePanl.find(".calendar-panel-body .calendar-panel-body-year")[0].addEventListener("click",(e)=>{
         var dataYear = $(e.target).attr("data-year")
         if(dataYear){
            this.current.year = Number(dataYear);
             // 年份隐藏
             $timePanl.find(".calendar-panel-heard .calendar-panel-heard-year").hide()
             $timePanl.find(".calendar-panel-body .calendar-panel-body-year").hide()
             // 月份显示
             this.updataMonths()
         }
    })
   
    /**
     * @msg 月数展示时的各个事件
     * 
     */
    // 选择月份事件
    $timePanl.find(".calendar-panel-body .calendar-panel-body-month")[0].addEventListener("click",(e)=>{
        var dataMonth = $(e.target).attr("data-month")
        if(dataMonth){
            this.current.month = Number(dataMonth);
            // 月份隐藏
            $timePanl.find(".calendar-panel-heard .calendar-panel-heard-month").hide()
            $timePanl.find(".calendar-panel-body .calendar-panel-body-month").hide()
           
            // 渲染每月天数
            this.updataDays()

        }
    })
    
    // 返回年份选择
    $timePanl.find(".calendar-panel-heard .calendar-panel-heard-month")[0].addEventListener("click",(e)=>{
        var classNameAry = e.target.className.split(" ")
        if(classNameAry.indexOf('month-return-year')>-1){ // 点击年份
           // 月份隐藏
           $timePanl.find(".calendar-panel-heard .calendar-panel-heard-month").hide()
           $timePanl.find(".calendar-panel-body .calendar-panel-body-month").hide()

           // 渲染年份
           this.updataYears()
        }
    })

    // 给document 添加事件
    document.addEventListener("click",()=>{
       this.close()
    });

    // 阻止事件冒泡
    $timePanl.click((e)=>{
        e.stopPropagation()
    })
}

// 上一月 or 下一月
Calendar.prototype.prevOrNextMonth = function(pn){
    var month = null,
        year = null,
        day = null;

    if(pn === 'prev'){
        if(this.current.month == 1){ // 当前月份为一月份
            month = 12;
            year = this.current.year - 1;
        }else{
            month = this.current.month - 1;
            year = this.current.year
        }
    }

    if(pn === 'next'){
        if(this.current.month == 12){ // 十二月份
            month = 1;
            year = this.current.year + 1;
        }else{
            month = this.current.month + 1;
            year = this.current.year
        }
    }
 // 保证年份在 1900 - 2100 之间包含两边
    if(year>=this.minYear && year <= this.maxYear){
        this.current = {
            month:month,
            year:year,
            day:day, // 天数清楚
        }
       this.updataDays()  // 更新
    }
   
}

// 上一年 or 下一年
Calendar.prototype.prevOrNextYears = function(pn){
    var month = null,
        year = null,
        day = null;

        if(pn === 'prev'){
            year = this.current.year - 1;
        }
        if(pn === 'next'){
            year = this.current.year + 1;
        }
        month = this.current.month;
        // 保证年份在 1900 - 2100 之间包含两边
        if(year >= this.minYear && year <= this.maxYear){
            this.current = {
                month:month,
                year:year,
                day:day, // 天数清楚
            }
            this.updataDays() // 更新
        }

}

// 头部年份事件
Calendar.prototype.headerYearClick = function(pn){
    var startYear = null;
    
    if(pn === 'prev'){
        var oldStartYear = parseInt(this.$timePanl.find(".calendar-panel-heard-year .before-year").text())
        startYear = (oldStartYear - 10) < this.minYear?this.minYear:(oldStartYear - 10);
    }
    if(pn === 'next'){
        var oldEndYear = parseInt(this.$timePanl.find(".calendar-panel-heard-year .after-year").text())
        startYear = (oldEndYear + 1) > this.maxYear?this.maxYear:(oldEndYear + 1);
    }
    this.updataYears(startYear)  // 更新
}


/**
 * @msg 日期事件触发
 * 
 **/ 

// 日期点击时会触发
Calendar.prototype.dayClick = function(e){
    if(e.dayMsg.flag == 'current'){
        this.days.forEach(dayItem =>{
            if(e !== dayItem){
                dayItem.removeClass("active")
            }
        })
    }
    
    this.setInputVal() // 设置input值
    this.options.click(e.current)
    // this.close()

}
//点击日历中的上月天数或下月天数会触发
Calendar.prototype.dayPrevOrNextClickUpdata = function(year,month,day){
    this.initTime(year,month,day)
    this.createDayList()
    this.updataDays()
}


/**
 * @msg 日历关闭打开
 * 
 **/ 
Calendar.prototype.open = function(){
    this.$timePanl.show()
    this.setPosition()
}

Calendar.prototype.close = function(){
    var timePanl = this.$timePanl
    timePanl.find(".calendar-panel-heard .calendar-panel-heard-month").hide()
            .siblings(".calendar-panel-heard-year").hide()
            .siblings(".calendar-panel-heard-day").show()

    timePanl.find(".calendar-panel-body .calendar-panel-body-month").hide()
            .siblings(".calendar-panel-body-year").hide()
            .siblings(".calendar-panel-body-day").show()   
   
    this.$timePanl.hide()
}



/**
 * @msg 初始化input
 * 
 **/ 


// 初始化input
Calendar.prototype.initInput = function(){
    this.addEventInput()
}

// 设置input值
Calendar.prototype.setInputVal = function(bol){
    if(bol){ // bol 为true时，设置input值为空
        this.$el.val("")
        return
    }
    var sele = this.selected;
    var opt = this.options;
     
    var year = sele.year,
        month = sele.month,
        day = sele.day;

    if(opt.isFillZero){ // 是否补0
        day =  day.toString().length === 1?("0"+day):day;
        month =  month.toString().length === 1?("0"+month):month;
    }
    var inpVal = `${year}${opt.format}${month}${opt.format}${day}`

    this.$el.val(inpVal)

    var obj = {
        year,
        month,
        day,
        dataStr:inpVal
    }

    opt.change(obj)
}
// 获取input值
Calendar.prototype.getInputVal = function(){
    var $inp = this.$el;
    var val = $inp.val();

    if(!val){
        return ""
    }

    if(/^\d$/.test(val)){
      val = Number(val)
    }
    var time = new Date(val);
    var milliscond = time.valueOf()
   
    if(!milliscond){
       this.setInputVal(true)
       return ""
    }

    var year = time.getFullYear()
    var month = time.getMonth() + 1;
    var day = time.getDate();
    if(year <= this.maxYear&&year >= this.minYear){
        // 限制年
        if(year<=this.limitTime.year[1]&&year>=this.limitTime.year[0]){ 
             // 限制月
            if(month<=this.limitTime.month[1]&&month>=this.limitTime.month[0]){
                 // 限制日
                if(day<=this.limitTime.day[1]&&day>=this.limitTime.day[0]){
                    this.selected = {
                        year,   
                        month,  // 1 - 12
                        day, 
                     }
                     this.current = {
                        year,   
                        month,  // 1 - 12
                        day, 
                     }
                     this.setInputVal()
                     return
                }
            }
         }
         this.setInputVal(true)
    }else{
        this.setInputVal(true)
        return ""
    }
}

// 为input添加事件
Calendar.prototype.addEventInput = function(){
     var input = this.$el;
     
     input.click((e)=>{
         e.stopPropagation();
     })

      // 获取焦点事件
     input.focus(()=>{
        var $inp = this.$el;
        var val = $inp.val();
        if(!val){
            this.initTime()
        }
        this.updataDays()
        this.open()
     })

     // 失去焦点事件
     input.blur(()=>{
        this.getInputVal()
     })
    
}

module.exports = Calendar