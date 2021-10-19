import { createSlice } from '@reduxjs/toolkit';

export const gameSlice = createSlice({

    name: 'game',
    initialState: {
        value: {
            game: {},
            displayDialog: false,
            selectedCards: []
        }
    },
    reducers: {
        setGame: (state, action) => {
            state.value.game = action.payload
        },
        setDisplayDialog: (state, action) => {
            state.value.displayDialog = action.payload
        },
        setSelectedCardsView: (state, action) => {
            state.value.selectedCards = action.payload
        }
    }

});

export const { setGame } = gameSlice.actions;
export const { setDisplayDialog } = gameSlice.actions;
export const { setSelectedCardsView } = gameSlice.actions;

export default gameSlice.reducer;