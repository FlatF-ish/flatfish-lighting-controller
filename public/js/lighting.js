var disableStatusUpdate = false;

document.addEventListener('readystatechange', event => {
	if (event.target.readyState === 'complete') {
		getStatus();
		setInterval(getStatus, 1000);
	}
});

function turnOn() {
	disableStatusUpdate = true;
	waitForResponse();
	const xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			disableStatusUpdate = false;
		}
	};
	xhttp.open('GET', '/on', true);
	xhttp.send();
}

function turnOff() {
	disableStatusUpdate = true;
	waitForResponse();
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			disableStatusUpdate = false;
		}
	};
	xhttp.open('GET', '/off', true);
	xhttp.send();
}

function styleForOn() {
	document.getElementById('off-state').classList.add('inactive');
	document.getElementById('off-state').classList.remove('off');
	document.getElementById('on-state').classList.remove('inactive');
	document.getElementById('on-state').classList.add('on');

	document.getElementById('js-status').innerHTML = 'On';

	document.getElementById('lightbulb-icon').classList.remove('lightbulb-icon-off');
	document.getElementById('lightbulb-icon').classList.add('lightbulb-icon-on');
}

function styleForOff() {
	document.getElementById('on-state').classList.add('inactive');
	document.getElementById('on-state').classList.remove('on');
	document.getElementById('off-state').classList.add('off');
	document.getElementById('off-state').classList.remove('inactive');

	document.getElementById('js-status').innerHTML = 'Off';

	document.getElementById('lightbulb-icon').classList.remove('lightbulb-icon-on');
	document.getElementById('lightbulb-icon').classList.add('lightbulb-icon-off');
}

function waitForResponse() {
	document.getElementById('js-status').innerHTML = 'Waiting...';
	document.getElementById('on-state').classList.add('inactive');
	document.getElementById('off-state').classList.add('inactive');
	document.getElementById('on-state').classList.add('disabled');
	document.getElementById('off-state').classList.add('disabled');
	document.getElementById('on-state').disabled = true;
	document.getElementById('off-state').disabled = true;
	loadAnimation();
}

function onResponseReceived() {
	document.getElementById('on-state').classList.remove('inactive');
	document.getElementById('off-state').classList.remove('inactive');
	document.getElementById('on-state').classList.remove('disabled');
	document.getElementById('off-state').classList.remove('disabled');
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
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200 && !disableStatusUpdate) {
			if (this.responseText === 'on') {
				onResponseReceived();
				styleForOn();
			} else if (this.responseText === 'off') {
				onResponseReceived();
				styleForOff();
			}
		}
	};
	xhttp.open('GET', '/status', true);
	xhttp.send();
}
