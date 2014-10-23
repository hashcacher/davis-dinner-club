var express = require('express');
var router = express.Router();

var oauth2Client = require('../../calendarapi/oauth2').client;
var google = require('../../node_modules/googleapis/lib/googleapis.js');
var calendar = google.calendar('v3');

/* GET users listing. */
router.get('/', function(req, res) {
 	    calendar.events.list({ auth: oauth2Client, calendarId: 'primary'}, function(err, googleRes) {
	    if (err) {
	      console.log('An error occured', err);
	      return;
	    }
    	console.log(googleRes);

    	//good stuff here
    	var events = [];
    	googleRes.items.forEach( function( i ){  //res is Google's response

        	var features = i.description.split('\n');
        	
        	var datetime = i.start.dateTime;
        	var time = new Date(datetime);
			// console.log(time.format("MM/dd/yy h:mm tt"));
			console.log(time);

        	var ppl = features[0].split('/');
        	var menu = features.slice(2); //the rest of the response is the menu items.

        	var curEvent = {title: i.summary, time: datetime, filled: ppl[0], max: ppl[1], price: features[1], menu: menu};
        	events.push(curEvent);
        });

    	res.render('reservation', { 
		title: 'Reservation',
		events: events });
    });
});

module.exports = router;
