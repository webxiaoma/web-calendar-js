/**
 * 创建日期
 */
import $ from './utils/jq-utils.js'

function Day(_dayMsg,caledar){
   this.dayMsg = _dayMsg; // 日期信息
   this.caledar = caledar; // caledar 实例
   this.$el = null; // jq dom元素
   this.selected = false; // 是否处于选中状态
   this.disabled = true; // 是否处于不可点击状态
   this.isHoliday = true; // 是否显示休息
   this.dayBottomMsg = null;
   this.init();
   return this
}

Day.prototype.init = function(){
    this.isDisabled()
    this.creatData()
    // 每日创建前的钩子函数
    this.caledar.options.beforeCreateDay(this) 

    this.layout()

    // 每日创建后的钩子函数
    this.caledar.options.afterCreateDay(this)
    this.addEvent()
}

// 是否可以操作
Day.prototype.isDisabled = function(){
    // 限制年
    var year = this.dayMsg.cYear
    var month = this.dayMsg.cMonth
    var day = this.dayMsg.cDay
    if(year<=this.caledar.limitTime.year[1]&&year>=this.caledar.limitTime.year[0]){ 
        if(month<=this.caledar.limitTime.month[1]&&month>=this.caledar.limitTime.month[0]){
            var flag = this.dayMsg.flag;
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
                      if(day >= this.caledar.limitTime.day[0] ){
                         this.disabled = false
                      }
                  }else if(month == this.caledar.limitTime.month[1]){
                      if(day <= this.caledar.limitTime.day[1]){
                         this.disabled = false
                      }
                  }else{
                      this.disabled = false
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

// 初始化天数所需数据
Day.prototype.creatData = function(){
     var caledar = this.caledar;
     var dayMsg = this.dayMsg;
    
    if(this.caledar.options.isLunar){
        if(this.caledar.options.isFestival){ // 是否显示节日
            if(dayMsg.LFtv){ // 阴历节日
                this.dayBottomMsg = dayMsg.LFtv;
            }
        
            if(!this.dayBottomMsg){//this.dayBottomMsg 没有被节日占用
                if(dayMsg.SFtv){ // 阳历节日
                    this.dayBottomMsg = dayMsg.SFtv;
                }
            }
        }
    
        if(!this.dayBottomMsg){ 
            if(dayMsg.isTerm&&this.caledar.options.isSolarTerm){ 
                this.dayBottomMsg = dayMsg.Term;
            }else{
                this.dayBottomMsg = dayMsg.IDayCn;
            }
        }
    }
    

    // 判断是否被选中
    if(caledar.selected.year == dayMsg.cYear && caledar.selected.month == dayMsg.cMonth && caledar.selected.day == dayMsg.cDay){ 
        if(dayMsg.flag == 'current'){
            this.selected = true;
        }
    }

    // 如果是选中状态，就不显示'休'
    if(this.caledar.options.isHoliday){
        if(this.dayMsg.nWeek < 6){
            this.isHoliday = false;
        }
    }else{
        this.isHoliday = false;
    }
    
}


Day.prototype.layout = function(){

    var dayWrapClassName  = ""
    if(this.disabled){  // 不可点击
        dayWrapClassName = `${this.dayMsg.isToday?'current':''} unClick`
    }else{
        dayWrapClassName = `${this.dayMsg.flag}-month ${this.dayMsg.isToday?'current':''} ${this.selected?'active':''}`
    }


    var warpDiv = null;
   
    // 是否显示阴历
    if(this.caledar.options.isLunar){
        warpDiv = $(`<div class="calendar-day-wrap ${dayWrapClassName} ${this.isHoliday?'rest':''}">
                        <div class="calendar-solar-day">${this.dayMsg.cDay?this.dayMsg.cDay:""}</div>
                        <div class="calendar-lunar-day">${this.dayBottomMsg?this.dayBottomMsg:""}</div>
                    </div>`)
    }else{
        warpDiv = $(`<div class="calendar-day-wrap ${dayWrapClassName} ${this.isHoliday?'rest':''}">
                        <div class="calendar-solar-day">${this.dayMsg.cDay?this.dayMsg.cDay:""}</div>
                    </div>`)
    }

    this.$el = warpDiv
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
        var flag = this.dayMsg.flag
        if(flag == "current"){ // 点击当月天时，不会刷新整个月的天数
            this.$el.addClass("active")
            this.selected = true;
            this.caledar.initTime(this.dayMsg.cYear,this.dayMsg.cMonth,this.dayMsg.cDay)
        }

        if(flag == "prev" || flag == "next"){// 点击上月或下月天时，会刷新整个月的天数
            this.caledar.dayPrevOrNextClickUpdata(this.dayMsg.cYear,this.dayMsg.cMonth,this.dayMsg.cDay)
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
            this.caledar.options.rightHandClick(this,e)
        }
    })

}



export default Day