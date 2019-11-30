require('dotenv').config();

const express = require('express');
const tplink = require('./tplink.js');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

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
app.use('/favicon.ico', express.static('./public/images/bulb.ico'));

app.post('/api', (req, res) => {
    switch(req.body.type) {
        case "on": 
            tplink.turnOn().then(() => { 
                res.status(200).send("Lights turned on"); 
            });
            break;
        case "off": 
            tplink.turnOff().then(() => { 
                res.status(200).send("Lights turned off"); 
            });
            break;
        case "toggle": 
            tplink.toggle().then((status) => { 
                res.status(200).send(status ? "Lights turned on" : "Lights turned off"); 
            });
            break;
        case "status": 
            tplink.getStatus().then(status => { 
                res.status(200).send("Lights status: " + status); 
            });
            break;
        default:
            res.status(400).send("Invalid type");
            break;
    }
});

app.listen(8000, () => {
    console.log('Example app listening on port 8000!');
})