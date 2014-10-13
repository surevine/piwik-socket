'use strict';

var Event  = require('events').EventEmitter
  , Piwik = require('../index')

var SocketEventer = function() {}
SocketEventer.prototype = new Event()
SocketEventer.prototype.send = function(event, data, callback) {
    this.emit(event, data, callback)
}

exports.SocketEventer = SocketEventer

var getValidPiwik = function(socket, options) {
    options = options || {
        siteId: 1,
        trackerUrl: 'http://www.example.com/piwik.php'
    }
    return new Piwik(socket, options)
}

exports.getValidPiwik = getValidPiwik