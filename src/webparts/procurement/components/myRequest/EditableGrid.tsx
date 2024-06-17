import * as React from 'react';
import { IGridRow } from './IGridRow';
import styles from '../Procurement.module.scss';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { getListItems } from '../utils/sp.utils';
import { listNames } from '../utils/models.utils';

interface EditableGridProps {
    rows: IGridRow[];
    suppliers: string[];
    onAddRow: () => void;
    onDeleteRow: (id: number) => void;
    onChangeRow: (id: number, row: IGridRow) => void;
    context: any;
    onGridUpdate: (rows: IGridRow[]) => void;
}

const EditableGrid: React.FC<EditableGridProps> = ({ rows, suppliers, onAddRow, onDeleteRow, onChangeRow, context, onGridUpdate }) => {
    const [itemsBySupplier, setItemsBySupplier] = React.useState<{ [supplier: string]: string[] }>({});
    const [itemLists, setItemLists] = React.useState<{ [item: string]: { price: number, currency: string } }>({});

    React.useEffect(() => {
        const fetchItemsBySupplier = async (supplier: string) => {
            try {
                const items = await getListItems(context, listNames.items);
                const activeItems = items.filter(item => item.Status === 'Active');
                const itemsForSupplier = activeItems
                    .filter(item => item.Supplier === supplier)
                    .map(item => item.Item);

                setItemsBySupplier(prevState => ({
                    ...prevState,
                    [supplier]: itemsForSupplier
                }));

                const listItems: { [item: string]: { price: number, currency: string } } = {};
                items.forEach(item => {
                    listItems[item.Item] = { price: item.Price, currency: item.Currency };
                });

                setItemLists(listItems);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        suppliers.forEach(supplier => {
            fetchItemsBySupplier(supplier);
        });
    }, [context, suppliers]);

    const handleSupplierChange = (id: number, supplier: string) => {
        const updatedRows = rows.map(row => {
            if (row.Id === id) {
                return { ...row, Supplier: supplier, Item: '', UnitPrice: 0, Currency: '' };
            }
            return row;
        });

        onGridUpdate(updatedRows);
        const updatedRow = updatedRows.filter(row => row.Id === id)[0];
        if (updatedRow) {
            onChangeRow(id, updatedRow);
        }
    };

    const handleItemChange = (id: number, item: string) => {
        const updatedRows = rows.map(row => {
            if (row.Id === id) {
                const itemData = itemLists[item] || { price: 0, currency: '' };
                return { ...row, Item: item, UnitPrice: itemData.price, Currency: itemData.currency };
            }
            return row;
        });
        onGridUpdate(updatedRows);
        const updatedRow = updatedRows.filter(row => row.Id === id)[0];
        if (updatedRow) {
            onChangeRow(id, updatedRow);
        }
    };

    const handleChange = (id: number, key: keyof IGridRow, value: any) => {
        const updatedRows = rows.map(row => {
            if (row.Id === id) {
                return { ...row, [key]: value };
            }
            return row;
        });
        onGridUpdate(updatedRows);
        const updatedRow = updatedRows.filter(row => row.Id === id)[0];
        if (updatedRow) {
            onChangeRow(id, updatedRow);
        }
    };


    const formatCurrency = (value: number, currency: string) => {
        return `${currency} ${value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    return (
        <div className="table-responsive">
            <table className={`table table-bordered table-sm ${styles.editableTable}`}>
                <thead>
                    <tr>
                        <th>S/N</th>
                        <th>Supplier</th>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Delivery Date</th>
                        <th className={styles.rightAlign}>Unit Price</th>
                        <th className={styles.rightAlign}>Total Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={row.Id}>
                            <td>{row.Id}</td>
                            <td>
                                <select className={styles.tableform} value={row.Supplier} onChange={e => handleSupplierChange(row.Id, e.target.value)}>
                                    <option value="">Select Supplier</option>
                                    {suppliers.map((supplier, index) => (
                                        <option key={index} value={supplier}>{supplier}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <select className={styles.tableform} value={row.Item} onChange={e => handleItemChange(row.Id, e.target.value)}>
                                    <option value="">Select Item</option>
                                    {itemsBySupplier[row.Supplier]?.map((item, index) => (
                                        <option key={index} value={item}>{item}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <input className={styles.tableform} type="number" value={row.Quantity} onChange={e => handleChange(row.Id, 'Quantity', parseInt(e.target.value))} />
                            </td>
                            <td>
                                <input className={styles.tableform} type="date" value={row.DeliveryDate} onChange={e => handleChange(row.Id, 'DeliveryDate', e.target.value)} />
                            </td>
                            <td className={styles.rightAlign}>
                                {formatCurrency(row.UnitPrice, row.Currency)}
                            </td>
                            <td className={styles.rightAlign}>
                                {formatCurrency(row.UnitPrice * row.Quantity, row.Currency)}
                            </td>
                            <td>
                                <Icon iconName="Delete" className={styles.tableicon} onClick={() => onDeleteRow(row.Id)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button type="button" className={styles.addbutton} onClick={onAddRow}>Add Row</button>
        </div>
    );
};

export default EditableGrid;
