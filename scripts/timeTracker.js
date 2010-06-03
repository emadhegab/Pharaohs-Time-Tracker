var maxId=0;
var MAX_FAILURE_COUNT=3;
var failureCount=0;

function init(tx,error){
	db = openDatabase("timeTracker_v1", "0.1", "Time tracker database.", 200000);
	db.transaction(
		function(tx) {
			//tx.executeSql("DROP TABLE timeTracker", [], null, init);	
			tx.executeSql("CREATE TABLE IF NOT EXISTS timeTracker (id INTEGER PRIMARY KEY ,activity TEXT"
				+", description TEXT,start TIMESTAMP,end TIMESTAMP,day DATE)", [], null, init);	
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
				tx.executeSql("SELECT * FROM timeTracker ",[],populateAcvtivityList,showError);
				//tx.executeSql("SELECT max(id) FROM timeTracker ", [],setMaxId,showError);	
			}
		);	
	}
}

init(null,null);

//function setMaxId(tx,result){
	//if(result.rows.length>0){
		//maxId=result.rows.item(0)['id'];
	//}
	//alert(maxId);
//}

function startTracking(){
	var activity= document.getElementById("activity").value;
	var start=new Date();
	db.transaction(
		function(tx) {
			tx.executeSql("INSERT INTO timeTracker (activity,start,day) VALUES(?,?,?)", 
				[activity,start,new Date()], updateTracker, showError);	
		}
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

//TODO test
function populateAcvtivityList(tx,result){
	var activityList=document.getElementById('activityList');
	var activityListStr=""
	for(var i = 0; i < result.rows.length; i++) {
		activityListStr+="<tr>";
		activityListStr+="<td>"+result.rows.item(i)['activity']+"<\/td>";
		activityListStr+="<td tyle='text-align: center;' >"+getDuration(result.rows.item(i))+"<\/td>";
		activityListStr+="<td><img src='images/edit.png' onclick='showEditform("+result.rows.item(i)['id']+");'/></td>";//NULL !!!
		activityListStr+="<\/tr>";
	}
	activityList.innerHTML=activityListStr;
}

function updateTracker(tx, result){
	alert("sucesss");
	//TODO every minute Update Tracker and DB with new values
}

function getDuration(activity){
	return "00:00"
	//TODO calculate duration from (from,to) if to= null then to =NOW 
}
