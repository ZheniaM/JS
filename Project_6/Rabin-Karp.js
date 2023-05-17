const PRIME = 1_689_931;


function find_all_substr(str, substr) {
	let res = "";
	let hash = 0;
	let subHash = 0;
	const N = str.length;
	const M = substr.length;
	let colision = 0;

	function brutforse(strIndex) {
		for (let i = 0; i < M; i++) {
			if (str[strIndex+i] !== substr[i]) {
				colision++;
				return;
			}
		}	
		res += strIndex + " ";
	}

	for (let i = 0; i < M; i++) {
		subHash += substr.charCodeAt(i) << i;
		hash += str.charCodeAt(i) << i;
	}
	subHash %= PRIME;
	hash %= PRIME;

	for (let i = 0; i < N - M; i++) {
		if (hash === subHash) {
			brutforse(i);
		}
		hash -= str.charCodeAt(i) % PRIME;
		if (hash & 1) {
			hash += PRIME;
		}
		hash >>= 1;
		hash += str.charCodeAt(i + M) << (M - 1);
		hash %= PRIME;
	}

	if (hash === subHash) {
		brutforse(N - M);
	}

	return [res, colision];
}

function brutforse(str, substr) {
	let res = "";
	const N = str.length;
	const M = substr.length;
	loop: for (let i = 0; i <= N - M ; i++) {
		for (let j = 0; j < M; j++) {
			if (str[i + j] !== substr[j]) {
				continue loop;
			}
		}
		res += i + " ";
	}

	return res;
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
	let performanceNow = require("performance-now");
	const TEXTFILE = process.argv[2];
	const S = read_file(TEXTFILE);
	const SUBSTRINGFILE = process.argv[3];
	const SUBSTRs = read_file(SUBSTRINGFILE).split("\x0A");

	let start1, start2;
	let end1, end2;
	let a, b;
	let result = {
		Rabin_Karp: 0,
		Bruteforce: 0,
	}
	for (let P of SUBSTRs) {
		P = P.split("\x0D")[0];
		console.log(`"${P}"`);
		start1 = new Date().getTime(); 
		a = find_all_substr(S, P);
		end1 = new Date().getTime();
		console.log(`Rabin-Karp: ${end1 - start1}ms`);
		console.log(`colisoin: ${a[1]}`);

		start2 = new Date().getTime();
		b = brutforse(S, P);
		end2 = new Date().getTime();
		console.log(`Bruteforce: ${end2 - start2}ms`);

		console.log(a[0] === b, a[0].split("\x20").length - 1);
		let ind = Number(b.split("\x20")[0]);
		console.log(S.slice(ind, ind + P.length));
		console.log();

		if ((end1 - start1) <= (end2 - start2)){
			result.Rabin_Karp++;
		} else {
			result.Bruteforce++;
		}
	}
	console.log(result);
})();