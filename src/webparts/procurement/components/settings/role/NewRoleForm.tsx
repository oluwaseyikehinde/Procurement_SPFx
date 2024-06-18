import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import styles from '../../Procurement.module.scss';
import { INewRoleFormFields } from './IRoleFields';
import { IWebPartProps } from "../../IProcurementProps";
import toast from 'react-hot-toast';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

interface NewRoleFormProps extends IWebPartProps {
    formData: INewRoleFormFields & { id: number };
    editing: boolean;
    onRoleSubmit: (formData: INewRoleFormFields & { id: number }) => void;
}

interface NewRoleFormState {
    formData: INewRoleFormFields & { id: number };
    isFormValid: boolean;
    isSubmitting: boolean;
}

export class NewRoleForm extends React.Component<NewRoleFormProps, NewRoleFormState> {
    constructor(props: NewRoleFormProps) {
        super(props);
        this.state = {
            formData: this.props.formData,
            isFormValid: this.isFormValid(this.props.formData),
            isSubmitting: false
        };
    }

    componentDidUpdate(prevProps: NewRoleFormProps) {
        if (prevProps.formData !== this.props.formData) {
            this.setState({
                formData: this.props.formData,
                isFormValid: this.isFormValid(this.props.formData)
            });
        }
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        this.setState(prevState => {
            const updatedFormData = {
                ...prevState.formData,
                [name]: value
            };
            return {
                formData: updatedFormData,
                isFormValid: this.isFormValid(updatedFormData)
            };
        });
    };

    isFormValid = (formData: INewRoleFormFields) => {
        const { Role, Description, Status } = formData;
        return Role !== '' && Description !== '' && Status !== '';
    };

    handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.setState({ isSubmitting: true });
        if (this.state.isFormValid) {
            await this.props.onRoleSubmit(this.state.formData);
            this.setState({
                formData: {
                    id: 0,
                    Role: '',
                    Description: '',
                    Status: ''
                },
                isFormValid: false,
                isSubmitting: false
            });
        } else {
            this.setState({ isSubmitting: false });
            toast.error('Please fill in all required fields.');
        }
    };

    render() {
        const { Role, Description, Status } = this.state.formData;
        const { editing } = this.props;

        return (
            <div>
                <h6 className={styles.mainheader}>{this.props.editing ? 'Edit Role' : 'New Role'}</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <form onSubmit={this.handleSubmit}>
                        <div className={styles.customRow}>
                            <div className={styles.customCol}>
                                <label>Role <span className={styles.labeltag}> . . . . . . . . . . . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="Role" value={Role} placeholder='Enter Role' onChange={this.handleInputChange} />
                            </div>
                            <div className={styles.customCol}>
                                <label>Description <span className={styles.labeltag}> . . . . . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="Description" value={Description} placeholder='Enter Description' onChange={this.handleInputChange} />
                            </div>
                        </div>
                        {this.props.editing && (
                            <div className={styles.customRow}>
                                <div className={styles.customCol}>
                                    <label>Status <span className={styles.labeltag}>. . . . . . . . . . . . </span></label>
                                    <select className={styles.formcontrol} name="Status" value={Status} onChange={this.handleInputChange}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        <div className={styles.buttoncontainer}>
                            {!this.state.isSubmitting ? (
                                <button type="submit" disabled={!this.state.isFormValid}>
                                    <Icon iconName={editing ? "Sync" : "SkypeCircleCheck"} className={styles.buttonicon} />
                                    {editing ? 'Update' : 'Submit'}
                                </button>
                            ) : (
                                <button className={styles.submitingbutton} disabled>
                                    <div className={styles.loadingcontainer}>
                                        <div className={styles.loadingbar}></div>
                                    </div>
                                    {editing ? 'Updating...' : 'Submitting...'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
