let debug = false;
let editMode = true;

jsonString = '["Felix wird politisch","Ismael rastet in Mathe aus", "Nervöses zappeln", "SPI sind (zurecht) abgehoben", "Jemand schreit Bingo #rekursion", "Sushi", "Rechenfehler in den Mathe-Lösungen", "\\"Können wir die KA verschieben\\"", "\\"Dürfen wir gehen?\\"", "Dom, Luis & Caro sind zu laut", "\\"mehr oder weniger\\"", "Amalya ist zu spät", "Volle Motivation #FREE", "Klebesterne", "Irgendein Engel macht das Fenster zu", "Christian und Johanna verschwinden", "Andree kommt zu spät", "\\"Stellen sie sich vor\\"", "Irgendein Wichser macht das Fenster auf", "Bentele kommt zu spät", "Vincent meckert", "Rechtschreibfehler auf dem Mathe-AB", "Kellerkinder", "Früher aus", "\\"laser\\""]';

// called when the page is loaded
window.onload = function () {
	generateBingo();
	generateCards();
	document.getElementById("shuffle-button").addEventListener("click", () => clickShuffle());
	document.getElementById("action-button").addEventListener("click", () => clickAction());
	document.getElementById("reset-button").addEventListener("click", () => clickReset());
}

// generates the bingo grid
function generateBingo() {
	let container = document.getElementById("bingo-container");
	for (let row = 0; row < 5; row++) {
		let rowDiv = document.createElement("div");
		setupStyle(rowDiv, "bingo-row", "bingo-row-" + row);
		for (let col = 0; col < 5; col++) {
			let colDiv = document.createElement("div");
			setupStyle(colDiv, "bingo-cell", "cell-" + row + "-" + col);
			colDiv.addEventListener("dragover", (e) => dragOver(e));
			colDiv.addEventListener("drop", (e) => drop(e));
			colDiv.addEventListener("contextmenu", (e) => contextMenu(e));
			rowDiv.appendChild(colDiv);
		}
		container.appendChild(rowDiv);
	}
}

// loads the values from the json file and generates the cards
function generateCards() {
	// load values from file into array
	let values = [];
	let xhr = new XMLHttpRequest();
	if (debug) {
		xhr.open("GET", "./resources/Values.json", false);
	} else {
		xhr.open("GET", "https://spi-matse.github.io/KHS-Bingo/resources/Values.json", false);
	}
	xhr.send(null);
	if (debug) console.log(xhr.responseText)
	if (xhr.status === 200) {
		values = JSON.parse(xhr.responseText);
	} else {
		console.log("Error loading values.json");
	}

	// generate cards from array and add them to the card container
	let container = document.getElementById("card-container");
	container.addEventListener("dragover", (e) => dragOver(e));
	container.addEventListener("drop", (e) => drop(e));
	for (let i = 0; i < values.length; i++) {
		let card = document.createElement("div");
		this.setupStyle(card, "bingo-card", "bingo-card-" + i);
		card.innerHTML = values[i];
		card.draggable = true;
		card.addEventListener("dragstart", (e) => dragStart(e));
		card.addEventListener("click", (e) => chopOffCard(e));
		container.appendChild(card);
	}
}

// set the class and id of a div
function setupStyle(div, clazz, id) {
	div.classList.add(clazz);
	div.id = id;
}

// prevents the default drag over
function dragOver(event) {
	event.preventDefault();
}

// drops the card to the target element if the target is valid
// if the bingo card is chopped off, the css class will be removed
function drop(event) {
	event.preventDefault();
	let card = document.getElementById(event.dataTransfer.getData("ElementId"));
	if (debug) console.log("parent id: " + card.parentElement.id + "target id: " + event.target.id);
	let validTarget = false;
	if (card.parentElement.id === "card-container" && event.target.id.startsWith("cell-")) { // drag from card container to bingo grid
		event.target.appendChild(card);
		validTarget = true;
	} else if (card.parentElement.id.startsWith("cell-")) { // drag from bingo grid
		if (event.target.id === "card-container") { // to card container
			event.target.appendChild(card);
			validTarget = true;
		} else if (event.target.id.startsWith("cell-")) { // to another cell
			event.target.appendChild(card);
			validTarget = true;
		} else if (event.target.id.startsWith("bingo-card-") && event.target.parentElement.id === "card-container") { // to card container over a card
			event.target.parentElement.insertBefore(card, event.target);
			validTarget = true;
		}
	}
	if (validTarget && card.classList.contains("bingo-card-chopped-off")) {
		card.classList.remove("bingo-card-chopped-off");
	}
}

// disables the context menu and moves the card to the card container
// if the bingo card is chopped off, the css class will be removed
function contextMenu(event) {
	event.preventDefault();
	if (!editMode) {
		return;
	}
	let card = document.getElementById(event.target.id);
	if (card.classList.contains("bingo-card-chopped-off")) {
		card.classList.remove("bingo-card-chopped-off");
	}
	if (card.className === "bingo-card") {
		let cardContainer = document.getElementById("card-container");
		cardContainer.insertBefore(card, cardContainer.firstChild);
	}
}

// sets the drag data to the id of the element
function dragStart(event) {
	event.dataTransfer.setData("ElementId", event.target.id);
}

// toggles the copped off class of the card in game mode
function chopOffCard(event) {
	if (editMode) {
		return;
	}
	event.target.classList.toggle("bingo-card-chopped-off");
}

// fills the bingo grid with random cards
function clickShuffle() {
	if (!editMode) {
		return;
	}
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

// toggle between edit mode and game mode
function clickAction() {
	if (editMode) {
		if (!hasGridSpace()) {
			document.getElementById("action-button").innerHTML = "Stop";
			document.getElementById("reset-button").hidden = true;
			document.getElementById("shuffle-button").hidden = true;
			updateDraggable(false);
			editMode = false;
		} else {
			alert("Please fill the entire grid before starting the game.");
		}
	} else {
		document.getElementById("action-button").innerHTML = "Start";
		document.getElementById("reset-button").hidden = false;
		document.getElementById("shuffle-button").hidden = false;
		updateDraggable(true);
		editMode = true;
	}
}

// checks if there is any empty space in the grid
function hasGridSpace() {
	let cells = document.getElementsByClassName("bingo-cell");
	for (let i = 0; i < cells.length; i++) {
		if (cells[i].children.length === 0) {
			return true;
		}
	}
	return false;
}

// updates the draggable property of all cards
function updateDraggable(value) {
	let cards = document.getElementsByClassName("bingo-card");
	for (let i = 0; i < cards.length; i++) {
		cards[i].draggable = value;
	}
}

// clears the bingo grid and returns all cards to the card container
// if the bingo card is chopped off, the css class will be removed
function clickReset() {
	if (!editMode) {
		return;
	}
	for (let i = 0; i < 25; i++) {
		let cell = document.getElementById("cell-" + Math.floor(i / 5) + "-" + (i % 5));
		if (cell.children.length > 0) {
			let card = cell.children[0];
			if (card.classList.contains("bingo-card-chopped-off")) {
				card.classList.remove("bingo-card-chopped-off");
			}
			document.getElementById("card-container").appendChild(card);
		}
	}
}
