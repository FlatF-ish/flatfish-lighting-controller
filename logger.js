const file = require('fs');
const fetch = require('node-fetch');

function log(type, text, address = "unknown ip")
{
	let dateObj = new Date();
	var day = dateObj.getDate().toString().padStart(2, '0');
	var month = (dateObj.getMonth()+1).toString().padStart(2, '0');
	var year = dateObj.getFullYear().toString().padStart(4, '0');
	var hour = dateObj.getHours().toString().padStart(2, '0');
	var minute = dateObj.getMinutes().toString().padStart(2, '0');
	var second = dateObj.getSeconds().toString().padStart(2, '0');
	let time = `${day}-${month}-${year} ${hour}:${minute}:${second}`;
	let message = `${type.toUpperCase()} ${text}: ${time} : ${address}\n`;
	file.appendFileSync(`${process.cwd()}/logs.txt`, message);

	sendDiscordMessage(type, text, type, day, month, year, hour, minute, second) 
}


function sendDiscordMessage(type, text, type, day, month, year, hour, minute, second) {
	var discordTime = `${day}-${month}-${year}_${hour}-${minute}-${second}`;
	var discordMessage = "\`\`\`"
	if (type.toLowerCase().includes("error")) {
		discordMessage += `diff
- ${type.toUpperCase()}`
    } else if (type.toLowerCase().includes("warning")) {
        discordMessage += `fix
- ${type.toUpperCase()}`;
    } else if (type.toLowerCase().includes("status")) {
        discordMessage += `CSS
- ${type.toUpperCase()}`;
    } else {
		discordMessage += "-"
	}

	discordMessage += ` ${text}__${discordTime}`
	discordMessage += "\`\`\`";
	
	var body = { content : discordMessage }
	fetch('https://discordapp.com/api/webhooks/653236090420985856/saL7of7pmuYI_LQkdmiDROc9BWAL07w1-YU1v3KVNNSUPyw6f1DwpTmlrUTnbSJoHE10' , {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {'Content-Type': 'application/json'},
	});
}

module.exports = { log: log };