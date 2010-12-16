// implemented from algorithm at http://snowball.tartarus.org/algorithms/english/stemmer.html

var exceptions = {
	skis    : 'ski'   ,
	skies   : 'sky'   ,
	dying   : 'die'   ,
	lying   : 'lie'   ,
	tying   : 'tie'   ,
	idly    : 'idl'   ,
	gently  : 'gentl' ,
	ugly    : 'ugli'  ,
	early   : 'earli' ,
	only    : 'onli'  ,
	singly  : 'singl' ,
	sky     : 'sky'   ,
	news    : 'news'  ,
	howe    : 'howe'  ,
	atlas   : 'atlas' ,
	cosmos  : 'cosmos',
	bias    : 'bias'  ,
	andes   : 'andes'

}, exceptions1a = {
	inning  : 'inning' ,
	outing  : 'outing' , 
	canning : 'canning',
	herring : 'herring',
	earring : 'earring',
	proceed : 'proceed',
	exceed  : 'exceed' ,
	succeed : 'succeed'

}, extensions2 = {
	ization : 'ize' , 
	fulness : 'ful' , 
	iveness : 'ive' , 
	ational : 'ate' , 
	ousness : 'ous' ,  
	tional  : 'tion', 
	biliti  : 'ble' , 
	lessli  : 'less', 
	entli   : 'ent' , 
	ation   : 'ate' , 
	alism   : 'al'  , 
	aliti   : 'al'  , 
	ousli   : 'ous' , 
	iviti   : 'ive' , 
	fulli   : 'ful' , 
	enci    : 'ence', 
	anci    : 'ance', 
	abli    : 'able', 
	izer    : 'ize' , 
	ator    : 'ate' , 
	alli    : 'al'  , 
	bli     : 'ble' , 
	ogi     : 'og'  , 
	li      : ''
};

module.exports = function(word){
	if(word.length < 3){ return word; }
	if(exceptions[word]){ return exceptions[word]; }

	var eRx = ['', ''],
	   word = word.toLowerCase().replace(/^'/, '').replace(/[^a-z']/g, '').replace(/^y|([aeiouy])y/g, '$1Y'),
	          R1, res;

	if(res = /^(gener|commun|arsen)/.exec(word)){
		R1 = res[0].length;
	}else{
		R1 = ((/[aeiouy][^aeiouy]/.exec(' '+word) || eRx).index || 1000) + 1;
	}

	var R2 = (((/[aeiouy][^aeiouy]/.exec(' '+word.substr(R1)) || eRx).index || 1000)) + R1 + 1;


	// step 0
	word = word.replace(/('s'?|')$/, '');


	// step 1a
	rx = /(?:(ss)es|(..i)(?:ed|es)|(us)|(ss)|(.ie)(?:d|s))$/;
	if(rx.test(word)){
		word = word.replace(rx, '$1$2$3$4$5');
	}else{
		word = word.replace(/([aeiouy].+)s$/, '$1');
	}

	if(exceptions1a[word]){ return exceptions1a[word]; }

	// step 1b
	var s1 = (/(eedly|eed)$/.exec(word) || eRx)[1],
	    s2 = (/(?:[aeiouy].*)(ingly|edly|ing|ed)$/.exec(word) || eRx)[1];

	if(s1.length > s2.length){
		if(word.indexOf(s1, R1)>=0){
			word = word.substr(0, word.length - s1.length) + 'ee';
		}
	}else if(s2.length > s1.length){
		word = word.substr(0, word.length - s2.length);
		if(/(at|bl|iz)$/.test(word)){
			word += 'e';
		}else if(/(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/.test(word)){
			word = word.substr(0, word.length - 1);
		}else if(!word.substr(R1) && /([^aeiouy][aeiouy][^aeiouywxY]|^[aeiouy][^aeiouy]|^[aeiouy])$/.test(word)){
			word += 'e';
		}
	}


	// step 1c
	word = word.replace(/(.[^aeiouy])[yY]$/, '$1i');


	// step 2
	var sfx = /(ization|fulness|iveness|ational|ousness|tional|biliti|lessli|entli|ation|alism|aliti|ousli|iviti|fulli|enci|anci|abli|izer|ator|alli|bli|l(ogi)|[cdeghkmnrt](li))$/.exec(word);
	if(sfx){
		sfx  = sfx[3] || sfx[2] || sfx[1];
		if(word.indexOf(sfx, R1) >= 0){
			word = word.substr(0, word.length - sfx.length) + extensions2[sfx];
		}
	}


	// step 3
	var sfx = (/(ational|tional|alize|icate|iciti|ative|ical|ness|ful)$/.exec(word) || eRx)[1];
	if(sfx && (word.indexOf(sfx, R1) >= 0)){
		word = word.substr(0, word.length - sfx.length) + {
			ational : 'ate',
			tional  : 'tion',
			alize   : 'al',
			icate   : 'ic',
			iciti   : 'ic',
			ative   : ((word.indexOf('ative', R2) >= 0) ? '' : 'ative'),
			ical    : 'ic',
			ness    : '',
			ful     : ''
		}[sfx];
	}


	// step 4
	var sfx = /(ement|ance|ence|able|ible|ment|ant|ent|ism|ate|iti|ous|ive|ize|[st](ion)|al|er|ic)$/.exec(word);
	if(sfx){
		sfx = sfx[2] || sfx[1];
		if(word.indexOf(sfx, R2) >= 0){
			word = word.substr(0, word.length - sfx.length);
		}
	}


	// step 5
	if(word.substr(-1) == 'e'){
		if(word.substr(R2) || (word.substr(R1) && !(/([^aeiouy][aeiouy][^aeiouywxY]|^[aeiouy][^aeiouy])e$/.test(word)))){
			word = word.substr(0, word.length - 1);
		}
		
	}else if((word.substr(-2) == 'll') && (word.indexOf('l', R2) >= 0)){
		word = word.substr(0, word.length - 1);
	}

	return word.toLowerCase();
};