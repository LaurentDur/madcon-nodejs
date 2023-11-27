import React, { ReactNode, useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import { SelectableContext } from '../contexts/SelectableContext';
import { SocketSend } from '../socket/SocketMng';


type IProps = {
    uuid: string,
    action?: ReactNode,
    orga?: ReactNode,
    visibleCard: 'action' | 'organisation'
}

function Mission(props: IProps) {
    
    const gameContext = useContext(GameContext)
    const selectContext = useContext(SelectableContext)

    const selectable = selectContext.selectableMissions.includes(props.uuid)

    const cls = ['Mission']
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
        </div>
    )

}
export default Mission;