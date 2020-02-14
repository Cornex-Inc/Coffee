function timedCount() {
    postMessage('get');
    setTimeout("timedCount()", 10000);
}

timedCount();
