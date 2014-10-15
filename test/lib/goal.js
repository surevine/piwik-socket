'use strict';

var helper = require('../helper')
  , should = require('should')
  , mockery = require('mockery')
  , PiwikTracker = require('../utils/piwik-tracker')

/* jshint -W030 */
describe('Piwik Tracking API - piwik.goal', function() {
    
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
    
    it('Should not send a tracking request if goalId is missing', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.goal', {
            time: new Date(),
            title: 'Test',
            url: 'test.html'
        })
        
        pwk.piwik.trackCalled.should.be.false
        pwk.piwik.trackCalls.should.equal(0)
    })
    
    it('Should send through the goalId when provided', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.goal', {
            time: new Date(),
            title: 'Test',
            url: 'test.html',
            goalId: 1
        })
        
        pwk.piwik.trackCalled.should.be.true
        pwk.piwik.trackCalls.should.equal(1)
        
        var payload = pwk.piwik.latestPayload
        payload.idgoal.should.exist
        payload.idgoal.should.equal(1)
    })
})