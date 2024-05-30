import * as React from 'react';
import { IGridRow } from './IGridRow';
import styles from '../Procurement.module.scss';
import { Icon } from 'office-ui-fabric-react/lib/Icon';


interface EditableGridProps {
    rows: IGridRow[];
    onAddRow: () => void;
    onDeleteRow: (id: number) => void;
    onChangeRow: (id: number, row: IGridRow) => void;
}

const EditableGrid: React.FC<EditableGridProps> = ({ rows, onAddRow, onDeleteRow, onChangeRow }) => {
    const handleChange = (id: number, key: keyof IGridRow, value: any) => {
        const updatedRows = rows.map(row => {
            if (row.Id === id) {
                return { ...row, [key]: value };
            }
            return row;
        });
        const updatedRow = updatedRows.filter(row => row.Id === id)[0];
        if (updatedRow) {
            onChangeRow(id, updatedRow);
        }
    };



    return (
        <div>
            <table className='table table-bordered table-sm '>
                <thead>
                    <tr>
                        <th>S/N</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={row.Id}>
                            <td>{row.Id}</td>
                            <td><input className={styles.tableform} type="text" value={row.Description} onChange={e => handleChange(row.Id, 'Description', e.target.value)} /></td>
                            <td><input className={styles.tableform} type="number" value={row.Quantity} onChange={e => handleChange(row.Id, 'Quantity', parseInt(e.target.value))} /></td>
                            <td><input className={styles.tableform} type="number" value={row.UnitPrice} onChange={e => handleChange(row.Id, 'UnitPrice', parseFloat(e.target.value))} /></td>
                            <td><input className={styles.tableform} type="number" value={row.UnitPrice * row.Quantity} disabled/></td>
                            <td><Icon iconName="Delete" className={styles.tableicon} onClick={() => onDeleteRow(row.Id)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button type="button" onClick={onAddRow}>Add Row</button>
        </div>
    );
};

export default EditableGrid;
