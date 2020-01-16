const myUser = process.env.TP_LINK_USER;
const myPass = process.env.TP_LINK_PASSWORD;
const token = process.env.TP_LINK_TOKEN;
const { login } = require('tplink-cloud-api');
const logger = require('./logger.js');

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
	loggedInUser = await login(myUser, myPass, token).catch((err) => logger.log("error", `Failed to login:\n${err}`));
}

async function getDevices() {
	devices = await loggedInUser.getDeviceList().catch((err) => logger.log("error", `Failed to get device list:\n${err}`));
}

async function getPlug() {
	try {
		hallPlug = await loggedInUser.getHS100('Hall');
	} catch (err) {
		logger.log("error", `There is a problem with the hall lights:\n${err}`);
	}

	try {
		kitchenPlug = await loggedInUser.getHS100('Kitchen');
	} catch (err) {
		logger.log("error", `There is a problem with the kitchen lights:\n${err}`);
	}
}

function checkSetupCompleted() {
	if (!ready) {
		logger.log("error", "Tried to run a function before initial setup complete")
		throw new Error('Sozza ma boz, not quite ready for ma dudes yet - check back soon');
	}
}

function toggle() {
	checkSetupCompleted();
	var hall = hallPlug.toggle();
	var kitchen = kitchenPlug.toggle();
	logger.log("status", "Toggled");
	return Promise.all([hall, kitchen]).catch((err) => logger.log("error", `Failed to toggle:\n${err}`));;

}

function turnOn() {
	checkSetupCompleted();
	var hall = hallPlug.powerOn();
	var kitchen = kitchenPlug.powerOn();

	logger.log("status", "On");
	return Promise.all([hall, kitchen]).catch((err) => logger.log("error", `Failed to turn on:\n${err}`));
}

function turnOff() {
	checkSetupCompleted();

	var hall = hallPlug.powerOff();
	var kitchen = kitchenPlug.powerOff();

	logger.log("status", "Off");
	return Promise.all([hall, kitchen]).catch((err) => logger.log("error", `Failed to turn off:\n${err}`));
}

async function getStatus() {
	checkSetupCompleted();
	var statusH = await hallPlug.isOn().catch((err) => logger.log("error", `Could not get status for hall:\n${err}`));

	return statusH ? 'on' : 'off';
}

async function syncStatus() {
	checkSetupCompleted();

	// Trying to fix the problems around status issues
	var statusH = await hallPlug.isOn().catch((err) =>
	{
		counter = 0;
		logger.log("error", `Could not get status for hall:\n${err}`);
	});

	var statusK = await kitchenPlug.isOn().catch((err) => {
		counter = 0;
		logger.log("error", `Could not get status for kitchen:\n${err}`);
	});

	if(statusH === statusK) {
		counter = 0;
	} else {
		counter ++;
	}

	if (counter > 3) {
		updatePlugs();
		logger.log("warning", "Out of sync");
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

	// Trying to fix the problems around status issues
	var statusH = await hallPlug.isOn().catch((err) =>
	{
		counter = 0;
		logger.log("error", `Could not get status for hall:\n${err}`);
	});

	var statusK = await kitchenPlug.isOn().catch((err) => {
		counter = 0;
		logger.log("error", `Could not get status for kitchen:\n${err}`);
	});

	if (!(previousHall === statusH)){
		previousHall = statusH;
		logger.log("status", `Hall plug changed`)
		return 'hall'
	}
	else if (!(previousKitchen === statusK))
	{	
		previousKitchen = statusK;
		logger.log("status", `Kitchen plug changed`)
		return 'kitchen'
	}
}

async function updatePlugs() {
	plug = await whichPlugChangedState();
	
	if (plug === 'hall') {
		var state = await hallPlug.isOn().catch((err) => logger.log("error", `Could not get status for hall:\n${err}`));
	}

	if (plug === 'kitchen'){
		var state = await kitchenPlug.isOn().catch((err) => logger.log("error", `Could not get status for kitchen:\n${err}`));
	}

	if (state) {
		await turnOn();
		previousKitchen = true;
		previousHall = true;
	} else {
		await turnOff();
		previousKitchen = false;
		previousHall = fales;
	}
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
	logger.log("warning", "Server restarted, getting things ready");
	await logUserIn();
	await getDevices();

	console.log(devices);
	await getPlug();
	ready = true;
	logger.log("status", "Set up complete");
	try {
	previousHall = (await hallPlug.isOn()? 'on':'off');
	previousKitchen = (await kitchenPlug.isOn()? 'on':'off');
	} catch (err) {
		logger.log("error", `This is embarrasing - could not get status of the plugs at setup\n ${err}`);
	}
	// Could be used later for some cool stuff!
	// hallStatus = await getStatus();
	// kitchenStatus = await getSecondaryStatus();
	// readyToSync = true;
	logger.log("status", "Initial synchronisation");
	setInterval(syncStatus, 1000);
}

setup();

module.exports = { turnOn: turnOn, turnOff: turnOff, toggle: toggle, getStatus: getStatus };