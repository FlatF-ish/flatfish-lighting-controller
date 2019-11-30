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
    waitForResponse();
}

function turnOff() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://flatfish.online:49161/off", true);
    xhttp.send();
    waitForResponse();
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

function waitForResponse() {
    document.getElementById('on-state').disabled = true;
    document.getElementById('off-state').disabled = true;
    loadAnimation();
}

function onResponseReceived() {
    document.getElementById('on-state').disabled = false;
    document.getElementById('off-state').disabled = false;
    removeAnimation();
}

function loadAnimation() {
    document.getElementById('light-one').classList.add('light-one');
    document.getElementById('light-two').classList.add('light-two');
    document.getElementById('light-three').classList.add('light-three');
    document.getElementById('light-four').classList.add('light-four');
}

function removeAnimation() {
    document.getElementById('light-one').classList.remove('light-one');
    document.getElementById('light-two').classList.remove('light-two');
    document.getElementById('light-three').classList.remove('light-three');
    document.getElementById('light-four').classList.remove('light-four');
}

function getStatus() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            if(this.responseText === 'on') {
                styleForOn();
                onResponseReceived();
            } else if (this.responseText === 'off') {
                styleForOff();
                onResponseReceived();
            }
        }
    }
    xhttp.open("GET", "http://flatfish.online:49161/status", true);
    xhttp.send();
}


