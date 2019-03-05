import Calendar from './calendar.js';


window.Calendar = Calendar;

if (typeof module === "object" && typeof module.exports === "object"){
    module.exports = Calendar
}
