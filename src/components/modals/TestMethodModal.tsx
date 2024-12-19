import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { initialTestMethods } from '../../store/initialData';
import { addTestMethod, updateTestMethod } from '../../store/labSlice';
import { Lab, TestMethod } from '../../types/Lab';
import ReusableForm from '../FormComponent';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


interface TestMethodModalProps {
    editData: Lab | null;
    setIsTestMethodModalOpen: (state: boolean) => void;
}

const TestMethodModal: React.FC<TestMethodModalProps> = ({
    editData,
    setIsTestMethodModalOpen,
}) => {
    const dispatch = useDispatch();
    const TestMethodSchemaObject = Object.fromEntries(
        initialTestMethods
            .filter((field) => field?.name) // Ensure fields with a valid name
            .map((field) => [
                field?.name, // Use field name as key
                field?.validation?.pattern ||
                (field?.validation?.required ? z.string().min(1) : z.nullable(z.any()))
            ])
    );

    const schema = z.object(TestMethodSchemaObject).required();
    const TestMethodFormMethods = useForm({
        resolver: zodResolver(schema),
    });


    const handleSubmit = (data: TestMethod) => {
        if (editData) {
            dispatch(addTestMethod({ labId: editData.id, ...data }));
        } else {
            dispatch(updateTestMethod(data));
        }
        setIsTestMethodModalOpen(false);
    };

    return (
        <ReusableForm
            fields={initialTestMethods}
            onSubmit={(data) => handleSubmit(data as TestMethod)}
            formMethods={TestMethodFormMethods}
            buttonComponent={(handleSubmit) => (
                <Button htmlType="submit" onClick={handleSubmit}>
                    Submit
                </Button>
            )}
            gridLayout="1x1"
        />
    );
};

export default TestMethodModal;