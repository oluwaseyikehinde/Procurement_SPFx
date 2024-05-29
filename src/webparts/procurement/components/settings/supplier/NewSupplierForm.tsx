import * as React from 'react';
import { createListItem } from '../../utils/sp.utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import styles from '../../Procurement.module.scss';
import { INewSupplierFormFields } from './ISupplierFields';
import { IWebPartProps } from "../../IProcurementProps";
import toast from 'react-hot-toast';
import { listNames } from '../../utils/models.utils';


interface NewSupplierFormState {
    formData: INewSupplierFormFields;
}

export class NewSupplierForm extends React.Component<IWebPartProps, NewSupplierFormState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            formData: {
                BusinessName: '',
                ContactName: '',
                ContactPhone: '',
                Email: ''
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
            await createListItem(this.props.context, listNames.suppliers, this.state.formData);
            this.setState({
                formData: {
                    BusinessName: '',
                    ContactName: '',
                    ContactPhone: '',
                    Email: ''
                }
            });
            toast.success('Supplier submitted successfully!');
        } catch (error) {
            toast.error('Failed to submit Supplier.', error);
        }
    };

    render() {
        const { BusinessName, ContactName, ContactPhone, Email } = this.state.formData;

        return (
            <div className={styles.maincontainer}>
                <h6 className={styles.mainheader}>New Supplier</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className='col'>
                                <label>Business Name <span className={styles.labeltag}>. . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="BusinessName" value={BusinessName} onChange={this.handleInputChange} />
                            </div>
                            <div className='col'>
                                <label>Contact Name <span className={styles.labeltag}>. . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="ContactName" value={ContactName} onChange={this.handleInputChange} />
                            </div>
                        </div>
                        <div className="row">
                            <div className='col'>
                                <label>Contact Phone <span className={styles.labeltag}>. . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="ContactPhone" value={ContactPhone} onChange={this.handleInputChange} />
                            </div>
                            <div className='col'>
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