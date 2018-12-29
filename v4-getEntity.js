//Article - How much vacation time is left for user id c789 ? | You have [[VACATIONBALANCE]] days left.
exports.handler = (event, context, callback) => {

    var botMemory = event; //Get whatever is in bot's memory
    
    //Check for missing entities
    var userID = nano.getEntityValue(botMemory,"USERID");

    if(!userID) {
        return nano.sendLambdaResult(callback, {
            "failure": true,
            "missingEntities": [{
                "name": "USERID",
                "missingVarText": "What is your user ID?"
            }]
        });
    }

    //Construct Entity
	var vacationEntity = nano.createEntity({
		"kind": "VACATIONBALANCE",
		"type": "number",
		"lifecycle": "topic",
		"value": getVacationBalance()
    });
    
	//Return Entity
	return nano.sendGetEntityResult(callback, [vacationEntity]);
}

//Fake API call to HR Software
function getVacationBalance() {
    return Math.floor((Math.random() * 10) + 1);;
}

