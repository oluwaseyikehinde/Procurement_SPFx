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
import { Icon } from 'office-ui-fabric-react/lib/Icon';



interface NewRequestFormState {
    formData: INewRequestFormFields;
    gridRows: IGridRow[];
    supplierOptions: { ID: number; BusinessName: string }[];
    isFormValid: boolean;
    isSubmitting: boolean;
}

export class NewRequestForm extends React.Component<IWebPartProps, NewRequestFormState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            formData: {
                Initiator: '',
                Department: '',
                Email: '',
                ApprovalStatus: '',
                ApprovalStage: '',
                Created: '',
            },
            gridRows: [{ Id: 1, Supplier: '', Item: '', DeliveryDate: '', UnitPrice: 0, Quantity: 0, Currency: '', TotalPrice: 0 }],
            supplierOptions: [],
            isFormValid: false,
            isSubmitting: false
        };
    }

    async componentDidMount() {
        try {
            // Fetch Current User
            const currentUser = await getLoggedInUserData(this.props.context);
            // Fetch Supplier List
            const suppliers = await getListItems(this.props.context, listNames.suppliers);
            const activeSuppliers = suppliers.filter((supplier: any) => supplier.Status === 'Active');
            const supplierOptions = activeSuppliers.map((supplier: any) => ({ ID: supplier.ID, BusinessName: supplier.BusinessName }));

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
        const newRow: IGridRow = { Id: Id, Supplier: '', Item: '', DeliveryDate: '', UnitPrice: 0, Quantity: 0, Currency: '', TotalPrice: 0 };
        this.setState(prevState => ({
            gridRows: [...prevState.gridRows, newRow]
        }), this.validateForm);
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
            this.setState({ gridRows: updatedRows }, this.validateForm);
        });
    };

    handleGridChangeRow = (id: number, updatedRow: IGridRow) => {
        this.setState(prevState => ({
            gridRows: prevState.gridRows.map(row => (row.Id === id ? updatedRow : row))
        }), this.validateForm);
    };

    handleGridUpdate = (rows: IGridRow[]) => {
        this.setState({ gridRows: rows }, this.validateForm);
    };

    validateForm = () => {
        const isFormValid = this.state.gridRows.length > 0 && this.state.gridRows.every(row =>
            row.Supplier.trim() !== '' &&
            row.Item.trim() !== '' &&
            row.DeliveryDate.trim() !== '' &&
            row.UnitPrice > 0 &&
            row.Quantity > 0
        );

        this.setState({ isFormValid });
    };

    handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.setState({ isSubmitting: true });
        try {
            const requestData = {
                ...this.state.formData,
                gridRows: this.state.gridRows
            };

            await createMyRequestListItem(this.props.context, listNames.request, listNames.requestItem, requestData);
            // Fetch Current User
            const currentUser = await getLoggedInUserData(this.props.context);
            this.setState({
                formData: {
                    Initiator: currentUser.displayName || '',
                    Department: currentUser.department || '',
                    Email: '',
                    ApprovalStatus: '',
                    ApprovalStage: '',
                    Created: '',
                },
                gridRows: [{ Id: 1, Supplier: '', Item: '', DeliveryDate: '', UnitPrice: 0, Quantity: 0, Currency: '', TotalPrice: 0 }],
                isSubmitting: false,
                isFormValid: false
            });
            toast.success('Procurement submitted successfully!');
        } catch (error) {
            this.setState({ isSubmitting: false });
            toast.error('Failed to submit Procurement.', error);
        }
    };

    render() {
        const { Initiator, Department } = this.state.formData;
        const { gridRows, supplierOptions, isFormValid, isSubmitting } = this.state;

        return (
            <div>
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
                        <EditableGrid
                            rows={gridRows}
                            suppliers={supplierOptions.map(supplier => supplier.BusinessName)}
                            onAddRow={this.handleGridAddRow}
                            onDeleteRow={this.handleGridDeleteRow}
                            onChangeRow={this.handleGridChangeRow}
                            context={this.props.context}
                            onGridUpdate={this.handleGridUpdate}
                        />
                        <div className={styles.buttoncontainer}>
                            {!isSubmitting ? (
                                <button type="submit" disabled={!isFormValid}>
                                    <Icon iconName="SkypeCircleCheck" className={styles.buttonicon} /> Submit
                                </button>
                            ) : (
                                <button className={styles.submitingbutton} disabled>
                                    <div className={styles.loadingcontainer}>
                                        <div className={styles.loadingbar}></div>
                                    </div>
                                    Submiting...
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
