let debug = false;

window.onload = function () {
	generateBingo();
	generateCards();
	document.getElementById("shuffle-button").addEventListener("click", (e) => clickShuffle(e));
	document.getElementById("start-button").addEventListener("click", (e) => clickAction(e));
	document.getElementById("reset-button").addEventListener("click", (e) => clickReset(e));
}

function generateBingo() {
	let container = document.getElementById("bingo-container");
	for (let row = 0; row < 5; row++) {
		let rowDiv = document.createElement("div");
		setupStyle(rowDiv, "bingo-row", "bingo-row-" + row);
		for (let col = 0; col < 5; col++) {
			let colDiv = document.createElement("div");
			setupStyle(colDiv, "bingo-cell", "cell-" + row + "-" + col);
			colDiv.addEventListener("click", (e) => click(e, row, col));
			colDiv.addEventListener("dragover", (e) => dragOver(e));
			colDiv.addEventListener("drop", (e) => drop(e));
			colDiv.addEventListener("contextmenu", (e) => contextMenu(e));
			rowDiv.appendChild(colDiv);
		}
		container.appendChild(rowDiv);
	}
}

function generateCards() {
	let container = document.getElementById("card-container");
	container.addEventListener("dragover", (e) => dragOver(e));
	container.addEventListener("drop", (e) => drop(e));
	for (let i = 0; i < 25; i++) {
		let card = document.createElement("div");
		this.setupStyle(card, "bingo-card", "bingo-card-" + i);
		card.innerHTML = i.toString();
		card.draggable = true;
		card.addEventListener("dragstart", (e) => dragStart(e));
		container.appendChild(card);
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

function dragOver(event) {
	event.preventDefault();
}

function drop(event) {
	event.preventDefault();
	let element = document.getElementById(event.dataTransfer.getData("ElementId"));
	if (debug) console.log("parent id: " + element.parentElement.id + "target id: " + event.target.id);
	if (element.parentElement.id === "card-container" && event.target.id.startsWith("cell-")) { // drag from card container to bingo grid
		event.target.appendChild(element);
	} else if (element.parentElement.id.startsWith("cell-")) { // drag from bingo grid
		if (event.target.id === "card-container") { // to card container
			event.target.appendChild(element);
		} else if (event.target.id.startsWith("cell-")) { // to another cell
			event.target.appendChild(element);
		} else if (event.target.id.startsWith("bingo-card-") && event.target.parentElement.id === "card-container") { // to card container over a card
			event.target.parentElement.insertBefore(element, event.target);
		}
	}
}

function contextMenu(event) {
	event.preventDefault();
	let card = document.getElementById(event.target.id);
	if (card.className === "bingo-card") {
		let cardContainer = document.getElementById("card-container");
		cardContainer.insertBefore(card, cardContainer.firstChild);
	}
}

function dragStart(event) {
	event.dataTransfer.setData("ElementId", event.target.id);
}

function clickShuffle(event) {
	let container = document.getElementById("card-container");
	for (let i = 0; i < 25; i++) {
		let cell = document.getElementById("cell-" + Math.floor(i / 5) + "-" + (i % 5));
		if (cell.children.length === 0) {
			function randomCard() {
				let rng = Math.floor(Math.random() * (container.children.length + 1));
				let element = container.children[rng];
				if (element !== undefined) {
					return element;
				} else {
					return randomCard();
				}
			}

			let element = randomCard();
			if (debug) console.log("element: " + element);
			cell.appendChild(element);
		}
	}
}

function clickAction(event) {

}

function clickReset(event) {
	for (let i = 0; i < 25; i++) {
		let cell = document.getElementById("cell-" + Math.floor(i / 5) + "-" + (i % 5));
		if (cell.children.length > 0) {
			document.getElementById("card-container").appendChild(cell.children[0]);
		}
	}
}
