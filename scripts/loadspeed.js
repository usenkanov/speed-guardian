var page = require('webpage').create();
var system = require('system');
var t, address;

if (system.args.length === 1) {
    //console.log('Usage: loadspeed.js <some URL>');
    console.log(-1);
    phantom.exit();
}

t = Date.now();
address = system.args[1];
page.open(address, function(status) {
    if (status !== 'success') {
        //console.log('FAIL to load the address');
        console.log(-1);
    } else {
        t = Date.now() - t;
        //console.log('Loading ' + system.args[1]);
        //console.log('Loading time ' + t + ' msec');
        console.log(t);
    }
    phantom.exit();
});

