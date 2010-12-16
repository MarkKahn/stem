// implemented from algorithm at http://snowball.tartarus.org/algorithms/french/stemmer.html

function ifIn(ix, word, sfx, ifTrue, ifFalse){
	var toExec = [].concat((word.substr(ix).substr(-sfx.length) === sfx) ? ifTrue || [] : ifFalse || []);

	for(var i=0, l=toExec.length; i<l; i++){
		if(typeof(toExec[i]) == 'function'){
			word = toExec[i](word);
		}else{
			word = word.substr(0, word.length - sfx.length) + (toExec[i] == 'delete' ? '' : toExec[i]);
		}
	}

	return word;
}

module.exports = function(word){
	var eRx = ['', ''];

	word = word.toLowerCase().replace(/[^a-zâàçëéêèïîôûùü]/g, '').replace(/([aeiouyâàëéêèïîôûù])y|y([aeiouyâàëéêèïîôûù])/g, '$1Y$2').replace(/([aeiouyâàëéêèïîôûù])u([aeiouyâàëéêèïîôûù])/g, '$1U$2').replace(/qu/g, 'qU').replace(/([aeiouyâàëéêèïîôûù])i([aeiouyâàëéêèïîôûùq])/g, '$1I$2');

	var RV = /^(par|col|tap)/.test(word) || /^[aeiouyâàëéêèïîôûù][aeiouyâàëéêèïîôûù]/.test(word) ? 3 : ((/[aeiouyâàëéêèïîôûù]/.exec(' ' + word.substr(1)) || eRx).index || 1000) + 1;

	var R1 = ((/[aeiouyâàëéêèïîôûù][^aeiouyâàëéêèïîôûù]/.exec(' '+word) || eRx).index || 1000) + 1,
	    R2 = (((/[aeiouyâàëéêèïîôûù][^aeiouyâàëéêèïîôûù]/.exec(' '+word.substr(R1)) || eRx).index || 1000)) + R1 + 1,
	  doS2 = false,
	         changed, oWord, res;


	// step 1
	oWord = word;
	var sfx = /(?:(ances?|iqUes?|ismes?|ables?|istes?|eux)|(at(?:rice|eur|ion)s?)|(logies?)|(u[st]ions?)|(ences?)|(ements?)|(ités?)|(ifs?|ives?)|(eaux)|(aux)|(euses?)|(issements?)|(amment)|(emment)|(ments?))$/.exec(word) || eRx;

	// ance|iqUe|isme|able|iste|eux|ances|iqUes|ismes|ables|istes
	if(sfx[1]){
		word = ifIn(R2, word, sfx[1], 'delete');

	// atrice|ateur|ation|atrices|ateurs|ations
	}else if(sfx[2]){
		word = ifIn(R2, word, sfx[2], ['delete', function(word){
			if(/ic$/.test(word)){
				return ifIn(R2, word, 'ic', 'delete', 'iqU');
			}
			return word;
		}]);

	// logie|logies
	}else if(sfx[3]){
		word = ifIn(R2, word, sfx[3], 'log');

	// usion|ution|usions|utions
	}else if(sfx[4]){
		word = ifIn(R2, word, sfx[4], 'u');

	// ence|ences
	}else if(sfx[5]){
		word = ifIn(R2, word, sfx[5], 'ent');

	// ement|ements
	}else if(sfx[6]){
		word = ifIn(RV, word, sfx[6], ['delete', function(word){
			return /ativ$/.test(word.substr(R2)) ? ifIn(R2, word, 'ativ', 'delete')
				: /iv$/.test(word) ? ifIn(R2, word, 'iv', 'delete')
				: /eus$/.test(word) ? ifIn(R2, word, 'eus', 'delete', function(word){
					return ifIn(R1, word, 'eus', 'eux');
				})
				: (res = /(abl|iqU)$/.exec(word)) ? ifIn(R2, word, res[1], 'delete')
				: (res = /(ièr|Ièr)$/.exec(word)) ? ifIn(RV, word, res[1], 'i')
				: word;
		}]);

	// ité|ités
	}else if(sfx[7]){
		word = ifIn(R2, word, sfx[7], ['delete', function(word){
			return (/abil$/.test(word) ? ifIn(R2, word, 'abil', 'delete', 'abl')
				: /ic$/.test(word) ? ifIn(R2, word, 'ic', 'delete', 'iqU')
				: /iv$/.test(word) ? ifIn(R2, word, 'iv', 'delete')
				: word);
		}]);

	// if|ive|ifs|ives
	}else if(sfx[8]){
		word = ifIn(R2, word, sfx[8], ['delete', function(word){
			return (/at$/.test(word) ? ifIn(R2, word, 'at', ['delete', function(word){
				return (/ic$/.test(word) ? ifIn(R2, word, 'ic', 'delete', 'iqU') : word);
			}]) : word);
		}]);

	// eaux
	}else if(sfx[9]){
		word = word.replace(/eaux$/, 'eau');

	// aux
	}else if(sfx[10]){
		word = ifIn(R1, word, 'aux', 'al');

	// euse|euses
	}else if(sfx[11]){
		word = ifIn(R2, word, sfx[11], 'delete', function(word){
			return ifIn(R1, word, sfx[11], 'eux');
		});

	// issement|issements
	}else if(sfx[12]){
		if(/[^aeiouyâàëéêèïîôûù](issements?)$/.test(word)){
			word = ifIn(R1, word, sfx[12], 'delete');
		}

	// amment
	}else if(sfx[13]){
		word = ifIn(RV, word, sfx[13], 'ant');
		doS2 = true;

	// emment
	}else if(sfx[14]){
		word = ifIn(RV, word, sfx[14], 'ent');
		doS2 = true;
	
	// ment|ments
	}else if(sfx[15]){
		if(/[aeiouyâàëéêèïîôûù]ments?$/.test(word.substr(RV))){
			word = word.substr(0, word.length - sfx[15].length);
		}
		doS2 = true;

	}
	changed = (word != oWord);
	if(!changed){ doS2 = true; }


	// step 2a
	if(doS2){
		oWord = word;
		var res = /[^aeiouyâàëéêèïîôûù](îmes|ît|îtes|ie?s?|ira?|iraIent|irai[st]?|iras|irent|iri?ez|iri?ons|iront|issaIent|issai[st]|issante?s?|isses?|issent|issi?ez|issi?ons|it)$/.exec(word.substr(RV));
		if(res){
			word = word.substr(0, word.length - res[1].length);
			doS2 = false;
		}
		changed = (word != oWord);
	}


	// step 2b
	if(doS2){
		oWord = word;
		var res = (/(?:(ions)|(ée?s?|èrent|era?|eraIent|erai[st]?|eras|eri?ez|eri?ons|eront|i?ez)|(â[mt]es|ât|ai?s?|aIent|ait|ante?s?|asse|assent|asses|assiez|assions))$/.exec(word.substr(RV)) || eRx);

		// ions
		if(res[1]){
			word = ifIn(R2, word, res[1], 'delete');

		// é|ée|ées|és|èrent|er|era|erai|eraIent|erais|erait|eras|erez|eriez|erions|erons|eront|ez|iez
		}else if(res[2]){
			word = word.substr(0, word.length - res[2].length);

		// âmes|ât|âtes|a|ai|aIent|ais|ait|ant|ante|antes|ants|as|asse|assent|asses|assiez|assions
		}else if(res[3]){
			word = word.substr(0, word.length - res[3].length);
			if(/e$/.test(word.substr(RV))){ word = word.substr(0, word.length - 1); }
		}
		changed = (word != oWord);
	}


	// step 3
	if(changed){
		if(/Y$/.test(word)){
			word = word.substr(0, word.length - 1) + 'i';
		}else if(/ç$/.test(word)){
			word = word.substr(0, word.length - 1) + 'c';
		}


	// step 4
	} else {
		if(/[^aiouès]s$/.test(word)){
			word = word.substr(0, word.length - 1);
		}

		res = (/(?:[st](ion)|(ier|ière|Ier|Ière)|(e)|gu(ë))$/.exec(word.substr(RV)) || eRx);

		// ion
		if(res[1]){
			word = ifIn(R2, word, 'ion', 'delete');

		// ier|ière|Ier|Ière
		}else if(res[2]){
			word = word.substr(0, word.length - res[2].length) + 'i';

		// e
		// ë
		}else if(res[3] || res[4]){
			word = word.substr(0, word.length - 1);
		}
	}


	// step 5
	if(/(enn|onn|ett|ell|eill)$/.test(word)){
		word = word.substr(0, word.length - 1);
	}


	// step 6
	if(res = /[é|è]([^aeiouyâàëéêèïîôûù]+)$/.exec(word)){
		word = word.substr(0, word.length - res[0].length) + 'e' + res[1];
	}

	return word.toLowerCase();
}