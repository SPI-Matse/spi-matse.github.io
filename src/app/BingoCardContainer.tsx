'use client'
import React, {useState} from "react";

export default function BingoCardContainer(props: {id: string, children?: React.ReactNode[]}) {

    return (
        <div className={"bingo-card-container"}>
            {props.id}
            {props.children}
        </div>
    );
}