import { createSlice } from '@reduxjs/toolkit';
import { Lab } from '../types/Lab';
import { generateFakeLabs } from '../utils/faker';

export const emptyLab: Lab = {
    id: 0,
    labName: '',
    location: '',
    contactPerson: '',
    contactNumber: '',
    servicesOffered: [],
    status: '',
    testMethods: [
        {
            method: '',
            parameters: [],
            sampleType: ''
        }
    ]
};



const labSlice = createSlice({
    name: 'labs',
    initialState: generateFakeLabs(20),
    reducers: {
        addLab: (state, action: { payload: Lab }) => {
            state.push(action.payload);
        },
        updateLab: (state, action: { payload: Lab }) => {
            const index = state.findIndex((lab) => lab.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteLab: (state, action: { payload: number }) => {
            return state.filter((lab) => lab.id !== action.payload);
        },
    },
});

export const { addLab, updateLab, deleteLab } = labSlice.actions;
export default labSlice.reducer;
