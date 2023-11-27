import React, { useContext, useState } from 'react';
import { IGameContext } from '../types/IGameContext';
import { GameContext } from '../contexts/GameContext';
import Card from './Card';
import Mission from './Mission';

type IProps = {
    uuid: string,
    color: string,
    name: string,
}

function Player(props: IProps) {

    const gameContext = useContext(GameContext)

    const cls = ['Player']

    const player = gameContext.players.find(p => p.uuid === props.uuid)
    if (!player) return <div>Player not found!</div>

    return (
        <div className={cls.join(' ')}>
            <div className='name'>{props.name}</div>
            <div className='hand'>
                {
                    player.actionHand.map((c,i) => 
                        <Card key={i} uuid={c.uuid} type='action'/>
                        )
                }
                {
                    player.orgahand.map((c,i) => 
                        <Card key={i} uuid={c.uuid} type='organisation'/>
                        )
                }
            </div>
            <div className='mission'>
                {
                    player.mission.map(m => 
                        <Mission key={m.uuid} 
                                uuid={m.uuid}
                                visibleCard={m.visible}
                                action={<Card uuid={m.action.uuid} type='action' action={m.action.action} forceVisible={m.visible === 'action'}/>}
                                orga={<Card uuid={m.orga.uuid} type='organisation' action={m.orga.organisation} forceVisible={m.visible !== 'action'}/>}
                                />
                        )
                }

            </div>
        </div>
    )

}

export default Player;