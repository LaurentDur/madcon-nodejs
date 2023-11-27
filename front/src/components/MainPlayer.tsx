import React, { useContext, useState } from 'react';
import { IGameContext } from '../types/IGameContext';
import { GameContext } from '../contexts/GameContext';
import Mission from './Mission';
import Card from './Card';
import { ACTIONCARD_TYPE } from '../types/ActionCardType';
import { SelectableContext } from '../contexts/SelectableContext';

type IProps = {
    uuid: string,
    color: string,
}

function MainPlayer(props: IProps) {

    const gameContext = useContext(GameContext)
    const selectContext = useContext(SelectableContext)

    const cls = ['MainPlayer']

    const player = gameContext.players.find(p => p.uuid === props.uuid)
    if (!player) return <div>Player not found!</div>

    return (
        <div className={cls.join(' ')}>
            <div className='task'>{selectContext.question}</div>

            <div className='hand'>
                <div className='cards'>
                    <div className='actions'>
                        {
                            player.actionHand.map(c => 
                                <Card key={c.uuid} uuid={c.uuid} type='action' forceVisible action={c.action as ACTIONCARD_TYPE}/>
                                )
                        }
                    </div>
                    <div className='organisations'>
                        {
                            player.orgahand.map(c => 
                                <Card key={c.uuid} uuid={c.uuid} type='organisation' forceVisible organisation={c.organisation}/>
                                )
                        }
                    </div>
                </div>
            </div>
            
            <div className='missions'>
                {
                    player.mission.map(m => <Mission uuid={m.uuid} key={m.uuid} visibleCard={m.visible} 
                        sabotage={m.sabotage}
                        action={<Card uuid={m.action.uuid} type='action' action={m.action.action} forceVisible={m.visible === 'action'}/>}
                        orga={<Card uuid={m.orga.uuid} type='organisation' organisation={m.orga.organisation} forceVisible={m.visible !== 'action'}/>}
                        />)
                }

            </div>
        </div>
    )

}

export default MainPlayer;