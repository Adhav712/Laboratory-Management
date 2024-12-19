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
        addTestMethod: (state, action: { payload: { labId: number, method: string, parameters: string[], sampleType: string } }) => {
            const index = state.findIndex((lab) => lab.id === action.payload.labId);
            if (index !== -1) {
                state[index].testMethods.push({
                    method: action.payload.method,
                    parameters: action.payload.parameters,
                    sampleType: action.payload.sampleType
                });
            }
        },
        updateLab: (state, action: { payload: Lab }) => {
            const index = state.findIndex((lab) => lab.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        updateTestMethod: (state, action: { payload: { labId: number, method: string, parameters: string[], sampleType: string } }) => {
            const index = state.findIndex((lab) => lab.id === action.payload.labId);
            if (index !== -1) {
                const methodIndex = state[index].testMethods.findIndex((method) => method.method === action.payload.method);
                if (methodIndex !== -1) {
                    state[index].testMethods[methodIndex] = {
                        method: action.payload.method,
                        parameters: action.payload.parameters,
                        sampleType: action.payload.sampleType
                    };
                }
            }
        },
        deleteLab: (state, action: { payload: number }) => {
            return state.filter((lab) => lab.id !== action.payload);
        },
        deleteTestMethod: (state, action: { payload: { labId: number, method: string } }) => {
            const index = state.findIndex((lab) => lab.id === action.payload.labId);
            if (index !== -1) {
                state[index].testMethods = state[index].testMethods.filter((method) => method.method !== action.payload.method);
            }
        }
    },
});

export const { addLab, updateLab, deleteLab, deleteTestMethod, addTestMethod, updateTestMethod } = labSlice.actions;
export default labSlice.reducer;
