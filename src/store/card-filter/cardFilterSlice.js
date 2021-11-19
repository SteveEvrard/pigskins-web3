import { createSlice } from '@reduxjs/toolkit';

export const cardFilterSlice = createSlice({

    name: 'cardFilter',
    initialState: {
        value: {
            position: 'Position',
            rarity: 'Rarity'
        }
    },
    reducers: {
        setPosition: (state, action) => {
            state.value.position = action.payload
        },
        setRarity: (state, action) => {
            state.value.rarity = action.payload
        }
    }

});

export const { setPosition } = cardFilterSlice.actions;
export const { setRarity } = cardFilterSlice.actions;

export default cardFilterSlice.reducer;