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

var util = require('util');

function makeExceptionMaker(type)
{
  return function(message) {
    if (arguments.length > 1) {
      message = util.format.apply(null, [message].concat(Array.prototype.slice.call(arguments, 1)));
    }
    return new ExceptionMakerError(message, type);
  };
}

// Create a new object, that prototypally inherits from the Error constructor
function ExceptionMakerError(message, type) {
  this.message = message;
  this.type = type;
}
ExceptionMakerError.prototype = Object.create(Error.prototype);
ExceptionMakerError.prototype.constructor = ExceptionMakerError;

exports.IAE = makeExceptionMaker('IllegalArgumentException');
exports.ISE = makeExceptionMaker('IllegalStateException');
exports.RE = makeExceptionMaker('RuntimeException');