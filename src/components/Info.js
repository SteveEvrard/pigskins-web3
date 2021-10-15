import React from 'react';
import { useSelector } from 'react-redux';
import legendary from '../images/legendary.png';
import exotic from '../images/exotic.png';
import rare from '../images/rare.png';
import common from '../images/common.png';
import crown from '../images/crown-view.png';
import water from '../images/water-view.png';
import football from '../images/football-view.png';
import { Card, CardContent, CardHeader } from '@mui/material';

const Info = ( props ) => {

    const isMobile = useSelector((state) => state.mobile.value);

    return(
        <div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '3vw', width: isMobile ? '100vw' : '70vw'}}>
                    <img src={common} alt='' style={{width: isMobile ? '40vw' : '20vw'}} />
                    <Card sx={{width: isMobile ? '55vw' : '40vw', marginRight: '5vw'}}>
                        <CardHeader sx={{paddingBottom: 0}} titleTypographyProps={{fontFamily: "Open Sans, sans-serif", fontSize: isMobile ? '5vw' : '3vw', fontWeight: 600}} title='Common Card' />
                        <CardContent sx={{fontFamily: "Open Sans, sans-serif"}}>Common cards do not have any special boosters or attributes</CardContent>
                    </Card>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '3vw', width: isMobile ? '100vw' : '70vw'}}>
                    <img src={rare} alt='' style={{width: isMobile ? '40vw' : '20vw'}} />
                    <Card sx={{width: isMobile ? '55vw' : '40vw', marginRight: '5vw'}}>
                        <CardHeader sx={{paddingBottom: 0}} titleTypographyProps={{fontFamily: "Open Sans, sans-serif", fontSize: isMobile ? '5vw' : '3vw', fontWeight: 600}} title='Rare Card' />
                        <CardContent sx={{fontFamily: "Open Sans, sans-serif"}}>Rare cards receive a 10% increase to their final point total</CardContent>
                    </Card>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '3vw', width: isMobile ? '100vw' : '70vw'}}>
                    <img src={exotic} alt='' style={{width: isMobile ? '40vw' : '20vw'}} />
                    <Card sx={{width: isMobile ? '55vw' : '40vw', marginRight: '5vw'}}>
                        <CardHeader sx={{paddingBottom: 0}} titleTypographyProps={{fontFamily: "Open Sans, sans-serif", fontSize: isMobile ? '5vw' : '3vw', fontWeight: 600}} title='Exotic Card' />
                        <CardContent sx={{fontFamily: "Open Sans, sans-serif"}}>Exotic cards receive a 25% increase to their final point total</CardContent>
                    </Card>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '3vw', width: isMobile ? '100vw' : '70vw'}}>
                    <img src={legendary} alt='' style={{width: isMobile ? '40vw' : '20vw'}} />
                    <Card sx={{width: isMobile ? '55vw' : '40vw', marginRight: '5vw'}}>
                        <CardHeader sx={{paddingBottom: 0}} titleTypographyProps={{fontFamily: "Open Sans, sans-serif", fontSize: isMobile ? '5vw' : '3vw', fontWeight: 600}} title='Legendary Card' />
                        <CardContent sx={{fontFamily: "Open Sans, sans-serif"}}>Legendary cards receive a 40% increase to their final point total</CardContent>
                    </Card>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '3vw', width: isMobile ? '100vw' : '70vw'}}>
                    <img src={football} alt='' style={{width: isMobile ? '40vw' : '20vw'}} />
                    <Card sx={{width: isMobile ? '55vw' : '40vw', marginRight: '5vw'}}>
                        <CardHeader sx={{paddingBottom: 0}} titleTypographyProps={{fontFamily: "Open Sans, sans-serif", fontSize: isMobile ? '5vw' : '3vw', fontWeight: 600}} title='Football' />
                        <CardContent sx={{fontFamily: "Open Sans, sans-serif"}}>A football on a player card prevents negative points from turnovers</CardContent>
                    </Card>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '3vw', width: isMobile ? '100vw' : '70vw'}}>
                    <img src={water} alt='' style={{width: isMobile ? '40vw' : '20vw'}} />
                    <Card sx={{width: isMobile ? '55vw' : '40vw', marginRight: '5vw'}}>
                        <CardHeader sx={{paddingBottom: 0}} titleTypographyProps={{fontFamily: "Open Sans, sans-serif", fontSize: isMobile ? '5vw' : '3vw', fontWeight: 600}} title='Water' />
                        <CardContent sx={{fontFamily: "Open Sans, sans-serif"}}>A water boosts a player's points from yards by 30%</CardContent>
                    </Card>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '5vw'}}>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '3vw', width: isMobile ? '100vw' : '70vw'}}>
                    <img src={crown} alt='' style={{width: isMobile ? '40vw' : '20vw'}} />
                    <Card sx={{width: isMobile ? '55vw' : '40vw', marginRight: '5vw'}}>
                        <CardHeader sx={{paddingBottom: 0}} titleTypographyProps={{fontFamily: "Open Sans, sans-serif", fontSize: isMobile ? '5vw' : '3vw', fontWeight: 600}} title='Crown' />
                        <CardContent sx={{fontFamily: "Open Sans, sans-serif"}}>A crown on a player doubles that players touchdown total</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Info;