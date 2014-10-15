'use strict';

var helper = require('../helper')
  , should = require('should')
  , mockery = require('mockery')
  , PiwikTracker = require('../utils/piwik-tracker')

/* jshint -W030 */
describe('Piwik Tracking API - piwik.search', function() {
    
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
    
    it('Should not send a tracking request if search.term is missing', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.search', {
            time: new Date(),
            title: 'Test',
            url: 'test.html'
        })
        
        pwk.piwik.trackCalled.should.be.false
        pwk.piwik.trackCalls.should.equal(0)
    })
    
    it('Should send through the search term when provided', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.search', {
            time: new Date(),
            title: 'Test',
            url: 'test.html',
            search: {
                term: 'test'
            }
        })
        
        pwk.piwik.trackCalled.should.be.true
        pwk.piwik.trackCalls.should.equal(1)
        
        var payload = pwk.piwik.latestPayload
        payload.search.should.exist
        payload.search.should.equal('test')
    })
    
    it('Should send through the search category when provided', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.search', {
            time: new Date(),
            title: 'Test',
            url: 'test.html',
            search: {
                term: 'test',
                category: 'test'
            }
        })
        
        pwk.piwik.trackCalled.should.be.true
        pwk.piwik.trackCalls.should.equal(1)
        
        var payload = pwk.piwik.latestPayload
        payload.search.should.exist
        payload.search.should.equal('test')
        payload.search_cat.should.exist
        payload.search_cat.should.equal('test')
    })
    
    it('Should send through the search results count when provided', function() {
        var pwk = new Piwik(socket, helper.getPiwikOptions(socket))
        
        socket.send('piwik.search', {
            time: new Date(),
            title: 'Test',
            url: 'test.html',
            search: {
                term: 'test',
                category: 'test',
                count: 2
            }
        })
        
        pwk.piwik.trackCalled.should.be.true
        pwk.piwik.trackCalls.should.equal(1)
        
        var payload = pwk.piwik.latestPayload
        payload.search.should.exist
        payload.search.should.equal('test')
        payload.search_cat.should.exist
        payload.search_cat.should.equal('test')
        payload.search_count.should.exist
        payload.search_count.should.equal(2)
    })
})