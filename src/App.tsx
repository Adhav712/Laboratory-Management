import { useRef, useState } from 'react';
import GridComponent from './components/GridComponent';
import DynamicForm, { FieldSchema } from './components/DynamicForm';
import { useSelector, useDispatch } from 'react-redux';
import { addLab, emptyLab, updateLab } from './store/labSlice';
import { Button, Divider, Input, InputRef, Modal, Select, Space } from 'antd';
import { Lab } from './types/Lab';
import { RootState } from './store';
import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { PlusOutlined } from '@ant-design/icons';



const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTestMethodModalOpen, setIsTestMethodModalOpen] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const [editData, setEditData] = useState<Lab | null>(null); // Specify type for editData
  const dispatch = useDispatch();

  const labs = useSelector((state: RootState) => state.labs); // Specify type for state

  console.log(labs);

  const handleRowClick = (data: Lab) => { // Specify type for data
    setEditData(data);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Lab) => { // Specify type for data
    if (editData) {
      dispatch(updateLab(data));
    } else {
      console.log(data);

      dispatch(addLab({ ...data, id: labs.length + 1 }));
    }
    setIsModalOpen(false);
  };

  const initialFormHeaders: FieldSchema<Lab>[] = [
    {
      name: 'labName',
      label: 'Lab Name',
      type: 'text',
      validation: {
        required: true,
        pattern: z.string().min(3, { message: 'Lab Name must be at least 3 characters' }),
      }

    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      validation: {
        required: true,
        pattern: z.string().min(3, { message: 'Location must be at least 3 characters' }),
      }
    },
    {
      name: 'contactPerson',
      label: 'Contact Person',
      type: 'text',
      validation: {
        required: true,
        pattern: z.string().min(3, { message: 'Contact Person must be at least 3 characters' }),
      }
    },
    {
      name: 'contactNumber',
      label: 'Contact Number',
      type: 'text',
      validation: {
        required: true,
        pattern: z.string().regex(/^\d{10}$/, { message: 'Enter a valid contact number' }),
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
      isMultiSelect: true,
      validation: {
        required: true,
        pattern: z.array(z.string()).min(1, { message: 'Please select at least one service' }),
      }
    },
    // {
    //   name: 'testMethods',
    //   label: 'Test Methods',
    //   type: 'customRender',
    //   customRender: (data, field, fieldState, control, index) => {
    //     const sampleTypeValue = data.testMethods[index]?.sampleType; // Get sampleType value dynamically
    //     return (
    //       <div key={field.name} className="grid grid-cols-3 gap-4">
    //         <div>
    //           <label>Method</label>
    //           <Controller
    //             name={`testMethods[${index}].method`}
    //             control={control}
    //             render={({ field }) => <Input {...field} placeholder="Enter Method" />}
    //           />
    //         </div>
    //         <div>
    //           <label>Sample Type</label>
    //           <Controller
    //             name={`testMethods[${index}].sampleType`}
    //             control={control}
    //             render={({ field }) => (
    //               <Select
    //                 value={field.value}
    //                 onChange={(value) => field.onChange(value)}
    //                 options={['Oil', 'Water', 'Air', 'Metal'].map((type) => ({
    //                   label: type,
    //                   value: type,
    //                 }))}
    //                 className="w-full"
    //               />
    //             )}
    //           />
    //         </div>
    //         {['Oil', 'Water'].includes(sampleTypeValue) && ( // Conditional rendering based on sampleType
    //           <div>
    //             <label>Parameters</label>
    //             <Controller
    //               name={`testMethods[${index}].parameters`}
    //               control={control}
    //               render={({ field }) => (
    //                 <Select
    //                   mode="multiple"
    //                   value={field.value || []}
    //                   onChange={(value) => field.onChange(value)}
    //                   options={['Viscosity', 'Temperature', 'Turbidity', 'pH'].map((parameter) => ({
    //                     label: parameter,
    //                     value: parameter,
    //                   }))}
    //                   className="w-full"
    //                   allowClear
    //                   dropdownRender={(menu) => (
    //                     <>
    //                       {menu}
    //                       <Divider style={{ margin: '8px 0' }} />
    //                       <Space style={{ padding: '0 8px 4px' }}>
    //                         <Input
    //                           placeholder="Add custom parameter"
    //                           ref={inputRef}
    //                           onKeyDown={(e) => e.stopPropagation()}
    //                         />
    //                         <Button
    //                           type="text"
    //                           icon={<PlusOutlined />}
    //                           onClick={() => {
    //                             const customValue = inputRef.current?.value;
    //                             if (customValue) {
    //                               field.onChange([...field.value, customValue]);
    //                             }
    //                           }}
    //                         >
    //                           Add
    //                         </Button>
    //                       </Space>
    //                     </>
    //                   )}
    //                 />
    //               )}
    //             />
    //           </div>
    //         )}
    //       </div>
    //     );
    //   },

    // },
  ];
  const [formFields] = useState(initialFormHeaders);




  return (
    <div className="container mx-auto">
      <button className="btn btn-primary my-4" onClick={handleAdd}>
        Add Form
      </button>
      <div>

        <GridComponent rowData={labs || []} onRowClick={handleRowClick} />
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditData(null);
        }}
        footer={null}
        width={
          window.innerWidth > 768 ? '70%' : '100%'
        }
      >
        <DynamicForm
          initialValues={editData || emptyLab}
          onSubmit={handleSubmit}
          fields={formFields}
        />
        <div className='flex justify-between px-5'>
          <p className='text-xl font-semibold'>Test Method</p>
          <Button onClick={() => {
            setIsTestMethodModalOpen(true);
          }}>
            Add Test Method
          </Button>
        </div>
        <div>
          <div className=''>
            {editData?.testMethods.map((method, index) => (
              <div key={index}
                className='flex flex-row gap-4'
              >
                <div>
                  <label>Method</label>
                  <Input
                    value={method.method}
                    onChange={(e) => {
                      console.log('Method', e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label>Parameters</label>
                  <Select
                    mode='multiple'
                    placeholder='Select Parameters'
                    value={method.parameters}
                    onChange={(value) => {
                      console.log('Parameters', value);
                    }}
                    options={['Viscosity', 'Temperature', 'Turbidity', 'pH'].map((parameter) => ({
                      label: parameter,
                      value: parameter,
                    }))}
                    className='w-full'
                  />
                </div>
                <div className='mb-4 flex flex-col w-1/2'>
                  <label>Sample Type</label>
                  <Select
                    value={method.sampleType}
                    onChange={(value) => {
                      console.log('Sample Type', value);
                    }}
                    options={['Oil', 'Water', 'Air', 'Metal'].map((type) => ({
                      label: type,
                      value: type,
                    }))}
                    className='w-full'
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
      {/* 
        Add Test Method Modal
      */}
      <Modal
        open={isTestMethodModalOpen}
        onCancel={() => {
          setIsTestMethodModalOpen(false);
        }}
        footer={null}
        className='w-1/2'
      >
        <DynamicForm
          initialValues={emptyLab}
          onSubmit={(data) => {
            console.log(data);
          }}
          fields={[
            {
              name: 'method',
              label: 'Method',
              type: 'text',
              validation: {
                required: true,
                pattern: z.string().min(3, { message: 'Method must be at least 3 characters' }),
              }
            },
            {
              name: 'parameters',
              label: 'Parameters',
              type: 'select',
              options: ['Viscosity', 'Temperature', 'Turbidity', 'pH'],
              isMultiSelect: true,
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
          ]}
        />
      </Modal>


    </div>
  );
};

export default App;