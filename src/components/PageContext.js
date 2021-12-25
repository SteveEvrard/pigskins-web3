import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader } from '@mui/material';

const PageContext = ( props ) => {

    const isMobile = useSelector((state) => state.mobile.value);

    return (
        <div style={{marginTop: props.parent === 'join-game' ? isMobile ? '35vw' : '25vw' : '', display: 'flex', justifyContent: 'center'}}>
            <Card sx={{width: '80vw', maxWidth: '550px', color: 'white', backgroundColor: '#2e8b57'}}>
                <CardHeader titleTypographyProps={{fontWeight: 600}} component='h2' title={props.header} />
                <CardContent sx={{fontWeight: 600}}>{props.body}</CardContent>
            </Card>
        </div>
    )
    
}

export default PageContext;