import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';

const headerOptions = [
    {label: 'Purchase', href: '/purchase'},
    {label: 'My Cards', href: '/cards'}
]

const Header = ( props ) => {

    const history = useHistory();

    function home() {
        history.push('/')
    }

    const getMenuButtons = () => {
        return headerOptions.map(({ label, href }) => {
            return (
                <Button
                    {...{component: RouterLink, to: href}}
                    key={label}
                    sx={{
                        fontFamily: "Open Sans, sans-serif",
                        fontWeight: 700,
                        key: label,
                        color: "inherit"
                    }}
                >
                    {label}
                </Button>
            );
        });
    };

    const displayDesktop = () => {
        return (
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <div onClick={home} style={{display: 'flex', cursor: 'pointer'}}>
                    <SportsFootballIcon sx={{marginTop: '3px'}} fontSize='large'/>
                    {logo}
                </div>
                <div>{getMenuButtons()}</div>
            </Toolbar>
        )
    };

    const logo = (
        <Typography variant="h4" component="h1"
            sx={{
                fontFamily: "Work Sans, sans-serif",
                fontWeight: 600,
                color: "#FFFEFE",
                textAlign: "left",
            }}
        >
            Pigskins
        </Typography>
    );

    return (
        <header style={{height: '80px'}}>
            <AppBar sx={{backgroundColor: "#31572c"}}>
                {displayDesktop()}
            </AppBar>
        </header>
    )

}

export default Header;