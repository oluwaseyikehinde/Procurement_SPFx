import * as React from 'react';
import { INewSupplierFormFields } from './ISupplierFields';
import { IWebPartProps } from "../../IProcurementProps";
import { getListItems } from '../../utils/sp.utils';
import styles from '../../Procurement.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import toast from 'react-hot-toast';
import { listNames } from '../../utils/models.utils';


interface ListItem extends INewSupplierFormFields {
    id: number;
}

interface SuppliersTableState {
    records: ListItem[];
}

export class SuppliersTable extends React.Component<IWebPartProps, SuppliersTableState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            records: []
        };
    }

    async componentDidMount() {
        try {
            // Fetch list items using the getListItems function from ProcurementService
            const listItems: INewSupplierFormFields[] = await getListItems(this.props.context, listNames.suppliers);
            // Transform list items to include an id property
            const recordsWithId = listItems.map((item, index) => ({ ...item, id: index + 1 }));
            this.setState({ records: recordsWithId });
        } catch (error) {
            toast.error('Failed to retrieve your supplier request(s). ', error);
        }
    }

    render() {
        const { records } = this.state;

        return (
            <div className={styles.maincontainer}>
                <h6 className={styles.mainheader}>Suppliers Table</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Business Name</th>
                                <th scope="col">Contact Name</th>
                                <th scope="col">Contact Phone</th>
                                <th scope="col">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record.id}>
                                    <td>{record.id}</td>
                                    <td>{record.BusinessName}</td>
                                    <td>{record.ContactName}</td>
                                    <td>{record.ContactPhone}</td>
                                    <td>{record.Email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}