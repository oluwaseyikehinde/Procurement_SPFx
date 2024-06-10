import * as React from 'react';
import * as moment from 'moment';
import { INewRequestFormFields } from './IRequestFields';
import { IWebPartProps } from "../IProcurementProps";
import { getMyRequestListItems } from '../utils/sp.utils';
import styles from '../Procurement.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import toast from 'react-hot-toast';
import { listNames } from '../utils/models.utils';
import Loader from '../loader/Loader';
import RecordDetailView from '../ViewRecord';
import RecordDetailTracker from '../TrackRecord';


interface ListItem extends INewRequestFormFields {
    id: number;
}

interface RecordsTableState {
    records: ListItem[];
    loading: boolean;
    error: string | null;
    selectedRecord: ListItem | null;
    showView: boolean;
    showTracker: boolean;
}

export class RecordsTable extends React.Component<IWebPartProps, RecordsTableState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            records: [],
            loading: true,
            error: null,
            selectedRecord: null,
            showView: false,
            showTracker: false
        };
    }

    async componentDidMount() {
        try {
            // Fetch list items using the getMyRequestListItems function from ProcurementService
            const listItems: INewRequestFormFields[] = await getMyRequestListItems(this.props.context, listNames.request);
            // Transform list items to include an id property
            const recordsWithId = listItems.map((item, index) => ({ ...item, id: index + 1 }));
            this.setState({ records: recordsWithId, loading: false });
        } catch (error) {
            this.setState({ error: 'Failed to load records', loading: false });
            toast.error('Failed to retrieve your procurement request(s). ', error);
        }
    }



    handleViewClick = (record: ListItem) => {
        this.setState({ selectedRecord: record, showTracker: false, showView:true });
    };

    handleTrackerClick = (record: ListItem) => {
        this.setState({ selectedRecord: record, showTracker: true, showView: false });
    };

    handleCloseDetailView = () => {
        this.setState({ selectedRecord: null, showTracker: false, showView: false });
    };

    handleCloseTrackerView = () => {
        this.setState({ selectedRecord: null, showTracker: false, showView: false });
    };

    render() {
        const { records, loading, error, selectedRecord, showView, showTracker } = this.state;

        if (loading) {
            return <Loader/>;
        }

        if (error) {
            return <div className={styles.centereddiv}>Error: {error}</div>;
        }

        if (records.length === 0) {
            return <div className={styles.centereddiv}>No records found</div>;
        }


        return (
            <div>
                <h6 className={styles.mainheader}>Records Table</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Initiator</th>
                                <th scope="col">Department</th>
                                <th scope="col">Status</th>
                                <th scope="col">Request Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record.id}>
                                    <td>{record.Initiator}</td>
                                    <td>{record.Department}</td>
                                    <td>{record.ApprovalStatus}</td>
                                    <td>{moment(record.Created).format('DD-MMM-YYYY')}</td>
                                    <td>
                                        <button onClick={() => this.handleViewClick(record)}>
                                            View
                                        </button>
                                        <button onClick={() => this.handleTrackerClick(record)}>
                                            Tracker
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {selectedRecord && showView &&  (
                    <RecordDetailView 
                        record={selectedRecord}
                        onClose={this.handleCloseDetailView}
                        context={this.props.context}
                    />
                )}
                {selectedRecord && showTracker && (
                    <RecordDetailTracker
                        record={selectedRecord}
                        onClose={this.handleCloseTrackerView}
                        context={this.props.context}
                    />
                )}
            </div>
        );
    }
}