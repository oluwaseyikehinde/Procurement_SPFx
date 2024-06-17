import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import styles from '../../Procurement.module.scss';
import { INewApproverFormFields } from './IApproverFields';
import { IWebPartProps } from "../../IProcurementProps";
import toast from 'react-hot-toast';
import { PeoplePicker, PrincipalType, IPeoplePickerContext } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface RoleOption {
    ID: number;
    Role: string;
}

interface NewApproverFormProps extends IWebPartProps {
    formData: INewApproverFormFields & { id: number };
    roleOptions: RoleOption[];
    editing: boolean;
    onApproverSubmit: (formData: INewApproverFormFields & { id: number }) => void;
    context: WebPartContext;
}

interface NewApproverFormState {
    formData: INewApproverFormFields & { id: number };
    selectedPeople: any[];
    isFormValid: boolean;
}

export class NewApproverForm extends React.Component<NewApproverFormProps, NewApproverFormState> {
    constructor(props: NewApproverFormProps) {
        super(props);
        this.state = {
            formData: this.props.formData,
            selectedPeople: this.props.formData.Personnel ? [{ text: this.props.formData.Personnel, secondaryText: this.props.formData.Email }] : [],
            isFormValid: this.isFormValid(this.props.formData)
        };
    }

    componentDidUpdate(prevProps: NewApproverFormProps) {
        if (prevProps.formData !== this.props.formData) {
            this.setState({
                formData: this.props.formData,
                selectedPeople: this.props.formData.Personnel ? [{ text: this.props.formData.Personnel, secondaryText: this.props.formData.Email }] : [],
                isFormValid: this.isFormValid(this.props.formData)
            });
        }
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        this.setState(prevState => {
            const updatedFormData = {
                ...prevState.formData,
                [name]: value
            };
            return {
                formData: updatedFormData,
                isFormValid: this.isFormValid(updatedFormData)
            };
        });
    };

    handlePeoplePickerChange = (items: any[]) => {
        if (items.length > 0) {
            const selectedUser = items[0];
            this.setState(prevState => {
                const updatedFormData = {
                    ...prevState.formData,
                    Personnel: selectedUser.text || '',
                    Email: selectedUser.secondaryText || ''
                };
                return {
                    formData: updatedFormData,
                    selectedPeople: items,
                    isFormValid: this.isFormValid(updatedFormData)
                };
            });
        } else {
            this.setState(prevState => {
                const updatedFormData = {
                    ...prevState.formData,
                    Personnel: '',
                    Email: ''
                };
                return {
                    formData: updatedFormData,
                    selectedPeople: [],
                    isFormValid: this.isFormValid(updatedFormData)
                };
            });
        }
    };

    isFormValid = (formData: INewApproverFormFields) => {
        const { Personnel, Role, Level, Email, Status } = formData;
        return Personnel !== '' && Role !== '' && Level !== 0 && Email !== '' && Status !== '';
    };

    handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (this.state.isFormValid) {
            try {
                this.props.onApproverSubmit(this.state.formData);
                this.setState({
                    formData: {
                        id: 0,
                        Personnel: '',
                        Role: '',
                        Level: 0,
                        Email: '',
                        Status: ''
                    },
                    selectedPeople: [],
                    isFormValid: false
                });
                toast.success('Approver submitted successfully!');
            } catch (error) {
                toast.error('Failed to submit Approver.', error);
            }
        } else {
            toast.error('Please fill in all required fields.');
        }
    };

    render() {
        const { Role, Level, Status } = this.state.formData;

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
                                    {this.props.roleOptions.map(option => (
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
                            {this.props.editing && (
                                <div className={styles.customCol}>
                                    <label>Status <span className={styles.labeltag}>. . . . . . . . . . . </span></label>
                                    <select className={styles.formcontrol} name="Status" value={Status} onChange={this.handleInputChange}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            )}
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
                                    defaultSelectedUsers={this.state.selectedPeople.map(person => person.secondaryText)}
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
                            <button type="submit" disabled={!this.state.isFormValid}>
                                {this.props.editing ? 'Update' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
