const SIGMA = new Array();
const G = new Object();

function read_file(path) {
	const fs = require("fs");
	try {
		return fs.readFileSync(path, "utf8");
	} catch {
		console.error(err);
	}
}

function fill_G_and_SIGMA(TEXT) {
	for (const SYM of TEXT) {
		G[SYM] ??= 0;
		G[SYM]++;
	}
	for (const SYM in G) {
		SIGMA.push(SYM);
		G[SYM] /= TEXT.length;
	}
}

function encrypt(str, s, SIGMA) {
	let enstr = "";
	let i;
	for (const SYM of str) {
		i = SIGMA.indexOf(SYM);
		i += s;
		while (i < 0) {
			i += SIGMA.length;
		}
		enstr += SIGMA[i%SIGMA.length];
	}
	return enstr;
}

function decrypt(enstr, G, SIGMA) {
	const L = {};
	for (const SYM of enstr) {
		L[SYM] ??= 0;
		L[SYM]++;
	}
	for (const SYM in L) {
		L[SYM] /= enstr.length;
	}

	const SSTAR = {};
	const ALEN = SIGMA.length;
	let sum;
	for (let s = 0; s < ALEN; s++) {
		sum = 0;
		for (let i = 0; i < ALEN; i++) {
			sum += (G[SIGMA[(i+s)%ALEN]] - (L[SIGMA[i]] ?? 0)) ** 2;
		}
		SSTAR[s] = sum;
	}

	let s;
	let m = Number.MAX_SAFE_INTEGER;
	for (const S in SSTAR) {
		if (SSTAR[S] < m) {
			s = S;
			m = SSTAR[S];
		}
	}
	s = Number(s);

	let str = "";
	let i;
	for (const SYM of enstr) {
		i = SIGMA.indexOf(SYM);
		i += s;
		str += SIGMA[i%ALEN];
	}
	return {
		str: str,
		s: s,
	};
}

(function main() {
	const FTEXT = process.argv[2];
	const TEXT = read_file(FTEXT);
	fill_G_and_SIGMA(TEXT);
	const FSTRINGS = process.argv[3];
	const STRINGS = read_file(FSTRINGS).split("\x0A");
	for (let STR of STRINGS) {
		STR = STR.split("\x0D")[0];
		console.log(`"${STR}"`);
		let enstr = encrypt(STR, 22, SIGMA);
		console.log(`"${enstr}"`);
		let destr = decrypt(enstr, G, SIGMA);
		console.log(destr.s);
		console.log(`"${destr.str}"`);
		console.log(STR === destr.str);
		console.log();
	}
})();