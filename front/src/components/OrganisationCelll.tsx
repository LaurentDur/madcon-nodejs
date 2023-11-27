import React, {  useContext } from 'react';
import Visitor from './Visitor';
import { GameContext } from '../contexts/GameContext';
import BackInterface from '../connector/BackInterface';
import { SelectableContext } from '../contexts/SelectableContext';
import { SocketSend } from '../socket/SocketMng';

type IProps = {
    uuid: string,
    orga: string,
}

const connector = new BackInterface()

function OrganisationCelll(props: IProps) {
    
    const gameContext = useContext(GameContext)
    const selectContext = useContext(SelectableContext)

    const visitors = gameContext.visitors.filter(v => v.position.where === 'organisation' && v.position.orga === props.orga )
    const selectable = selectContext.selectableVisitors.includes(props.uuid)

    const cls = ['OrganisationCell']
    if (selectable) cls.push('selectable')

    const onClick = () => {
        if (selectable && gameContext.connector) {
            gameContext.connector.send(SocketSend.orgaSelected, { uuid: props.uuid, player: gameContext.currentPlayer })
        }
    }

    return (
        
        <div className={cls.join(" ")} onClick={onClick}>
            <p>{props.orga}</p>
            <div className='steps'>
                {[...Array(gameContext.nbSteps).keys()].map((x,i) => {
                    const vis = visitors.filter(v => v.position.steps === i)
                    return <div className='step'>
                            <p>&nbsp;</p>
                            <div>
                                {
                                    vis.map(v => <Visitor key={v.uuid} uuid={v.uuid} playerColor={v.invitedBy.color} value={v.value}/>)
                                }
                            </div>
                        </div>
                })}                                
            </div>
        </div>
    )

}

export default OrganisationCelll;