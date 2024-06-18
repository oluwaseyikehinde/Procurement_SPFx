import * as React from 'react';
import { INewItemFormFields } from './IItemFields';
import { IWebPartProps } from "../../IProcurementProps";
import styles from '../../Procurement.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Loader from '../../loader/Loader';
import { Icon } from 'office-ui-fabric-react';


interface ListItem extends INewItemFormFields {
    id: number;
}

interface ItemsTableProps extends IWebPartProps{
    records: ListItem[];
    loading: boolean;
    error: string | null;
    onEdit: (item: ListItem) => void;
}

interface ItemsTableState {
    currentPage: number;
    itemsPerPage: number;
}

export class ItemsTable extends React.Component<ItemsTableProps, ItemsTableState> {
    constructor(props: ItemsTableProps) {
        super(props);
        this.state = {
            currentPage: 1,
            itemsPerPage: 5,
        };
    }


    handleClick = (event: React.MouseEvent<HTMLAnchorElement>, pageNumber: number) => {
        event.preventDefault();
        this.setState({ currentPage: pageNumber });
    };

    render() {
        const { records, loading, error, onEdit } = this.props;
        const { currentPage, itemsPerPage } = this.state;

        if (loading) {
            return <Loader />;
        }

        if (error) {
            return <div className={styles.centereddiv}>Error: {error}</div>;
        }

        if (records.length === 0) {
            return <div className={styles.centereddiv}>No records found</div>;
        }

        const formatCurrency = (value: number) => {
            return value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };

        // Calculate the current records to display
        const indexOfLastRecord = currentPage * itemsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
        const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

        // Calculate page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(records.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }


        return (
            <div>
                <h6 className={styles.mainheader}>Items Table</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Supplier</th>
                                <th scope="col">Item</th>
                                <th scope="col">Currency</th>
                                <th scope="col">Price</th>
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map(record => (
                                <tr key={record.id}>
                                    <td>{record.Supplier}</td>
                                    <td>{record.Item}</td>
                                    <td>{record.Currency}</td>
                                    <td>{formatCurrency(record.Price)}</td>
                                    <td>{record.Status}</td>
                                    <td>
                                        <button className={styles.tablebutton} onClick={() => onEdit(record)}>
                                            <Icon iconName="Edit" className={styles.buttonicon} /> Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <nav>
                        <ul className="pagination pagination-sm justify-content-center">
                            {pageNumbers.map(number => (
                                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                    <a href="!#" className="page-link" onClick={(e) => this.handleClick(e, number)}>
                                        {number}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }
}