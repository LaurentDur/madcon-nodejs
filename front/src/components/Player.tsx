import React, { useContext, useState } from 'react';
import { IGameContext } from '../types/IGameContext';
import { GameContext } from '../contexts/GameContext';

type IProps = {
    uuid: string,
    color: string,
    name: string,
}

function Player(props: IProps) {

    const gameContext = useContext(GameContext)

    const cls = ['Player']


    return (
        <div className={cls.join(' ')}>
            <div>{props.name}</div>
            Other Player
        </div>
    )

}

export default Player;