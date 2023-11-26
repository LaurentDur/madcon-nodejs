import React, { useContext, useState } from 'react';
import Visitor from './Visitor';
import { GameContext, gameData } from '../contexts/GameContext';
import { IGameContext } from '../types/IGameContext';

type IProps = {
    uuid: string,
    steps: number,
}

function Board(props: IProps) {

    const [xxx, setXXXX] = useState(3)
    const [game, setGame] = useState<IGameContext>(gameData)

    return (
        <GameContext.Provider value={game}>
            <div className="Board">
                Board of {game.uuid} {xxx}

                <div className='orgaCells'>
                    {
                        game.organisations.map(orga => {
                            return (<div>
                                <p>{orga}</p>
                                <div className='steps'>
                                    {[...Array(props.steps).keys()].map((x,i) => <div className='step'>
                                        <p>{i}</p>
                                        <div>
                                            <Visitor uuid='x2' playerColor='green' value={-1}/>
                                        </div>
                                    </div>)}                                
                                </div>
                            </div>)
                        })
                    }
                </div>

                <div className='entrance'>
                    <Visitor uuid='x1' playerColor='red' value={1}/>
                    <Visitor uuid='x3' playerColor='red' value={2}/>
                </div>


            </div>
        </GameContext.Provider>
    )

}


Board.defaultProps = {
    steps: 5
};
export default Board;