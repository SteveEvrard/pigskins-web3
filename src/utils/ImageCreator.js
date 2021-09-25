import legendary from '../images/legendary.png';
import exotic from '../images/exotic.png';
import rare from '../images/rare.png';
import common from '../images/common.png';
import fortyNiners1 from '../images/49ers-1.png';
import bears1 from '../images/bears-1.png';
import chiefs1 from '../images/chiefs-1.png';
import cowboys1 from '../images/cowboys-1.png';
import packers2 from '../images/packers-2.png';
import rams2 from '../images/rams-2.png';
import titans1 from '../images/titans-1.png';
import steelers1 from '../images/steelers-1.png';
import browns2 from '../images/browns-2.png';
import texans1 from '../images/texans-1.png';

export const resolveCardType = ( type ) => {

    switch(type){
        case '0': 
            return common;
        case '1': 
            return rare;
        case '2': 
            return exotic;
        case '3':
            return legendary;
        default:
            return '';
    }
}

export const resolveTeam = ( team )=> {

    switch(team){
        case '0':
            return fortyNiners1;
        case '1': 
            return bears1;
        case '2': 
            return rare;
        case '3':
            return legendary;
        case '4': 
            return exotic;
        case '5': 
            return browns2;
        case '6':
            return legendary;
        case '7': 
            return exotic;
        case '8': 
            return rare;
        case '9':
            return chiefs1;
        case '10': 
            return exotic;
        case '11': 
            return cowboys1;
        case '12':
            return legendary;
        case '13': 
            return exotic;
        case '14': 
            return rare;
        case '15':
            return legendary;
        case '16': 
            return exotic;
        case '17': 
            return rare;
        case '18':
            return legendary;
        case '19': 
            return packers2;
        case '20': 
            return rare;
        case '21':
            return legendary;
        case '22': 
            return exotic;
        case '23': 
            return rams2;
        case '24': 
            return rare;
        case '25':
            return legendary;
        case '26': 
            return exotic;
        case '27': 
            return rare;
        case '28':
            return steelers1;
        case '29': 
            return texans1;
        case '30': 
            return titans1;
        case '31':
            return legendary;
        default:
            return '';
    }
}