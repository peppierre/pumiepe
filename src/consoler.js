Consoler = function () {/**/
};
Consoler.generateStandardMessage = function (message) {
    var currentTime, timeStamp;
    currentTime = new Date();
    timeStamp = currentTime.getFullYear();
    timeStamp += "-" + (currentTime.getMonth() < 9 ? "0" : "") + (currentTime.getMonth() + 1);
    timeStamp += "-" + (currentTime.getDate() < 10 ? "0" : "") + currentTime.getDate();
    timeStamp += " " + (currentTime.getHours() < 10 ? "0" : "") + currentTime.getHours();
    timeStamp += ":" + (currentTime.getMinutes() < 10 ? "0" : "") + currentTime.getMinutes();
    timeStamp += ":" + (currentTime.getSeconds() < 10 ? "0" : "") + currentTime.getSeconds();
    timeStamp += "." + (currentTime.getMilliseconds() < 10 ? "0" : "") + (currentTime.getMilliseconds() < 100 ? "0" : "") + currentTime.getMilliseconds();
    return "[" + timeStamp + "] [PUMIEPE] " + message;
};
Consoler.log = function (message) {
    if (!console) {
        return;
    }
    console.log(Consoler.generateStandardMessage(message));
};
Consoler.info = function (message) {
    if (!console) {
        return;
    }
    console.info(Consoler.generateStandardMessage(message));
};
Consoler.warn = function (message) {
    if (!console) {
        return;
    }
    console.warn(Consoler.generateStandardMessage(message));
};
Consoler.error = function (message) {
    if (!console) {
        return;
    }
    console.error(Consoler.generateStandardMessage(message));
};
