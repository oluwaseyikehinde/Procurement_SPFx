import * as React from 'react';
import * as moment from 'moment';
import { IAllRequestFormFields } from './IAllRequestFields';
import { IWebPartProps } from "../IProcurementProps";
import { getListItems } from '../utils/sp.utils';
import styles from '../Procurement.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import toast from 'react-hot-toast';
import { listNames } from '../utils/models.utils';
import Loader from '../loader/Loader';
import RecordDetailView from '../ViewRecord';

interface ListItem extends IAllRequestFormFields {
    id: number;
}

interface AllRecordsTableState {
    records: ListItem[];
    loading: boolean;
    error: string | null;
    selectedRecord: ListItem | null;
    currentPage: number;
    itemsPerPage: number;
}

export class AllRecordsTable extends React.Component<IWebPartProps, AllRecordsTableState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            records: [],
            loading: true,
            error: null,
            selectedRecord: null,
            currentPage: 1,
            itemsPerPage: 10
        };
    }

    async componentDidMount() {
        try {
            // Fetch list items using the getListItems function from ProcurementService
            const listItems: IAllRequestFormFields[] = await getListItems(this.props.context, listNames.request);
            // Transform list items to include an id property
            const recordsWithId = listItems.map((item, index) => ({ ...item, id: index + 1 }));
            this.setState({ records: recordsWithId, loading: false });
        } catch (error) {
            this.setState({ error: 'Failed to load records', loading: false });
            toast.error('Failed to retrieve your procurement request(s). ', error);
        }
    }

    handleClick = (event: React.MouseEvent<HTMLAnchorElement>, number: number) => {
        event.preventDefault();
        this.setState({ currentPage: number });
    };

    handleViewClick = (record: ListItem) => {
        this.setState({ selectedRecord: record });
    };

    handleCloseDetailView = () => {
        this.setState({ selectedRecord: null });
    };

    render() {
        const { records, loading, error, selectedRecord, currentPage, itemsPerPage } = this.state;

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
            <div className={styles.maincontainer}>
                <h6 className={styles.mainheader}>Records Table</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Initiator</th>
                                <th scope="col">Department</th>
                                <th>Status</th>
                                <th scope="col">Request Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map(record => (
                                <tr key={record.id}>
                                    <td>{record.Initiator}</td>
                                    <td>{record.Department}</td>
                                    <td>{record.ApprovalStatus}</td>
                                    <td>{moment(record.Created).format('DD-MMM-YYYY')}</td>
                                    <td>
                                        <button className={styles.tablebutton} onClick={() => this.handleViewClick(record)}>
                                            View
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
                {selectedRecord && (
                    <RecordDetailView
                        record={selectedRecord}
                        onClose={this.handleCloseDetailView}
                        context={this.props.context}
                    />
                )}
            </div>
        );
    }
}
