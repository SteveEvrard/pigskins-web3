import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, MenuItem, Menu } from '@mui/material';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import { useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';

const headerOptions = [
    {label: 'Purchase', href: '/purchase'},
    {label: 'Auction', href: '/auction'},
    {label: 'My Cards', href: '/cards'}
]

const Header = ( props ) => {

    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const isMobile = useSelector((state) => state.mobile.value)

    function home() {
        history.push('/')
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    function handleClose() {
        setAnchorEl(null);
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

    const getMobileMenuButtons = () => {
        return headerOptions.map(({ label, href }) => {
            return (
                <MenuItem 
                    {...{component: RouterLink, to: href}}
                    sx={{
                        fontFamily: "Open Sans, sans-serif",
                        fontWeight: 700,
                        key: label,
                        color: "inherit"
                    }}
                    onClick={handleClose}
                >
                    {label}
                </MenuItem>
            )
        }) 
    }

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

    const displayMobile = () => {
        return (
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <div onClick={home} style={{display: 'flex', cursor: 'pointer'}}>
                    <SportsFootballIcon sx={{marginTop: '3px'}} fontSize='large'/>
                    {logo}
                </div>
                <MenuIcon onClick={handleClick} fontSize='large'/>
                <Menu onClick={handleClose} anchorEl={anchorEl} open={open}>
                    {getMobileMenuButtons()}
                </Menu>
            </Toolbar>
        )
    }

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
                {isMobile ? displayMobile() : displayDesktop()}
            </AppBar>
        </header>
    )

}

export default Header;