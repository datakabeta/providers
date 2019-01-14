//Define Client side entity 
nanorep.floatingWidget.on({
  load: function() {
    var entities = {
      USERID1: function(response) {
        return {
          "kind": "USERID",
          "type": "text",
          "value": "x123",
          "lifecycle": "persistent"
        }
      },
      USERID2: function(response) {
        return {
          "kind": "USERID2",
          "type": "text",
          "value": "x123",
          "lifecycle": "persistent"
        }
      }
    }

    this.api.conversation.registerClientEntities(entities); //Register entity with bot
  }
});