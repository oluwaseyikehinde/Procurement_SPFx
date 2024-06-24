import * as React from 'react';
import * as moment from 'moment';
import { IApprovalRequestFormFields } from './IApprovalRequestFields';
import { IWebPartProps } from "../IProcurementProps";
import { getPendingApprovalRequestListItems } from '../utils/sp.utils';
import styles from '../Procurement.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import toast from 'react-hot-toast';
import { listNames } from '../utils/models.utils';
import Loader from '../loader/Loader';
import ApprovalRecordDetailView from './ApprovalRecordDetailView';
import { Icon } from 'office-ui-fabric-react';

interface ListItem extends IApprovalRequestFormFields {
    id: number;
}

interface ApprovalRecordsTableState {
    records: ListItem[];
    loading: boolean;
    error: string | null;
    selectedRecord: ListItem | null;
    currentPage: number;
    itemsPerPage: number;
    sortDirection: 'asc' | 'desc';
    filterStatus: string;
    searchQuery: string;
    tempSearchQuery: string;
}

export class ApprovalRecordsTable extends React.Component<IWebPartProps, ApprovalRecordsTableState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            records: [],
            loading: true,
            error: null,
            selectedRecord: null,
            currentPage: 1,
            itemsPerPage: 10,
            sortDirection: 'desc',
            filterStatus: 'All',
            searchQuery: '',
            tempSearchQuery: ''
        };
    }
    
    async componentDidMount() {
        this.getRecordList();
    }

    getRecordList = async () => {
        try {
            // Fetch list items using the getPendingApprovalRequestListItems function from ProcurementService
            const listItems: IApprovalRequestFormFields[] = await getPendingApprovalRequestListItems(this.props.context, listNames.request, listNames.approvers);
            // Transform list items to include an id property
            const recordsWithId = listItems.map((item, index) => ({ ...item, id: index + 1 }));
            const sortedRecords = recordsWithId.sort((a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime());
            this.setState({ records: sortedRecords, loading: false });
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

    handleSort = () => {
        const { sortDirection, records } = this.state;
        const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        const sortedRecords = [...records].sort((a, b) => {
            const dateAsc = new Date(a.Created).getTime();
            const dateDesc = new Date(b.Created).getTime();
            return newSortDirection === 'asc' ? dateAsc - dateDesc : dateDesc - dateAsc;
        });
        this.setState({ records: sortedRecords, sortDirection: newSortDirection });
    };

    handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ filterStatus: event.target.value });
    };

    handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ tempSearchQuery: event.target.value });
    };

    handleSearch = () => {
        this.setState(prevState => ({
            searchQuery: prevState.tempSearchQuery,
            currentPage: 1
        }));
    };

    getFilteredRecords = () => {
        const { records, filterStatus, searchQuery } = this.state;
        let filteredRecords = records;

        if (filterStatus !== 'All') {
            filteredRecords = filteredRecords.filter(record => record.ApprovalStatus === filterStatus);
        }

        if (searchQuery) {
            filteredRecords = filteredRecords.filter(record =>
                record.Initiator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.Department.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filteredRecords;
    };


    render() {
        const { loading, selectedRecord, currentPage, itemsPerPage, sortDirection, filterStatus, tempSearchQuery } = this.state;

        // Calculate the current records to display
        const filteredRecords = this.getFilteredRecords();
        const indexOfLastRecord = currentPage * itemsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
        const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

        // Calculate page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(filteredRecords.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }

        if (loading) {
            return <Loader />;
        }

        return (
            <div>
                <div className={styles.filtercontainer}>
                    <div style={{ cursor: 'pointer' }}>
                        <Icon iconName={sortDirection === 'asc' ? 'SortUp' : 'SortDown'} onClick={this.handleSort} />
                    </div>
                    <div>
                        <select id="filterStatus" className="form-control" value={filterStatus} onChange={this.handleFilterChange}>
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div>
                        <div className="input-group">
                            <input type="text" id="searchQuery" className="form-control" value={tempSearchQuery} onChange={this.handleSearchChange} />
                            <div className="input-group-append">
                                <button className={styles.searchbutton} type="button" onClick={this.handleSearch}>Search</button>
                            </div>
                        </div>
                    </div>
                </div>
                <h6 className={styles.mainheader}>Records Table</h6>
                <hr />
                {filteredRecords.length === 0 ? (
                    <div className={styles.centereddiv}>No records found</div>
                ) : (
                <div className={styles.sectioncontainer}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Initiator</th>
                                <th scope="col">Department</th>
                                <th scope="col">Status</th>
                                <th scope="col">Request Date</th>
                                <th scope="col">Actions</th>
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
                                        <button
                                            className={styles.tablebutton} 
                                            onClick={() => this.handleViewClick(record)}
                                        >
                                            <Icon iconName="View" className={styles.buttonicon} /> View
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
                )}
                {selectedRecord && (
                    <div>
                        <ApprovalRecordDetailView
                            record={selectedRecord}
                            onClose={this.handleCloseDetailView}
                            context={this.props.context}
                            refreshRecords={this.getRecordList}
                        />
                    </div>
                )}
            </div>
        );
    }
}