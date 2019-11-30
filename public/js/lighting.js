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
            if(this.responseText === 'on') {
                document.getElementById('off-state').classList.add('inactive');
                document.getElementById('off-state').classList.remove('off');
                document.getElementById('on-state').classList.remove('inactive');
                document.getElementById('on-state').classList.add('on');
            } else if (this.responseText === 'off') {
                document.getElementById('on-state').classList.add('inactive');
                document.getElementById('on-state').classList.remove('on');
                document.getElementById('off-state').classList.add('off');
                document.getElementById('off-state').classList.remove('inactive');
            }
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
