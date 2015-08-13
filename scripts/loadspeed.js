var page = require('webpage').create();
var system = require('system');
var t, address;

page.settings.resourceTimeout = 30000;

page.onResourceTimeout = function (e) {
//    console.log("TIMEOUT:");
//    console.log(e.errorCode);   // it'll probably be 408
//    console.log(e.errorString); // it'll probably be 'Network timeout on resource'
//    console.log(e.url);         // the url whose request timed out
//    phantom.exit(1);
};

page.onError = function (msg, trace) {
//    console.log("PAGE ERROR:");
//    console.log(msg);
//    trace.forEach(function(item) {
//        console.log('  ', item.file, ':', item.line);
//    });
//    phantom.exit(1);
};

page.onResourceError = function (resourceError) {
//    page.reason = resourceError.errorString;
//    page.reason_url = resourceError.url;
};

phantom.onError = function (msg, trace) {
    var msgStack = ['PHANTOM ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function (t) {
            msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function + ')' : ''));
        });
    }
    console.error(msgStack.join('\n'));
    phantom.exit(1);
};

if (system.args.length === 1) {
    console.log('Usage: loadspeed.js <some URL>');
    phantom.exit(1);
}

t = Date.now();
address = system.args[1];
page.open(address, function (status) {
    if (status !== 'success') {
        console.log('WEBPAGE LOADING FAILED');
        console.log(
            "Error opening url \"" + page.reason_url
                + "\": " + page.reason
        );
        phantom.exit(1);
    }

    //success
    t = Date.now() - t;
    console.log(t);
    phantom.exit();
});

