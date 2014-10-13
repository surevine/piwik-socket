'use strict';

var Event  = require('events').EventEmitter

var SocketEventer = function() {}
SocketEventer.prototype = new Event()
SocketEventer.prototype.send = function(event, data, callback) {
    this.emit(event, data, callback)
}

SocketEventer.prototype.address = {
    ip: '127.0.0.1',
    secure: false,
    port: 57283
}

exports.SocketEventer = SocketEventer

var getPiwikOptions = function() {
    return {
        siteId: 1,
        trackerUrl: 'http://www.example.com/piwik.php',
        baseUrl: 'http://localhost/test/'
    }
}

exports.getPiwikOptions = getPiwikOptions