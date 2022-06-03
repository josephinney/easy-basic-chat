const moment = require('moment');

console.log(moment().format());

var now = moment();

console.log('Current Timestamp', now.unix());

//var timestamp = 807900559;
var timestamp = now.unix();
var currentMoment = moment.unix(timestamp);

console.log('Current Moment: ', currentMoment.format('MMMM Do, YYYY @ h:mm A'));