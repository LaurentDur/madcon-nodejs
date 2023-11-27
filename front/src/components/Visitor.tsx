import React, { useContext, useState } from 'react';
import { IGameContext } from '../types/IGameContext';
import { GameContext } from '../contexts/GameContext';
import { SelectableContext } from '../contexts/SelectableContext';
import { SocketSend } from '../socket/SocketMng';

type IProps = {
    uuid: string,
    value?: number,
    playerColor: string,
}

function Visitor(props: IProps) {

    const gameContext = useContext(GameContext)
    const selectContext = useContext(SelectableContext)
    const [show, setShow] = useState<boolean>(false)

    const isVisible = gameContext.visibleVisitors.includes(props.uuid)
    const selectable = selectContext.selectableVisitors.includes(props.uuid)

    const cls = ['Visitor']
    if (selectable) cls.push('selectable')

    const onClick = () => {
        if (selectable && gameContext.connector) {
            gameContext.connector.send(SocketSend.visitorSelected, { uuid: props.uuid, player: gameContext.currentPlayer })
        }
    }

    return (
        <div className={cls.join(' ')} onMouseEnter={() => setShow(isVisible && true)} onMouseLeave={() => setShow(false)} onClick={onClick}>
            { show && 
                <div className='value' style={{background: props.playerColor}}><span>{props.value?.toString() || ''}</span></div>
            }
            { !show && 
                <div className='playerMark' style={{background: props.playerColor}}>&nbsp;</div>
            }
        </div>
    )

}

Visitor.defaultProps = {
    visible: false
};

export default Visitor;