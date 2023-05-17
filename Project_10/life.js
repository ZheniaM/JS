var isNotRunned = false;
const WIDTH = 50;
const HEIGHT = 50;
const CW = 6;
const CH = 6;
const DEAD = "#edeeca";
const LIVE = "#c20000";
let matrix = new Array(HEIGHT).fill().map(() => Array(WIDTH).fill(false));
let newMatrix = new Array(HEIGHT).fill().map(() => Array(WIDTH));

const TABLE = document.getElementById("matrix");
for (let i = 0; i < HEIGHT; i++) {
	const TR = document.createElement("tr");
	TABLE.appendChild(TR);
	for (let j = 0; j < WIDTH; j++) {
		const CELL = document.createElement("td");
		CELL.id = `${i} ${j}`;
		CELL.style.background = DEAD;
		CELL.width = CW;
		CELL.height = CH;
		CELL.addEventListener("click", function(){ refrash(i, j) });
		TR.appendChild(CELL)
	}
}

function refrash(i, j) {
	isNotRunned = true;
	const CELL = document.getElementById(`${i} ${j}`);
	if (matrix[i][j]) {
		matrix[i][j] = false;
		CELL.style.background = DEAD;
		return;
	}
	matrix[i][j] = true;
	CELL.style.background = LIVE;
}

function step_clicked() {
	isNotRunned = true;
	step();
}

function step() {
	let count;
	for (let i = 0; i < HEIGHT; i++) {
		for (let j = 0; j < WIDTH; j++) {
			count = 0;
			for (let ii = i + HEIGHT -1; ii <= i + HEIGHT + 1; ii++) {
				for (let jj = j + WIDTH -1; jj <= j + WIDTH + 1; jj++) {
					count += matrix[ii%HEIGHT][jj%WIDTH];
				}
			}
			if (matrix[i][j]){
				newMatrix[i][j] = (count == 3 || count == 4);
			} else {
				newMatrix[i][j] = count == 3;
			}
		}
	}

	let match = 0;
	for (let i = 0; i < HEIGHT; i++) {
		for (let j = 0; j < WIDTH; j++) {
			match += matrix[i][j] === newMatrix[i][j];
			matrix[i][j] = newMatrix[i][j];
			const CELL = document.getElementById(`${i} ${j}`);
			if (matrix[i][j]) {
				CELL.style.background = LIVE;
			} else {
				CELL.style.background = DEAD;
			}
		}
	}
	if (match === HEIGHT * WIDTH) {
		run_stop();
	}
}

function run_stop() {
	if (isNotRunned) {
		isNotRunned = false;
		run();
	} else {
		isNotRunned = true;
	}
}

function random() {
	isNotRunned = true;
	for (let i = 0; i < HEIGHT; i++) {
		for (let j = 0; j < WIDTH; j++) {
			matrix[i][j] = Math.random() > 0.25;
			refrash(i, j)
		}
	}
}

function clear_matrix() {
	isNotRunned = true;
	for (let i = 0; i < HEIGHT; i++) {
		for (let j = 0; j < WIDTH; j++) {
			const CELL = document.getElementById(`${i} ${j}`);
			matrix[i][j] = 0;
			CELL.style.background = DEAD;
		}
	}
}

function make_glider() {
	clear_matrix();
	let middle = Math.floor(HEIGHT / 2);
	refrash(middle - 1, 2);
	refrash(middle, 3);
	refrash(middle + 1, 1);
	refrash(middle + 1, 2);
	refrash(middle + 1, 3);
}

function make_LWSS() {
	clear_matrix();
	let middle = Math.floor(HEIGHT / 2);
	refrash(middle - 2, 1);
	refrash(middle - 2, 4);
	refrash(middle - 1, 5);
	refrash(middle, 1);
	refrash(middle, 5);
	refrash(middle + 1, 2);
	refrash(middle + 1, 3);
	refrash(middle + 1, 4);
	refrash(middle + 1, 5);
}

function make_cloverleaf() {
	clear_matrix();
	let mh = Math.floor(HEIGHT / 2);
	let mw = Math.floor(WIDTH / 2);
	refrash(mh - 3, mw);
	refrash(mh - 1, mw);
	refrash(mh + 3, mw);
	refrash(mh + 1, mw);

	refrash(mh - 5, mw - 1);
	refrash(mh - 4, mw - 1);
	refrash(mh - 4, mw - 2);
	refrash(mh - 4, mw - 3);
	refrash(mh - 3, mw - 4);
	refrash(mh - 2, mw - 4);
	refrash(mh - 2, mw - 2);
	refrash(mh - 1, mw - 3);
	refrash(mh - 1, mw - 2);

	refrash(mh - 5, mw + 1);
	refrash(mh - 4, mw + 1);
	refrash(mh - 4, mw + 2);
	refrash(mh - 4, mw + 3);
	refrash(mh - 3, mw + 4);
	refrash(mh - 2, mw + 4);
	refrash(mh - 2, mw + 2);
	refrash(mh - 1, mw + 3);
	refrash(mh - 1, mw + 2);

	refrash(mh + 5, mw - 1);
	refrash(mh + 4, mw - 1);
	refrash(mh + 4, mw - 2);
	refrash(mh + 4, mw - 3);
	refrash(mh + 3, mw - 4);
	refrash(mh + 2, mw - 4);
	refrash(mh + 2, mw - 2);
	refrash(mh + 1, mw - 3);
	refrash(mh + 1, mw - 2);

	refrash(mh + 5, mw + 1);
	refrash(mh + 4, mw + 1);
	refrash(mh + 4, mw + 2);
	refrash(mh + 4, mw + 3);
	refrash(mh + 3, mw + 4);
	refrash(mh + 2, mw + 4);
	refrash(mh + 2, mw + 2);
	refrash(mh + 1, mw + 3);
	refrash(mh + 1, mw + 2);
}

function make_sun() {
	clear_matrix();
	let mh = Math.floor(HEIGHT / 2);
	let mw = Math.floor(WIDTH / 2);

	refrash(mh - 4, mw - 1);
	refrash(mh - 3, mw - 1);
	refrash(mh - 3, mw + 1);
	refrash(mh - 2, mw - 3);
	refrash(mh - 1, mw + 2);
	refrash(mh - 1, mw + 3);
	refrash(mh, mw - 3);
	refrash(mh, mw - 4);
	refrash(mh + 1, mw + 2);
	refrash(mh + 2, mw - 2);
	refrash(mh + 2, mw);
	refrash(mh + 3, mw);
}

function make_loafer() {
	clear_matrix();
	let mh = Math.floor(HEIGHT / 2) - 4;
	let mw = Math.floor(WIDTH / 2);

	refrash(mh, mw - 3);
	refrash(mh, mw - 2);
	refrash(mh, mw + 1);
	refrash(mh, mw + 3);
	refrash(mh, mw + 4);
	refrash(++mh, mw - 4);
	refrash(mh, mw - 1);
	refrash(mh, mw + 2);
	refrash(mh, mw + 3);
	refrash(++mh, mw - 3);
	refrash(mh, mw - 1);
	refrash(++mh, mw - 2);
	refrash(++mh, mw + 4);
	refrash(++mh, mw + 2);
	refrash(mh, mw + 3);
	refrash(mh, mw + 4);
	refrash(++mh, mw + 1);
	refrash(++mh, mw + 2);
	refrash(++mh, mw + 3);
	refrash(mh, mw + 4);

}


function make_cicle() {
	clear_matrix();
	let mh = Math.floor(HEIGHT / 2);
	let mw = Math.floor(WIDTH / 2);

	refrash(mh - 3, mw - 1);
	refrash(mh - 3, mw - 2);
	refrash(mh - 10, mw + 1);
	refrash(mh - 9, mw);
	refrash(mh - 9, mw + 1);
	refrash(mh - 9, mw + 2);
	refrash(mh - 8, mw);
	refrash(mh - 8, mw + 2);
	refrash(mh - 8, mw + 3);
	refrash(mh - 7, mw + 3);

	refrash(mh + 3, mw + 1);
	refrash(mh + 3, mw + 2);
	refrash(mh + 10, mw - 1);
	refrash(mh + 9, mw);
	refrash(mh + 9, mw - 1);
	refrash(mh + 9, mw - 2);
	refrash(mh + 8, mw);
	refrash(mh + 8, mw - 2);
	refrash(mh + 8, mw - 3);
	refrash(mh + 7, mw - 3);

	refrash(mh - 1, mw + 3);
	refrash(mh - 2, mw + 3);
	refrash(mh + 1, mw + 10);
	refrash(mh, mw + 9);
	refrash(mh + 1, mw + 9);
	refrash(mh + 2, mw + 9);
	refrash(mh, mw + 8);
	refrash(mh + 2, mw + 8);
	refrash(mh + 3, mw + 8);
	refrash(mh + 3, mw + 7);

	refrash(mh + 1, mw - 3);
	refrash(mh + 2, mw - 3);
	refrash(mh - 1, mw - 10);
	refrash(mh, mw - 9);
	refrash(mh - 1, mw - 9);
	refrash(mh - 2, mw - 9);
	refrash(mh, mw - 8);
	refrash(mh - 2, mw - 8);
	refrash(mh - 3, mw - 8);
	refrash(mh - 3, mw - 7);
}

function make_glidergun() {
	clear_matrix();

	refrash(5, 2);
	refrash(5, 3);
	refrash(6, 2);
	refrash(6, 3);
	
	refrash(4, 37);
	refrash(4, 36);
	refrash(5, 37);
	refrash(5, 36);

	refrash(5, 12);
	refrash(6, 12);
	refrash(7, 12);
	refrash(4, 13);
	refrash(8, 13);
	refrash(3, 14);
	refrash(9, 14);
	refrash(3, 15);
	refrash(9, 15);
	refrash(6, 16);
	refrash(4, 17);
	refrash(8, 17);
	refrash(5, 18);
	refrash(6, 18);
	refrash(7, 18);
	refrash(6, 19);

	refrash(3, 22);
	refrash(4, 22);
	refrash(5, 22);
	refrash(3, 23);
	refrash(4, 23);
	refrash(5, 23);
	refrash(2, 24);
	refrash(6, 24);
	refrash(2, 26);
	refrash(1, 26);
	refrash(6, 26);
	refrash(7, 26)

	refrash(HEIGHT - 2, 12);
	refrash(HEIGHT - 3, 12);
	refrash(HEIGHT - 3, 11);
	refrash(HEIGHT - 3, 10);
	refrash(HEIGHT - 4, 9);
	refrash(HEIGHT - 5, 9);
	refrash(HEIGHT - 5, 10);
}

function make_60p312() {
	clear_matrix();
	let mh = Math.floor(HEIGHT / 2);
	let mw = Math.floor(WIDTH / 2);

	refrash(mh, mw);
	refrash(mh - 1, mw);
	refrash(mh, mw - 1);
	refrash(mh - 1, mw - 1);

	refrash(mh - 3, mw + 11);
	refrash(mh - 2, mw + 12);
	refrash(mh - 2, mw + 13);
	refrash(mh - 2, mw + 14);
	refrash(mh - 3, mw + 14);
	refrash(mh - 1, mw + 19);
	refrash(mh, mw + 19);
	refrash(mh, mw + 20);
	refrash(mh - 1, mw + 20);

	refrash(mh + 2, mw - 12);
	refrash(mh + 1, mw - 13);
	refrash(mh + 1, mw - 14);
	refrash(mh + 1, mw - 15);
	refrash(mh + 2, mw - 15);
	refrash(mh, mw - 20);
	refrash(mh - 1, mw - 20);
	refrash(mh - 1, mw - 21);
	refrash(mh, mw - 21);
	
	refrash(mh + 11, mw - 3);
	refrash(mh + 12, mw - 2);
	refrash(mh + 13, mw - 2);
	refrash(mh + 14, mw - 2);
	refrash(mh + 14, mw - 3);
	refrash(mh + 19,  mw - 1);
	refrash(mh + 19, mw);
	refrash(mh + 20, mw);
	refrash(mh + 20, mw - 1);
	
	refrash(mh - 12, mw + 2);
	refrash(mh - 13, mw + 1);
	refrash(mh - 14, mw + 1);
	refrash(mh - 15, mw + 1);
	refrash(mh - 15, mw + 2);
	refrash(mh - 20, mw);
	refrash(mh - 20, mw - 1);
	refrash(mh - 21, mw - 1);
	refrash(mh - 21, mw);
}

async function run() {
	while (!isNotRunned) {
		step();
		await new Promise(r => setTimeout(r, 100));
	}
}