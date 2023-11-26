import React, { useContext, useState } from 'react';
import { IGameContext } from '../types/IGameContext';
import { GameContext } from '../contexts/GameContext';
import Mission from './Mission';
import Card from './Card';
import { ACTIONCARD_TYPE } from '../types/ActionCardType';

type IProps = {
    uuid: string,
    color: string,
}

function MainPlayer(props: IProps) {

    const gameContext = useContext(GameContext)

    const cls = ['MainPlayer']


    return (
        <div className={cls.join(' ')}>
            <div className='missions'>

                <Mission uuid='m'
                        cardA={<Card uuid='a6' type='action' action={ACTIONCARD_TYPE.Security}/>}
                        cardB={<Card uuid='xx' type='organisation' organisation='Azerty'/>}
                />
                <Mission uuid='m2'/>
                <Mission uuid='m3'/>
                <Mission uuid='m4'/>
                <Mission uuid='m5'/>

            </div>

            <div className='hand'>
                <p>You cards</p>
                <div className='cards'>
                    <div className='actions'>
                        <Card uuid='a6' type='action' action={ACTIONCARD_TYPE.TargetedArguments}/>
                        <Card uuid='a6' type='action' action={ACTIONCARD_TYPE.Goodies}/>
                    </div>
                    <div className='organisations'>
                        <Card uuid='xxx' type='organisation' organisation='Boutic'/>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default MainPlayer;