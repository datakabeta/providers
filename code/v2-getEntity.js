//Article - How much vacation time I have left? | You have [[VACATIONBALANCE]] days left.
exports.handler = (event, context, callback) => {
    //log("<==============START==========================>");
    var botMemory = event; //Get whatever is in bot's memory
    
    //Check for missing entities
    var userID = nano.getEntityValue(botMemory,"USERID");

    if(!userID) {
        //log("no user ID");
        return nano.sendGetEntityResult(callback,[],"USERID");
    }

    //log("user ID obtained");
    //log(JSON.stringify(botMemory));

    //Construct Entity
	var vacationEntity = nano.createEntity({
		"kind": "VACATIONBALANCE",
		"type": "number",
		"lifecycle": "topic",
		"value": getVacationBalance(userID)
    });
    //log(JSON.stringify(vacationEntity));
    
	//Return Entity
	return nano.sendGetEntityResult(callback, [vacationEntity]);
}

//Fake API call to HR Software
function getVacationBalance(userID) {
    return Math.floor((Math.random() * 10) + 1);;
}




