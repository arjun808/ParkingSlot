import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Item {
    id: number;
    registrationNumber: string;
    isAvailable: boolean;
    parkedAt?: string;
}


const storedLength = localStorage.getItem('arrayLength');
const storedItems = localStorage.getItem('items');

const initialState = {
    length: storedLength ? parseInt(storedLength, 10) : 0,
    items: storedItems ? JSON.parse(storedItems) as Item[] : [],
};

const lengthSlice = createSlice({
    name: 'length',
    initialState,
    reducers: {
        setLength(state, action: PayloadAction<number>) {
            const newLength = action.payload;
            state.length = newLength;
            state.items = Array.from({ length: newLength }, (_, index) => ({
                id: index + 1,
                registrationNumber: "",
                isAvailable: true,
                parkedAt: undefined, // Initial state has no parking time
            }));
            localStorage.setItem('arrayLength', newLength.toString());
            localStorage.setItem('items', JSON.stringify(state.items));
        },
      
        updateRegistrationNumber(state, action: PayloadAction<{ id: number; registrationNumber: string }>) {
            const { id, registrationNumber } = action.payload;
            const item = state.items.find(item => item.id === id);
           
            if (item) {
                item.registrationNumber = registrationNumber;
                item.isAvailable = !item.isAvailable; 
                if (registrationNumber) {
                    item.parkedAt = new Date().toISOString(); 
                }
            }
            localStorage.setItem('items', JSON.stringify(state.items)); // Save updated items array
        },
    },
});

export const { setLength, updateRegistrationNumber } = lengthSlice.actions;
export default lengthSlice.reducer;
