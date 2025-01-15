'use client'
import React, {useState} from "react";





export default function BingoCard(props: {value: string, id: string}) {
    const [isClicked, setIsClicked] = useState(false);


    function handleClick() {
        setIsClicked(!isClicked);
    }


    function getClassNames(isClicked: boolean) {
        let classes = "bingo-card";
        if (isClicked) {
            classes += " clicked";
        }
        return classes;
    }

    return (
        <div className={getClassNames(isClicked)} onClick={handleClick}>
            {props.value}
        </div>
    );
}