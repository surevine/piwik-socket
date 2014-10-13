'use strict';

var PiwikTracker = function() {
    this.payloads = []
    this.latestPayload = {}
    this.trackCalled = false
    this.trackCalls = 0
}

PiwikTracker.prototype.track = function(data) {
    this.latestPayload = data
    this.payloads.push(data)
    this.trackCalled = true
    this.trackCalls++
}

module.exports = PiwikTracker