'use strict';

var Event  = require('events').EventEmitter

var SocketEventer = function() {}
SocketEventer.prototype = new Event()
SocketEventer.prototype.send = function(event, data, callback) {
    this.emit(event, data, callback)
}

exports.SocketEventer = SocketEventer