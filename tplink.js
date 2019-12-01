const myUser = process.env.TP_LINK_USER;
const myPass = process.env.TP_LINK_PASSWORD;
const { login } = require("tplink-cloud-api")

var loggedInUser;
var devices;
var plug;

async function logUserIn() {
    loggedInUser = await login(myUser, myPass)
}

async function getDevices() {
    devices = await loggedInUser.getDeviceList();
}

async function getPlug() {
    plug = await loggedInUser.getHS100("Christmas Lights");
}

function toggle() {
    return plug.toggle();
}

function turnOn() {
    return plug.powerOn();
}

function turnOff() {
    return plug.powerOff();
}

async function getStatus() {
    var status = await plug.isOn();
    return status ? "on" : "off";
}

async function setup() {
    await logUserIn();
    await getDevices();
    await getPlug();
}

setup();

module.exports = {turnOn: turnOn, turnOff: turnOff, toggle: toggle, getStatus: getStatus}