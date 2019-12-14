var content;
var container;

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
    container.appendChild(tableRow);
}