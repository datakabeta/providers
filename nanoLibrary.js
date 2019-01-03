
function Nano()
{
    this.version = 1.0;
    this.changeLog = [{"1.0":"added type to 'createEntity' method"}];

    //This is the end game, this interfaces with Lambda function to send the provider response to bot engine.
    // Always use this in return statement of Detect.
    //Also use this to return a 'missing entity' from getEntity function if you want to include a prompt/error message to user.
    this.sendLambdaResult = function(callback, json){
        var response = {
            "statusCode": 200,
            "headers": {  },
            "body": JSON.stringify(json)
            };
            
        console.log("sendResult: " +  JSON.stringify(response));
        if (typeof callback == "function")
            callback(null, response);
        else
            callback.done(null, response);
    };

    //Takes entity details from provider and constructs the call to sendLambdaResult() 
    //'Entities' param should be an array. This function works for getEntity and not Detect.
    this.sendGetEntityResult = function(callback, entities, missingEntity){ 
        console.log("missing entity: " + missingEntity);
        if (!entities) entities = [];
        var missingEntities = [];
        if (missingEntity) missingEntities.push({"name":missingEntity});
        return this.sendLambdaResult(callback,
        {
            "resultEntities": entities,
            "missingEntities": missingEntities
        });
    };
    
    //----------------------------------------------------------------------------------------------------------------//
    //All code below  are helper functions meant to simplify the provider dev, you don't necessarily need to use them.
    //----------------------------------------------------------------------------------------------------------------//

    //Loops through the 'event' object, received from bot engine, to find a particular Entity 
    this.getEntity = function(json, entityName, currentStatementOnly, currentTopicOnly){
        for (var i in json.entities)
        {
            var entity = json.entities[i];
            if (entity.kind === entityName)
            {
                if (currentStatementOnly &&  entity.statementId != json.statementId) continue;
                if (currentTopicOnly && entity.topicId < json.topicId) continue; //get entity from current topic only
                return entity;
            }
        }
    };

    //For a given Entity obtained from the 'event' object, get one of its property.
    this.getEntityProperty = function(json, entityName, propertyName){
        var entity = this.getEntity(json, entityName);
        if (!entity) return null;
        entity = this.getProperty(entity.properties, propertyName);
        if (!entity) return null;
        return entity.value;
    };

    this.getEntityValue = function(json, entityName, currentStatementOnly, currentTopicOnly){
        var entity = this.getEntity(json,entityName, currentStatementOnly, currentTopicOnly);
        if (!entity) return null;
        return entity.value;
    };

    //Loop through properties and return a given property
    this.getProperty = function(properties, propertyName, currentStatementOnly, currentTopicOnly){
        for (var i in properties)
        {
            var entity = properties[i];
            if (entity.name == propertyName || entity.kind === propertyName)
            {
                if (currentStatementOnly &&  entity.statementId != json.statementId) continue;
                if (currentTopicOnly && entity.topicId < json.topicId) continue; //get entity from current topic only
                return entity;
            }
        }
    };

    //Return 'value' attribute of a given property
    this.getPropertyValue = function(properties, propertyName, currentStatementOnly, currentTopicOnly){
        var property = this.getProperty(properties, propertyName, currentStatementOnly, currentTopicOnly);
        if (!property) return "";
        return property.value;
    };

    //Use this function to construct the 'entities' object to be sent to sendGetEntityResult()
    this.createEntity = function(options, type, value, matchedToken, tokenStart, tokenEnd, addValueAsIDProperty){
        var entity;
        if (typeof options == "object")
        {
            entity =
            {       
                "kind":options.kind, 
                "type":options.type,
                "value":options.value,
                "consumes":options.consumes,
                "lifecycle": options.lifecycle ? options.lifecycle : "persistent",
                "confidence":options.confidence ? options.confidence : 1,
                "_public": options.public ? options.public : true,
                "matchedToken": options.matchedToken,
                "tokenRangeSet": options.matchedToken ? true : false,
                "tokenRangeStart": options.tokenStart ? options.tokenStart : 0,
                "tokenRangeEnd": options.tokenEnd ? options.tokenEnd : 0,
                dependencies: options.dependencies ? options.dependencies : null
            };
            if (options.properties)
            {
                var valueType; 
                if (Array.isArray(options.properties))
                {
                    // support explicit object with (kind, type, value, name) properties
                    for (var prop of options.properties)
                    {
                        if (!type)
                        {
                            valueType = typeof prop.value;
                            if (valueType == "string") type = "text";
                            else if (valueType == "number") type = "number";
                            else continue;
                        }
                        this.addProperty(entity, prop.kind, type, prop.value, prop.name);
                    }
                }
                else // if simple object with key-values
                {
                    for (var kind in options.properties)
                    {
                        value = options.properties[kind];
                        valueType = typeof value;
                        if (valueType == "string") type = "text";
                        else if (valueType == "number") type = "number";
                        else continue;
                        this.addProperty(entity, kind, type, value);
                    }
                }
            }
        }
        else // backwards compatibility
        {   
            entity =
            {       
                "kind":options, 
                "type":type,
                "value":value,
                "matchedToken": matchedToken,
                "consumes":["NUM"],
                "lifecycle":"persistent",
                "confidence":1,
                "_public":true,
                "tokenRangeStart": tokenStart ? tokenStart : 0,
                "tokenRangeEnd": tokenEnd ? tokenEnd : 0,
                "tokenRangeSet": matchedToken ? true : false,
                dependencies:[]
                
            };
        }
        if (addValueAsIDProperty) this.addProperty(entity, "ID","text",value);
        
        return entity;
    };

    //Add property to properties of an Entity
    this.addProperty = function(entity, kind, type, value, name){
        var property =  {
                "kind":kind,
                "type":type,
                "value":value
            };
        if (name) property.name = name;
        if (!entity.properties) entity.properties = [];
        entity.properties.push(
           property
        );
        return property;
    };

    //Sends request to an API on behalf of your Get Entity code
	this.sendExternalURL = function(requestConfig, callback, errorCallback){

		var requestData = {
		   protocol : requestConfig.protocol ? requestConfig.protocol : "http:",
		   method : requestConfig.method ? requestConfig.method : "GET",
		   hostname:requestConfig.hostname,
		   path: requestConfig.path
	   };
	   
	   if (requestConfig.port) requestData.port = port;
	   
        var http = require(requestData.protocol == "https:" ? "https" : "http");
			
		if (!errorCallback.params) errorCallback.params = {};
		
		var request = http.request(requestData, function (res) {
			var body = [];
				
			if (res.statusCode != 200) {
				console.log("ERROR CODE: " + res.statusCode);
				this.sendLambdaResult(errorCallback.method, errorCallback.params);
			}
	 
			// Data MUST be consumed for resonse handling and proper memory recovery 
			res.on('data', function(chunk)
			{
				console.log("getting data");
				body.push(chunk);
			});
	 
			res.on('end', function () {
				body = Buffer.concat(body).toString();				
				console.log("Sending Response Data to callback function. data: " + body);
				
				return callback.method(body, callback.params);
			});
			
			res.on('error', function (err) {
				console.log("Communications error: " + err);
				this.sendLambdaResult(errorCallback.method, errorCallback.params);
				return;
			  });
				
		}).on('error', function (e) {
			console.log("Communications error: " + e.message);
			this.sendLambdaResult(errorCallback.method, errorCallback.params);
			return;
		});
		
		if (requestConfig.method == "POST" && requestConfig.data){
			console.log("add post data to request");
			request.write(requestConfig.data);
		}
		request.end(); 
    };

    return this;
};
module.exports = new Nano();