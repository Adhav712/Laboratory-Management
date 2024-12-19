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
    //  [
    //     {
    //         "id": 1,
    //         "labName": "Viswa Lab Chennai",
    //         "location": "Chennai",
    //         "contactPerson": "Dr. Ramesh",
    //         "contactNumber": "9876543210",
    //         "servicesOffered": [
    //             "Chemical Analysis",
    //             "Oil Testing",
    //             "Water Quality"
    //         ],
    //         "status": "Active",
    //         "testMethods": [
    //             {
    //                 "method": "ASTM D445",
    //                 "parameters": [
    //                     "Viscosity",
    //                     "Temperature"
    //                 ],
    //                 "sampleType": "Oil"
    //             },
    //             {
    //                 "method": "ISO 7027",
    //                 "parameters": [
    //                     "Turbidity"
    //                 ],
    //                 "sampleType": "Water"
    //             }
    //         ]
    //     },
    //     {
    //         "id": 2,
    //         "labName": "Viswa Lab Mumbai",
    //         "location": "Mumbai",
    //         "contactPerson": "Dr. Priya",
    //         "contactNumber": "9123456789",
    //         "servicesOffered": [
    //             "Material Testing",
    //             "Environmental Testing"
    //         ],
    //         "status": "Inactive",
    //         "testMethods": [
    //             {
    //                 "method": "ISO 9001",
    //                 "parameters": [
    //                     "Hardness",
    //                     "Tensile Strength"
    //                 ],
    //                 "sampleType": "Metal"
    //             },
    //             {
    //                 "method": "EPA 8270D",
    //                 "parameters": [
    //                     "Organic Pollutants"
    //                 ],
    //                 "sampleType": "Air"
    //             }
    //         ]
    //     }
    // ] as Lab[],
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
