'use strict';

var helper = require('../helper')
  , should = require('should')
  , mockery = require('mockery')
  , PiwikTracker = require('../utils/piwik-tracker')

/* jshint -W030 */
describe('Piwik Tracking API - piwik.event', function() {
    
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
    
    it('Should send through category, action, name & value if provided', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.event', {
            time: new Date(),
            title: 'Test',
            url: 'test.html',
            category: 'Test category',
            action: 'test_action',
            name: 'test_name',
            value: 'test_value'
        })
        
        pwk.piwik.trackCalled.should.be.true
        pwk.piwik.trackCalls.should.equal(1)
        
        var payload = pwk.piwik.latestPayload
        payload.category.should.equal('Test category')
        payload.action.should.equal('test_action')
        payload.name.should.equal('test_name')
        payload.value.should.equal('test_value')
    })
    
    it('Should not send through action if no category is provided', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.event', {
            time: new Date(),
            title: 'Test',
            url: 'test.html',
            action: 'Test category'
        })
        
        pwk.piwik.trackCalled.should.be.true
        pwk.piwik.trackCalls.should.equal(1)
        
        var payload = pwk.piwik.latestPayload
        
        should.not.exist(payload.category)
        should.not.exist(payload.action)
    })
    
    it('Should not send through name if no category is provided', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.event', {
            time: new Date(),
            title: 'Test',
            url: 'test.html',
            name: 'Test name'
        })
        
        pwk.piwik.trackCalled.should.be.true
        pwk.piwik.trackCalls.should.equal(1)
        
        var payload = pwk.piwik.latestPayload
        
        should.not.exist(payload.category)
        should.not.exist(payload.action)
        should.not.exist(payload.name)
    })
    
    it('Should not send through value if no category is provided', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.event', {
            time: new Date(),
            title: 'Test',
            url: 'test.html',
            value: 'test value'
        })
        
        pwk.piwik.trackCalled.should.be.true
        pwk.piwik.trackCalls.should.equal(1)
        
        var payload = pwk.piwik.latestPayload
        
        should.not.exist(payload.category)
        should.not.exist(payload.action)
        should.not.exist(payload.name)
        should.not.exist(payload.value)
    })
})