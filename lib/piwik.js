'use strict';

var PiwikTracker = require('piwik-tracker')

var Piwik = function(socket, options) {
    this.attachEvents(socket)
    
    if ( !options.siteId )
        throw new Error('options.siteId required')
        
    if ( !options.trackerUrl )
        throw new Error('options.trackerUrl required')
    
    if ( !options.baseUrl )
        throw new Error('options.baseUrl required')
    
    this.siteId = options.siteId
    this.trackerUrl = options.trackerUrl
    this.baseUrl = options.baseUrl
    
    // Initialize with your site ID and Piwik URL
    var piwik = new PiwikTracker(this.siteId, this.trackerUrl)
    this.setPiwik(piwik)
}

Piwik.prototype.setPiwik = function(pwk) {
    this.piwik = pwk
}

Piwik.prototype._events = {
    'piwik.track': 'track',
    'piwik.goal': 'trackGoal',
    'piwik.event': 'trackEvent',
    'piwik.search': 'trackSearch'
}

Piwik.prototype.attachEvents = function(socket) {
    this.clientIp = socket.address.ip
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
    if ( !this._validPayload(data) )
        return callback({error: 'Must contain url and title keys'})
    
//    console.log('track', data)
    this._track(this._basePayload(data))
}

Piwik.prototype.trackGoal = function(data, callback) {
    if ( !this._validPayload(data) )
        return callback({error: 'Must contain url and title keys'})
        
    if ( !data.goalId )
        return callback({error: 'Must contain goalId'})
    
    var payload = this._basePayload(data)
    payload.idgoal = data.goalId
    
//    console.log('trackGoal', data, payload)
    this._track(payload)
}

Piwik.prototype.trackSearch = function(data, callback) {
    if ( !this._validPayload(data) )
        return callback({error: 'Must contain url and title keys'})
        
    if ( !data.search || !data.search.term )
        return callback({error: 'Must contain search.term'})
    
    var payload = this._basePayload(data)
    payload.search = data.search.term
    if ( data.search.category )
        payload.search_cat = data.search.category
    if ( data.search.count )
        payload.search_count = data.search.count
    
    this._track(payload)
}

Piwik.prototype.trackEvent = function(data, callback) {
    if ( !this._validPayload(data) )
        return callback({error: 'Must contain url and title keys'})
    
    var payload = this._basePayload(data)
    if ( data.category )
        payload.category = data.category
    if ( data.category && data.action )
        payload.action = data.action
    if ( data.category && data.action && data.name )
        payload.name = data.name
    if ( data.category && data.action && data.name && data.value ) 
        payload.value = data.value
    
    // category, action, name, value
    this._track(payload)
}

Piwik.prototype._validPayload = function(data) {
    return (data.url && data.title)
}

Piwik.prototype._basePayload = function(data) {
    var rtn = {
        cip: this.clientIp,
        url: this.baseUrl + data.url,
        /* jshint camelcase: false */
        action_name: data.title
    }
    
    if ( data.campaign ) {
        if ( data.campaign.name )
            rtn._rcn = data.campaign.name
        if ( data.campaign.keyword )
            rtn._rck = data.campaign.keyword
    }
    
    var time
    if ( data.time ) {
        time = new Date(data.time)
    } else {
        time = new Date()
    }
        
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