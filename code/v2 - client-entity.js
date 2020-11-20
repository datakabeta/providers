//Define Client side entity 
nanorep.floatingWidget.on({
	load: function() {
		var userID = {
			USERID: function(response) {
				return {
					"kind": "USERID",
					"type": "text",
					"value": "a123",
					"lifecycle": "persistent"
                }
            }};

        this.api.conversation.registerClientEntities(userID); //Register entity with bot
	}
});

