require('dotenv').config();

const express = require('express');
const tplink = require('./tplink.js');
const bodyParser = require('body-parser');
const fs = require('fs');
const logger = require('./logger.js');



require('dns').reverse("192.168.0.44", function(err, domains) {
	console.log(domains);
});



const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
	console.log("remote: " + req.connection.remoteAddress);

	// require('dns').reverse(req.connection.remoteAddress, function(err, domains) {
	// 	console.log(domains);
	// });
    // res.end(req.headers.host);
	res.sendFile(process.cwd() + '/lighting.html');
});

app.get('/on', (req, res) => {
	tplink.turnOn().then(() => {
		console.log('On');
		logger.log("", "On Endpoint", req.connection.remoteAddress);
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
		logger.log("", `Off Endpoint`, req.connection.remoteAddress);
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
				logger.log("status", "Lights turned on", req.connection.remoteAddress);
			});
			break;
		case 'off':
			tplink.turnOff().then(() => {
				res.status(200).send('Lights turned off');
				logger.log("status", "Lights turned on", req.connection.remoteAddress);
			});
			break;
		case 'toggle':
			tplink.toggle()
				.then(() => tplink.getStatus())
				.then((status) => {
					res.status(200).send(`Lights turned ${status}`);
					logger.log("status", `Lights toggled ${status}`, req.connection.remoteAddress);
				});
			break;
		case 'status':
			tplink.getStatus().then(status => {
				res.status(200).send('Lights status: ' + status);
				logger.log("status", `Status checked ${status}`, req.connection.remoteAddress);
			});
			break;
		default:
			res.status(400).send('Invalid type');
			logger.log("error", `Invalid request`);
			break;
	}
});

app.listen(8000, () => {
	console.log('Lighting controller listening on port 8000!');
	logger.log("", "Lighting controller listening");
});

app.get('/logs', (req, res) => {
	res.sendFile(process.cwd() + '/public/logs.html') 
})

app.get('/console-data', (req, res) => {
	var content = fs.readFileSync(`${process.cwd()}/logs.txt`);
	res.send(content);
});