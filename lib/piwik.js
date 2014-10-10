'use strict'

var PiwikTracker = require('piwik-tracker')

var Piwik = function(socket, options) {
    this.attachEvents(socket)
    
    this.siteId = options.siteId
    this.endpoint = options.endpoint
    this.baseUrl = options.baseUrl
    
    // Initialize with your site ID and Piwik URL
    this.piwik = new PiwikTracker(this.siteId, this.endpoint)
    
    // Piwik works with absolute URLs, so you have to provide protocol and hostname
    var baseUrl = 'http://example.com'
}

Piwik.prototype._events = {
    'piwik.track': 'track',
    'piwik.click': 'trackClick',
    'piwik.goal': 'trackGoal',
    'piwik.event': 'trackEvent',
    'piwik.search': 'trackSearch'
}

Piwik.prototype.attachEvents = function(socket) {
    console.log(socket.address)
    if (!this._events) return
    var self = this
    Object.keys(this._events).forEach(function(event) {
        socket.removeAllListeners(event)
        socket.on(event, function(data, callback) {
            self[self._events[event]](data, callback)
        })
    })
}

Piwik.prototype.track = function(data, callback) {
    console.log('track', data)
}

Piwik.prototype.trackClick = function(data, callback) {
    console.log('trackClick', data)
}

Piwik.prototype.trackGoal = function(data, callback) {
    var payload = this._basePayload()
    payload.idgoal = data.goalId
    
    console.log('trackGoal', data, payload)
    this._track(payload)
}

Piwik.prototype.trackEvent = function(data, callback) {
    var payload = this._basePayload(data)
    if ( data.category )
        payload.category = data.category
    if ( data.action )
        payload.action = data.action
    if ( data.name )
        payload.name = data.name
    if ( data.value ) 
        payload.value = data.value
    
    // category, action, name, value
    console.log('trackEvent', data, payload)
    this._track(payload)
}

Piwik.prototype._basePayload = function(data) {
    var rtn = {
        cip: this.clientIp,
        url: this.baseUrl+data.url,
        action_name: data.title
    }
    
    if ( data.campaign ) {
        if ( data.campaign.name )
            rtn._rcn = data.campaign.name
        if ( data.campaign.keyword )
            rtn._rck = data.campaign.keyword
    }
    
    var time = data.time || new Date()
    rtn.h = time.getHours()
    rtn.m = time.getMinutes()
    rtn.s = time.getSeconds()
    
    if ( data.uid )
        rtn.uid = data.uid
        
    return rtn
}

Piwik.prototype._track = function(payload) {
    this.piwik.track(payload)
//    this.piwik.track({
//        // The full request URL
//        url: baseUrl + req.url,
//        
//        // This will be shown as title in your Piwik backend
//        action_name: 'API call',
//        
//        // User agent and language settings of the client
//        ua: req.header('User-Agent'),
//        lang: req.header('Accept-Language'),
//        
//        // Custom request variables
//        cvar: JSON.stringify({
//            '1': ['API version', 'v1'],
//            '2': ['HTTP method', req.method]
//        })
//    })
}

module.exports = Piwik