import * as React from 'react';
import { IWebPartProps } from "../../IProcurementProps";
import { NewItemForm } from './NewItemForm';
import { ItemsTable } from './ViewItem';
import { getListItems, createListItem, updateListItem } from '../../utils/sp.utils';
import { listNames } from '../../utils/models.utils';
import toast from 'react-hot-toast';
import { INewItemFormFields } from './IItemFields';

interface ItemState {
    records: (INewItemFormFields & { id: number })[];
    loading: boolean;
    error: string | null;
    formData: INewItemFormFields & { id: number };
    supplierOptions: { ID: number; BusinessName: string }[];
    editing: boolean;
}

export class Item extends React.Component<IWebPartProps, ItemState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            records: [],
            loading: true,
            error: null,
            formData: {
                id: 0,
                Supplier: '',
                Item: '',
                Currency: '',
                Price: 0,
                Status: 'Active'
            },
            supplierOptions: [],
            editing: false
        };
    }

    async componentDidMount() {
        await this.fetchItems();
    }

    fetchItems = async () => {
        this.setState({ loading: true, error: null });
        try {
            // Fetch Supplier List
            const suppliers = await getListItems(this.props.context, listNames.suppliers);
            const activeSuppliers = suppliers.filter((supplier: any) => supplier.Status === 'Active');
            const supplierOptions = activeSuppliers.map((supplier: any) => ({ ID: supplier.ID, BusinessName: supplier.BusinessName }));

            const listItems = await getListItems(this.props.context, listNames.items);
            const recordsWithId = listItems.map(item => ({ ...item, id: item.Id })); 
            this.setState({ records: recordsWithId, loading: false, supplierOptions });
        } catch (error) {
            this.setState({ error: 'Failed to load records', loading: false });
            toast.error('Failed to retrieve your Item request(s).', error);
        }
    };

    handleEdit = (item: INewItemFormFields & { id: number }) => {
        this.setState({ formData: item, editing: true });
    };

    handleFormSubmit = async (formData: INewItemFormFields & { id: number }) => {
        const { id, Supplier, Item, Currency, Price, Status } = formData;

        const dataToSave = {
            Supplier,
            Item,
            Currency,
            Price,
            Status
        };

        const itemRequestData = JSON.parse(JSON.stringify(dataToSave));
        try {
            if (this.state.editing) {
                await updateListItem(this.props.context, listNames.items, id, itemRequestData);
                toast.success('Item updated successfully!');
            } else {
                await createListItem(this.props.context, listNames.items, dataToSave);
                toast.success('Item submitted successfully!');
            }
            this.setState({
                formData: { id: 0, Supplier: '', Item: '', Currency: '', Price: 0, Status: 'Active' },
                editing: false
            });
            await this.fetchItems();
        } catch (error) {
            toast.error('Failed to submit Item.', error);
        }
    };

    render() {
        return (
            <div>
                <NewItemForm
                    context={this.props.context}
                    formData={this.state.formData}
                    editing={this.state.editing}
                    supplierOptions={this.state.supplierOptions} 
                    onItemSubmit={this.handleFormSubmit}
                />
                <hr />
                <ItemsTable
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
