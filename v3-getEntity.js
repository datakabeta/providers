//Article - How much vacation time I have left? | You have [[VACATIONBALANCE]] days left.
exports.handler = (event, context, callback) => {
    log("<==============START==========================>");
    var botMemory = event; //Get whatever is in bot's memory
    
    //Check for missing entities
    var userID = nano.getEntityValue(botMemory,"USERID");

    if(!userID) {
        log("no user ID");
        return nano.sendGetEntityResult(callback,[],"USERID");
    }

    log("user ID obtained");
    log(JSON.stringify(botMemory));

    //Construct Entity
	var vacationEntity = nano.createEntity({
		"kind": "VACATIONBALANCE",
		"type": "number",
		"lifecycle": "topic",
		"value": getVacationBalance(userID)
    });
    log(JSON.stringify(vacationEntity));
    
	//Return Entity
	return nano.sendGetEntityResult(callback, [vacationEntity]);
}

//Fake API call to HR Software
function getVacationBalance(userID) {
    return Math.floor((Math.random() * 10) + 1);;
}

//Log Father
const Config = {
    FileName: "solution3",
    Host: "logfather.futbol",
    // Port: "8080",
    // Host: "localhost",
  }
  
  if (!Object.__stack) {
    // https://stackoverflow.com/questions/14172455/get-name-and-line-of-calling-function-in-node-js
    Object.defineProperty(global, '__stack', {
        get: function () {
            var orig = Error.prepareStackTrace;
            Error.prepareStackTrace = function (_, stack) {
                return stack;
            };
            var err = new Error;
            Error.captureStackTrace(err, arguments.callee);
            var stack = err.stack;
            Error.prepareStackTrace = orig;
            return stack;
        }
    });
  
    Object.defineProperty(global, '__line', {
        get: function () {
            return String(__stack[2].getLineNumber());
        }
    });
  
    Object.defineProperty(global, '__function', {
        get: function () {
            return __stack[2].getFunctionName();
        }
    });
  }
  var START = new Date();
  
  function init() {
    START = new Date();
  }
  
  function log(message) {
  
    var http = require('http');
    let postData = JSON.stringify({
        "message": (new Date() - START) + " ms: " + message,
        "fileName": Config.FileName,
        "line": __line,
        "function": __function,
        "createdOn": new Date(),
    });
  
    let options = {
        host: Config.Host,
        port: Config.Port || "80",
        path: "/api/log",
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    }
  
    const req = http.request(options, (res) => {
        res.setEncoding('utf8');
    });
  
    req.on('error', (e) => {
        console.error("problem with request: " + e.message);
    });
  
    req.write(postData);
    req.end();
  }






