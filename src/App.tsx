import { useState } from 'react';
import GridComponent from './components/GridComponent';
import DynamicForm, { FieldSchema } from './components/DynamicForm';
import { useSelector, useDispatch } from 'react-redux';
import { addLab, emptyLab, updateLab } from './store/labSlice';
import { Input, Modal, Select } from 'antd';
import { Lab } from './types/Lab';
import { RootState } from './store';
import { z } from 'zod';
import { Controller } from 'react-hook-form';



const initialFormHeaders: FieldSchema<Lab>[] = [
  {
    name: 'labName', label: 'Lab Name', type: 'text',
    validation: { required: true, pattern: z.string().min(3) }
  },
  {
    name: 'location', label: 'Location', type: 'text',
    validation: { required: true, pattern: z.string().min(3) }
  },
  {
    name: 'contactPerson', label: 'Contact Person', type: 'text',
    validation: { required: true, pattern: z.string().min(3) }
  },
  {
    name: 'contactNumber', label: 'Contact Number', type: 'text',
    validation: { required: true, pattern: z.string().min(3) }
  },
  {
    name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'],
    validation: { required: true, pattern: z.string().min(3) }
  },
  {
    name: 'servicesOffered', label: 'Services Offered', type: 'select',
    options: ['Chemical Analysis', 'Oil Testing', 'Water Quality', "Material Testing",
      "Environmental Testing"],
    isMultiSelect: true,
    validation: {
      required: true, pattern:
        z.array(z.string()).min(1).refine((services) => services.length >= 1, {
          message: 'Please select at least one service',
        }),
    }
  },
  {
    name: 'testMethods',
    label: 'Test Methods',
    type: 'customRender',
    // validation: { required: true, pattern: z.string().min(3) }
    customRender: (data: Lab, field, fieldState, control) => {
      return (
        <div>
          {data.testMethods.map((method, index) => (
            <div key={index} className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Method</label>
              <Controller
                name={`testMethods[${index}].method`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Method"
                    className="w-full"
                  />
                )}
              />
              <label className="mb-2 text-sm font-medium text-gray-700">Parameters</label>
              <Controller
                name={`testMethods[${index}].parameters`}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    mode="multiple"
                    placeholder="Parameters"
                    className="w-full"
                  >
                    {['Viscosity', 'Temperature', 'Turbidity', 'Hardness', 'Tensile Strength', 'Organic Pollutants'].map((param) => (
                      <Select.Option key={param} value={param}>
                        {param}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              <label className="mb-2 text-sm font-medium text-gray-700">Sample Type</label>
              <Controller
                name={`testMethods[${index}].sampleType`}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Sample Type"
                    className="w-full"
                  >
                    {['Oil', 'Water', 'Metal', 'Air'].map((param) => (
                      <Select.Option key={param} value={param}>
                        {param}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </div>
          ))}
        </div>
      );
    }
  }
]
const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          window.innerWidth > 768 ? '50%' : '100%'
        }
      >
        <DynamicForm
          initialValues={editData || emptyLab}
          onSubmit={handleSubmit}
          fields={formFields}
        />
      </Modal>
    </div>
  );
};

export default App;