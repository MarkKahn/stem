module.exports = function(str, lang){
	var words = str.replace(/[^a-zA-Z0-9\u00C0-\u00FF]+/g, ' ').split(' '),
	     lang = lang || 'en';

	var stem = require('./' + lang);
	for(var i=0, l=words.length; i<l; i++){ words[i] = stem(words[i]); }

	return words;
}