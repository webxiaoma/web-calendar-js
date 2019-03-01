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
    nextMonthBtnText:'',  // 上一年按钮名字
    nextYearBtnText:'',
    prevMonthBtnText:'',
    nextMonthBtnText:'',
    max:'',
    min:'',

    /**
     * 默认事件
     **/

     // 改变时触发 
    change:function(val){
        
    },

    click:function(data){ // 点击回调函数
      

    },

    rightHandClick:function(day,e){ // 右键回调函数
      
    },

    /**
     * 默认方法
     **/

    // 天数创建之前的钩子函数
    beforeCreateDay:function(dayMsg){  
      
    },

    // 天数创建之后的钩子函数
    afterCreateDay:function(day){ 
       // day 实例
    },
}