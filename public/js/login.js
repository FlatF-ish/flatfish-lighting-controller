function submitResults() {
    var key = document.getElementById('key-input').value;
    var name = document.getElementById('name-input').value;

    alert(`You said your name is ${name} and your key is ${key}`);
}



document.addEventListener('readystatechange', event => {
    var key = document.getElementById('key-underline');
    var name = document.getElementById('name-underline');

	document.getElementById('key-input').addEventListener('focus', function(event) {
        key.classList.add('active-underline');
        key.classList.remove('inactive-underline');
    });

    document.getElementById('key-input').addEventListener('blur', function(event) {
        key.classList.remove('active-underline');
        key.classList.add('inactive-underline');
    });

	document.getElementById('name-input').addEventListener('focus', function(event) {
        name.classList.add('active-underline');
        name.classList.remove('inactive-underline');
    });

    document.getElementById('name-input').addEventListener('blur', function(event) {
        name.classList.remove('active-underline');
        name.classList.add('inactive-underline');
    });
});