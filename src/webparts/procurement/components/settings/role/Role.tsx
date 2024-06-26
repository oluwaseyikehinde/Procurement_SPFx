import * as React from 'react';
import { IWebPartProps } from "../../IProcurementProps";
import { NewRoleForm } from './NewRoleForm';
import { RolesTable } from './ViewRole';
import { getListItems, createListItem, updateListItem } from '../../utils/sp.utils';
import { listNames } from '../../utils/models.utils';
import toast from 'react-hot-toast';
import { INewRoleFormFields } from './IRoleFields';

interface RoleState {
    records: (INewRoleFormFields & { id: number })[];
    loading: boolean;
    error: string | null;
    formData: INewRoleFormFields & { id: number };
    editing: boolean;
}

export class Role extends React.Component<IWebPartProps, RoleState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            records: [],
            loading: true,
            error: null,
            formData: {
                id: 0,
                Role: '',
                Description: '',
                Status: 'Active'
            },
            editing: false
        };
    }

    async componentDidMount() {
        await this.fetchRoles();
    }

    fetchRoles = async () => {
        this.setState({ loading: true, error: null });
        try {
            const listItems = await getListItems(this.props.context, listNames.roles);
           const recordsWithId = listItems.map(item => ({ ...item, id: item.Id })); 
            this.setState({ records: recordsWithId, loading: false });
        } catch (error) {
            this.setState({ error: 'Failed to load records', loading: false });
            toast.error('Failed to retrieve your Role request(s).', error);
        }
    };

    handleEdit = (item: INewRoleFormFields & { id: number }) => {
        this.setState({ formData: item, editing: true });
    };

    handleFormSubmit = async (formData: INewRoleFormFields & { id: number }) => {
        const { id, Role, Description, Status } = formData;

        const dataToSave = {
            Role,
            Description,
            Status
        };
        try {
            if (this.state.editing) {
                await updateListItem(this.props.context, listNames.roles, id, dataToSave);
                toast.success('Role updated successfully!');
            } else {
                await createListItem(this.props.context, listNames.roles, dataToSave);
                toast.success('Role submitted successfully!');
            }
            this.setState({
                formData: { id: 0, Role: '', Description: '', Status: 'Active' },
                editing: false
            });
            await this.fetchRoles();
        } catch (error) {
            toast.error('Failed to submit Role.', error);
        }
    };

    render() {
        return (
            <div>
                <NewRoleForm
                    context={this.props.context}
                    formData={this.state.formData}
                    editing={this.state.editing}
                    onRoleSubmit={this.handleFormSubmit}
                />
                <hr />
                <RolesTable
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
