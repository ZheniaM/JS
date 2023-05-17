let a = Number(1);
let i = 0;
while (a > 0) {
	a <<= 1;
	console.log(a);
	i++;
}
console.log("done", i);