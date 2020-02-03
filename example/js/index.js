var Tabs = require('../../cjs/tabs.js');

var tabs1 = new Tabs(document.getElementById('Example1'));

tabs1.on('update', function (i) {
    console.log(i);
});

var tabs2 = new Tabs(document.getElementById('Example2'));

document.querySelector('button.destroy').addEventListener('click', function() {
    tabs1.destroy();
});

document.querySelector('button.enable').addEventListener('click', function() {
    tabs1 = new Tabs(document.getElementById('Example1'));
});
