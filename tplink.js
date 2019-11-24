const myUser = "joshuaquarryhouse@gmail.com";
const myPass = "password"
const { login } = require("tplink-cloud-api")
// const tplink = await login("joshuaquarryhouse@gmail.com", "password");

function toggle() {
    login(myUser, myPass).then( tplink => {
        tplink.getDeviceList().then(deviceList => {
            console.log(deviceList);
            tplink.getHS100('Christmas Lights').toggle().then(myPlug => {
                myPlug.getRelayState().then(state => {
                    console.log(state);  
                })
            })
        })
    });
}

function turnOn() {
    login(myUser, myPass).then( tplink => {
        tplink.getDeviceList().then(deviceList => {
            console.log(deviceList);
            tplink.getHS100('Christmas Lights').powerOn().then(myPlug => {
                console.log("Just a thing so it doesn't crash");
            });
        });
    });
}

function turnOff() {
    login(myUser, myPass).then( tplink => {
        tplink.getDeviceList().then(deviceList => {
            console.log(deviceList);
            tplink.getHS100('Christmas Lights').powerOff().then(myPlug => {
                console.log("Just a thing so it doesn't crash");
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

module.exports = {turnOn: turnOn, turnOff: turnOff, toggle: toggle}