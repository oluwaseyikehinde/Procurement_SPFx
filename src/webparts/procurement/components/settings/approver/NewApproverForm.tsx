import * as React from 'react';
import { createListItem, getListItems } from '../../utils/sp.utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import styles from '../../Procurement.module.scss';
import { INewApproverFormFields } from './IApproverFields';
import { IWebPartProps } from "../../IProcurementProps";
import toast from 'react-hot-toast';
import { listNames } from '../../utils/models.utils';
import { PeoplePicker, PrincipalType, IPeoplePickerContext } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface NewApproverFormState {
    formData: INewApproverFormFields;
    roleOptions: { ID: number; Role: string }[];
}

interface NewApproverFormProps extends IWebPartProps {
    context: WebPartContext;
}

export class NewApproverForm extends React.Component<NewApproverFormProps, NewApproverFormState> {
    constructor(props: NewApproverFormProps) {
        super(props);
        this.state = {
            formData: {
                Personnel: '',
                Role: '',
                Level: 0,
                Email: ''
            },
            roleOptions: []
        };
    }

    async componentDidMount() {
        try {
            // Fetch Role List
            const roles = await getListItems(this.props.context, listNames.roles);
            const roleOptions = roles.map((role: any) => ({ ID: role.ID, Role: role.Role }));

            this.setState({ roleOptions });

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

    handlePeoplePickerChange = (items: any[]) => {
        if (items.length > 0) {
            const selectedUser = items[0];
            this.setState(prevState => ({
                formData: {
                    ...prevState.formData,
                    Personnel: selectedUser.text,
                    Email: selectedUser.secondaryText || ''
                }
            }));
        } else {
            this.setState(prevState => ({
                formData: {
                    ...prevState.formData,
                    Personnel: '',
                    Email: ''
                }
            }));
        }
    };

    handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const itemRequestData = JSON.parse(JSON.stringify(this.state.formData));
            await createListItem(this.props.context, listNames.approvers, itemRequestData);
            this.setState({
                formData: {
                    Personnel: '',
                    Role: '',
                    Level: 0,
                    Email: ''
                }
            });
            toast.success('Approver submitted successfully!');
        } catch (error) {
            toast.error('Failed to submit Approver.', error);
        }
    };

    render() {
        const { Role, Level } = this.state.formData;

        const peoplePickerContext: IPeoplePickerContext = {
            absoluteUrl: this.props.context.pageContext.web.absoluteUrl,
            msGraphClientFactory: this.props.context.msGraphClientFactory,
            spHttpClient: this.props.context.spHttpClient
        };

        return (
            <div>
                <h6 className={styles.mainheader}>New Approver</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <form onSubmit={this.handleSubmit}>
                        <div className={styles.customRow}>
                            <div className={styles.customCol}>
                                <label>Role <span className={styles.labeltag}> . . . . . . . . . . . . . </span></label>
                                <select className={styles.formcontrol} name="Role" value={Role} onChange={this.handleInputChange}>
                                    <option value="">Select Role</option>
                                    {this.state.roleOptions.map(option => (
                                        <option key={option.ID} value={option.Role}>
                                            {option.Role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.customCol}>
                                <label>Level <span className={styles.labeltag}>. . . . . . . . . . . .</span></label>
                                <input className={styles.formcontrol} type="text" name="Level" value={Level} onChange={this.handleInputChange} />
                            </div>
                        </div>
                        <div className={styles.customRow}>
                            <div className={styles.customColWithPicker}>
                                <label>Personnel <span className={styles.labeltag}>. . . . . . . .  </span></label>
                                   <PeoplePicker
                                            context={peoplePickerContext}
                                            titleText=""
                                            groupName={""}
                                            personSelectionLimit={1}
                                            showtooltip={true}
                                            required={true}
                                            placeholder='Search Personnel'
                                            disabled={false}
                                            onChange={this.handlePeoplePickerChange}
                                            showHiddenInUI={false}
                                            principalTypes={[PrincipalType.User]}
                                            resolveDelay={1000}
                                            styles={{
                                                text: {
                                                    width: '115%',
                                                    height: '35px',
                                                    padding: '0px',
                                                    border: '1px solid #ccc',
                                                    background: '#fff',
                                                    borderRadius: '3px',
                                                    fontSize: '12px',
                                                    marginBottom: '20px',
                                                    marginLeft: '0px'
                                                }
                                            }}
                                        />
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
