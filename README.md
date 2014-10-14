piwik-socket
===============

An event emitter interface to [Piwik](https://piwik.org).

## Build status

[![Build Status](https://travis-ci.org/surevine/piwik-socket.svg?branch=master)](https://travis-ci.org/surevine/piwik-socket) 

[![Coverage Status](https://img.shields.io/coveralls/surevine/piwik-socket.svg)](https://coveralls.io/r/surevine/piwik-socket)

## Coding Standards

Checkstyle is used to confirm the preferred coding standards are used, these are based loosely on Google's OS Java guidelines.  There is support in maven, the build should fail on the introduction of errors and there is also support for automated formatting in Eclipse.  To setup do the following -

* Navigate to Eclipse->Preferences->Java ->Code Style->Formatter
* Select 'import' and there is a file named 'eclipse_formatter.xml' in src/main/resources.
* Import and set it as the active profile