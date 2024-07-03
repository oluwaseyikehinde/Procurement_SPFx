import * as React from 'react';
import { IWebPartProps } from "../../IProcurementProps";
import { NewAdminForm } from './NewAdminForm';
import { AdminsTable } from './ViewAdmin';
import { getListItems, createListItem, updateListItem, deleteListItem } from '../../utils/sp.utils';
import { listNames } from '../../utils/models.utils';
import toast from 'react-hot-toast';
import { INewAdminFormFields } from './IAdminFields';
import styles from '../../Procurement.module.scss';
import { Icon } from 'office-ui-fabric-react';

interface AdminState {
    records: (INewAdminFormFields & { id: number })[];
    loading: boolean;
    error: string | null;
    formData: INewAdminFormFields & { id: number };
    editing: boolean;
    showModal: boolean;
    itemToDelete: INewAdminFormFields & { id: number } | null;
    deleting: boolean;
}

export class Admin extends React.Component<IWebPartProps, AdminState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            records: [],
            loading: true,
            error: null,
            formData: {
                id: 0,
                Personnel: '',
                AdminRole: '',
                Email: ''
            },
            editing: false,
            showModal: false,
            itemToDelete: null,
            deleting: false
        };
    }

    async componentDidMount() {
        await this.fetchAdmins();
    }

    fetchAdmins = async () => {
        this.setState({ loading: true, error: null });
        try {
            const listItems = await getListItems(this.props.context, listNames.admin);
            const recordsWithId = listItems.map(item => ({ ...item, id: item.Id })); 
            this.setState({ records: recordsWithId, loading: false });
        } catch (error) {
            this.setState({ error: 'Failed to load records', loading: false });
            toast.error('Failed to retrieve your Admin request(s).', error);
        }
    };

    handleEdit = (item: INewAdminFormFields & { id: number }) => {
        this.setState({ formData: item, editing: true });
    };

    handleFormSubmit = async (formData: INewAdminFormFields & { id: number }) => {
        const { id, Personnel, AdminRole, Email } = formData;

        const dataToSave = {
            Personnel,
            AdminRole,
            Email
        };

        const itemRequestData = JSON.parse(JSON.stringify(dataToSave));
        try {
            if (this.state.editing) {
                await updateListItem(this.props.context, listNames.admin, id, itemRequestData);
                toast.success('Admin updated successfully!');
            } else {
                await createListItem(this.props.context, listNames.admin, dataToSave);
                toast.success('Admin submitted successfully!');
            }
            this.setState({
                formData: { id: 0, Personnel: '', AdminRole: '', Email: '' },
                editing: false
            });
            await this.fetchAdmins();
        } catch (error) {
            toast.error('Failed to submit Admin.', error);
        }
    };

    handleDelete = async (item: INewAdminFormFields & { id: number }) => {
        this.setState({ showModal: true, itemToDelete: item}); 
    };

    confirmDelete = async () => {
        this.setState({deleting: true});
        const { itemToDelete } = this.state;
        if (itemToDelete) {
            try {
                await deleteListItem(this.props.context, listNames.admin, itemToDelete.id);
                toast.success('Admin deleted successfully!');
                this.setState({ showModal: false, itemToDelete: null, deleting: false }); 
                await this.fetchAdmins();
            } catch (error) {
                toast.error('Failed to delete Admin.', error);
                this.setState({ showModal: false, itemToDelete: null, deleting: false }); 
            }
        }
    };

    closeModal = () => {
        this.setState({ showModal: false, itemToDelete: null, deleting: false }); 
    };

    render() {
        return (
            <div>
                <NewAdminForm
                    context={this.props.context}
                    formData={this.state.formData}
                    editing={this.state.editing}
                    onAdminSubmit={this.handleFormSubmit}
                />
                <hr />
                <AdminsTable
                    context={this.props.context}
                    records={this.state.records}
                    loading={this.state.loading}
                    error={this.state.error}
                    onEdit={this.handleEdit}
                    onDelete={this.handleDelete}
                />
                {this.state.showModal && (
                    <div className={styles.overlay}>
                        <div className={styles.deletemodal}>
                            <h4>Confirm Delete
                                <span>
                                    <Icon iconName="ErrorBadge" onClick={this.closeModal} className={styles.closeButton} />
                                </span>
                            </h4>
                            <p>Are you sure you want to delete {this.state.itemToDelete?.Personnel}?</p>
                            <div className={styles.buttoncontainer}>
                                {this.state.deleting ? (
                                    <button className={styles.submitingbutton} disabled>
                                        <div className={styles.loadingcontainer}>
                                            <div className={styles.loadingbar}></div>
                                        </div>
                                        Deleting...
                                    </button>
                                ) : (
                                    <button className={styles.buttondelete} onClick={this.confirmDelete}>
                                        <Icon iconName="Delete" className={styles.buttonicon} />
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}