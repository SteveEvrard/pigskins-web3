import legendary from '../images/legendary.png';
import exotic from '../images/exotic.png';
import rare from '../images/rare.png';
import common from '../images/common.png';
import fortyNiners1 from '../images/49ers-1.png';
import fortyNiners2 from '../images/49ers-2.png';
import bears1 from '../images/bears-1.png';
import bears2 from '../images/bears-2.png';
import bengals1 from '../images/bengals-1.png';
import bengals2 from '../images/bengals-2.png';
import bills1 from '../images/bills-1.png';
import bills2 from '../images/bills-2.png';
import broncos1 from '../images/broncos-1.png';
import broncos2 from '../images/broncos-2.png';
import browns1 from '../images/browns-1.png';
import browns2 from '../images/browns-2.png';
import buccaneers1 from '../images/buccaneers-1.png';
import buccaneers2 from '../images/buccaneers-2.png';
import cardinals1 from '../images/cardinals-1.png';
import cardinals2 from '../images/cardinals-2.png';
import chargers1 from '../images/chargers-1.png';
import chargers2 from '../images/chargers-2.png';
import chiefs1 from '../images/chiefs-1.png';
import chiefs2 from '../images/chiefs-2.png';
import colts1 from '../images/colts-1.png';
import colts2 from '../images/colts-2.png';
import cowboys1 from '../images/cowboys-1.png';
import cowboys2 from '../images/cowboys-2.png';
import dolphins1 from '../images/dolphins-1.png';
import dolphins2 from '../images/dolphins-2.png';
import eagles1 from '../images/eagles-1.png';
import eagles2 from '../images/eagles-2.png';
import falcons1 from '../images/falcons-1.png';
import falcons2 from '../images/falcons-2.png';
import giants1 from '../images/giants-1.png';
import giants2 from '../images/giants-2.png';
import jaguars1 from '../images/jaguars-1.png';
import jaguars2 from '../images/jaguars-2.png';
import jets1 from '../images/jets-1.png';
import jets2 from '../images/jets-2.png';
import lions1 from '../images/lions-1.png';
import lions2 from '../images/lions-2.png';
import packers1 from '../images/packers-1.png';
import packers2 from '../images/packers-2.png';
import panthers1 from '../images/panthers-1.png';
import panthers2 from '../images/panthers-2.png';
import patriots1 from '../images/patriots-1.png';
import patriots2 from '../images/patriots-2.png';
import raiders1 from '../images/raiders-1.png';
import raiders2 from '../images/raiders-2.png';
import rams1 from '../images/rams-1.png';
import rams2 from '../images/rams-2.png';
import ravens1 from '../images/ravens-1.png';
import ravens2 from '../images/ravens-2.png';
import redskins1 from '../images/redskins-1.png';
import redskins2 from '../images/redskins-2.png';
import saints1 from '../images/saints-1.png';
import saints2 from '../images/saints-2.png';
import seahawks1 from '../images/seahawks-1.png';
import seahawks2 from '../images/seahawks-2.png';
import steelers1 from '../images/steelers-1.png';
import steelers2 from '../images/steelers-2.png';
import texans1 from '../images/texans-1.png';
import texans2 from '../images/texans-2.png';
import titans1 from '../images/titans-1.png';
import titans2 from '../images/titans-2.png';
import vikings1 from '../images/vikings-1.png';
import vikings2 from '../images/vikings-2.png';
import one from '../images/one.png';
import two from '../images/two.png';
import three from'../images/three.png';
import four from '../images/four.png';
import five from '../images/five.png';
import six from '../images/six.png';
import seven from '../images/seven.png';
import eight from '../images/eight.png';
import nine from '../images/nine.png';
import teen from '../images/teen.png';
import twenty from '../images/twenty.png';
import thirty from '../images/thirty.png';
import forty from '../images/forty.png';
import fifty from '../images/fifty.png';
import sixty from '../images/sixty.png';
import seventy from '../images/seventy.png';
import eighty from '../images/eighty.png';
import ninety from '../images/ninety.png';
import zeroPair from '../images/zero-pair.png';
import onePair from '../images/one-pair.png';
import twoPair from '../images/two-pair.png';
import threePair from '../images/three-pair.png';
import fourPair from '../images/four-pair.png';
import fivePair from '../images/five-pair.png';
import sixPair from '../images/six-pair.png';
import sevenPair from '../images/seven-pair.png';
import eightPair from '../images/eight-pair.png';
import ninePair from '../images/nine-pair.png';
import crown from '../images/crown.png';
import water from '../images/water.png';
import football from '../images/football.png';
import blank from '../images/blank.png';

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

export const resolveTeam = ( team, type )=> {

    switch(team){
        case '0':
            return type === '1' ? fortyNiners1 : fortyNiners2;
        case '1': 
            return type === '1' ? bears1 : bears2;
        case '2': 
            return type === '1' ? bengals1 : bengals2;
        case '3':
            return type === '1' ? bills1 : bills2;
        case '4': 
            return type === '1' ? broncos1 : broncos2;
        case '5': 
            return type === '1' ? browns1 : browns2;
        case '6':
            return type === '1' ? buccaneers1 : buccaneers2;
        case '7': 
            return type === '1' ? cardinals1 : cardinals2;
        case '8': 
            return type === '1' ? chargers1 : chargers2;
        case '9':
            return type === '1' ? chiefs1 : chiefs2;
        case '10': 
            return type === '1' ? colts1 : colts2;
        case '11': 
            return type === '1' ? cowboys1 : cowboys2;
        case '12':
            return type === '1' ? dolphins1 : dolphins2;
        case '13': 
            return type === '1' ? eagles1 : eagles2;
        case '14': 
            return type === '1' ? falcons1 : falcons2;
        case '15':
            return type === '1' ? giants1 : giants2;
        case '16': 
            return type === '1' ? jaguars1 : jaguars2;
        case '17': 
            return type === '1' ? jets1 : jets2;
        case '18':
            return type === '1' ? lions1 : lions2;
        case '19': 
            return type === '1' ? packers1 : packers2;
        case '20': 
            return type === '1' ? panthers1 : panthers2;
        case '21':
            return type === '1' ? patriots1 : patriots2;
        case '22': 
            return type === '1' ? raiders1 : raiders2;
        case '23': 
            return type === '1' ? rams1 : rams2;
        case '24': 
            return type === '1' ? ravens1 : ravens2;
        case '25':
            return type === '1' ? redskins1 : redskins2;
        case '26': 
            return type === '1' ? saints1 : saints2;
        case '27': 
            return type === '1' ? seahawks1 : seahawks2;
        case '28':
            return type === '1' ? steelers1 : steelers2;
        case '29': 
            return type === '1' ? texans1 : texans2;
        case '30': 
            return type === '1' ? titans1 : titans2;
        case '31':
            return type === '1' ? vikings1 : vikings2;
        default:
            return '';
    }
}

export const resolveSingleDigitNumber = (num) => {
    
    switch(num) {
        case 1:
            return one;
        case 2:
            return two;
        case 3:
            return three;
        case 4:
            return four;
        case 5:
            return five;
        case 6:
            return six;
        case 7:
            return seven;
        case 8:
            return eight;
        case 9:
            return nine;
        default:
            return '';
    }

}

export const resolveLeftNumber = (num) => {

    if (num >= 10 && num < 20) {
        return teen;
    } else if (num >= 20 && num < 30) {
        return twenty;
    } else if (num >= 30 && num < 40) {
        return thirty;
    } else if (num >= 40 && num < 50) {
        return forty;
    } else if (num >= 50 && num < 60) {
        return fifty;
    } else if (num >= 60 && num < 70) {
        return sixty;
    } else if (num >= 70 && num < 80) {
        return seventy;
    } else if (num >= 80 && num < 90) {
        return eighty;
    } else if (num >= 90) {
        return ninety;
    } else {
        return '';
    }

}

export const resolveRightNumber = (num) => {

    if (num % 10 === 0) {
        return zeroPair;
    } else if (num % 10 === 1) {
        return onePair;
    } else if (num % 10 === 2) {
        return twoPair;
    } else if (num % 10 === 3) {
        return threePair;
    } else if (num % 10 === 4) {
        return fourPair;
    } else if (num % 10 === 5) {
        return fivePair;
    } else if (num % 10 === 6) {
        return sixPair;
    } else if (num % 10 === 7) {
        return sevenPair;
    } else if (num % 10 === 8) {
        return eightPair;
    } else if (num % 10 === 9) {
        return ninePair;
    } else {
        return '';
    }

}

export const resolveCrown = (attrHash) => {

    const crownHash = Number(attrHash.substring(7, 10));

    if (crownHash % 100 === 0) {
        return crown;
    } else {
        return blank;
    }
}

export const resolveWater = (attrHash) => {

    const waterHash = Number(attrHash.substring(2, 6));

    if (waterHash % 50 === 0) {
        return water;
    } else {
        return blank;
    }
}

export const resolveFootball = (attrHash) => {

    const footballHash = Number(attrHash.substring(0, 2));

    if (footballHash % 10 === 0) {
        return football;
    } else {
        return blank;
    }
}