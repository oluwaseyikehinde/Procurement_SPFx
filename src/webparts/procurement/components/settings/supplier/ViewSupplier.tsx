import * as React from 'react';
import { INewSupplierFormFields } from './ISupplierFields';
import { IWebPartProps } from "../../IProcurementProps";
import styles from '../../Procurement.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Loader from '../../loader/Loader';
import { Icon } from 'office-ui-fabric-react';

interface ListItem extends INewSupplierFormFields {
    id: number;
}

interface SuppliersTableProps extends IWebPartProps {
    records: ListItem[];
    loading: boolean;
    error: string | null;
    onEdit: (item: ListItem) => void;
}

interface SuppliersTableState {
    currentPage: number;
    itemsPerPage: number;
}

export class SuppliersTable extends React.Component<SuppliersTableProps, SuppliersTableState> {
    constructor(props: SuppliersTableProps) {
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
                <h6 className={styles.mainheader}>Suppliers Table</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                     <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Business Name</th>
                                <th scope="col">Contact Name</th>
                                <th scope="col">Contact Phone</th>
                                <th scope="col">Email</th>
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map(record => (
                                <tr key={record.id}>
                                    <td>{record.BusinessName}</td>
                                    <td>{record.ContactName}</td>
                                    <td>{record.ContactPhone}</td>
                                    <td>{record.Email}</td>
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
