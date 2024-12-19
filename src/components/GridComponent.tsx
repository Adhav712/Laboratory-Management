


import { Lab } from '../types/Lab';
import { deleteLab, updateLab } from '../store/labSlice';
import { useDispatch } from 'react-redux';
import { Select, Tag } from 'antd';
import TableComponent from './TableComponent';
import {
    ColDef
} from 'ag-grid-community';
import { CustomCellEditorProps, CustomCellRendererProps } from 'ag-grid-react';

interface GridComponentProps {
    rowData: Lab[];
    onRowClick: (data: Lab) => void;
}

const GridComponent: React.FC<GridComponentProps> = ({ rowData, onRowClick }) => {
    const dispatch = useDispatch();
    const columns: ColDef[] = [
        {
            headerName: 'ID', field: 'id', sortable: true,
            cellRenderer: (params: CustomCellRendererProps) => {
                return <span
                    className='cursor-pointer text-blue-500'
                    onClick={() => onRowClick(params.data)}
                >{params.value}</span>;
            },
            width: 80
        },
        {
            headerName: 'Lab Name', field: 'labName', sortable: true, filter: true,
        },
        { headerName: 'Location', field: 'location', sortable: true, filter: true },
        {
            headerName: 'Contact Person',
            field: 'contactPerson',
            sortable: true,
            filter: true
        },
        {
            headerName: 'Contact Number',
            field: 'contactNumber',
            sortable: true,
            filter: true
        },
        {
            headerName: 'Services Offered',
            field: 'servicesOffered',
            sortable: true,
            filter: true,
            // width: 250,
            flex: 1,
            cellRenderer: (params: CustomCellRendererProps) => {
                return (
                    params.value.map((service: string) => (
                        <Tag key={service}
                            color='blue'
                            className='mb-1'
                        >{service}</Tag>
                    ))
                )
            },
            editable: true,
            cellEditor: (params: CustomCellEditorProps) => {
                return (
                    <Select
                        mode='multiple'
                        placeholder='Select Services'
                        value={params.value ? params.value : []}
                        onChange={(value) => {
                            dispatch(updateLab({ ...params.data, servicesOffered: value }));
                            params.stopEditing()
                        }}
                        onBlur={() => {
                            params.stopEditing()
                        }}
                        options={
                            ['Chemical Analysis', 'Oil Testing', 'Water Quality', "Material Testing",
                                "Environmental Testing"].map((service) => ({
                                    label: service,
                                    value: service
                                }))
                        }
                        allowClear
                        style={{ width: '100%' }}
                    />
                )
            },
            cellEditorPopup: true
        },
        {
            headerName: 'Status',
            field: 'status',
            sortable: true,
            filter: true,
            cellRenderer: (params: CustomCellRendererProps) => {
                return <Tag
                    color={params.value === 'Active' ? 'green' : 'red'}
                >{params.value}</Tag>;
            },
            width: 100
        },
        {
            headerName: 'Action',
            field: 'id',
            //    delete Button
            cellRenderer: (params: CustomCellRendererProps) => {
                return <span
                    className='cursor-pointer text-red-500 flex items-center justify-center mt-2'
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this item?')) {
                            dispatch(deleteLab(params.data.id));
                        }
                    }}
                >
                    {/* Delete Dustbin ICon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>

                </span>;
            },
            width: 100
        },
    ];

    return (
        <TableComponent
            columns={columns}
            data={rowData}
            isLoading={false}
            defaultColDef={{
                flex: 0
            }}
        />
    );
};

export default GridComponent;