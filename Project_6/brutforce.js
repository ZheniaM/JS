function read_file(path) {
	const fs = require("fs");
	try {
		return fs.readFileSync(path, "utf8");
	} catch {
		console.error(err);
	}
}

const S = read_file(process.argv[2]);
const P = process.argv[3];
const N = S.length;
const M = P.length;

loop: for (let i = 0; i <= N - M ; i++) {
	for (let j = 0; j < M; j++) {
		if (S[i + j] !== P[j]) {
			continue loop;
		}
	}
	console.log(i);
	console.log(S[i]);
}