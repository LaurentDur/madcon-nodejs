import React, { ReactNode, useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import Card from './Card';
import { ACTIONCARD_TYPE } from '../types/ActionCardType';

type IProps = {
    uuid: string,
    cardA?: ReactNode,
    cardB?: ReactNode,
}

function Mission(props: IProps) {
    
    const gameContext = useContext(GameContext)

    const cls = ['Mission']

    return (
        <div className={cls.join(' ')}>
            <div className='topCard'>
                {props.cardA}
            </div>
            <div className='bottomCard'>            
                {props.cardB}
            </div>
        </div>
    )

}
export default Mission;