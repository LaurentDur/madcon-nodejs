import React, { ReactNode, useContext } from 'react';
import { GameContext } from '../contexts/GameContext';


type IProps = {
    uuid: string,
    action?: ReactNode,
    orga?: ReactNode,
    visibleCard: 'action' | 'organisation'
}

function Mission(props: IProps) {
    
    const gameContext = useContext(GameContext)

    const cls = ['Mission']

    return (
        <div className={cls.join(' ')}>
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