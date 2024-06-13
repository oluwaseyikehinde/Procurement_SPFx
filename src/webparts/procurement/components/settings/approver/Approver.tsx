import * as React from 'react';
import { IWebPartProps } from "../../IProcurementProps";
import { NewApproverForm } from './NewApproverForm';
import { ApproversTable } from './ViewApprover';
import { getListItems, createListItem, updateListItem } from '../../utils/sp.utils';
import { listNames } from '../../utils/models.utils';
import toast from 'react-hot-toast';
import { INewApproverFormFields } from './IApproverFields';

interface ApproverState {
    records: (INewApproverFormFields & { id: number })[];
    loading: boolean;
    error: string | null;
    formData: INewApproverFormFields & { id: number };
    roleOptions: { ID: number; Role: string }[];
    editing: boolean;
}

export class Approver extends React.Component<IWebPartProps, ApproverState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            records: [],
            loading: true,
            error: null,
            formData: {
                id: 0,
                Personnel: '',
                Role: '',
                Level: 0,
                Email: '',
                Status: 'Active'
            },
            roleOptions: [],
            editing: false
        };
    }

    async componentDidMount() {
        await this.fetchApprovers();
    }

    fetchApprovers = async () => {
        this.setState({ loading: true, error: null });
        try {
            // Fetch Role List
            const roles = await getListItems(this.props.context, listNames.roles);
            const activeRoles = roles.filter((role: any) => role.Status === 'Active');
            const roleOptions = activeRoles.map((role: any) => ({ ID: role.ID, Role: role.Role }));

            const listItems = await getListItems(this.props.context, listNames.approvers);
            const recordsWithId = listItems.map((item, index) => ({ ...item, id: index + 1 }));
            this.setState({ records: recordsWithId, loading: false, roleOptions });
        } catch (error) {
            this.setState({ error: 'Failed to load records', loading: false });
            toast.error('Failed to retrieve your Approver request(s).', error);
        }
    };

    handleEdit = (item: INewApproverFormFields & { id: number }) => {
        this.setState({ formData: item, editing: true });
    };

    handleFormSubmit = async (formData: INewApproverFormFields & { id: number }) => {
        const { id, Personnel, Role, Level, Email, Status } = formData;

        const dataToSave = {
            Personnel,
            Role,
            Level,
            Email,
            Status
        };

        const itemRequestData = JSON.parse(JSON.stringify(dataToSave));
        try {
            if (this.state.editing) {
                await updateListItem(this.props.context, listNames.approvers, id, itemRequestData);
                toast.success('Approver updated successfully!');
            } else {
                await createListItem(this.props.context, listNames.approvers, dataToSave);
                toast.success('Approver submitted successfully!');
            }
            this.setState({
                formData: { id: 0, Personnel: '', Role: '', Level: 0, Email: '', Status: 'Active' },
                editing: false
            });
            await this.fetchApprovers();
        } catch (error) {
            toast.error('Failed to submit Approver.', error);
        }
    };

    render() {
        return (
            <div>
                <NewApproverForm
                    context={this.props.context}
                    formData={this.state.formData}
                    editing={this.state.editing}
                    roleOptions={this.state.roleOptions}
                    onApproverSubmit={this.handleFormSubmit}
                />
                <hr />
                <ApproversTable
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
