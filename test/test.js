'use strict'

var Piwik = require('../index')
  , helper = require('./helper')
  , should = require('should')
  , sinon = require('sinon')

var options = {
    //
}

describe('Piwik Tracking API', function() {
    var socket
    
    before(function() {
        socket = new helper.SocketEventer()
    })
    
    it('Should error if no siteId is provided', function() {
        (function() {
            var piwik = new Piwik(socket, {})
        }).should.throw(Error)
    })
    
    it('Should error if no trackerUrl is provided', function() {
        (function() {
            var piwik = new Piwik(socket, {siteId: 1})
        }).should.throw(Error)
    })
    
    it('Should accept a siteId and trackerUrl', function() {
        (function() {
            var piwik = new Piwik(socket, {
                siteId: 1,
                trackerUrl: 'http://www.example.com/piwik.php'
            })
        }).should.not.throw(Error)
    })
    
    it('Should call track', function() {
        var piwik = helper.getValidPiwik(socket)
        
        var stub = sinon.stub(piwik.piwik, 'track')
        socket.send('piwik.event', {})
        
        stub.callCount.should.equal(1)
    })
})

