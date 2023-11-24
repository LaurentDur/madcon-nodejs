import React, { useContext, useState } from 'react';
import Visitor from './Visitor';
import { GameContext, gameData } from '../contexts/GameContext';
import { IGameContext } from '../types/IGameContext';

type IProps = {
    uuid: string,
}

function Board(props: IProps) {

    const [xxx, setXXXX] = useState(3)
    const [game, setGame] = useState<IGameContext>(gameData)

    console.log(game)

    return (
        <GameContext.Provider value={game}>
            <div className="Board">
                Board of {game.uuid} {xxx}

                <button onClick={() => {
                    const newGame = Object.assign({},game)
                    newGame.uuid = "Bonjour !"
                    if (newGame.visibleVisitors.length === 0 ) newGame.visibleVisitors.push('x3')
                    else newGame.visibleVisitors.length = 0
                    newGame.selectableVisitors.push('x3')
                    setGame(newGame)
                    // setXXXX(9)
                    // console.log(game)
                }}>Test !!!</button>

                <Visitor uuid='x1' playerColor='red' value={1}/>
                <Visitor uuid='x2' playerColor='green' value={-1}/>
                <Visitor uuid='x3' playerColor='red' value={2}/>
            </div>
        </GameContext.Provider>
    )

}
export default Board;