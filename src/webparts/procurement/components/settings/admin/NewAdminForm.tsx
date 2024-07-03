import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import styles from '../../Procurement.module.scss';
import { INewAdminFormFields } from './IAdminFields';
import { IWebPartProps } from "../../IProcurementProps";
import toast from 'react-hot-toast';
import { PeoplePicker, PrincipalType, IPeoplePickerContext } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Icon } from 'office-ui-fabric-react/lib/Icon';


interface NewAdminFormProps extends IWebPartProps {
    formData: INewAdminFormFields & { id: number };
    editing: boolean;
    onAdminSubmit: (formData: INewAdminFormFields & { id: number }) => void;
    context: WebPartContext;
}

interface NewAdminFormState {
    formData: INewAdminFormFields & { id: number };
    selectedPeople: any[];
    isFormValid: boolean;
    isSubmitting: boolean;
}

export class NewAdminForm extends React.Component<NewAdminFormProps, NewAdminFormState> {
    constructor(props: NewAdminFormProps) {
        super(props);
        this.state = {
            formData: this.props.formData,
            selectedPeople: this.props.formData.Personnel ? [{ text: this.props.formData.Personnel, secondaryText: this.props.formData.Email }] : [],
            isFormValid: this.isFormValid(this.props.formData),
            isSubmitting: false
        };
    }

    componentDidUpdate(prevProps: NewAdminFormProps) {
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

    isFormValid = (formData: INewAdminFormFields) => {
        const { Personnel, AdminRole, Email } = formData;
        return Personnel !== '' && AdminRole !== '' && Email !== '';
    };

    handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.setState({ isSubmitting: true });
        if (this.state.isFormValid) {
            await this.props.onAdminSubmit(this.state.formData);
            this.setState({
                formData: {
                    id: 0,
                    Personnel: '',
                    AdminRole: '',
                    Email: ''
                },
                selectedPeople: [],
                isFormValid: false,
                isSubmitting: false
            });
        } else {
            this.setState({ isSubmitting: false });
            toast.error('Please fill in all required fields.');
        }
    };

    render() {
        const { AdminRole } = this.state.formData;
        const { editing } = this.props;

        const peoplePickerContext: IPeoplePickerContext = {
            absoluteUrl: this.props.context.pageContext.web.absoluteUrl,
            msGraphClientFactory: this.props.context.msGraphClientFactory,
            spHttpClient: this.props.context.spHttpClient
        };

        return (
            <div>
                <h6 className={styles.mainheader}>New Admin</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <form onSubmit={this.handleSubmit}>
                        <div className={styles.customRow}>
                            <div className={styles.customColLeft}>
                                <label>Personnel <span className={styles.labeltag}>. . . . . . . .  </span></label>
                                <div className={styles.pickerContainer}>
                                    <input
                                        className={styles.hiddenInput}
                                        type="text"
                                        name="hiddenInput"
                                        disabled
                                    />
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
                                                width: '100%',
                                                height: '35px',
                                                padding: '0px',
                                                border: '0px solid #ccc',
                                                background: 'transpatent',
                                                borderRadius: '0px',
                                                fontSize: '12px',
                                                margin: '20px',
                                                gridColumn: '1',
                                                gridRow: '1'
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={styles.customColRight}>
                                <label>Role <span className={styles.labeltag}> . . . . . . . . . . . . . </span></label>
                                <select className={styles.formcontrol} name="AdminRole" value={AdminRole} onChange={this.handleInputChange}>
                                    <option value="">Select AdminRole</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.buttoncontainer}>
                            {!this.state.isSubmitting ? (
                                <button type="submit" disabled={!this.state.isFormValid}>
                                    <Icon iconName={editing ? "Sync" : "SkypeCircleCheck"} className={styles.buttonicon} />
                                    {editing ? 'Update' : 'Submit'}
                                </button>
                            ) : (
                                <button className={styles.submitingbutton} disabled>
                                    <div className={styles.loadingcontainer}>
                                        <div className={styles.loadingbar}></div>
                                    </div>
                                    {editing ? 'Updating...' : 'Submitting...'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
} 