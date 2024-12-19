import { z } from 'zod';
import { CustomField } from '../components/FormComponent';
import { parameters } from '../utils/faker';

export const initialFormHeaders: CustomField[] = [
    {
        name: 'labName',
        label: 'Lab Name',
        type: 'input',
        validation: {
            required: true,
            pattern: z.string().min(3, { message: 'Lab Name must be at least 3 characters' }),
        }

    },
    {
        name: 'location',
        label: 'Location',
        type: 'input',
        validation: {
            required: true,
            pattern: z.string().min(3, { message: 'Location must be at least 3 characters' }),
        }
    },
    {
        name: 'contactPerson',
        label: 'Contact Person',
        type: 'input',
        validation: {
            required: true,
            pattern: z.string().min(3, { message: 'Contact Person must be at least 3 characters' }),
        }
    },
    {
        name: 'contactNumber',
        label: 'Contact Number',
        type: 'input',
        validation: {
            required: true,
            pattern: z.string().regex(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, { message: 'Enter a valid contact number' }),
        }
    },
    {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: ['Active', 'Inactive'],
        validation: {
            required: true,
            pattern: z.enum(['Active', 'Inactive'], { message: 'Select a valid status' }),
        }
    },
    {
        name: 'servicesOffered',
        label: 'Services Offered',
        type: 'select',
        options: [
            'Chemical Analysis',
            'Oil Testing',
            'Water Quality',
            'Material Testing',
            'Environmental Testing',
        ],
        isInputProps: {
            multiple: true
        },
        validation: {
            required: true,
            pattern: z.array(z.string()).min(1, { message: 'Please select at least one service' }),
        }
    }
];


export const initialTestMethods: CustomField[] = [
    {
        name: 'method',
        label: 'Method',
        type: 'input',
        validation: {
            required: true,
            pattern: z.string().min(3, { message: 'Method must be at least 3 characters' }),
        }
    },
    {
        name: 'parameters',
        label: 'Parameters',
        type: 'select',
        options: parameters,
        isInputProps: {
            multiple: true
        },
        validation: {
            required: true,
            pattern: z.array(z.string()).min(1, { message: 'Please select at least one parameter' }),
        }
    },
    {
        name: 'sampleType',
        label: 'Sample Type',
        type: 'select',
        options: ['Oil', 'Water', 'Air', 'Metal'],
        validation: {
            required: true,
            pattern: z.enum(['Oil', 'Water', 'Air', 'Metal'], { message: 'Select a valid sample type' }),
        }
    }
]