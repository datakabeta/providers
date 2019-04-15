//Article - How much vacation time I have left? | You have [[VACATIONBALANCE]] days left.

exports.handler = (event, context, callback) => {

	    //Construct Entity
		var vacationEntity = nano.createEntity({
			"kind": "VACATIONBALANCE", 
			"type": "number",  
			"lifecycle": "topic", 
			"value": Math.floor((Math.random() * 10) + 1) 
		});
		
		//Return Entity
		return nano.sendGetEntityResult(callback, [vacationEntity]);
	}
	
	

}

