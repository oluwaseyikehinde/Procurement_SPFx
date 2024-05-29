import * as React from 'react';
import { INewRoleFormFields } from './IRoleFields';
import { IWebPartProps } from "../../IProcurementProps";
import { getListItems } from '../../utils/sp.utils';
import styles from '../../Procurement.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import toast from 'react-hot-toast';
import { listNames } from '../../utils/models.utils';


interface ListItem extends INewRoleFormFields {
    id: number;
}

interface RolesTableState {
    records: ListItem[];
}

export class RolesTable extends React.Component<IWebPartProps, RolesTableState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            records: []
        };
    }

    async componentDidMount() {
        try {
            // Fetch list items using the getListItems function from ProcurementService
            const listItems: INewRoleFormFields[] = await getListItems(this.props.context, listNames.roles);
            // Transform list items to include an id property
            const recordsWithId = listItems.map((item, index) => ({ ...item, id: index + 1 }));
            this.setState({ records: recordsWithId });
        } catch (error) {
            toast.error('Failed to retrieve your role request(s). ', error);
        }
    }

    render() {
        const { records } = this.state;

        return (
            <div className={styles.maincontainer}>
                <h6 className={styles.mainheader}>Roles Table</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Role</th>
                                <th scope="col">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record.id}>
                                    <td>{record.id}</td>
                                    <td>{record.Role}</td>
                                    <td>{record.Description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}