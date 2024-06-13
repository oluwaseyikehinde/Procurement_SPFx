import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import styles from '../../Procurement.module.scss';
import { INewSupplierFormFields } from './ISupplierFields';
import { IWebPartProps } from "../../IProcurementProps";

interface NewSupplierFormProps extends IWebPartProps {
    formData: INewSupplierFormFields & { id: number };
    editing: boolean;
    onSupplierSubmit: (formData: INewSupplierFormFields & { id: number }) => void;
}

interface NewSupplierFormState {
    formData: INewSupplierFormFields & { id: number };
}

export class NewSupplierForm extends React.Component<NewSupplierFormProps, NewSupplierFormState> {
    constructor(props: NewSupplierFormProps) {
        super(props);
        this.state = {
            formData: this.props.formData
        };
    }

    componentDidUpdate(prevProps: NewSupplierFormProps) {
        if (prevProps.formData !== this.props.formData) {
            this.setState({ formData: this.props.formData });
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
        this.props.onSupplierSubmit(this.state.formData);
        this.setState({
            formData: {
                id: 0,
                BusinessName: '',
                ContactName: '',
                ContactPhone: '',
                Email: '',
                Status: ''
            }
        });
    };

    render() {
        const { BusinessName, ContactName, ContactPhone, Email, Status } = this.state.formData;

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
                            <button type="submit">{this.props.editing ? 'Update' : 'Submit'}</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
