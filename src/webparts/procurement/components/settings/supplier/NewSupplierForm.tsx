import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import styles from '../../Procurement.module.scss';
import { INewSupplierFormFields } from './ISupplierFields';
import { IWebPartProps } from "../../IProcurementProps";
import toast from 'react-hot-toast';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

interface NewSupplierFormProps extends IWebPartProps {
    formData: INewSupplierFormFields & { id: number };
    editing: boolean;
    onSupplierSubmit: (formData: INewSupplierFormFields & { id: number }) => void;
}

interface NewSupplierFormState {
    formData: INewSupplierFormFields & { id: number };
    isFormValid: boolean;
    isSubmitting: boolean;
}

export class NewSupplierForm extends React.Component<NewSupplierFormProps, NewSupplierFormState> {
    constructor(props: NewSupplierFormProps) {
        super(props);
        this.state = {
            formData: this.props.formData,
            isFormValid: this.isFormValid(this.props.formData),
            isSubmitting: false
        };
    }

    componentDidUpdate(prevProps: NewSupplierFormProps) {
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

    isFormValid = (formData: INewSupplierFormFields) => {
        const { BusinessName, ContactName, ContactPhone, Email, Status } = formData;
        return BusinessName !== '' && ContactName !== '' && ContactPhone !== '' && Email !== '' && Status !== '';
    };

    handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.setState({ isSubmitting: true });
        if (this.state.isFormValid) {
            await this.props.onSupplierSubmit(this.state.formData);
            this.setState({
                formData: {
                    id: 0,
                    BusinessName: '',
                    ContactName: '',
                    ContactPhone: '',
                    Email: '',
                    Status: 'Active'
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
        const { BusinessName, ContactName, ContactPhone, Email, Status } = this.state.formData;
        const { editing } = this.props;

        return (
            <div>
                <h6 className={styles.mainheader}>{this.props.editing ? 'Edit Supplier' : 'New Supplier'}</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <form onSubmit={this.handleSubmit}>
                        <div className={styles.customRow}>
                            <div className={styles.customCol}>
                                <label>Business Name <span className={styles.labeltag}>. . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="BusinessName" value={BusinessName} placeholder='Enter Business Name' onChange={this.handleInputChange} />
                            </div>
                            <div className={styles.customCol}>
                                <label>Contact Name <span className={styles.labeltag}>. . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="ContactName" value={ContactName} placeholder='Enter Contact Name' onChange={this.handleInputChange} />
                            </div>
                        </div>
                        <div className={styles.customRow}>
                            <div className={styles.customCol}>
                                <label>Contact Phone <span className={styles.labeltag}>. . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="ContactPhone" value={ContactPhone} placeholder='Enter Contact Phone' onChange={this.handleInputChange} />
                            </div>
                            <div className={styles.customCol}>
                                <label>Email <span className={styles.labeltag}> . . . . . . . . . . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="Email" value={Email} placeholder='Enter Email' onChange={this.handleInputChange} />
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
