/*
 * grunt-contrib-jshint
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

// External libs.
var jshint = require('jshint').JSHINT,
    hint = require('../../node_modules/jshint/lib/hint').hint;

exports.init = function(grunt) {
  var exports = {},
      reporter = require( './grunt-reporter' ).init(grunt).reporter;

  exports.hint = function(targets, config, ignore, extraExtensionList) {
    // Lint.
    var result = hint(targets, config, reporter, ignore, extraExtensionList);

    if (result) {
      // Success!
      grunt.verbose.ok();
      return;
    }
    // Something went wrong.
    grunt.log.error();

    grunt.log.writeln();
  }

  return exports;
};
