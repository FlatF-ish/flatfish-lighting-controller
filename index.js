const express = require('express');
const tplink = require('./tplink.js');
const app = express();

const fs = require('fs');
const path = require('path');

app.use(express.static('public'));

app.get('/', (req, res) => {
    var file = fs.readFileSync(process.cwd()+'/lighting.html').toString();
    res.send(file);
});

app.get('/on', (req, res) => {
    tplink.turnOn().then( () => {
        res.send("On");
    });
});

app.get('/toggle', (req, res) => {
    tplink.toggle().then(() => {
        res.send("Toggled");
    });
});

app.get('/off', (req, res) => {
    tplink.turnOff().then( () => {
        res.send("Off");
    });
});

app.get('/status', (req, res) => {
    tplink.getStatus().then((status) => {
        res.send(`Status: ${status}`);
        console.log(status);
    })
});

app.listen(8000, () => {
    console.log('Example app listening on port 8000!');
    // tplink.lighting();
})