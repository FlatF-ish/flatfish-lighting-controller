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


async function whichPlugChangedState() {
	checkSetupCompleted();

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
	return 'neither'
}

async function updatePlugs() {
	plug = await whichPlugChangedState();

	if (plug === 'neither')
		return;

	if (plug === 'hall') {
		var state = await hallPlug.isOn().catch((err) => logger.log("error", `Could not get status for hall:\n${err}`));
	}

	if (plug === 'kitchen'){
		var state = await kitchenPlug.isOn().catch((err) => logger.log("error", `Could not get status for kitchen:\n${err}`));
	}

	if (state === true) {
		await turnOn();
		previousKitchen = true;
		previousHall = true;
	} else if (state === false){
		await turnOff();
		previousKitchen = false;
		previousHall = false;
	} else {
		logger.log('error', 'Could not get status not synced');
	}
}


async function setup() {
	logger.log("warning", "Server restarted, getting things ready");
	await logUserIn();
	await getDevices();

	console.log(devices);
	await getPlug();
	ready = true;
	logger.log("status", "Set up complete");
	try {
		previousHall = await hallPlug.isOn();
		previousKitchen = await kitchenPlug.isOn();
	} catch (err) {
		logger.log("error", `This is embarrasing - could not get status of the plugs at setup\n ${err}`);
	}
	logger.log("status", "Initial synchronisation");
	setInterval(updatePlugs, 1000);
}

setup();

module.exports = { turnOn: turnOn, turnOff: turnOff, toggle: toggle, getStatus: getStatus };