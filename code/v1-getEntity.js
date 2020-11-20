//Article - How much vacation time I have left? | You have [[VACATIONBALANCE]] days left.

exports.handler = (event, context, callback) => {

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
		return Math.floor((Math.random() * 10) + 1);

}

