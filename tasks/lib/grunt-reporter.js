exports.init = function( grunt ) {
	"use strict";
	var exports = {},
        path = require( 'path' );


	exports.reporter = function( results, data ){
		var reporters = grunt.config.get('jshint.reporters') || [ 'default' ],
            errorCount = 0 ;

        results.forEach( function(w) {
            var e = w.error;
            // Sometimes there's no error object.
            if (!e) { return; }
            var evidence = e.evidence;
            if (evidence) {
-               errorCount++;
            }
        });
        grunt.fail.errorcount = errorCount;


		reporters.forEach( function( item ){
            var reporter;
            grunt.log.debug( 'Current directory: ' + process.cwd() );
            if ( typeof item === 'function' ) {
                reporter = item;
            } else if ( typeof item === 'string' ) {
                reporter = require( './reporters/' + item );
            } else {
                reporter = require( './reporters/' + item.name );
            }

			var report = reporter( results, data );
			if ( item.dest ) {
				grunt.file.write( item.dest, report);
			} else {
                grunt.log.write( report );
                grunt.log.writeln();                    
			}
		});
	};

	return exports;
};