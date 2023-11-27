import React, { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import { ACTIONCARD_TEXT, ACTIONCARD_TYPE } from '../types/ActionCardType';
import { SelectableContext } from '../contexts/SelectableContext';
import { SocketSend } from '../socket/SocketMng';

type IProps = {
    uuid: string,
    type: 'action' | 'organisation'
    action?: ACTIONCARD_TYPE | '',
    organisation?: string,
    forceVisible: boolean,
}

function Card(props: IProps) {
    
    const selectContext = useContext(SelectableContext)
    const gameContext = useContext(GameContext)

    const isVisible = props.forceVisible === true
    const selectable = selectContext.selectableCards.includes(props.uuid)

    const cls = ['Card', props.type]
    if (selectable) cls.push('selectable')
    if (!isVisible) cls.push('back')

    const text = ACTIONCARD_TEXT.find(n => n.type === props.action)?.text || ''
    const act = props.action !== '' ? props.action : undefined
    const name = (act || props.organisation)?.replaceAll(/([A-Z])/g, " $1")

    const onClick = () => {
        if (selectable && gameContext.connector) {
            gameContext.connector.send(SocketSend.cardSelected, { uuid: props.uuid, player: gameContext.currentPlayer })
        }
    }

    return (
        <div className={cls.join(' ')} onClick={onClick}>
            <div>
                {
                    isVisible && <>
                        <p className='name'>{name}</p>
                        <p className='explain'>{text}</p>
                    </>
                }
                <p className='type'>{props.type}</p>
            </div>
        </div>
    )

}
Card.defaultProps = {
    forceVisible: false
};
export default Card;