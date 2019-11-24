const express = require('express');
const tplink = require('./tplink.js');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.get('/on', (req, res) => {
    tplink.turnOn();
});

app.get('/toggle', (req, res) => {
    tplink.toggle();
});

app.get('/off', (req, res) => {
    tplink.turnOff();
});

app.listen(8000, () => {
    console.log('Example app listening on port 8000!');
    // tplink.lighting();
})