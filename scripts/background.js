/**
 * A background Script that manages notifications. and badges
 * Copyright 2010 the Time Tracker
 * Use of this source code is governed by a BSD-style license that can be found
 * in the "LICENSE" file.
 * Mustafa Zidan <mustafa.zidan@gmail.com>
 */
var db = openDatabase("timeTracker_v1", "0.1", "Time tracker database.", 200000);
var NOTIFICATION_ENABLED = false;
var currentActivity = null;

init(new Date());
runNotifier();

function init(date){
    var day=date.getDate();
	var month= date.getMonth()+1;
    var year= date.getFullYear();
	db.transaction(
		function(tx) {
			tx.executeSql("SELECT * FROM timeTracker where day = "+day+" and month = "+month+" and year = "+year+" ",				[],populateAcvtivityList,null);
	});
	setInterval(function(){init(new Date());},60000);
}

function populateAcvtivityList(tx,result){
    if (result.rows.length!="0") {
	     var end= result.rows.item(result.rows.length-1)['end'];
	     var start= result.rows.item(result.rows.length-1)['start']
		if (end == null ) {
		 	updateBadge(new Date(start)); 
		 	currentActivity = result.rows.item(result.rows.length-1)['activity'];    
		} else {
		    clearBadge();
		    stopNotifier();
		}
	} 
}

function stopNotifier(){
    NOTFICATION_ENABLED = false; 
    currentActivity = null;   
}

function clearBadge() {
	chrome.browserAction.setBadgeText({text:""});
} 

function updateBadge(time) {
	
	var badge = getDateDifferenceAsMinutes(time, new Date()) ;
	chrome.browserAction.setBadgeText({text:badge});
} 

function getDateDifferenceAsMinutes(from, to) {
	var diff= ((to.getTime() - from.getTime())/60000 | 0);
	//not that  | 0 is for casting diff to integer
	var zeros=""
	if(diff < 10 ) {
		zeros = "00";
	} else if (diff >=10 && diff <= 99) {
		zeros = "0";
	}
	return zeros+diff;
}

function runNotifier(){
    setInterval(function(){
        if (currentActivity != null) {
            var notification = webkitNotifications.createNotification(
              'images/icon.png',  // icon url - can be relative
              'time tracker!',  // notification title
              'You Still Working On '+currentActivity  // notification body text
            );
            notification.show();
            setInterval(function(){notification.cancel();},5000);
        }
        runNotifier();
    },900000);
}
