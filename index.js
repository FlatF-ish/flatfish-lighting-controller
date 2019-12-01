require('dotenv').config();

const express = require('express');
const tplink = require('./tplink.js');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
	var file = fs.readFileSync(process.cwd() + '/lighting.html').toString();
	res.send(file);
});

app.get('/on', (req, res) => {
	tplink.turnOn().then(() => {
		console.log('On');
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
			});
			break;
		case 'off':
			tplink.turnOff().then(() => {
				res.status(200).send('Lights turned off');
			});
			break;
		case 'toggle':
			tplink.toggle()
				.then(() => tplink.getStatus())
				.then((status) => {
					res.status(200).send(`Lights turned ${status}`);
				});
			break;
		case 'status':
			tplink.getStatus().then(status => {
				res.status(200).send('Lights status: ' + status);
			});
			break;
		default:
			res.status(400).send('Invalid type');
			break;
	}
});

app.listen(8000, () => {
	console.log('Lighting controller listening on port 8000!');
});