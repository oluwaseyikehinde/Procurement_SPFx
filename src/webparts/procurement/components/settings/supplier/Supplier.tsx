import * as React from 'react';
import { IWebPartProps } from "../../IProcurementProps";
import { NewSupplierForm } from './NewSupplierForm';
import { SuppliersTable } from './ViewSupplier';
import { getListItems, createListItem, updateListItem } from '../../utils/sp.utils';
import { listNames } from '../../utils/models.utils';
import toast from 'react-hot-toast';
import { INewSupplierFormFields } from './ISupplierFields';

interface SupplierState {
    records: (INewSupplierFormFields & { id: number })[];
    loading: boolean;
    error: string | null;
    formData: INewSupplierFormFields & { id: number };
    editing: boolean;
}

export class Supplier extends React.Component<IWebPartProps, SupplierState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            records: [],
            loading: true,
            error: null,
            formData: {
                id: 0,
                BusinessName: '',
                ContactName: '',
                ContactPhone: '',
                Email: '',
                Status: 'Active'
            },
            editing: false
        };
    }

    async componentDidMount() {
        await this.fetchSuppliers();
    }

    fetchSuppliers = async () => {
        this.setState({ loading: true, error: null });
        try {
            const listItems = await getListItems(this.props.context, listNames.suppliers);
            const recordsWithId = listItems.map((item, index) => ({ ...item, id: index + 1 }));
            this.setState({ records: recordsWithId, loading: false });
        } catch (error) {
            this.setState({ error: 'Failed to load records', loading: false });
            toast.error('Failed to retrieve your Supplier request(s).', error);
        }
    };

    handleEdit = (item: INewSupplierFormFields & { id: number }) => {
        this.setState({ formData: item, editing: true });
    };

    handleFormSubmit = async (formData: INewSupplierFormFields & { id: number }) => {
        const { id, BusinessName, ContactName, ContactPhone, Email, Status } = formData;

        const dataToSave = {
            BusinessName,
            ContactName,
            ContactPhone,
            Email,
            Status
        };
        try {
            if (this.state.editing) {
                await updateListItem(this.props.context, listNames.suppliers, id, dataToSave);
                toast.success('Supplier updated successfully!');
            } else {
                await createListItem(this.props.context, listNames.suppliers, dataToSave);
                toast.success('Supplier submitted successfully!');
            }
            this.setState({
                formData: { id: 0, BusinessName: '', ContactName: '', ContactPhone: '', Email: '', Status: 'Active' },
                editing: false
            });
            await this.fetchSuppliers();
        } catch (error) {
            toast.error('Failed to submit Supplier.', error);
        }
    };

    render() {
        return (
            <div>
                <NewSupplierForm
                    context={this.props.context}
                    formData={this.state.formData}
                    editing={this.state.editing}
                    onSupplierSubmit={this.handleFormSubmit}
                />
                <hr />
                <SuppliersTable
                    context={this.props.context}
                    records={this.state.records}
                    loading={this.state.loading}
                    error={this.state.error}
                    onEdit={this.handleEdit}
                />
            </div>
        );
    }
}
