import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, MenuItem, Menu, Badge } from '@mui/material';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import { setCardDetail, setDisplayCard } from '../store/card-detail/cardDetailSlice';
import { styled } from '@mui/material/styles';

const headerOptions = [
    {label: 'Purchase', href: '/purchase'},
    {label: 'Auction', href: '/auction'},
    {label: 'Completed', href: '/claim'},
    {label: 'My Cards', href: '/cards'},
    {label: 'Info', href: '/info'}
]

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: 0,
      top: 3
    },
}));

const StyledDot = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -5,
      top: 5
    },
}));

const StyledDotDesktop = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 4
    },
}));

const Header = ( props ) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const isMobile = useSelector((state) => state.mobile.value);
    const notification = useSelector((state) => state.notification.value);

    function home() {
        dispatch(setCardDetail({}));
        dispatch(setDisplayCard(false));
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
                    <StyledDotDesktop invisible={!(label === 'Completed' && notification)} variant='dot' color='primary'>{label}</StyledDotDesktop>
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
                    key={label}
                    onClick={handleClose}
                >
                    <StyledDot anchorOrigin={{vertical: 'top', horizontal: 'right'}} invisible={!(label === 'Completed' && notification)} variant='dot' color='primary'>{label}</StyledDot>
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
                <StyledBadge color='primary' invisible={!notification}>
                    <MenuIcon onClick={handleClick} fontSize='large'/>
                </StyledBadge>
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