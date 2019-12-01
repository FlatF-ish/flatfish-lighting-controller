const myUser = process.env.TP_LINK_USER;
const myPass = process.env.TP_LINK_PASSWORD;
const { login } = require("tplink-cloud-api");

var loggedInUser;
var devices;
var plug;
var ready = false;

async function logUserIn() {
	loggedInUser = await login(myUser, myPass);
}

async function getDevices() {
	devices = await loggedInUser.getDeviceList();
}

async function getPlug() {
	plug = await loggedInUser.getHS100("Christmas Lights");
}

function checkSetupCompleted() {
	if (!ready) {
		throw new Error("Sozza ma boz, not quite ready for ma dudes yet - check back soon");
	}
}

function toggle() {
	checkSetupCompleted();
	return plug.toggle();
}

function turnOn() {
	checkSetupCompleted();
	return plug.powerOn();
}

function turnOff() {
	checkSetupCompleted();
	return plug.powerOff();
}

async function getStatus() {
	checkSetupCompleted();
	var status = await plug.isOn();
	return status ? "on" : "off";
}

async function setup() {
	await logUserIn();
	await getDevices();
	await getPlug();
	ready = true;
}

setup();

module.exports = { turnOn: turnOn, turnOff: turnOff, toggle: toggle, getStatus: getStatus };