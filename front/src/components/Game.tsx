import React, { useContext, useState } from 'react';
import Visitor from './Visitor';
import { GameContext, gameData } from '../contexts/GameContext';
import { IGameContext } from '../types/IGameContext';
import BackInterface from '../connector/BackInterface';
import Board from './Board';
import Player from './Player';
import MainPlayer from './MainPlayer';

type IProps = {
}

const connector = new BackInterface()

function Game(props: IProps) {
    
    const [game, setGame] = useState<IGameContext>(gameData)
    
    connector.onContextChange((ctx: IGameContext) => {
        setGame(ctx)
    })

    return (
        <GameContext.Provider value={game}>
            <div className="Game">

                <div className='players'>
                    {
                        game.players.filter(p => p.uuid !== game.currentPlayer ).map( p => 
                            <Player key={p.uuid} uuid={p.uuid} color={p.color} name={p.name}/>
                        )
                    }
                </div>

                <Board key={game.uuid} uuid={game.uuid}/>

                {
                    game.players.filter(p => p.uuid === game.currentPlayer ).map( p => 
                        <MainPlayer key={p.uuid} uuid={p.uuid} color={p.color}/>
                    )
                }

            </div>
        </GameContext.Provider>
    )

}

export default Game;