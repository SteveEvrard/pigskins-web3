import React, { useState } from 'react';
import water from '../images/water.png';
import cardback from '../images/cardback.png';
import { resolveCardType, resolveTeam } from '../utils/ImageCreator';
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
                <img style={{position: 'absolute', width: props.width, height: props.width}} alt='N/A' src={resolveTeam(props.team)}/>
                <img style={{position: 'absolute', width: props.width, height: props.width}} alt='N/A' src={water}/>
                {/* <img style={{position: 'absolute', width: props.width, height: props.width}} alt='N/A' src={water}/> */}
                <img style={{width: props.width, height: props.width}} alt='N/A' src={resolveCardType(props.cardType)}/>
            </div>
            <div key='back' onClick={toggle}>
                <img style={{cursor: 'pointer', width: props.width, height: props.width}} alt='N/A' src={cardback}/>
            </div>
        </ReactCardFlip>
        :
        <div>
            <img style={{position: 'absolute', width: props.width, height: props.width}} alt='N/A' src={resolveTeam(props.team)}/>
            <img style={{position: 'absolute', width: props.width, height: props.width}} alt='N/A' src={water}/>
            {/* <img style={{position: 'absolute', width: props.width, height: props.width}} alt='N/A' src={water}/> */}
            <img style={{width: props.width, height: props.width}} alt='N/A' src={resolveCardType(props.cardType)}/>
        </div>
    )

}

export default PlayerCard;