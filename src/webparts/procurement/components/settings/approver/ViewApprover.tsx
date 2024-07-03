import * as React from 'react';
import { INewApproverFormFields } from './IApproverFields';
import { IWebPartProps } from "../../IProcurementProps";
import styles from '../../Procurement.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Loader from '../../loader/Loader';
import { Icon } from 'office-ui-fabric-react';


interface ListItem extends INewApproverFormFields {
    id: number;
}

interface ApproversTableProps extends IWebPartProps {
    records: ListItem[];
    loading: boolean;
    error: string | null;
    onEdit: (item: ListItem) => void;
}

interface ApproversTableState {
    currentPage: number;
    itemsPerPage: number;
}


export class ApproversTable extends React.Component<ApproversTableProps, ApproversTableState> {
    constructor(props: ApproversTableProps) {
        super(props);
        this.state = {
            currentPage: 1,
            itemsPerPage: 5,
        };
    }

    handleClick = (event: React.MouseEvent<HTMLButtonElement>, pageNumber: number) => {
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
                <h6 className={styles.mainheader}>Approvers Table</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Personnel</th>
                                <th scope="col">Role</th>
                                <th scope="col">Level</th>
                                <th scope="col">Email</th>
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map(record => (
                                <tr key={record.id}>
                                    <td>{record.Personnel}</td>
                                    <td>{record.Role}</td>
                                    <td>{record.Level}</td>
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
                    <nav className={styles.paginationcontainer}>
                        <ul className="pagination pagination-sm justify-content-center">
                            {pageNumbers.map(number => (
                                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                    <button className="page-link" onClick={(e) => this.handleClick(e, number)}>
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }
}