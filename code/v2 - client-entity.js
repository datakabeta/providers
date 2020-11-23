//Define Client side entity 
nanorep.floatingWidget.on({
	load: function() {
		var userID = {
			USERID: function(response) {
				return {
					"kind": "USERID",
					"type": "number",
					"value": "123",
					"lifecycle": "persistent"
                }
            }};

        this.api.conversation.registerClientEntities(userID); //Register entity with bot
	}
});

