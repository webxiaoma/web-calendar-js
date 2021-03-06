# web-calendar-js

一个js日历插件（A js calendar plugin ）

---

[中文文档](https://webxiaoma.com/web-plugin/calendar.html)

## 注意事项

- 兼容 `IE8+` (不包括IE8)
- 本日历插件年份范围在`1900年`—— `2100年`

## 安装

**1. 第一种方式，直接引入**

- 引入`js`

```
<script src="https://webxiaoma.github.io/web-calendar-js/lib/js/calendar.min.js"></script>
```

- 引入`css`

```
<link rel="stylesheet" href="https://webxiaoma.github.io/web-calendar-js/lib/static/css/calendar.min.css">
```

> 推荐下载到本地使用，在 [web-calendar-js] 中 的 `lib`目录中引入相应的`js`以及`css`


**2. 第二种方式**

使用安装`npm`下载

``` 
npm install --save-dev web-calendar-js

或

npm i -D web-calendar-js
```

## 基本用法

```js
var cal = new Calendar(el,options)
```
- `el`: `input`元素的`id`或`class`,推荐使用`id`；
- `options`: 日历插件的配置，各项配置见下表；

## `Options` 属性

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| ------ | ------ | ------ |:------:|:------:|  
| format | 年月日之间的分隔符 | `String` | —— | `-` |
| isFillZero | 单月份和单日前是否补0 | `Boolean` | —— | `true` |
| max | 可选择的最大时间 | `String`/`Number` | 时间格式如(2019-2-1、2019/2/1、时间戳) | `true` |
| min | 可选择的最小时间 | `String`/`Number` | 时间格式如(2019-2-1、2019/2/1、时间戳) | `true` |
| nextMonthBtnText | 上一年按钮文本 | `String` | —— | `<<` |
| nextYearBtnName | 下一年按钮文本 | `String` | —— | `>>` |
| prevMonthBtnName | 上一月按钮文本 | `String` | —— | `<`|
| nextMonthBtnName | 下一月按钮文本 | `String` | —— | `>` |
| isHoliday | 是否在周六周日时显示休息字眼 | `Boolean` | —— | `true` |
| isLunar | 是否显示阴历 |  `Boolean`  | —— | `true` |
| isFestival | 是否显示节日（当显示阴历时，才会起作用） |  `Boolean`  | —— | `true` |
| isSolarTerm | 是否显示节气（当显示阴历时，才会起作用） |  `Boolean`  | —— | `true` |


## `Options` 事件

| 事件 | 说明 | 回调参数 |
| ------ | ------ | ------ |
| click | 选择日期时触发 | 返回日期对象day，日期对象中含有日期信息dayMsg |
| change | 日期更改时触发 | 返回包含年月日等信息的对象 | 
| rightHandClick | 右击日期时触发 | 返回日期对象day |


## `Options` 方法

| 方法 | 说明 | 参数 |
| ------ | ------ | ------ |
| beforeCreateDay | 日期天数创建前钩子函数 | 返回日期对象day |
| afterCreateDay | 日期天数创建后钩子函数 | 返回日期对象day | 


## 其它对象说明

### dayMsg对象

- `Animal`: 当年的生肖属性
- `IDayCn`: "二十"
- `IMonthCn`: "十月"
- `LFtv`: 阴历常见节日（默认null）
- `SFtv`: 阳历历常见节日（默认null）
- `Term`: 二十四节气
- `astro`: 当日星座
- `cDay`: 阳历日
- `cMonth`: 阳历月份（1-12）
- `cYear`: 阳历年份
- `gzDay`: 干支纪天
- `gzMonth`: 干支纪月
- `gzYear`: 干支纪年
- `isLeap`: 是否是闰年，boolean值
- `isTerm`: 当时是否是二十四节气，boolean值
- `isToday`: 当前阳历日期是否就是今日，boolean值
- `lDay`: 阴历号
- `lMonth`: 阴历月份
- `lYear`: 阴历年份
- `nWeek`: 数字星期（1-7）
- `ncWeek`: 字符串星期

