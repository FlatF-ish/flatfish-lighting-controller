require('dotenv').config();

const express = require('express');
const tplink = require('./tplink.js');
const bodyParser = require('body-parser');
const fs = require('fs');


const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(process.cwd() + '/lighting.html');
});

app.get('/on', (req, res) => {
	tplink.turnOn().then(() => {
		console.log('On');
		tplink.logChange("", "On Endpoint");
		res.send('On');
	});
});

app.get('/toggle', (req, res) => {
	tplink.toggle().then(() => {
		console.log('toggled');
		res.send('Toggled');
	});
});

app.get('/off', (req, res) => {
	tplink.turnOff().then(() => {
		console.log('Off');
		tplink.logChange("", `Off Endpoint`);
		res.send('Off');
	});
});

app.get('/status', (req, res) => {
	tplink.getStatus().then((status) => {
		res.send(`${status}`);
	});
});

app.use('/api', bodyParser.json());
app.use('/favicon.ico', express.static('./public/images/bulb.ico'));

app.post('/api', (req, res) => {
	switch (req.body.type) {
		case 'on':
			tplink.turnOn().then(() => {
				res.status(200).send('Lights turned on');
				tplink.logChange("status", "Lights turned on");
			});
			break;
		case 'off':
			tplink.turnOff().then(() => {
				res.status(200).send('Lights turned off');
				tplink.logChange("status", "Lights turned on");
			});
			break;
		case 'toggle':
			tplink.toggle()
				.then(() => tplink.getStatus())
				.then((status) => {
					res.status(200).send(`Lights turned ${status}`);
					tplink.logChange("status", `Lights toggled ${status}`);
				});
			break;
		case 'status':
			tplink.getStatus().then(status => {
				res.status(200).send('Lights status: ' + status);
				tplink.logChange("status", `Status checked ${status}`);
			});
			break;
		default:
			res.status(400).send('Invalid type');
			tplink.logChange("error", `Invalid request`);
			break;
	}
});

app.listen(8000, () => {
	console.log('Lighting controller listening on port 8000!');
	tplink.logChange("", "Lighting controller listening");
});

app.get('/logs', (req, res) => {
	res.sendFile(process.cwd() + '/public/logs.html') 
})

app.get('/console-data', (req, res) => {
	var content = fs.readFileSync(`${process.cwd()}/logs.txt`);
	res.send(content);
});