import * as React from 'react';
import { IApprovalRequestFormFields } from './IApprovalRequestFields';
import { IWebPartProps } from "../IProcurementProps";
import { getListItems } from '../utils/sp.utils';
import styles from '../Procurement.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import toast from 'react-hot-toast';
import { listNames } from '../utils/models.utils';

interface ListItem extends IApprovalRequestFormFields {
    id: number;
}

interface ApprovalRecordsTableState {
    records: ListItem[];
}

export class ApprovalRecordsTable extends React.Component<IWebPartProps, ApprovalRecordsTableState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            records: []
        };
    }

    async componentDidMount() {
        try {
            // Fetch list items using the getListItems function from ProcurementService
            const listItems: IApprovalRequestFormFields[] = await getListItems(this.props.context, listNames.request);
            // Transform list items to include an id property
            const recordsWithId = listItems.map((item, index) => ({ ...item, id: index + 1 }));
            this.setState({ records: recordsWithId });
        } catch (error) {
            toast.error('Failed to retrieve your procurement request(s). ', error);
        }
    }

    render() {
        const { records } = this.state;

        return (
            <div className={styles.maincontainer}>
                <h6 className={styles.mainheader}>Records Table</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Initiator</th>
                                <th scope="col">Department</th>
                                <th scope="col">Delivery Date</th>
                                <th scope="col">Supplier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record.id}>
                                    <td>{record.id}</td>
                                    <td>{record.Initiator}</td>
                                    <td>{record.Department}</td>
                                    <td>{record.DeliveryDate}</td>
                                    <td>{record.Supplier}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
