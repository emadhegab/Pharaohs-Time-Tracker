var db;
var MAX_FAILURE_COUNT=3;
var failureCount=0;

function init(tx,error){
	db = openDatabase("timeTracker_v1", "0.1", "Time tracker database.", 200000);
	db.transaction(
		function(tx) {
			//tx.executeSql("DROP TABLE timeTracker", [], null, init);	
			tx.executeSql("CREATE TABLE IF NOT EXISTS timeTracker (id INTEGER PRIMARY KEY ,activity TEXT"
				+", description TEXT,start TIME,end TIME)", [], null, init);	
		}
	);	
	if(!db){
		if(failureCount<=MAX_FAILURE_COUNT){
			failureCount++;
			init(tx,error)
		}else{
			showError(tx,error);
		}	
	}else{
		db.transaction(
			function(tx) {
				tx.executeSql("SELECT * FROM timeTracker WHERE '"+new Date()+"' BETWEEN start AND"
				+" COALESCE(end,'"+new Date()+"')",[],populateAcvtivityList,showError);
			}
		);	
	}
}

init(null,null);

function startTracking(){
var activityField =document.getElementById("activity").value;  
  if(activityField !=null && activityField!=""){ 
    $('#start').toggle();
    $('#stop').toggle();
	var activity= document.getElementById("activity").value;
	db.transaction(
		function(tx) {
			tx.executeSql("INSERT INTO timeTracker (activity,start) VALUES(?,?)", 
				[activity,new Date()], updateTracker, showError);	
		}
	);
  }else{
      $('#errorValidation').html("Please Fill Your Activty! ");
  }
}
function stopTracking(){
    $('#start').toggle();
    $('#stop').toggle();
	 	db.transaction(
		/**function(tx) {
			tx.executeSql("update  timeTracker set end = ? where id= ", 
				[new Date()], updateTracker, showError);	
		}**/
	);	
}

function showError(tx,error){
	var errorDiv=document.getElementById("error");
	errorDiv.innerHTML='<b>' + error.message + '</b><br />';
	$("#error").dialog({
		bgiframe: true,
		height: 70,
		modal: true,
		buttons: { "Ok": function() { $(this).dialog("close"); } } 
	});
	$("#error").dialog('open');
}

function populateAcvtivityList(tx,result){
	var activityList=document.getElementById('activityList');
	var activityListStr=""
	for(var i = 0; i < result.rows.length; i++) {
		activityListStr+="<tr>";
        activityListStr+="<td>"+getStartDate(result.rows.item(i))+"<\/td>";
		activityListStr+="<td>"+result.rows.item(i)['activity']+"<\/td>";
		activityListStr+="<td tyle='text-align: center;' >"+getDuration(result.rows.item(i))+"<\/td>";
		activityListStr+="<td><img style=\"cursor:pointer\" src='images/edit.png' "
			+"onclick='showEditForm("+result.rows.item(i)['id']+");'/></td>";
        activityListStr+="<td><img style=\"cursor:pointer\" height=\"16\" width=\"16\" src='images/delete.ico' "+
        	"onclick='deleteActivity("+result.rows.item(i)['id']+");'/></td>";
		activityListStr+="<\/tr>";
	}
	activityList.innerHTML=activityListStr;
}

function updateTracker(tx, result){
	//TODO every minute Update Tracker and DB with new values
}


function getStartDate(activity){
	var start = new Date(activity['start']);
	var minutes=start.getMinutes();
	var hours= start.getHours();
	var duration="";
	if(hours<10){
		duration='0';
	}
	duration+=hours+":";
	if(minutes<10){
		duration+="0";
	}
	duration+=minutes;
	return duration;
 
}

function getDuration(activity){
	var start=new Date(activity['start']);
	var end=new Date();
	if(activity['end']!=null){
		end=new Date(activity['end'])
	}
	var duration=(end.getTime()-start.getTime())/1000;
	var minutes=parseInt(duration/60)%60;
	var hours= parseInt(duration/3600);
	duration="";
	if(hours<10){
		duration='0';
	}
	duration+=hours+":";
	if(minutes<10){
		duration+="0";
	}
	duration+=minutes;
	return duration;
}

function showEditForm(id){
		populateEditForm(id);
		$("#dialog").dialog({
			bgiframe: true,
			height: 190,
			modal: true,
			buttons: { "Ok":function(){saveEditedActivity();}, "Cancel": function(){$(this).dialog("close");}}
		});
		$("#dialog").dialog('open');
}

function populateEditForm(id){
	db.transaction(
		function(tx) {
			tx.executeSql("SELECT * FROM timeTracker WHERE id=?", 
				[id], function(tx,result){
					var activity=result.rows.item(0);
					var start=new Date(activity['start']);
					document.getElementById("activityId").value=activity['id'];
					document.getElementById("activityName").value=activity['activity'];
					document.getElementById("description").value=activity['description'];
					document.getElementById("from").value=start.getHours()+":"+start.getMinutes();
					if(activity['end']==null){
						document.getElementById("to").disabled=true;
						document.getElementById("inprogress").checked=true;
					}else {
						var end=new Date(activity['end']);
						document.getElementById("to").value=end.getHours()+":"+end.getMinutes();
					}
				}, showError);	
		}
	);	
}

function saveEditedActivity(){
	//TODO save edited activity
	$("#dialog").dialog('close');
}

function inProgressSelected(elem){
	if(elem.checked){
		document.getElementById("to").disabled=true;
	}else{
		document.getElementById("to").disabled=false;
	} 
}


function removeValidationMessage(){
    var errorValidation = document.getElementById("errorValidation");
    $("#errorValidation").html("");
}
