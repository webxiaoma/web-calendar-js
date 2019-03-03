/**
 * @msg 插件默认配置
 **/ 

export default {

    /**
     * 默认属性
     **/

    value:'',  // 日期初始值
    format:'-', // 日期年月日分隔符
    isFillZero:true, // 月，日 是否补0, 默认补0
    nextMonthBtnText:'',  // 下一月按钮文本
    nextYearBtnText:'',   // 下一年按钮文本
    prevMonthBtnText:'',  // 上一月按钮文本
    nextMonthBtnText:'',  // 下一月按钮文本
    max:'',  // 可选择的最大时间
    min:'',  // 可选择的最小时间
    isHoliday:true, // 是否显示休息
    isFestival:true, // 是否显示节日
    isLunar:true, // 是否显示阴历
    isSolarTerm:true, // 是否显示节气

    /**
     * @msg默认事件
     **/

     // 改变时触发 
    change:function(val){
        
    },

    // 点击回调函数
    click:function(data){ 
      

    },
    // 右键回调函数
    rightHandClick:function(day,e){ 
      
    },

    /**
     *@msg 默认方法
     **/

    // 天数创建之前的钩子函数
    beforeCreateDay:function(day){  
    },

    // 天数创建之后的钩子函数
    afterCreateDay:function(day){ 
       // day 实例
    },

    // createDomDay:function(){

    // }
}