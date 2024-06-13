import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import styles from '../../Procurement.module.scss';
import { INewItemFormFields } from './IItemFields';
import { IWebPartProps } from "../../IProcurementProps";

interface SupplierOption {
    ID: number;
    BusinessName: string;
}

interface NewItemFormProps extends IWebPartProps {
    formData: INewItemFormFields & { id: number };
    editing: boolean;
    supplierOptions: SupplierOption[];
    onItemSubmit: (formData: INewItemFormFields & { id: number }) => void;
}

interface NewItemFormState {
    formData: INewItemFormFields & { id: number };
}

export class NewItemForm extends React.Component<NewItemFormProps, NewItemFormState> {
    constructor(props: NewItemFormProps) {
        super(props);
        this.state = {
            formData: this.props.formData
        };
    }

    componentDidUpdate(prevProps: NewItemFormProps) {
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
        this.props.onItemSubmit(this.state.formData);
        this.setState({
            formData: {
                id: 0,
                Supplier: '',
                Item: '',
                Currency: '',
                Price: 0,
                Status: ''
            }
        });
    };

    render() {
        const { Supplier, Item, Currency, Price, Status } = this.state.formData;

        return (
            <div>
                <h6 className={styles.mainheader}>{this.props.editing ? 'Edit Item' : 'New Item'}</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <form onSubmit={this.handleSubmit}>
                        <div className={styles.customRow}>
                            <div className={styles.customCol}>
                                <label>Supplier <span className={styles.labeltag}>. . . . . . . . . . . </span></label>
                                <select className={styles.formcontrol} name="Supplier" value={Supplier} onChange={this.handleInputChange}>
                                    <option value="">Select Supplier</option>
                                    {this.props.supplierOptions.map(option => (
                                        <option key={option.ID} value={option.BusinessName}>
                                            {option.BusinessName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.customCol}>
                                <label>Item <span className={styles.labeltag}> . . . . . . . . . . . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="Item" value={Item} placeholder='Enter Item' onChange={this.handleInputChange} />
                            </div>
                        </div>
                        <div className={styles.customRow}>
                            <div className={styles.customCol}>
                                <label>Currency <span className={styles.labeltag}>. . . . . . . . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="Currency" value={Currency} onChange={this.handleInputChange} />
                            </div>
                            <div className={styles.customCol}>
                                <label>Price <span className={styles.labeltag}> . . . . . . . . . . . . </span></label>
                                <input className={styles.formcontrol} type="number" name="Price" value={Price} onChange={this.handleInputChange} />
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
