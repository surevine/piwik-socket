'use strict';

var helper = require('../helper')
  , should = require('should')
  , mockery = require('mockery')
  , PiwikTracker = require('../utils/piwik-tracker')

/* jshint -W030 */
describe('Piwik Tracking API - Base functionality', function() {
    
    var socket = null
      , piwikTracker = null
      , Piwik = null
    
    beforeEach(function() {
        
        mockery.enable()

        mockery.registerMock('piwik-tracker', PiwikTracker)
        
        Piwik = require('../../index')
        socket = new helper.SocketEventer()
    })
    
    afterEach(function() {
        piwikTracker = null
        socket = null
        Piwik = null
        mockery.disable()
    })
    
    /*jshint -W068 */
    it('Should error if no siteId is provided', function() {
        (function() {
            new Piwik(socket, {})
        }).should.throw(Error)
    })
    
    /*jshint -W068 */
    it('Should error if no trackerUrl is provided', function() {
        (function() {
            new Piwik(socket, {siteId: 1})
        }).should.throw(Error)
    })
    
    /*jshint -W068 */
    it('Should error if no baseUrl is provided', function() {
        (function() {
            new Piwik(socket, {
                siteId: 1, 
                trackerUrl: 'http://example.com/piwik.php'
            })
        }).should.throw(Error)
    })
    
    /*jshint -W068 */
    it('Should accept a siteId, trackerUrl and baseUrl', function() {
        (function() {
            new Piwik(socket, {
                siteId: 1,
                trackerUrl: 'http://www.example.com/piwik.php',
                baseUrl: 'http://site.com'
            })
        }).should.not.throw(Error)
    })
    
    it('Should not call `track` if required fields are omitted', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.track', {
            url: 'test.html'
        })
        
        pwk.piwik.trackCalled.should.be.false
        pwk.piwik.trackCalls.should.equal(0)
    })
    
    it('Should not call `track` if the page title is omitted', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.track', {
            url: 'test.html'
        })
        
        pwk.piwik.trackCalled.should.be.false
        pwk.piwik.trackCalls.should.equal(0)
    })
    
    it('Should not call `track` if the page url is omitted', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.track', {
            title: 'Test page'
        })
        
        pwk.piwik.trackCalled.should.be.false
        pwk.piwik.trackCalls.should.equal(0)
    })
    
    it('Should call track if the required fields are provided', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.track', {
            url: 'test.html',
            title: 'Test page'
        })
        
        pwk.piwik.trackCalled.should.be.true
        pwk.piwik.trackCalls.should.equal(1)
    })
    
    it('Should send through the correct IP address', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.track', {
            time: new Date(),
            title: 'Test',
            url: 'test.html'
        })
        
        pwk.piwik.trackCalled.should.be.true
        pwk.piwik.trackCalls.should.equal(1)
        pwk.piwik.latestPayload.cip.should.equal('127.0.0.1')
    })
    
    it('Should send through the correct time', function() {
        var time = new Date()
          , hours = time.getHours()
          , minutes = time.getMinutes()
          , seconds = time.getSeconds()
        
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.track', {
            time: time.toUTCString(),
            title: 'Test',
            url: 'test.html'
        })
        
        pwk.piwik.trackCalled.should.be.true
        pwk.piwik.trackCalls.should.equal(1)
        
        var payload = pwk.piwik.latestPayload
        payload.h.should.equal(hours)
        payload.m.should.equal(minutes)
        payload.s.should.equal(seconds)
    })
    
    it('Should send through campaign information if provided', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.track', {
            time: new Date(),
            title: 'Test',
            url: 'test.html',
            campaign: {
                name: 'Test Campaign',
                keyword: 'test'
            }
        })
        
        pwk.piwik.trackCalled.should.be.true
        pwk.piwik.trackCalls.should.equal(1)
        
        var payload = pwk.piwik.latestPayload
        payload._rcn.should.equal('Test Campaign')
        payload._rck.should.equal('test')
    })
    
    it('Should encode custom variables properly', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        var custom = {
            "1": ['Test', 'value'],
            "2": ['Another', 'test']
        }
        
        socket.send('piwik.track', {
            title: 'Test',
            url: 'test.html',
            custom: custom
        })
        
        pwk.piwik.trackCalled.should.be.true
        pwk.piwik.trackCalls.should.equal(1)
        
        var payload = pwk.piwik.latestPayload
        payload.cvar.should.exist
        payload.cvar.should.equal(JSON.stringify(custom))
    })
})