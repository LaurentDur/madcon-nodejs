import React, {  useContext, useState } from 'react';
import Visitor from './Visitor';
import { GameContext, gameData } from '../contexts/GameContext';
import { IGameContext } from '../types/IGameContext';
import BackInterface from '../connector/BackInterface';
import OrganisationCelll from './OrganisationCelll';

type IProps = {
    uuid: string,
}

const connector = new BackInterface()

function Board(props: IProps) {
    
    const gameContext = useContext(GameContext)

    return (
        
        <div className="Board">
            Board of game : {gameContext.uuid}

            <div className='orgaCells'>
                {
                    gameContext.organisations.map(orga => {
                        return (<OrganisationCelll uuid={orga} key={orga} orga={orga}/>)
                    })
                }
            </div>

            <div className='entrance'>
                {
                    gameContext.visitors.filter(v => v.position.where === 'entrance').map(v => 
                        <Visitor key={v.uuid} uuid={v.uuid} playerColor={v.invitedBy.color} value={v.value}/>
                        )
                }
            </div>


        </div>
    )

}

export default Board;