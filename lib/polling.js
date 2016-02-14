// == BSD2 LICENSE ==
// Copyright (c) 2014, Tidepool Project
// 
// This program is free software; you can redistribute it and/or modify it under
// the terms of the associated License, which is identical to the BSD 2-Clause
// License as published by the Open Source Initiative at opensource.org.
// 
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the License for more details.
// 
// You should have received a copy of the License along with this program; if
// not, you can obtain one from Tidepool Project at tidepool.org.
// == BSD2 LICENSE ==

'use strict';

var log = require('./log.js')('amoeba/lib/polling.js');
var util = require('util');

/**
 * Runs function fn immediately and repeats it after delay millis.
 *  
 * Function is given a callback.  If the callback is called with an error
 * repetition will cease.  If the error is the String 'stop', then it will
 * do this silently, otherwise it will produce a log line using bunyan. The
 * callback must be called in order to schedule the next repetition.
 *
 * name - cosmetic, used for logging.
 * fn - the function to run
 * delay - delay in millis
 */
exports.repeat = function(name, fn, delay, unreference) {
  fn(function(err){
    if (err == null) {
      var future = setTimeout(function(){
        exports.repeat(name, fn, delay, unreference);
      }, delay);
      // Unit tests screw up if the setTimeout is unref'd, so have flag for it.
      if (unreference == null || unreference === true) {
        future.unref();
      }
    }
    else {
      if (err !== 'stop') {
        log.info('%s stopping because of error[%s]', name, util.inspect(err));
      }
    }
  });  
};

/**
 * Runs function fn after delay millis and repeats from there on.
 *
 * Function is given a callback.  If the callback is called with an error
 * repetition will cease.  If the error is the String 'stop', then it will
 * do this silently, otherwise it will produce a log line using bunyan. The
 * callback must be called in order to schedule the next repetition.
 *
 * name - cosmetic, used for logging.
 * fn - the function to run
 * delay - delay in millis
 */
exports.repeatAfterDelay = function(name, fn, delay, unreference) {
  var future = setTimeout(
    function(){
      fn(function(err){
        if (err == null) {
          exports.repeatAfterDelay(name, fn, delay, unreference);
        }
        else {
          if (err !== 'stop') {
            log.info('Job[%s] stopping because of error[%s]', name, util.inspect(err));
          }
          log.info('Job[%s] stopping', name);
        }
      });
    },
    typeof delay === 'function' ? delay() : delay
  );
  // Unit tests screw up if the setTimeout is unref'd, so have flag for it.
  if (unreference == null || unreference === true) {
    future.unref();
  }
};