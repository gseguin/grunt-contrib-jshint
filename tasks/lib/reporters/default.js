'use strict';

module.exports = function(results, data) {
	var out = '',
		file;
	results.forEach( function(w) {
		var e = w.error;
		// Sometimes there's no error object.
		if (!e) { return; }
		var pos;
		var evidence = e.evidence;
		var character = e.character;
        if ( file != w.file ) {
            file = w.file;
            out = 'Linting ' + file + '...' + 'ERROR'.red + '\n';
        }
		if (evidence) {
			// Descriptive code error.
			pos = '['.red + ('L' + e.line).yellow + ':'.red + ('C' + character).yellow + ']'.red;
			out += pos + ' ' + e.reason.yellow + '\n';
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