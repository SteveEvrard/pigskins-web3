import React from 'react';
import { Box, Tab, Typography, Badge } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useSelector } from 'react-redux';
import Claim from './Claim';
import OpenUserAuctions from './OpenUserAuctions';
import { styled } from '@mui/material/styles';
import AnnouncementIcon from '@mui/icons-material/Announcement';

const StyledDot = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -5,
      top: 5
    },
}));

const MyAuction = ( props ) => {

    const notification = useSelector((state) => state.notification.value);
    const isMobile = useSelector((state) => state.mobile.value);
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div style={{marginTop: '2vw'}}>
            <Typography sx={{marginBottom: '3vw', fontFamily: "Work Sans, sans-serif", fontSize: isMobile ? '8vw' : '6vw', color: '#fff'}}>
                My Auctions
            </Typography>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Box sx={{ width: '100vw', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            { notification ? <AnnouncementIcon sx={{color: '#d8572a', position: 'absolute', right: isMobile ? '2vw' : '11vw', fontSize: isMobile ? '6vw' : '3vw'}}/> : null}
                            <TabList sx={{display: 'flex', justifyContent: 'center'}} textColor='secondary' onChange={handleChange} aria-label="lab API tabs example">
                                <Tab sx={{width: '50vw', margin: isMobile ? '' : 'auto', fontSize: isMobile ? '5vw' : '3vw'}} label="Open" value="1" />
                                <Tab sx={{width: '50vw', margin: isMobile ? '' : 'auto', fontSize: isMobile ? '5vw' : '3vw'}} label="Completed" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel sx={{padding: 0}} value="1"><OpenUserAuctions/></TabPanel>
                        <StyledDot>
                            <TabPanel sx={{padding: 0}} value="2"><Claim/></TabPanel>
                        </StyledDot>
                    </TabContext>
                </Box>
            </div>
        </div>
    )

}

export default MyAuction;