document.addEventListener('readystatechange', event => {
    if(event.target.readyState === "complete") {
        getStatus();                    
        setInterval(getStatus, 1000);
    }
});

function turnOn() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://flatfish.online:49161/on", true);
    xhttp.send();
    styleForOn();
}

function turnOff() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://flatfish.online:49161/off", true);
    xhttp.send();
    styleForOff();
}

function styleForOn() {
    document.getElementById('off-state').classList.add('inactive');
    document.getElementById('off-state').classList.remove('off');
    document.getElementById('on-state').classList.remove('inactive');
    document.getElementById('on-state').classList.add('on');
    document.getElementById('js-status').innerHTML = "on";
}

function styleForOff() {
    document.getElementById('on-state').classList.add('inactive');
    document.getElementById('on-state').classList.remove('on');
    document.getElementById('off-state').classList.add('off');
    document.getElementById('off-state').classList.remove('inactive');
    document.getElementById('js-status').innerHTML = "off";
}

function getStatus() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            if(this.responseText === 'on') {
                styleForOn();
            } else if (this.responseText === 'off') {
                styleForOff();
            }
        }
    }
    xhttp.open("GET", "http://flatfish.online:49161/status", true);
    xhttp.send();
}


