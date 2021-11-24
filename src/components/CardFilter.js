import React, { useState } from 'react';
import { MenuItem, Select } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setPosition, setRarity } from '../store/card-filter/cardFilterSlice';

const CardFilter = ( props ) => {

    const dispatch = useDispatch();
    const [selectedPosition, setSelectedPosition] = useState('Position');
    const [selectedRarity, setSelectedRarity] = useState('Rarity');
    const isMobile = useSelector((state) => state.mobile.value);

    const handleSelectPosition = (e) => {
        setSelectedPosition(e.target.value);
        dispatch(setPosition(e.target.value));
    }

    const handleSelectRarity = (e) => {
        setSelectedRarity(e.target.value);
        dispatch(setRarity(e.target.value));
    }

    return (
        <div style={{display: 'flex', width: isMobile ? '100vw' : '40vw', justifyContent: 'space-evenly'}}>
            <Select sx={{width: isMobile ? '33vw' : '15vw', marginBottom: '3vw'}} color='darkGreen' placeholder='Position' onChange={handleSelectPosition} value={selectedPosition}>
                <MenuItem disabled value={'Position'}>Position</MenuItem>
                <MenuItem value={'All'}>All</MenuItem>
                <MenuItem value={'QB'}>QB</MenuItem>
                <MenuItem value={'RB'}>RB</MenuItem>
                <MenuItem value={'WR'}>WR</MenuItem>
                <MenuItem value={'TE'}>TE</MenuItem>
            </Select>
            <Select sx={{width: isMobile ? '33vw' : '15vw', marginBottom: '3vw'}} color='darkGreen' placeholder='Position' onChange={handleSelectRarity} value={selectedRarity}>
                <MenuItem disabled value={'Rarity'}>Rarity</MenuItem>
                <MenuItem value={'All'}>All</MenuItem>
                <MenuItem value={'0'}>Common</MenuItem>
                <MenuItem value={'1'}>Rare</MenuItem>
                <MenuItem value={'2'}>Exotic</MenuItem>
                <MenuItem value={'3'}>Legendary</MenuItem>
                <MenuItem value={'Special'}>Special</MenuItem>
            </Select>
        </div>
    )
}

export default CardFilter;