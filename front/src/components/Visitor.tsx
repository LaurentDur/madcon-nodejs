import React, { useContext, useState } from 'react';
import { IGameContext } from '../types/IGameContext';
import { GameContext } from '../contexts/GameContext';

type IProps = {
    uuid: string,
    value?: number,
    playerColor: string,
}

function Visitor(props: IProps) {

    const gameContext = useContext(GameContext)
    const [show, setShow] = useState<boolean>(false)

    const isVisible = gameContext.visibleVisitors.includes(props.uuid)
    const selectable = gameContext.selectableVisitors.includes(props.uuid)

    const cls = ['Visitor']
    if (selectable) cls.push('selectable')


    return (
        <div className={cls.join(' ')} onMouseEnter={() => setShow(isVisible && true)} onMouseLeave={() => setShow(false)}>
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