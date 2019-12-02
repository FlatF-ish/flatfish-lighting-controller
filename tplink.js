const myUser = process.env.TP_LINK_USER;
const myPass = process.env.TP_LINK_PASSWORD;
const { login } = require('tplink-cloud-api');

var loggedInUser;
var hallPlug;
var kitchenPlug;
var ready = false;

var readyToSync = false;

var kitchenStatus = 'off';
var hallStatus = 'off';

async function logUserIn() {
	loggedInUser = await login(myUser, myPass);
}

async function getDevices() {
	await loggedInUser.getDeviceList();
}

async function getPlug() {
	hallPlug = await loggedInUser.getHS100('Hall Lights');
	kitchenPlug = await loggedInUser.getHS100('Kitchen Lights');
}

function checkSetupCompleted() {
	if (!ready) {
		throw new Error('Sozza ma boz, not quite ready for ma dudes yet - check back soon');
	}
}

function toggle() {
	checkSetupCompleted();
	return hallPlug.toggle();
}

function turnOn() {
	checkSetupCompleted();
	var hall = hallPlug.powerOn();
	var kitchen = hallPlug.powerOn();

	return Promise.all([hall, kitchen]);
}

function turnOff() {
	checkSetupCompleted();

	var hall = hallPlug.powerOff();
	var kitchen = hallPlug.powerOff();

	return Promise.all([hall, kitchen]);
}

async function getStatus() {
	checkSetupCompleted();
	var status = await hallPlug.isOn();
	return status ? 'on' : 'off';
}

async function getSecondaryStatus() {
	checkSetupCompleted();
	var status = await kitchenPlug.isOn();
	return status ? 'on' : 'off';
}


// This could be cool later - but not yet
async function syncPlugs() {
	if(readyToSync) {
		readyToSync = false;
		var newHallStatus = await getStatus();
		var newKitchenStatus = await getSecondaryStatus();

		console.log("Hall old " + hallStatus);
		console.log("Kitchen old " + kitchenStatus);
		console.log("Hall new " + newHallStatus);
		console.log("Kitchen new " + newKitchenStatus);

		if (newHallStatus === newKitchenStatus && newHallStatus === hallStatus && newKitchenStatus === kitchenStatus)
		{
			console.log("No change required");
			readyToSync = true;
		} else if (!(newHallStatus === hallStatus)) {
			console.log("Hall changed, need to change kitchen");
			hallStatus = newHallStatus;
			kitchenStatus = newHallStatus;
			newKitchenStatus = newHallStatus;
			await synchroniseLighting(hallStatus)
			readyToSync = true;
		} else {
			console.log("Kitchen changed, need to change hall");
			kitchenStatus = newKitchenStatus;
			hallStatus = newKitchenStatus;
			newHallStatus = newKitchenStatus;
			await synchroniseLighting(kitchenStatus);
			readyToSync = true;
		}
	}
}


// In future this could be the magic required to sync plugs
async function synchroniseLighting(state) {
	if (state === 'on')
	{
		await hallPlug.powerOn();
		await kitchenPlug.powerOn();
		console.log("Both on");
	} else {
		await hallPlug.powerOff();
		await kitchenPlug.powerOff();
		console.log("Both off");

	}
}

async function setup() {
	await logUserIn();
	await getDevices();
	await getPlug();
	ready = true;
	// Could be used later for some cool stuff!
	// hallStatus = await getStatus();
	// kitchenStatus = await getSecondaryStatus();
	// readyToSync = true;
	// setInterval(syncPlugs, 1000);
}

setup();

module.exports = { turnOn: turnOn, turnOff: turnOff, toggle: toggle, getStatus: getStatus };