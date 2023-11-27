import React, { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import { ACTIONCARD_TEXT, ACTIONCARD_TYPE } from '../types/ActionCardType';

type IProps = {
    uuid: string,
    type: 'action' | 'organisation'
    action?: ACTIONCARD_TYPE | '',
    organisation?: string,
    forceVisible: boolean,
}

function Card(props: IProps) {
    
    const gameContext = useContext(GameContext)

    const isVisible = props.forceVisible === true || gameContext.visibleCards.includes(props.uuid)
    const selectable = gameContext.selectableCards.includes(props.uuid)

    const cls = ['Card', props.type]
    if (selectable) cls.push('selectable')
    if (!isVisible) cls.push('back')

    const text = ACTIONCARD_TEXT.find(n => n.type === props.action)?.text || ''
    const act = props.action !== '' ? props.action : undefined
    const name = (act || props.organisation)?.replaceAll(/([A-Z])/g, " $1")
    return (
        <div className={cls.join(' ')}>
            {
                isVisible && <>
                    <p className='name'>{name}</p>
                    <p className='explain'>{text}</p>
                </>
            }
            <p className='type'>{props.type}</p>
        </div>
    )

}
Card.defaultProps = {
    forceVisible: false
};
export default Card;