function turnOn() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://flatfish.online:49161/on", true);
    xhttp.send();
    getStatus();
}

function turnOff() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://flatfish.online:49161/off", true);
    xhttp.send();
    getStatus();
}

function getStatus() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            document.getElementById('js-status').innerHTML = this.responseText;
        }
    }
    xhttp.open("GET", "http://flatfish.online:49161/status", true);
    xhttp.send();
}

document.addEventListener('readystatechange', event => {
    if(event.target.readyState === "complete") {
        getStatus();                    
        setInterval(getStatus, 1000);
    }
});
