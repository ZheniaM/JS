const ENDSYM = "\0";

function encode(str) {
	let tree = (function make_tree(str) {
		let frequence = (function get_frequence(str) {
			let frequence = {};
			for (const SYM of str) {
				if (!frequence[SYM]) {
					frequence[SYM] = 1;
					continue;
				}
				frequence[SYM]++;
			}
			frequence[ENDSYM] = 1;
			return frequence;
		})(str);
		const NODES = [];
		for (const KEY in frequence) {
			NODES.push({
				left: null,
				right: null,
				frequence: frequence[KEY],
				value: KEY,
			});
		}
		while (NODES.length !== 1) {
			NODES.sort((a, b) => a.frequence - b.frequence);
			let left = NODES.shift(); // delite first and return it
			let right = NODES.shift();
			NODES.push({
				left: left,
				right: right,
				frequence: left.frequence + right.frequence,
				value: "",
			});
		}
		return NODES[0];
	})(str);

	let codes = (function get_codes(tree) {
		let codes = {};
		function helper(node, code) {
			if (node.value) {
				codes[node.value] = code;
				return;
			}
			helper(node.left, code + "0");
			helper(node.right, code + "1");
		}
		helper(tree, "");
		return codes;
	})(tree);

	let encodedStr = "";
	for (const SYM of str) {
		encodedStr += codes[SYM];
	}
	encodedStr += codes[ENDSYM];

	encodedStr = (function codes_to_bin(codes) {
		let str = "";
		let maxSize = Math.ceil(Math.log2(String(Math.max(...Object.values(codes))).length));
		let char;
		let codeSize;
		let size = 0;
		for (const SYM in codes) {
			size++;
			char = SYM.charCodeAt(0).toString(2);
			str += "0".repeat(8 - char.length) + char;
			codeSize = codes[SYM].length.toString(2);
			str += "0".repeat(maxSize - codeSize.length) + codeSize + codes[SYM];
		}
		maxSize = maxSize.toString(2);
		size = size.toString(2);
		str = "0".repeat(8 - size.length) + size + "0".repeat(8 - maxSize.length) + maxSize + str;
		return str;
	})(codes) + encodedStr;

	return (function make_symbol(str) {
		let hex = ""
		let char;
		if (str.length % 8 != 0) {
			str = str + "0".repeat(8 - str.length % 8);
		}
		for (let i = 0; i < str.length; i += 8) {
			char = parseInt(str.slice(i, i + 8), 2);
			hex += String.fromCharCode(char);
		}	
		return hex
	})(encodedStr);
}

function decode(enStr) {
	let decodedStr = "";

	let str = (function get_bin(str) {
		let bin = "";
		let char;
		for (const SYM of str) {
			char = SYM.charCodeAt(0).toString(2);
			bin += "0".repeat(8 - char.length) + char;
		}
		return bin;
	})(enStr);

	let codes = {};
	let char;
	let code;
	let codeSize;
	let maxSize = parseInt(str.slice(8, 16), 2);
	let i = 16;
	for (let j = 0; j < parseInt(str.slice(0, 8), 2); j++) {
		char = String.fromCharCode(parseInt(str.slice(i, i += 8), 2));
		codeSize = parseInt(str.slice(i, i += maxSize), 2);
		code = str.slice(i, i += codeSize);
		codes[code] = char;
	}

	str = str.slice(i);
	code = ""
	for (const SYM of str) {
		code += SYM;
		if (code in codes) {
			if (codes[code] === ENDSYM) {
				break;
			}
			decodedStr += codes[code];
			code = "";
		}
	}
	return decodedStr;
}

function read_file(path) {
	const fs = require("fs");
	try {
		return fs.readFileSync(path, "utf8");
	} catch {
		console.error(err);
	}
}

function write_file(path, str) {
	const fs = require("fs");
	try {
		fs.writeFileSync(path, str);
	} catch {
		console.error(err);
	}
}

function entrop(str){
	let res = 0;
	let a = (function alphabet(str){
		let res = {};
		for(let i = 0; i < str.length; i++){
			if(str[i] in res)
				res[str[i]]++;
			else 
				res[str[i]] = 1;
		}
		return res;
	})(str);
	let p;
	for (i in a){
		p = a[i]/str.length;
		res -= p * Math.log2(p);
	}
	return res;
}

(function main() {
	const STR = read_file("input.txt");
	const ENCODEDSTR = encode(STR);
	const DECODEDSTR = decode(ENCODEDSTR);

	write_file("encoded.txt", ENCODEDSTR);
	write_file("decoded.txt", DECODEDSTR);

	console.log("file entropy:   \t", entrop(STR));
	console.log("encoded entropy:\t", entrop(ENCODEDSTR));
	console.log("file length:    \t", STR.length);
	console.log("encoded length: \t", ENCODEDSTR.length);
	console.log("decoded length: \t", DECODEDSTR.length);
})();