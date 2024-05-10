import * as React from 'react';
import { INewRequestFormFields } from './IRequestFields';
import { getListItems } from '../serviceOperation/ProcurementService';
import styles from '../Procurement.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

const LIST_NAME = 'Procurement List';

interface ListItem extends INewRequestFormFields {
    id: number;
}

interface RecordsTableState {
    records: ListItem[];
}

export class RecordsTable extends React.Component<{}, RecordsTableState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            records: []
        };
    }

    async componentDidMount() {
        try {
            // Fetch list items using the getListItems function from ProcurementService
            const listItems: INewRequestFormFields[] = await getListItems(LIST_NAME);
            // Transform list items to include an id property
            const recordsWithId = listItems.map((item, index) => ({ ...item, id: index + 1 }));
            this.setState({ records: recordsWithId });
        } catch (error) {
            console.error('Error fetching list items:', error);
        }
    }

    render() {
        const { records } = this.state;

        return (
            <div className={styles.maincontainer}>
                <h6 className={styles.mainheader}>Records Table</h6>
                <hr/>
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
