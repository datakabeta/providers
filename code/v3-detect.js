//Detects user ID in statement
exports.handler = (event, context, callback) => {
    //Fake DB of valid user IDs
    var userID = {
        "a123": true,
        "b456": true,
        "c789": true
    };

    var botMemory = event; //Get whatever is in the bot's memory
    var tokens = botMemory.tokens; //Get array of words in statement
    count = -1;
    for (var t in tokens) {
        count+=1;
        var token = tokens[t];
        //If user ID matched, create & return USERID entity
        
        if (userID[token.word]) {

            var userEntity =  nano.createEntity({
                "kind": "USERID",
                "type": "text",
                "value": token.word,
                "lifecycle": "topic",
                "tokenRangeSet": true,
                "matchedToken": token.word,
                "tokenStart": count,
                "tokenEnd": count
            });
            return nano.sendLambdaResult(callback,[userEntity]);
        }
    }
    return nano.sendLambdaResult(callback,[]);
}









