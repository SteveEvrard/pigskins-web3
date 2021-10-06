import React, { useState } from 'react';
import cardback from '../images/cardback.png';
import { resolveCardType, 
    resolveSingleDigitNumber, 
    resolveTeam, 
    resolveLeftNumber, 
    resolveRightNumber,
    resolveCrown,
    resolveFootball,
    resolveWater 
} from '../utils/ImageCreator';
import ReactCardFlip from 'react-card-flip';

const PlayerCard = ( props ) => {

    const [flipped, setFlipped] = useState(true);

    function toggle() {
        setFlipped(false)
    }

    return (
        props.flippable ? 
        <ReactCardFlip isFlipped={flipped}>
            <div key='front'>
                <img style={{position: 'absolute', width: props.width, height: props.width}} alt='' src={resolveTeam(props.team, props.playerType)}/>
                {props.number < 10 ? 
                    <img style={{position: 'absolute', width: props.width, height: props.width}} alt='' src={resolveSingleDigitNumber(props.number)}/>
                    :
                    <span>
                        <img style={{position: 'absolute', width: props.width, height: props.width}} alt='' src={resolveLeftNumber(props.number)}/>
                        <img style={{position: 'absolute', width: props.width, height: props.width}} alt='' src={resolveRightNumber(props.number)}/>
                    </span> 
                }
                <img style={{position: 'absolute', width: props.width, height: props.width}} alt='' src={resolveWater(props.attributes)}/>
                <img style={{position: 'absolute', width: props.width, height: props.width}} alt='' src={resolveFootball(props.attributes)}/>
                <img style={{position: 'absolute', width: props.width, height: props.width}} alt='' src={resolveCrown(props.attributes)}/>
                <img style={{width: props.width, height: props.width}} alt='' src={resolveCardType(props.cardType)}/>
            </div>
            <div key='back' onClick={toggle}>
                <img style={{cursor: 'pointer', width: props.width, height: props.width}} alt='' src={cardback}/>
            </div>
        </ReactCardFlip>
        :
        <div>
            <img style={{position: 'absolute', width: props.width, height: props.width}} alt='' src={resolveTeam(props.team, props.playerType)}/>
            {props.number < 10 ? 
                <img style={{position: 'absolute', width: props.width, height: props.width}} alt='' src={resolveSingleDigitNumber(props.number)}/>
                :
                <span>
                    <img style={{position: 'absolute', width: props.width, height: props.width}} alt='' src={resolveLeftNumber(props.number)}/>
                    <img style={{position: 'absolute', width: props.width, height: props.width}} alt='' src={resolveRightNumber(props.number)}/>
                </span> 
            }
            <img style={{position: 'absolute', width: props.width, height: props.width}} alt='' src={resolveWater(props.attributes)}/>
            <img style={{position: 'absolute', width: props.width, height: props.width}} alt='' src={resolveFootball(props.attributes)}/>
            <img style={{position: 'absolute', width: props.width, height: props.width}} alt='' src={resolveCrown(props.attributes)}/>
            <img style={{width: props.width, height: props.width}} alt='' src={resolveCardType(props.cardType)}/>
        </div>
    )

}

export default PlayerCard;