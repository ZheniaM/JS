function buildKMPTable(substring) {
	let table = new Array(substring.length).fill(0);
	let i = 0, j = 1;
	while (j < substring.length) {
		if (substring[i] === substring[j]) {
			table[j] = i + 1;
			i++;
			j++;
			continue;
		} 
		if (i > 0) {
			i = table[i - 1];
			continue;
		}
		j++;
	}
	console.log(table);
	return table;
}

function kmpSearch(substring, input) {
	let table = buildKMPTable(substring);
	let i = 0, j = 0;
	let indexes = [];
	while (i < input.length) {
		if (substring[j] === input[i]) {
			i++;
			j++;
			if (j === substring.length) {
				indexes.push(i - j);
				j = table[j - 1];
			}
			continue;
		}
		if (j > 0) {
			j = table[j - 1];
			continue;
		}
		i++;
	}
	return indexes;
}


let substring = "aba";
let input = "ababbababa";
console.log(kmpSearch(substring, input));