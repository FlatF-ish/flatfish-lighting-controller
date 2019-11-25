const express = require('express');
const tplink = require('./tplink.js');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello world');
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

app.listen(8000, () => {
    console.log('Example app listening on port 8000!');
    // tplink.lighting();
})