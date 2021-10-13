import { Card, CardContent, CardHeader } from '@mui/material';
import React from 'react';

const PageContext = ( props ) => {

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Card sx={{width: '80vw', maxWidth: '550px', color: 'white', backgroundColor: '#31572c'}}>
                <CardHeader titleTypographyProps={{fontWeight: 600}} component='h2' title={props.header} />
                <CardContent sx={{fontWeight: 600}}>{props.body}</CardContent>
            </Card>
        </div>
    )
    
}

export default PageContext;