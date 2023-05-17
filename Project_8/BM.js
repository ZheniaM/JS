function bm_search(str, substr) {
	const N = str.length;
	const M = substr.length;
	const ALFABET = new Set(substr.split(""))
	const badSym = new Array();
	const goodSuffix = new Array(M+1).fill(0);

	let suffix = "";
	for (let i = M - 1; i >= 0; i--) {
		let sub = substr.slice(0, i);
		let row = {};
		for (const SYM of ALFABET) {
			if (SYM === substr[i]) {
				row[SYM] = undefined;
				continue;
			}
			row[SYM] = i - sub.lastIndexOf(SYM);
		}
		badSym.push(row);

		suffix = substr[i] + suffix;
		let subsubstr = substr.slice(0, i);
		let index = subsubstr.lastIndexOf(suffix);
		if (index !== -1) {
			goodSuffix[i] = i - index;
			continue;
		}
		goodSuffix[i] = goodSuffix[i+1];
		if (goodSuffix[i] === 0) {
			goodSuffix[i] = M;
		}
	}
	console.log(badSym);
	goodSuffix[M] = 1;
	let res = [];
	let i = 0;
	while (i <= N - M) {
		let j = M - 1;
		while (j >= 0 && substr[j] === str[i+j]) {
			j--;
		}
		if (j !== -1) {
			let indent = badSym[M-j-1][str[i+j]];
			if (indent === undefined) {
				indent = j
			}
			i += Math.max(1, indent, goodSuffix[j+1]);
			continue;
		}
		res.push(i);
		i += Math.max(1, goodSuffix[0]);
	}
	return res;
}

function bad_search(str, substr) {
	const N = str.length;
	const M = substr.length;
	const badSym = new Map();
	for (let i = 0; i < M; i++) {
		badSym.set(substr[i], i);
	}
	let res = [];
	let i = 0;

	while (i <= N - M) {
		let j = M - 1;
		while (j >= 0 && substr[j] === str[i + j]) {
			j--;
		}
		if (j !== -1) {
			const indent = badSym.get(str[i + j]) ?? -1;
			i += Math.max(1, j - indent);
			continue;
		}
		res.push(i);
		i += M - (badSym.get(str[i+M]) ?? -1);
	}
	return res;
}

function good_search(str, substr) {
	const N = str.length;
	const M = substr.length;
	let table = new Array(M + 1).fill(0);
	let suffix = "";

	for (let i = M - 1; i >= 0; i--) {
		suffix = substr[i] + suffix;
		let subsubstr = substr.slice(0, i);
		let index = subsubstr.lastIndexOf(suffix);
		if (index !== -1) {
			table[i] = i - index;
			continue;
		}
		table[i] = table[i+1];
		if (table[i] === 0) {
			table[i] = M;
		}
	}
	table[M] = 1

	let res = [];
	let i = 0;
	while (i <= N - M) {
		let j = M - 1;
		while (j >= 0 && substr[j] === str[i+j]) {
			j--;
		}
		if (j !== -1) {
			i += table[j+1];
			continue;
		}
		res.push(i);
		i += table[0];
	}
	return res;
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
		//console.error("\x1b[31m[-] neq: length");
		return false;
	}
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			//console.error("\x1b[31m[-] neq: elements")
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

	for (let P of PATTERNS) {
		P = P.split("\x0D")[0];
		console.log('\x1b[35m%s\x1b[0m', P); // magenta color

		console.time("   BM");
		let bm = bm_search(S, P);
		console.timeEnd("   BM");

		console.time("  bad");
		let bad = bad_search(S, P);
		console.timeEnd("  bad");

		console.time(" good");
		let good = good_search(S, P);
		console.timeEnd(" good");

		console.time("brute");
		let brute = brutforse(S, P);
		console.timeEnd("brute");

		console.log("\x1b[33mEquality of brute whith: "
					+ (eq(bm, brute) ? "\x1b[32m" : "\x1b[31m") + "BM\x1b[0m, "
					+ (eq(bad, brute) ? "\x1b[32m" : "\x1b[31m") + "bad symbol\x1b[0m, "
					+ (eq(good, brute) ? "\x1b[32m" : "\x1b[31m") + "good suffix\x1b[0m\n");
	}
});
/*
let str = "abbaaababbabb"; // 0, 7
let substr = "abba";
console.log(bad_search(str, substr));
console.log(good_search(str, substr));
console.log(brutforse(str, substr));
console.log("done");
console.log(good_suffix(substr));
beuler_mur_search(str, substr);
*/
let str = "ABAC"
bm_search(str, str);