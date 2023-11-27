import React, { ReactNode, useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import { SelectableContext } from '../contexts/SelectableContext';
import { SocketSend } from '../socket/SocketMng';
import Card from './Card';
import { Hand } from '../types/IGameContext';


type IProps = {
    uuid: string,
    action?: ReactNode,
    orga?: ReactNode,
    visibleCard: 'action' | 'organisation',
    size: 'small' | 'medium' | 'large',
    sabotage: Hand[]
}

function Mission(props: IProps) {
    
    const gameContext = useContext(GameContext)
    const selectContext = useContext(SelectableContext)

    const selectable = selectContext.selectableMissions.includes(props.uuid)

    const cls = ['Mission', props.size]
    if (selectable) cls.push('selectable')

    const onClick = () => {
        if (selectable && gameContext.connector) {
            gameContext.connector.send(SocketSend.missionSelected, { uuid: props.uuid, player: gameContext.currentPlayer })
        }
    }

    return (
        <div className={cls.join(' ')} onClick={onClick}>
            <div className='topCard'>
                {props.visibleCard === 'action' ? props.action : props.orga}
            </div>
            <div className='bottomCard'>         
                {props.visibleCard === 'action' ? props.orga : props.action}
            </div>
            {
                props.sabotage.length > 0 && <div className='sabotage'>
                        <Card uuid={props.sabotage[props.sabotage.length - 1].uuid} 
                                type='organisation'
                                forceVisible
                                organisation={props.sabotage[props.sabotage.length - 1].organisation} 
                                size={props.size}
                                />
                    </div>
            }
        </div>
    )

}

Mission.defaultProps = {
    size: 'medium'
}

export default Mission;