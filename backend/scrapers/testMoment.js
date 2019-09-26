var moment = require('moment');

let da = [ 'Sun', 'Jul', '14', '2019' ];
da=[ 'Sunday', 'December', '8', '2019' ];
da=[ 'Tuesday', 'December', '17th', '2019' ]


let myMoment = moment(da[3]+"-"+da[1]+"-"+da[2], 'YYYY-MMM-DD');
console.log(new Date(myMoment));

da=[ 'Saturday', 'November', '9th', '2019' ]
myMoment = moment(da[3]+"-"+da[1]+"-"+da[2], 'YYYY-MMM-DD');
console.log(new Date(myMoment));
