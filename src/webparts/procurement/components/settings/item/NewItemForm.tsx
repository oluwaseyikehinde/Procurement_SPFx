import * as React from 'react';
import { createListItem, getListItems } from '../../utils/sp.utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import styles from '../../Procurement.module.scss';
import { INewItemFormFields } from './IItemFields';
import { IWebPartProps } from "../../IProcurementProps";
import toast from 'react-hot-toast';
import { listNames } from '../../utils/models.utils';


interface NewItemFormState {
    formData: INewItemFormFields;
    supplierOptions: { ID: number; BusinessName: string }[];
}

export class NewItemForm extends React.Component<IWebPartProps, NewItemFormState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            formData: {
                Supplier: '',
                Item: '',
                Price: 0
            },
            supplierOptions: []
        };
    }

    async componentDidMount() {
        try {
            // Fetch Supplier List
            const suppliers = await getListItems(this.props.context, listNames.suppliers);
            const supplierOptions = suppliers.map((supplier: any) => ({ ID: supplier.ID, BusinessName: supplier.BusinessName }));

            // Update state
            this.setState({
                supplierOptions
            });
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
            const itemRequestData = JSON.parse(JSON.stringify(this.state.formData));
            await createListItem(this.props.context, listNames.items, itemRequestData);
            this.setState({
                formData: {
                    Supplier: '',
                    Item: '',
                    Price: 0
                }
            });
            toast.success('Item submitted successfully!');
        } catch (error) {
            toast.error('Failed to submit Item.', error);
        }
    };

    render() {
        const { Supplier, Item, Price } = this.state.formData;

        return (
            <div>
                <h6 className={styles.mainheader}>New Item</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <form onSubmit={this.handleSubmit}>
                        <div className={styles.customRow}>
                            <div className={styles.customCol}>
                                <label>Supplier <span className={styles.labeltag}> . . . . . . . . . </span></label>
                                <select className={styles.formcontrol} name="Supplier" value={Supplier} onChange={this.handleInputChange}>
                                    <option value="">Select Supplier</option>
                                    {this.state.supplierOptions.map(option => (
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
                                <label>Price <span className={styles.labeltag}> . . . . . . . . . . . . </span></label>
                                <input className={styles.formcontrol} type="number" name="Price" value={Price} onChange={this.handleInputChange} />
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