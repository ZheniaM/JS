function code(number) {
	let bin = number.toString(2);
	console.log(bin);
	let pCount = 0;
	while (2**pCount < bin.length + pCount + 1) {
		pCount++
	}
	let res = new Array(bin.length + pCount + 1);
	let p = 1;
	let j = 0;
	for (let i = 1; i < res.length; i++) {
		if (i == p) {
			p <<= 1;
			continue;
		}
		res[i] = Number(bin[j++]);
		res[0] ^= res[i];
	}
	for (let i = 1; i < res.length; i <<= 1) {
		for (let j = i + 1; j < res.length; j++) {
			if (i & j) {
				res[i] ^= res[j];
			}
		}
		res[0] ^= res[i];
	}
	return res.join("");
}

function decode(bin) {
	console.log(bin + "\n");
	bin = String(bin).split("");
	let allP = [bin[0]];
	let pPosicion = 1;
	let p = 0;
	for (let i = 1; i < bin.length; i++) {
		allP[0] ^= bin[i];
		if (i != pPosicion) {
			continue;
		}
		pPosicion <<= 1;
		allP.push(0);
		p++
		for (let j = i; j < bin.length; j++) {
			if (j & i) {
				allP[p] ^= bin[j];
			}
		}
	}
	if (allP.includes(1, 1)) {
		if (!allP[0]) {
			console.log("[-] to many errors");
			return NaN;
		}
		let pos = parseInt(allP.splice(1).reverse().join(""), 2);
		if (bin[pos] == 1) {
			bin[pos] = 0;
		} else {
			bin[pos] = 1;
		}
	} else if (allP[0]) {
		if (bin[0] == 1) {
			bin[0] = 0;
		} else {
			bin[0] = 1;
		}
	}
	//////////////////////////////
	///// view that data corrected
	//////////////////////////////
	let view = typeof(bin[0]) == "string" ? "\x1b[34m" : "\x1b[35m";
	view += bin[0];
	p = 1;
	for (let i = 1; i < bin.length; i++) {
		if (i & p) {
			p <<= 1;
			view += typeof(bin[i]) == "string" ? "\x1b[34m" : "\x1b[35m";
		} else {
			view += typeof(bin[i]) == "string" ? "\x1b[32m" : "\x1b[31m";
		}
		view += bin[i];
	}
	view += "\x1b[0m";
	console.log(view);
	/////
	/////
	/////
	let data = "";
	pPosicion = 1;
	for (let i = 1; i < bin.length; i++) {
		if (i == pPosicion) {
			pPosicion <<= 1;
		} else {
			data += bin[i];
		}
	}
	return data;
}

(function main() {
	const DATA = process.argv[3];
	switch (process.argv[2]) {
	case "-c":
		console.log(code(DATA));
		break;
	case "-d":
		console.log(decode(DATA));
		break;
	case "-cd":
		console.log(DATA);
		const CODEDDATA = code(DATA);
		console.log(CODEDDATA);
		console.log(decode(CODEDDATA));
		break;
	default:
		console.log("type -c <binary data> to code it");
		console.log("type -d <coded binary> to decode it");
	}
})();
/*
const DATA = process.argv[2];
console.log(DATA);
const CODEDDATA = code(DATA);
console.log(CODEDDATA);
const DECODEDDATA = decode(CODEDDATA);
console.log(DECODEDDATA);
*/