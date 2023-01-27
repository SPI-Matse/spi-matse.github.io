let debug = false;

window.onload = function () {
	let container = document.getElementById("bingo-container");
	for (let row = 0; row < 5; row++) {
		let rowDiv = document.createElement("div");
		this.setupStyle(rowDiv, "bingo-row", "bingo-row-" + row);
		for (let col = 0; col < 5; col++) {
			let colDiv = document.createElement("div");
			this.setupStyle(colDiv, "bingo-cell", "cell-" + row + "-" + col);
			colDiv.addEventListener("click", (e) => click(e, row, col));
			rowDiv.appendChild(colDiv);
		}
		container.appendChild(rowDiv);
	}
}

function setupStyle(div, clazz, id) {
	div.classList.add(clazz);
	div.id = id;
}

function click(e, row, col) {
	if (debug) console.log("row: " + row + " col: " + col);
	e.target.classList.toggle("bingo-cell-selected");
}
