require('dotenv').config();

const express = require('express');
const tplink = require('./tplink.js');
const bodyParser = require('body-parser');
const fs = require('fs');
const logger = require('./logger.js');
const cookieParser = require('cookie-parser');

var nameCookie;
var keyCookie;

const app = express();
app.use(express.static('public'));
app.use(cookieParser());

function isAuthenticUser(req) {
	nameCookie = req.cookies.name;
	keyCookie = req.cookies.key;

	if (!nameCookie || !keyCookie)
		return false;
	return true;
}

app.get('/', (req, res) => {
	
	if (isAuthenticUser(req))
	{
		logger.log("status", `${nameCookie} just logged in`);
		res.sendFile(process.cwd() + '/lighting.html');
	} else {
		logger.log("status", `Failed to authenticate user`);
		req.url = '/login';
		app.handle(req, res);
	}
});

app.get('/on', (req, res) => {
	
	if (!isAuthenticUser(req)) {
		logger.log("status", `Failed to authenticate user`);
		req.url = '/login';
		app.handle(req, res);
		res.send('bad-login');
		return;
	}

	tplink.turnOn().then(() => {
		logger.log("", `${nameCookie} hit the on endpoint`);
		res.send('On');
	});
});

app.get('/toggle', (req, res) => {

	if (!isAuthenticUser(req)) {
		logger.log("status", `Failed to authenticate user`);
		req.url = '/login';
		app.handle(req, res);
		res.send('bad-login');
		return;
	}

	tplink.toggle().then(() => {
		console.log('toggled');
		res.send(`Toggled`);
	});
});

app.get('/off', (req, res) => {

	if (!isAuthenticUser(req)) {
		logger.log("status", `Failed to authenticate user`);
		req.url = '/login';
		app.handle(req, res);
		res.send('bad-login');
		return;
	}

	tplink.turnOff().then(() => {
		console.log('Off');
		logger.log("", `${nameCookie} hit the off endpoint`);
		res.send('Off');
	});
});

app.get('/status', (req, res) => {

	if (!isAuthenticUser(req)) {
		logger.log("status", `Failed to authenticate user`);
		req.url = '/login';
		app.handle(req, res);
		res.send('bad-login');
		return;
	}

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
				logger.log("status", "Lights turned on");
			});
			break;
		case 'off':
			tplink.turnOff().then(() => {
				res.status(200).send('Lights turned off');
				logger.log("status", "Lights turned on");
			});
			break;
		case 'toggle':
			tplink.toggle()
				.then(() => tplink.getStatus())
				.then((status) => {
					res.status(200).send(`Lights turned ${status}`);
					logger.log("status", `Lights toggled ${status}`);
				});
			break;
		case 'status':
			tplink.getStatus().then(status => {
				res.status(200).send('Lights status: ' + status);
				logger.log("status", `Status checked ${status}`);
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
	res.sendFile(process.cwd() + '/public/logs.html');
})

app.get('/login', (req, res) => {
	res.sendFile(`${process.cwd()}/public/login.html`);
})

app.get('/console-data', (req, res) => {
	var content = fs.readFileSync(`${process.cwd()}/logs.txt`);
	res.send(content);
});

app.get('/timer', (req, res) => {
	res.sendFile(process.cwd() + '/public/timer.html');
});