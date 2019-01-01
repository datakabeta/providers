//Construct and return a multichoice Entity with static data which presents dummy reasons for a user to select from.

var reasonsEntity = {
        "name": "",
        "kind": "text",
        "value": "Ticket selection",
        "type": "error",
        "properties": [{
            "name": "type",
            "kind": "type",
            "value": "multichoice",
            "type": "text"
        }, {
            "name": "header",
            "kind": "header",
            "value": "Please provide a reason for cancellation.",
            "type": "text"
        }, {
            "name": "1",
            "kind": "1",
            "value": "Reason1",
            "type": "text",
            "properties": [{
                "name": "text",
                "kind": "text",
                "value": "Reason1",
                "type": "text"
            }, {
                "name": "statement",
                "kind": "statement",
                "value": "subscriber reason1",
                "type": "text"
            }, {
                "name": "quickOption",
                "kind": "quickOption",
                "value": "Reason1",
                "type": "text"
            }]
        }, {
            "name": "2",
            "kind": "2",
            "value": "5011111111",
            "type": "text",
            "properties": [{
                "name": "text",
                "kind": "text",
                "value": "Reason2",
                "type": "text"
            }, {
                "name": "statement",
                "kind": "statement",
                "value": "subscriber reason2",
                "type": "text"
            }, {
                "name": "quickOption",
                "kind": "quickOption",
                "value": "Reason2",
                "type": "text"
            }]
        }, {
            "name": "3",
            "kind": "3",
            "value": "Reason 3",
            "type": "text",
            "properties": [{
                "name": "text",
                "kind": "text",
                "value": "Reason3",
                "type": "text"
            }, {
                "name": "statement",
                "kind": "statement",
                "value": "subscriber reason3",
                "type": "text"
            }, {
                "name": "quickOption",
                "kind": "quickOption",
                "value": "Reason3",
                "type": "text"
            }]
        }, {
            "name": "count",
            "kind": "count",
            "value": "3",
            "type": "number"
        }]
    };

  //Returns reasons Entity. CANCELLATION_REASON entity would be a Detect function which processes the user's choice.
  return nano.sendGetEntityResult(callback,[reasonsEntity], "CANCELLATION_REASON"); 
					

