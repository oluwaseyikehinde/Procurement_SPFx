import * as React from 'react';
import { createMyRequestListItem, getListItems } from '../utils/sp.utils';
import { getLoggedInUserData } from '../utils/graph.utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import styles from '../Procurement.module.scss';
import { INewRequestFormFields } from './IRequestFields';
import { IWebPartProps } from "../IProcurementProps";
import EditableGrid from './EditableGrid';
import { IGridRow } from './IGridRow';
import toast from 'react-hot-toast';
import { listNames } from '../utils/models.utils';



interface NewRequestFormState {
    formData: INewRequestFormFields;
    gridRows: IGridRow[];
    supplierOptions: { ID: number; BusinessName: string }[];
}

export class NewRequestForm extends React.Component<IWebPartProps, NewRequestFormState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            formData: {
                Initiator: '',
                Department: '',
                Email: '',
                DeliveryDate: '',
                Supplier: '',
                ApprovalStatus: '',
                ApprovalStage: ''
            },
            gridRows: [{ Id: 1, Description: '', UnitPrice: 0, Quantity: 0, TotalPrice: 0 }],
            supplierOptions: []
        };
    }

    async componentDidMount() {
        try {
            // Fetch Supplier List
            const suppliers = await getListItems(this.props.context, listNames.suppliers);
            const supplierOptions = suppliers.map((supplier: any) => ({ ID: supplier.ID, BusinessName: supplier.BusinessName }));

            // Fetch Current User
            const currentUser = await getLoggedInUserData(this.props.context);

            // Update state
            this.setState({
                supplierOptions,
                formData: {
                    ...this.state.formData,
                    Initiator: currentUser.displayName || '',
                    Department: currentUser.department || '',
                    Email: currentUser.mail || '',
                    ApprovalStatus: "Pending",
                    ApprovalStage: "1"
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    generateUniqueId = () => {
        return this.state.gridRows.length + 1;
    };

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: value
            }
        }));
    };


    handleGridAddRow = () => {
        const Id = this.generateUniqueId();
        const newRow: IGridRow = { Id: Id, Description: '', UnitPrice: 0, Quantity: 0, TotalPrice: 0 };
        this.setState(prevState => ({
            gridRows: [...prevState.gridRows, newRow]
        }));
    };

    handleGridDeleteRow = (id: number) => {
        this.setState(prevState => ({
            gridRows: prevState.gridRows.filter(row => row.Id !== id)
        }), () => {
            // After deleting a row, update the IDs of the remaining rows
            const updatedRows = this.state.gridRows.map((row, index) => ({
                ...row,
                Id: index + 1 // Update the ID to the new index + 1
            }));
            this.setState({ gridRows: updatedRows });
        });
    };

    handleGridChangeRow = (id: number, updatedRow: IGridRow) => {
        this.setState(prevState => ({
            gridRows: prevState.gridRows.map(row => (row.Id === id ? updatedRow : row))
        }));
    };

    handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const requestData = {
                ...this.state.formData,
                gridRows: this.state.gridRows
            };

            await createMyRequestListItem(this.props.context, listNames.request, listNames.requestItem, requestData);
            this.setState({
                formData: {
                    Initiator: '',
                    Department: '',
                    Email: '',
                    DeliveryDate: '',
                    Supplier: '',
                    ApprovalStatus: '',
                    ApprovalStage: ''
                },
                gridRows: [{ Id: 1, Description: '', UnitPrice: 0, Quantity: 0, TotalPrice: 0 }]
            });
            toast.success('Procurement submitted successfully!');
        } catch (error) {
            toast.error('Failed to submit Procurement.', error);
        }
    };

    render() {
        const { Initiator, Department, DeliveryDate, Supplier } = this.state.formData;

        return (
            <div className={styles.maincontainer}>
                <h6 className={styles.mainheader}>New Request</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <form onSubmit={this.handleSubmit}>
                        <div className={styles.customRow}>
                            <div className={styles.customCol}>
                                <label>Initiator <span className={styles.labeltag}>. . . . . . . . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="Initiator" value={Initiator} onChange={this.handleInputChange} disabled />
                            </div>
                            <div className={styles.customCol}>
                                <label>Department <span className={styles.labeltag}>. . . . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="Department" value={Department} onChange={this.handleInputChange} disabled />
                            </div>
                        </div>
                        <div className={styles.customRow}>
                            <div className={styles.customCol}>
                                <label>Delivery Date <span className={styles.labeltag}>. . . . . </span></label>
                                <input className={styles.formcontrol} type="date" name="DeliveryDate" value={DeliveryDate} onChange={this.handleInputChange} />
                            </div>
                            <div className={styles.customCol}>
                                <label>Supplier <span className={styles.labeltag}> . . . . . . . . . </span></label>
                                {/* <input className={styles.formcontrol} type="text" name="Supplier" value={Supplier} onChange={this.handleInputChange} /> */}
                                <select className={styles.formcontrol} name="Supplier" value={Supplier} onChange={this.handleInputChange}>
                                    <option value="">Select Supplier</option>
                                    {this.state.supplierOptions.map(option => (
                                        <option key={option.ID} value={option.BusinessName}>
                                            {option.BusinessName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <EditableGrid
                            rows={this.state.gridRows}
                            onAddRow={this.handleGridAddRow}
                            onDeleteRow={this.handleGridDeleteRow}
                            onChangeRow={this.handleGridChangeRow}
                        />
                        <div className={styles.buttoncontainer}>
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
