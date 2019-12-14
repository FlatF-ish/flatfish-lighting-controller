var content;
var container;
var lightState = true;

document.addEventListener('readystatechange', event => {
	if (event.target.readyState === 'complete') {
        var template = document.getElementsByTagName('template')[0];

        content = template.content.querySelector("div");

        container = document.getElementById('timer-container');

        // for (var i = 0; i < 2; i++)
        // {
        //     tableRow = document.importNode(content, true);
        //     container.appendChild(tableRow);
        // }
	}
});

function addTimerRow() {
    var tableRow = document.importNode(content, true);
    // tableRow.getElementById
    container.appendChild(tableRow);
}

function toggleLightButton() {
    var lightButton = document.getElementById('light-button');
    console.log(lightState)
    if(lightState === true) {
        lightButton.classList.remove('turn-on');
        lightButton.classList.add('turn-off');
        lightState = false;
    } else {
        lightButton.classList.remove('turn-off');
        lightButton.classList.add('turn-on');
        lightState = true;
    }
}