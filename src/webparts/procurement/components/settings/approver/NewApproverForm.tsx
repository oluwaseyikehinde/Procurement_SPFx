import * as React from 'react';
import {createListItem, getListItems } from '../../utils/sp.utils';
import { getAllUsersInOrg } from '../../utils/graph.utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import styles from '../../Procurement.module.scss';
import { INewApproverFormFields } from './IApproverFields';
import { IWebPartProps } from "../../IProcurementProps";
import toast from 'react-hot-toast';
import { listNames } from '../../utils/models.utils';

interface NewApproverFormState {
    formData: INewApproverFormFields;
    roleOptions: { ID: number; Role: string }[];
    allUsers: { displayName: string; id: string }[];
}

export class NewApproverForm extends React.Component<IWebPartProps, NewApproverFormState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            formData: {
                Personnel: '',
                Role: '',
                Level: '',
                Email: ''
            },
            roleOptions: [],
            allUsers: []
        };
    }

    async componentDidMount() {
        try {
            //Fetch Role List
            const roles = await getListItems(this.props.context, listNames.roles);
            const roleOptions = roles.map((role: any) => ({ ID: role.ID, Role: role.Role }));

            // Fetch All Users
            const allUsers = await getAllUsersInOrg(this.props.context);
            const userOptions = allUsers.map((user: any) => ({ displayName: user.displayName, id: user.id }));

            this.setState({ roleOptions, allUsers: userOptions });

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: value
            }
        }));
    };

    handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await createListItem(this.props.context, listNames.approvers, this.state.formData);
            this.setState({
                formData: {
                    Personnel: '',
                    Role: '',
                    Level: '',
                    Email: ''
                }
            });
            toast.success('Approver submitted successfully!');
        } catch (error) {
            toast.error('Failed to submit Approver.', error);
        }
    };

    render() {
        const { Personnel, Role, Level, Email } = this.state.formData;

        return (
            <div className={styles.maincontainer}>
                <h6 className={styles.mainheader}>New Approver</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <form onSubmit={this.handleSubmit}>
                        <div className={styles.customRow}>
                            <div className={styles.customCol}>
                                <label>Personnel <span className={styles.labeltag}>. . . . . . . .</span></label>
                                <select className={styles.formcontrol} name="Personnel" value={Personnel} onChange={this.handleInputChange}>
                                    <option value="">Select Personnel</option>
                                    {this.state.allUsers.map(user => (
                                        <option key={user.id} value={user.displayName}>{user.displayName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.customCol}>
                                <label>Role <span className={styles.labeltag}> . . . . . . . . . . . . . </span></label>
                                <select className={styles.formcontrol} name="Role" value={Role} onChange={this.handleInputChange}>
                                    <option value="">Select Role</option>
                                    {this.state.roleOptions.map(option => (
                                        <option key={option.ID} value={option.Role}>
                                            {option.Role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className={styles.customRow}>
                            <div className={styles.customCol}>
                                <label>Level <span className={styles.labeltag}>. . . . . . . . . . . .</span></label>
                                <input className={styles.formcontrol} type="text" name="Level" value={Level} onChange={this.handleInputChange} />
                            </div>
                            <div className={styles.customCol}>
                                <label>Email <span className={styles.labeltag}> . . . . . . . . . . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="Email" value={Email} onChange={this.handleInputChange} />
                            </div>
                        </div>
                        <div className={styles.buttoncontainer}>
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}