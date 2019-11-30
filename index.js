const express = require('express');
const tplink = require('./tplink.js');
const bodyParser = require('body-parser');
const app = express();

const fs = require('fs');
const path = require('path');

app.use(express.static('public'));

app.use('/favicon.ico', express.static('images/favicon.ico'));

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
        console.log("toggled");
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
        res.send(`${status}`);
    })
});

app.use('/api', bodyParser.json());

app.post('/api', (req, res) => {
    if (req.body.type === "setState") {
        // on or off
    } else if (req.body.type === "toggle") {
        tplink.toggle();
    } else if (req.body.type === "status") {
        tplink.getStatus();
    }
});

app.listen(8000, () => {
    console.log('Example app listening on port 8000!');
})