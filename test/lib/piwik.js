'use strict';

var helper = require('../helper')
  , should = require('should')
  , mockery = require('mockery')
  , PiwikTracker = require('../utils/piwik-tracker')

/* jshint -W030 */
describe('Piwik Tracking API', function() {
    
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
    
    it('Should call track', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.event', {})
        
        pwk.piwik.trackCalled.should.be.true
        pwk.piwik.trackCalls.should.equal(1)
    })
    
    it('Should send through the correct IP address', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.event', {
            time: new Date(),
            title: 'Test',
            url: 'test.html'
        })
        
        pwk.piwik.trackCalled.should.be.true
        pwk.piwik.trackCalls.should.equal(1)
        pwk.piwik.latestPayload.cip.should.equal('127.0.0.1')
    })
})

