var arrayContent;
var counter = 0;

function outputLogs() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            content = this.response;
            arrayContent = content.split('\n');
            triggerLogging();
		}
    }
    xhttp.open('GET', '/console-data');
    xhttp.send();
}

function triggerLogging() {
    for (var i = counter; i < (arrayContent.length - 1); i++) {
        counter++;
        logToConsole(arrayContent[i]);
        console.log(arrayContent[i]);
    }
}


function logToConsole(message) {
    console.log('hi');
    var consoleWindow = document.getElementById('console-output');

    var consoleLine = document.createElement("div");
    consoleLine.innerHTML = `> ${message}`;
    consoleWindow.appendChild(consoleLine);

    consoleLine.classList.add("log-line");

    if (message.toLowerCase().includes("error")) {
        consoleLine.classList.add("error-message");
        console.log("error");
    } else if (message.toLowerCase().includes("warning")) {
        consoleLine.classList.add("warning-message");
        console.log("warning");
    } else if (message.toLowerCase().includes("status")) {
        consoleLine.classList.add("status-message");
        console.log("status");
    } else {
        consoleLine.classList.add("generic-message");
        console.log("generic");
    }
    
    console.log(`logged: ${message}`);
}

document.addEventListener('readystatechange', event => {
	if (event.target.readyState === 'complete') {
        console.log("ready!");
        outputLogs();
        setInterval(outputLogs, 1000);
	}
});