import React from "react";
import BingoCard from "@/app/BingoCard";
import BingoCardContainer from "@/app/BingoCardContainer";

function handleCellClick() {
    console.log("clicked");
}

function getJsonValues(path:string) {
    //read file into string
    let fs = require('fs');
    let values: string[] = JSON.parse(fs.readFileSync(path, 'utf8'));
    return values;
}

function generateBoard(){
    let rows = [];
    for(let i = 0; i < 5; i++){
        rows.push(getBoardRow(i*5));
    }
    return rows;
}

function getBoardRow(offset: number){
    let containers = [];
    for(let i = 0; i < 5; i++){
        let id = (i + offset).toString();
        containers.push(<BingoCardContainer key={id} id={id}/>);
    }

    return containers;
}

function generateCards(json: string[]){
    let cards = [];
    for(let i = 0; i < json.length; i++){
        let id = i.toString();
        cards.push(<BingoCard key={id} id={id} value={json[i]}/>);
    }
    return cards;
}



export default function Home() {
    let json = getJsonValues("./resources/Values.json");
    let bingoCards = generateCards(json);
    let boardRows = generateBoard();
  return (
      <div>
          <div className={"header"}>
              <h1>Bingo</h1>
          </div>

          <div className="bingo-board">
                {boardRows.map((row) => <div className={"board-row"} key={crypto.randomUUID()}>{row}</div>)}
        </div>

</div>
)
  ;
}


