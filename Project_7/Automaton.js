function find_substr_dfa(str, substr) {
	let alphabet = new Set(str.split(""));
	function make_dfa(str) {
		let table = [];
		let substring = "";
		for (let i = 0; i <= str.length; i++) {
			const row = {};
			symloop: for (let sym of alphabet) {
				let sub = substring + sym;
				const L = sub.length
				for (let k = 0; k < L; k++) {
					if (sub === str.slice(0, sub.length)) {
						row[sym] = sub.length;
						continue symloop;
					}
					sub = sub.slice(1);
				}
				row[sym] = 0;
			}
			substring += str[i];
			table.push(row);
		}
		return table;
	}

	let dfa = make_dfa(substr);
	let state = 0;
	const FINAL = dfa.length - 1;
	let result = [];
	for (let i = 0; i < str.length; i++) {
		if (state === FINAL) {
			result.push(i - FINAL + 1);
		}
		state = dfa[state][str[i]];
	}
	return result;
}

function brutforse(str, substr) {
	let res = [];
	const N = str.length;
	const M = substr.length;
	loop: for (let i = 0; i <= N - M; i++) {
		for (let j = 0; j < M; j++) {
			if (str[i + j] !== substr[j]) {
				continue loop;
			}
		}
		res.push(i);
	}
	return res;
}

function eq(arr1, arr2) {
	if (arr1.length !== arr2.length) {
		console.error("[-] neq: length");
		return false;
	}
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			console.error("[-] neq: elements")
			return false;
		}
	}
	return true;
}

function read_file(path) {
	const fs = require("fs");
	try {
		return fs.readFileSync(path, "utf8");
	} catch {
		console.error(err);
	}
}

(function main() {
	const TEXTFILE = process.argv[2];
	const SUBSFILE = process.argv[3];
	const S = read_file(TEXTFILE);
	const PATTERNS = read_file(SUBSFILE).split("\x0A");

	let testing = {
		dfa: 0,
		brute: 0,
	};
	for (let P of PATTERNS) {
		P = P.split("\x0D")[0];
		console.log(`"${P}"`);

		console.time("dfa");
		let start = new Date().getTime();
		let dfaRes = find_substr_dfa(S, P);
		let end = new Date().getTime();
		let time = end - start;
		console.timeEnd("dfa")

		console.time("brute");
		start = end;
		let bruteRes = brutforse(S, P);
		end = new Date().getTime();
		console.timeEnd("brute");
		console.log(eq(dfaRes, bruteRes));

		console.log();
		if (time <= end - start) {
			testing.dfa++;
		} else {
			testing.brute++;
		}
	}
	console.log(testing);
})();