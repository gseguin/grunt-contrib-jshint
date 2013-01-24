exports.init = function(grunt) {
	"use strict";
	var exports = {},
		pathToReporters = '../../node_modules/jshint/lib/reporters/',
		_reporters,
		tabregex = /\t/g;



	function defaultReporter(results, data) {
		var out = '';
		results.forEach( function(w) {
			var e = w.error;
			// Sometimes there's no error object.
			if (!e) { return; }
			var pos;
			var evidence = e.evidence;
			var character = e.character;
			if (evidence) {
				// Manually increment errorcount since we're not using grunt.log.error().
				grunt.fail.errorcount++;
				// Descriptive code error.
				pos = '['.red + ('L' + e.line).yellow + ':'.red + ('C' + character).yellow + ']'.red;
				out = pos + ' ' + e.reason.yellow + '\n';
				if (character === 0) {
					// Beginning of line.
					evidence = '?'.inverse.red + evidence;
				} else if (character > evidence.length) {
					// End of line.
					evidence = evidence + ' '.inverse.red;
				} else {
					// Middle of line.
					evidence = evidence.slice(0, character - 1) + evidence[character - 1].inverse.red +
					evidence.slice(character);
				}
				out += evidence + '\n';
			} else {
				// Generic "Whoops, too many errors" error.
				out = e.reason;
			}
		});
		return out;
	}

	function checkstyleReporter(results, data) {
        var files = {},
            out = [],
            pairs = {
                "&": "&amp;",
                '"': "&quot;",
                "'": "&apos;",
                "<": "&lt;",
                ">": "&gt;"
            },
            file, fileName, i, issue, globals, unuseds;

        function encode(s) {
            for (var r in pairs) {
                if (typeof(s) !== "undefined") {
                    s = s.replace(new RegExp(r, "g"), pairs[r]);
                }
            }
            return s || "";
        }

        results.forEach(function (result) {
            // Register the file
            result.file = result.file.replace(/^\.\//, '');
            if (!files[result.file]) {
                files[result.file] = [];
            }

            // Add the error
            files[result.file].push({
                severity: 'error',
                line: result.error.line,
                column: result.error.character,
                message: result.error.reason,
                source: result.error.raw
            });
        });

        data.forEach(function (result) {
            file = data.file;
            globals = result.implieds;
            unuseds = result.unused;

            // Register the file
            result.file = result.file.replace(/^\.\//, '');
            if (!files[result.file]) {
                files[result.file] = [];
            }

            if (globals) {
                globals.forEach(function (global) {
                    files[result.file].push({
                        severity: 'warning',
                        line: global.line,
                        column: 0,
                        message: "Implied global '" + global.name + "'",
                        source: 'jshint.implied-globals'
                    });
                });
            }
            if (unuseds) {
                unuseds.forEach(function (unused) {
                    files[result.file].push({
                        severity: 'warning',
                        line: unused.line,
                        column: 0,
                        message: "Unused variable: '" + unused.name + "'",
                        source: 'jshint.implied-unuseds'
                    });
                });
            }
        });

        out.push("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
        out.push("<checkstyle version=\"4.3\">");

        for (fileName in files) {
            if (files.hasOwnProperty(fileName)) {
                out.push("\t<file name=\"" + fileName + "\">");
                for (i = 0; i < files[fileName].length; i++) {
                    issue = files[fileName][i];
                    out.push(
                        "\t\t<error " +
                            "line=\"" + issue.line + "\" " +
                            "column=\"" + issue.column + "\" " +
                            "severity=\"" + issue.severity + "\" " +
                            "message=\"" + encode(issue.message) + "\" " +
                            "source=\"" + encode(issue.source) + "\" " +
                            "/>"
                    );
                }
                out.push("\t</file>");
            }
        }

        out.push("</checkstyle>");
        return out.join("\n") + "\n";
	}

	_reporters = {
		default: defaultReporter,
		checkstyle: checkstyleReporter
	};

	exports.reporter = function(results, data){
		var reporters = grunt.config.get('jshint.reporters') || [{name: 'default'}];
		reporters.forEach(function(reporter){
			var report = _reporters[ reporter.name ]( results, data );
			if ( reporter.fileName ) {
				grunt.file.write(reporter.fileName, report);
			} else {
				grunt.log.write(report);
				grunt.log.writeln();
			}
		});

		// process.stdout.write = grunt.log.write;
        //reporters.checkstyle.reporter(results, data);
        // process.stdout = stdout;
	};

	return exports;
};