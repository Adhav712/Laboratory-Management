import React, { Suspense, useCallback } from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { initialFormHeaders } from '../../store/initialData';
import { updateLab, addLab, deleteTestMethod } from '../../store/labSlice';
import { Lab, TestMethod } from '../../types/Lab';
import ReusableForm from '../FormComponent';
import TableComponent from '../TableComponent';
import { CustomCellRendererProps } from 'ag-grid-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface MainCardProps {
    editData: Lab | null;
    setIsModalOpen: (state: boolean) => void;
    labs: Lab[];
    setIsTestMethodModalOpen: (state: boolean) => void;
    setCurrentTestMethod: (state: TestMethod) => void;
}

const MainCard: React.FC<MainCardProps> = ({
    editData,
    setIsModalOpen,
    labs,
    setIsTestMethodModalOpen,
    setCurrentTestMethod
}) => {
    const dispatch = useDispatch();
    const MainFormSchemaObject = Object.fromEntries(
        initialFormHeaders
            .filter((field) => field?.name) // Ensure fields with a valid name
            .map((field) => [
                field?.name, // Use field name as key
                field?.validation?.pattern ||
                (field?.validation?.required ? z.string().min(1) : z.nullable(z.any()))
            ])
    );
    const schema = z.object(MainFormSchemaObject).required();

    const MainFormMethods = useForm({
        resolver: zodResolver(schema),
        defaultValues: editData ?? {}
    });
    const handleSubmit = useCallback((data: Lab) => {
        console.log(data);

        if (editData) {
            dispatch(updateLab(data));
        } else {
            dispatch(addLab({ ...data, id: labs.length + 1, testMethods: [] }));
        }
        setIsModalOpen(false);

        console.log(data);

    },
        [dispatch, editData, labs.length, setIsModalOpen]
    );


    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <ReusableForm
                    fields={initialFormHeaders}
                    onSubmit={(data) => {
                        console.log(data);
                        handleSubmit(data as Lab);
                    }}
                    formMethods={MainFormMethods as unknown as UseFormReturn<FieldValues>}
                    buttonComponent={(handleSubmit) => (
                        <>
                            <div className="w-full flex justify-end mb-2">
                                <Button
                                    className=''
                                    onClick={handleSubmit}>
                                    {editData ? 'Update' : 'Submit'}
                                </Button>
                            </div>
                        </>
                    )}
                    gridLayout='3x3'
                />

            </Suspense>
            <div className='flex justify-between'>
                <p className='text-xl font-semibold'>Test Method</p>
                <Button onClick={() => {
                    setIsTestMethodModalOpen(true);
                    setCurrentTestMethod({
                        method: '',
                        parameters: [],
                        sampleType: ''
                    });
                }}>
                    Add Test Method
                </Button>
            </div>
            <div>
                <div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <TableComponent
                            data={
                                labs.find((lab) => lab.id === editData?.id)?.testMethods || []}
                            isLoading={false}
                            paginationPageSize={5}
                            paginationPageSizeSelector={
                                // Increment by 5 after 20 then 50, 100, 200, 500, 1000
                                Array.from({ length: 6 }, (_, index) => index * 5 + 5)

                            }
                            height='35vh'
                            columns={[
                                {
                                    headerName: 'Method',
                                    field: 'method',
                                    sortable: true,
                                    filter: true,
                                    flex: 1,
                                },
                                {
                                    headerName: 'Parameters',
                                    field: 'parameters',
                                    sortable: true,
                                    filter: true,
                                    flex: 1,
                                },
                                {
                                    headerName: 'Sample Type',
                                    field: 'sampleType',
                                    sortable: true,
                                    filter: true,
                                    flex: 1,
                                },
                                {
                                    headerName: 'Action',
                                    field: 'Action',
                                    cellRenderer: (params: CustomCellRendererProps) => {
                                        return (
                                            <div className="flex gap-4">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => {
                                                        setIsTestMethodModalOpen(true);
                                                        setCurrentTestMethod(params.data);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800"
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this item?')) {
                                                            dispatch(deleteTestMethod(
                                                                {
                                                                    labId: editData?.id || 0,
                                                                    method: params.data.method
                                                                }
                                                            ));
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )
                                    },
                                    flex: 1,
                                }
                            ]}
                        />
                    </Suspense>
                </div>
            </div>
        </>
    )
};

export default MainCard;