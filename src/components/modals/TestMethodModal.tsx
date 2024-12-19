import React, { useCallback, useEffect } from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { initialTestMethods } from '../../store/initialData';
import { emptyTestMethod, updateTestMethod } from '../../store/labSlice';
import { Lab, TestMethod } from '../../types/Lab';
import ReusableForm from '../FormComponent';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


interface TestMethodModalProps {
    editData: Lab | null;
    setIsTestMethodModalOpen: (state: boolean) => void;
    currentTestMethod: TestMethod | null;
    isEdit: boolean;
    setTempTestMethodData: (state: TestMethod[]) => void;
    tempTestMethodData: TestMethod[];
}

const TestMethodModal: React.FC<TestMethodModalProps> = ({
    editData,
    setIsTestMethodModalOpen,
    currentTestMethod,
    isEdit,
    setTempTestMethodData,
    tempTestMethodData
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
        defaultValues: currentTestMethod ?? emptyTestMethod
    });


    const handleSubmit = useCallback((data: TestMethod) => {
        if ((editData?.id !== 0) && isEdit) {
            dispatch(updateTestMethod(data));
        } else {
            setTempTestMethodData(
                [...tempTestMethodData, { ...data, id: tempTestMethodData.length + 1 }]
            );
        }
        setIsTestMethodModalOpen(false);
    }, [dispatch, editData, isEdit, setIsTestMethodModalOpen, tempTestMethodData, setTempTestMethodData]);

    useEffect(() => {
        if ((editData?.id !== 0) && currentTestMethod && isEdit) {
            TestMethodFormMethods.reset(currentTestMethod);
        } else {
            TestMethodFormMethods.reset(emptyTestMethod);
        }
    }, [TestMethodFormMethods, currentTestMethod, editData, isEdit]);
    return (
        <ReusableForm
            fields={initialTestMethods}
            onSubmit={(data) => handleSubmit(data as TestMethod)}
            formMethods={TestMethodFormMethods as unknown as UseFormReturn<FieldValues>}
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