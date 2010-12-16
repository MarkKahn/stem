var languages = ['en', 'de', 'fr'];

languages.forEach(function(lang){
	console.log('Testing ' + lang);
	var words = require('./' + lang + '_vocab'),
	     stem = require('./../' + lang),
	    start = Date.now();

	for(var i=0, l=words.length; i<l; i++){
		if(stem(words[i][0]) != words[i][1]){
			console.log(words[i][0] + ' failed.  Stemmed as ' + stem(words[i][0]) + '.  Should be ' + words[i][1]);
			break;
		}
	}
	if(i===l){
		console.log(lang + ' passed -- ' + ((Date.now() - start) / words.length) + 'ms per word avg');
		console.log('');
	}
});