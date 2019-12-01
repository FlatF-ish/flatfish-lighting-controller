const myUser = process.env.TP_LINK_USER;
const myPass = process.env.TP_LINK_PASSWORD;
const { login } = require("tplink-cloud-api")

var loggedInUser;
var devices;
var plug;
var ready;


function logUserIn() {
    return login(myUser, myPass)
}

function getDevices() {
    return loggedInUser.getDeviceList();
}

function getPlug() {
    return loggedInUser.getHS100("Christmas Lights");
}


logUserIn().then(user => {
    loggedInUser = user;
    return getDevices();
}).then(deviceList => {
    devices = deviceList;
    return getPlug();
}).then(myPlug => {
    plug = myPlug;
    ready = true;
})



async function toggle() {
    plug.toggle().then(() => {
        return plug.getRelayState()
    });
}

//     return new Promise(function(accept, reject){
//         login(myUser, myPass).then( tplink => {
//             tplink.getDeviceList().then(deviceList => {
//                 tplink.getHS100('Christmas Lights').toggle().then(something => {
//                     let myPlug = tplink.getHS100("Christmas Lights")
//                     myPlug.getRelayState().then(state => {
//                         console.log(state);
//                         accept(state);
//                     })
//                 })
//             })
//         });
//     });
// }

function turnOn() {
    return new Promise(function(accept, reject){
        login(myUser, myPass).then( tplink => {
            tplink.getDeviceList().then(deviceList => {
                console.log(deviceList);
                tplink.getHS100('Christmas Lights').powerOn().then(myPlug => {
                    console.log("Just a thing so it doesn't crash");
                    accept();
                });
            });
        });
    })
}

function turnOff() {
    return new Promise(function(accept, reject){
        login(myUser, myPass).then( tplink => {
            tplink.getDeviceList().then(deviceList => {
                console.log(deviceList);
                tplink.getHS100('Christmas Lights').powerOff().then(myPlug => {
                    console.log("Just a thing so it doesn't crash");
                    accept();
                });
            });
        });
    });
}

async function getStatus() {
    return new Promise(async function(accept, reject){
        login(myUser, myPass).then( tplink => {
            tplink.getDeviceList().then(deviceList => {
                let myPlug = tplink.getHS100("Christmas Lights");
                myPlug.isOn().then((val) => {
                    if(val === true)
                    {
                        console.log("On");
                        accept("on");
                    } else {
                        console.log("Off");
                        accept("off");
                    }
                })
            });
        });
    });
}

// function turnOn()
// {
//     logMeIn().then( tplink => {
//         tplink.getHS100('Christmas Lights').powerOn();
//     });
// }


// function turnOff()
// {
//     logMeIn().then( tplink => {
//         tplink.getHS100('Christmas Lights').powerOff();
//     });
// }

module.exports = {turnOn: turnOn, turnOff: turnOff, toggle: toggle, getStatus: getStatus}