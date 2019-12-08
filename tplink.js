const myUser = process.env.TP_LINK_USER;
const myPass = process.env.TP_LINK_PASSWORD;
const { login } = require('tplink-cloud-api');
const file = require('fs');
const fetch = require('node-fetch');

var loggedInUser;
var devices;

var previousHall;
var previousKitchen;

var hallPlug;
var kitchenPlug;
var ready = false;

var counter = 0;


var readyToSync = false;

var kitchenStatus = 'off';
var hallStatus = 'off';

async function logUserIn() {
	loggedInUser = await login(myUser, myPass);
}

async function getDevices() {
	devices = await loggedInUser.getDeviceList();
}

async function getPlug() {
	hallPlug = await loggedInUser.getHS100('Hall Lights');
	kitchenPlug = await loggedInUser.getHS100('Kitchen Lights');
}

function checkSetupCompleted() {
	if (!ready) {
		logChange("error", "Tried to run a function before initial setup complete")
		throw new Error('Sozza ma boz, not quite ready for ma dudes yet - check back soon');
	}
}

function toggle() {
	checkSetupCompleted();
	var hall = hallPlug.toggle();
	var kitchen = kitchenPlug.toggle();
	logChange("status", "Toggled");
	return Promise.all([hall, kitchen]);

}

function turnOn() {
	checkSetupCompleted();
	var hall = hallPlug.powerOn();
	var kitchen = kitchenPlug.powerOn();

	logChange("status", "On");
	return Promise.all([hall, kitchen]);
}

function turnOff() {
	checkSetupCompleted();

	var hall = hallPlug.powerOff();
	var kitchen = kitchenPlug.powerOff();

	logChange("status", "Off");
	return Promise.all([hall, kitchen]);
}

async function getStatus() {
	checkSetupCompleted();
	var statusH = await hallPlug.isOn();

	logChange("status",`${statusH}`);

	return statusH ? 'on' : 'off';
}

async function syncStatus() {
	checkSetupCompleted();
	var statusH = await hallPlug.isOn();
	var statusK = await kitchenPlug.isOn();

	if(statusH === statusK) {
		counter = 0;
	} else {
		counter ++;
	}

	if (counter > 3) {
		updatePlugs();
		logChange("warning", "Out of sync");
	}

	return statusH ? 'on' : 'off';
}

// async function getSecondaryStatus() {
// 	checkSetupCompleted();
// 	var status = await kitchenPlug.isOn();
// 	return status ? 'on' : 'off';
// }


async function whichPlugChangedState() {
	checkSetupCompleted();
	var statusH = await hallPlug.isOn();
	var statusK = await kitchenPlug.isOn();
	if (!(previousHall === statusH)){
		previousHall = statusH;
		return 'hall'
	}
	else if (!(previousKitchen === statusK))
	{	
		previousKitchen = statusK;
		return 'kitchen'
	}
}

async function updatePlugs() {
	plug = await whichPlugChangedState();
	
	if (plug === 'hall') {
		var state = await hallPlug.isOn();
	}

	if (plug === 'kitchen'){
		var state = await kitchenPlug.isOn();
	}

	if (state) {
		await turnOn();
	} else {
		await turnOff();
	}
}


function logChange(type, text)
{
	let dateObj = new Date();
	var day = dateObj.getDate().toString().padStart(2, '0');
	var month = (dateObj.getMonth()+1).toString().padStart(2, '0');
	var year = dateObj.getFullYear().toString().padStart(4, '0');
	var hour = dateObj.getHours().toString().padStart(2, '0');
	var minute = dateObj.getMinutes().toString().padStart(2, '0');
	var second = dateObj.getSeconds().toString().padStart(2, '0');
	let time = `${day}-${month}-${year} ${hour}:${minute}:${second}`;
	let message = `${type.toUpperCase()} ${text}: ${time}\n`;
	file.appendFileSync(`${process.cwd()}/logs.txt`, message);

	sendDiscordMessage(type, text, type, day, month, year, hour, minute, second) 
}


function sendDiscordMessage(type, text, type, day, month, year, hour, minute, second) {
	var discordTime = `${day}-${month}-${year}_${hour}-${minute}-${second}`;
	var discordMessage = "\`\`\`"
	if (type.toLowerCase().includes("error")) {
		discordMessage += `diff
- ${type.toUpperCase()}`
    } else if (type.toLowerCase().includes("warning")) {
        discordMessage += `fix
- ${type.toUpperCase()}`;
    } else if (type.toLowerCase().includes("status")) {
        discordMessage += `CSS
- ${type.toUpperCase()}`;
    } else {
		discordMessage += "-"
	}

	discordMessage += ` ${text}__${discordTime}`
	discordMessage += "\`\`\`";
	
	var body = { content : discordMessage }
	fetch('https://discordapp.com/api/webhooks/653236090420985856/saL7of7pmuYI_LQkdmiDROc9BWAL07w1-YU1v3KVNNSUPyw6f1DwpTmlrUTnbSJoHE10' , {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {'Content-Type': 'application/json'},
	});
}
// This could be cool later - but not yet
// async function syncPlugs() {
// 	if(readyToSync) {
// 		readyToSync = false;
// 		var newHallStatus = await getStatus();
// 		var newKitchenStatus = await getSecondaryStatus();

// 		console.log("Hall old " + hallStatus);
// 		console.log("Kitchen old " + kitchenStatus);
// 		console.log("Hall new " + newHallStatus);
// 		console.log("Kitchen new " + newKitchenStatus);

// 		if (newHallStatus === newKitchenStatus && newHallStatus === hallStatus && newKitchenStatus === kitchenStatus)
// 		{
// 			console.log("No change required");
// 			readyToSync = true;
// 		} else if (!(newHallStatus === hallStatus)) {
// 			console.log("Hall changed, need to change kitchen");
// 			hallStatus = newHallStatus;
// 			kitchenStatus = newHallStatus;
// 			newKitchenStatus = newHallStatus;
// 			await synchroniseLighting(hallStatus)
// 			readyToSync = true;
// 		} else {
// 			console.log("Kitchen changed, need to change hall");
// 			kitchenStatus = newKitchenStatus;
// 			hallStatus = newKitchenStatus;
// 			newHallStatus = newKitchenStatus;
// 			await synchroniseLighting(kitchenStatus);
// 			readyToSync = true;
// 		}
// 	}
// }


// In future this could be the magic required to sync plugs
// async function synchroniseLighting(state) {
// 	if (state === 'on')
// 	{
// 		await hallPlug.powerOn();
// 		await kitchenPlug.powerOn();
// 		console.log("Both on");
// 	} else {
// 		await hallPlug.powerOff();
// 		await kitchenPlug.powerOff();
// 		console.log("Both off");

// 	}
// }

async function setup() {
	logChange("warning", "Server restarted, getting things ready");
	await logUserIn();
	await getDevices();

	console.log(devices);
	await getPlug();
	ready = true;
	logChange("status", "Set up complete");
	previousHall = (await hallPlug.isOn()? 'on':'off');
	previousKitchen = (await kitchenPlug.isOn()? 'on':'off');
	// Could be used later for some cool stuff!
	// hallStatus = await getStatus();
	// kitchenStatus = await getSecondaryStatus();
	// readyToSync = true;
	logChange("status", "Initial synchronisation");
	setInterval(syncStatus, 1000);
}

setup();

module.exports = { turnOn: turnOn, turnOff: turnOff, toggle: toggle, getStatus: getStatus, logChange: logChange };