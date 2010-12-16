# A JavaScript stemming library

This is an implementation of the Porter2 stemming algorithm in JavaScript, currently for English, French and German.

## Example

	var tokenizer = require('./../lib/tokenizer.js'),
	        words = tokenizer('The quick brown fox jumps over the lazy dog'),
	      frWords = tokenizer('Servez à ce monsieur une bière et des kiwis', 'fr');