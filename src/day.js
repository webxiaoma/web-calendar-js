
/**
 * 创建日期
 */
import {calendar} from  './utils/calendar.js'
import $ from './utils/jq-utils.js'

function Day(dateMsg,caledar){
   this.dateMsg = dateMsg; // 日期信息
   this.caledar = caledar; // caledar 实例
   this.current = null;
   this.$el = null; // jq dom元素
   this.selected = false; // 是否处于选中状态
   this.disabled = true; // 是否处于不可点击状态
   this.init();
   return this
}

Day.prototype.init = function(){
    this.isDisabled()
    this.creatDay()
    this.addEvent()
}

// 是否可以操作
Day.prototype.isDisabled = function(){
    // 限制年
    var year = this.dateMsg.year
    var month = this.dateMsg.month
    var day = this.dateMsg.day

    if(year<=this.caledar.limitTime.year[1]&&year>=this.caledar.limitTime.year[0]){ 
        if(month<=this.caledar.limitTime.month[1]&&month>=this.caledar.limitTime.month[0]){

            var flag = this.dateMsg.flag;
            if(flag == 'prev'){
                 // 限制日
                 if(day>=this.caledar.limitTime.day[0]){
                    this.disabled = false
                 }
            }
            // 限制当月中的日期
            if(flag == 'current'){
                  // 当月份等于最小月份时，日期要大于最小日期才可以点击
                  if(month == this.caledar.limitTime.month[0]){
                      if(day >= this.caledar.limitTime.day[0]){
                         this.disabled = false
                      }
                  }
                  if(month == this.caledar.limitTime.month[1]){
                      if(day <= this.caledar.limitTime.day[1]){
                         this.disabled = false
                      }
                  }
            }

            if(flag == 'next'){
                  // 限制日
                  if(day<=this.caledar.limitTime.day[1]){
                    this.disabled = false
                  }
            }

        }
    }
}

// 创建天数
Day.prototype.creatDay = function(){
     var caledar = this.caledar;
     var dateMsg = this.dateMsg;
     // 阴历转换
    this.current = calendar.solar2lunar(this.dateMsg.year,this.dateMsg.month,this.dateMsg.day);

    var dayBottomMsg = null;

    if(this.current.LFtv){ // 阴历节日
        dayBottomMsg = this.current.LFtv;
    }

    if(!dayBottomMsg){//dayBottomMsg 没有被节日占用
        if(this.current.SFtv){ // 阳历节日
            dayBottomMsg = this.current.SFtv;
        }
    }

    if(!dayBottomMsg){ 
        if(!this.current.isTerm){ 
            dayBottomMsg = this.current.IDayCn;
        }else{
            dayBottomMsg = this.current.Term;
        }
    }

    // 判断是否被选中
    if(caledar.selected.year == dateMsg.year && caledar.selected.month == dateMsg.month && caledar.selected.day == dateMsg.day){ 
        if(this.dateMsg.flag == 'current'){
            this.selected = true;
        }
    }

    var dayWrapClassName  = ""

    if(this.disabled){  // 不可点击
        dayWrapClassName = ` ${this.current.isToday?'current':''} unClick`
    }else{
        dayWrapClassName = `${this.dateMsg.flag}-month ${this.current.isToday?'current':''} ${this.selected?'active':''}`
    }

    this.$el = $(`<div class="calendar-day-wrap ${dayWrapClassName}">
                    <div class="calendar-solar-day">${this.current.cDay?this.current.cDay:""}</div>
                    <div class="calendar-lunar-day">${dayBottomMsg?dayBottomMsg:""}</div>
                  </div>`)

}

// 移除class
Day.prototype.removeClass = function(className){
    this.$el.removeClass(className)
}

// 添加事件
Day.prototype.addEvent = function(){
    if(this.disabled){
        return;
    }
    // 点击事件
    this.$el.click((e)=>{ 
        var flag = this.dateMsg.flag
        if(flag == "current"){ // 点击当月天时，不会刷新整个月的天数
            this.$el.addClass("active")
            this.selected = true;
            this.caledar.initTime(this.dateMsg.year,this.dateMsg.month,this.dateMsg.day)
        }

        if(flag == "prev" || flag == "next"){// 点击上月或下月天时，会刷新整个月的天数
            this.caledar.dayPrevOrNextClickUpdata(this.dateMsg.year,this.dateMsg.month,this.dateMsg.day)
        }

        this.caledar.dayClick(this)
    })
   

    // 组织右击菜单
    this.$el[0].addEventListener("contextmenu",function(e){
        e.preventDefault();
    });

    // 右击事件
    this.$el[0].addEventListener("mouseup",(e)=>{
        if (e.button == 2) {
            console.log('鼠标右击了')
            this.caledar.options.rightHandClick(this,e)
        }
    })

}



export default Day