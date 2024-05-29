import * as React from 'react';
import { createListItem } from '../../utils/sp.utils'; // Import the create function
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import styles from '../../Procurement.module.scss';
import { INewRoleFormFields } from './IRoleFields';
import { IWebPartProps } from "../../IProcurementProps";
import toast from 'react-hot-toast';
import { listNames } from '../../utils/models.utils';


interface NewRoleFormState {
    formData: INewRoleFormFields;
}

export class NewRoleForm extends React.Component<IWebPartProps, NewRoleFormState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            formData: {
                Role: '',
                Description: ''
            }
        };
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
            await createListItem(this.props.context, listNames.roles, this.state.formData);
            this.setState({
                formData: {
                    Role: '',
                    Description: ''
                }
            });
            toast.success('Role submitted successfully!');
        } catch (error) {
            toast.error('Failed to submit Role.', error);
        }
    };

    render() {
        const { Role, Description } = this.state.formData;

        return (
            <div className={styles.maincontainer}>
                <h6 className={styles.mainheader}>New Role</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className='col'>
                                <label>Role <span className={styles.labeltag}> . . . . . . . . . . . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="Role" value={Role} onChange={this.handleInputChange} />
                            </div>
                            <div className='col'>
                                <label>Description <span className={styles.labeltag}> . . . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="Description" value={Description} onChange={this.handleInputChange} />
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