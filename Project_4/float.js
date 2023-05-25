function encode(NUM) {
	if (isNaN(Number(NUM))) {
		console.log(`[-] Invalid data: "${NUM}" is not a number!`);
		process.exit(1);
	}
	let bits = new Array(32).fill(0);
	bits[0] = NUM >= 0 ? 0 : 1;

	let p = Math.floor(Math.log2(Math.abs(NUM)));
	let m;
	if (p < -126) {
		m = Math.abs(NUM) / 2**(-126);
		p = 0;
	} else {
		m = Math.abs(NUM) / 2.0**p - 1;
		p += 127;
	}

	if (!isFinite(p)) {
		return "7FFFFFF";
	}

	let t;

	if (p > 254) {
		for (let i = 1; i < 9; i++) {
			bits[i] = 1;
		}
	} else {
		t = 8;
		while (p) {
			bits[t--] = p % 2;
			p = p / 2 | 0;
		}
		let i = 9;
		for (const n of m.toString(2).slice(2)) {
			bits[i++] = n;
			if (i == 32){
				break;
			}
		}
	}
	let res = "";

	for (let i = 0; i < 32; i += 4) {
		t = ""
		for (const DIG of bits.slice(i, i + 4)) {
			t += DIG;
		}
		res += parseInt(t, 2).toString(16);
	}
	
	return res.toUpperCase();
}

function decode(STR) {
	let t16;
	let bits = "";
	for (const DIGIT of STR) {
		t16 = parseInt(DIGIT, 16).toString(2);
		bits += "0".repeat(4 - t16.length) + t16;
	}

	// NaN?, Inf?, -Inf?
	if (bits.slice(1, 9) === "1".repeat(8)) {
		if (bits.slice(9, 32) === "0".repeat(23))
			return bits[0] == 0 ? Infinity : -Infinity;
		return NaN;
	}

	const SGN = bits[0] == 0 ? 1 : -1;
	let P = parseInt(bits.slice(1, 9), 2) - 127;
	

	let M = 0;
	for (let i = 1; i < 24; i++) {
		M += bits[8 + i] * 2**(-i);
	}
	
	if (P === -127) return SGN * 2**(-126) * M;
	return SGN * 2**P * (M + 1);
}

(function main() {
	const MODE = process.argv[2];
	const NUMBER = process.argv[3];
	if (MODE === "-h" || MODE === "--help") {
		console.log(`MODE:`);
		console.log(`-h or --help:\tshow this page.`);
		console.log(`-e or --encode:\tconvert float to binary.`);
		console.log(`-d or --decode:\tconvert binary to float.`);
		console.log(`-t or --test:\tconvert float to bin, then bin to float.`)
		return;
	}
	if (MODE === "-e" || MODE === "--encode") {
		console.log(encode(NUMBER));
		return;
	}
	if (MODE === "-d" || MODE === "--decode") {
		console.log(decode(NUMBER));
		return;
	}
	if (MODE === "-t" || MODE === "--test") {
		let test = encode(NUMBER);
		console.log(test);
		test = decode(test);
		console.log(test);
		return;
	}
	console.log("[-] Invalide mode. Try -h to help");
})();