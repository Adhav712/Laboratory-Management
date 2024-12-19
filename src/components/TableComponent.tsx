import { useRef } from 'react';
import { AllCommunityModule, ColDef, ColGroupDef, ModuleRegistry } from 'ag-grid-community';
import { useMediaQuery } from 'react-responsive';
import { AgGridReact } from 'ag-grid-react';

interface TableComponentProps<T> {
    columns: (ColDef | ColGroupDef)[];
    data: T[];
    isLoading: boolean;
    defaultColDef?: ColDef;
    height?: string;
    width?: string;
    paginationPageSize?: number;
    paginationPageSizeSelector?: number[];
}

ModuleRegistry.registerModules([AllCommunityModule]);

const TableComponent = <T,>({
    columns,
    data,
    isLoading,
    defaultColDef,
    height = '60vh',
    width = 'auto',
    paginationPageSize = 10,
    paginationPageSizeSelector = [10, 25, 50, 100, 200, 500, 1000]
}: TableComponentProps<T>) => {
    const gridRef = useRef<AgGridReact>(null);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    return (
        <div className={`ag-theme-quartz mx-2 ${isMobile ? 'overflow-x-auto' : ''}`} style={{ height, width }}>
            <AgGridReact
                ref={gridRef}
                columnDefs={columns}
                rowData={data}
                loadingOverlayComponent={'Loading...'}
                overlayNoRowsTemplate={'<span class="ag-overlay-loading-center">No rows to show</span>'}
                pagination={true}
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
                loading={isLoading}
                defaultColDef={{
                    flex: 1,
                    minWidth: 100,
                    resizable: true,
                    sortable: true,
                    filter: true,
                    ...defaultColDef
                }}
                enableCellTextSelection={true}
                domLayout={isMobile ? 'autoHeight' : 'normal'}
            />
            {isMobile && (
                <div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                        Swipe left to see more columns
                    </p>
                </div>
            )}
        </div>
    );
};

export default TableComponent;