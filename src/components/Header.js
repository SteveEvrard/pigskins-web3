import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, MenuItem, Menu, Badge } from '@mui/material';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import { setCardDetail, setDisplayCard } from '../store/card-detail/cardDetailSlice';
import { styled } from '@mui/material/styles';
import { signer } from '../ethereum/ethers';
import TwitterIcon from '@mui/icons-material/Twitter';
import { mdiDiscord } from '@mdi/js';
import Icon from '@mdi/react'

const headerOptions = [
    // {label: 'Buy Pack', href: '/purchase'},
    {label: 'Auction', href: '/auction'},
    {label: 'Join Game', href: '/games'},
    {label: 'Leader Board', href: '/leader-board'},
    {label: 'My Auctions', href: '/my-auction'},
    {label: 'My Games', href: '/my-games'},
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
    const [hideMenu, setHideMenu] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [headerItems, setHeaderItems] = useState(headerOptions);
    const open = Boolean(anchorEl);
    const getAccount = async () => signer.getAddress().catch(() => setHideMenu(true));
    const isMobile = useSelector((state) => state.mobile.value);
    const notification = useSelector((state) => state.notification.value);

    useEffect(() => {
        checkOwner();
        checkWeb3Connected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const checkOwner = async () => {
        const account = await getAccount();
        if (account === process.env.REACT_APP_ACCOUNT_OWNER) {
            setHeaderItems(headerItems => [...headerItems, {label: 'Admin', href: '/admin'}])
        }
    }

    const checkWeb3Connected = async () => {
        if(!signer) {
            setHideMenu(true);
        }
    }

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

    const openMobileTwitter = () => {
        window.open('https://twitter.com/PigskinsNFT', '_blank');
    }

    const openDiscord = () => {
        window.open('https://discord.gg/zKTqRqwD', '_blank')
    }

    const getMenuButtons = () => {
        return headerItems.map(({ label, href }) => {
            return (
                <Button
                    {...{component: RouterLink, to: href}}
                    key={label}
                    sx={{
                        key: label,
                        color: "black",
                        fontWeight: 600
                    }}
                >
                    <StyledDotDesktop invisible={!(label === 'My Auctions' && notification)} variant='dot' color='primary'>{label}</StyledDotDesktop>
                </Button>
            );
        });
    };

    const getMobileMenuButtons = () => {
        return headerItems.map(({ label, href }) => {
            return (
                <MenuItem 
                    {...{component: RouterLink, to: href}}
                    sx={{
                        key: label,
                        color: "black",
                        fontWeight: 600
                    }}
                    key={label}
                    onClick={handleClose}
                >
                    <StyledDot anchorOrigin={{vertical: 'top', horizontal: 'right'}} invisible={!(label === 'My Auctions' && notification)} variant='dot' color='primary'>{label}</StyledDot>
                </MenuItem>
            )
        }) 
    }

    const displayDesktop = () => {
        return (
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between',}}>
                <div style={{display: 'flex', cursor: 'pointer', marginLeft: '6vw'}}>
                    {logo}
                </div>
                {hideMenu ? null : <div>{getMenuButtons()}</div>}
            </Toolbar>
        )
    };

    const displayMobile = () => {
        return (
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', cursor: 'pointer'}}>
                    {logo}
                    <div onClick={openMobileTwitter}><TwitterIcon sx={{marginTop: '3px', marginLeft: '1.5vw'}} fontSize='large'/></div>
                    <div onClick={openDiscord}><Icon style={{marginTop: '3px'}} size={1.75} path={mdiDiscord} /></div>
                </div>
                {hideMenu ? null :
                <div>
                    <StyledBadge color='primary' invisible={!notification}>
                        <MenuIcon color='darkGreen' onClick={handleClick} fontSize='large'/>
                    </StyledBadge>
                    <Menu onClick={handleClose} anchorEl={anchorEl} open={open}>
                        {getMobileMenuButtons()}
                    </Menu>
                </div>}
            </Toolbar>
        )
    }

    const logo = (
        <Typography onClick={home} variant="h4" component="h1"
            sx={{
                color: "#2e8b57",
                textAlign: "left",
                fontWeight: 600
            }}
        >
            PIGSKINS
        </Typography>
    );

    return (
        <header style={{width: '100vw', marginBottom: isMobile ? '55px' : '64px'}}>
            <AppBar position='fixed' sx={{backgroundColor: "#fff"}}>
                {isMobile ? displayMobile() : displayDesktop()}
            </AppBar>
        </header>
    )

}

export default Header;