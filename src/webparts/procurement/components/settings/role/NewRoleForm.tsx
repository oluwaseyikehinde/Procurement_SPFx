import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import styles from '../../Procurement.module.scss';
import { INewRoleFormFields } from './IRoleFields';
import { IWebPartProps } from "../../IProcurementProps";


interface NewRoleFormProps extends IWebPartProps {
    formData: INewRoleFormFields & { id: number };
    editing: boolean;
    onRoleSubmit: (formData: INewRoleFormFields & { id: number }) => void;
}

interface NewRoleFormState {
    formData: INewRoleFormFields & { id: number };
}

export class NewRoleForm extends React.Component<NewRoleFormProps, NewRoleFormState> {
    constructor(props: NewRoleFormProps) {
        super(props);
        this.state = {
            formData: this.props.formData
        };
    }

    componentDidUpdate(prevProps: NewRoleFormProps) {
        if (prevProps.formData !== this.props.formData) {
            this.setState({ formData: this.props.formData });
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

    handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.onRoleSubmit(this.state.formData);
        this.setState({
            formData: {
                id: 0,
                Role: '',
                Description: '',
                Status: ''
            }
        });
    };


    render() {
        const { Role, Description, Status } = this.state.formData;

        return (
            <div>
                <h6 className={styles.mainheader}>{this.props.editing ? 'Edit Role' : 'New Role'}</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <form onSubmit={this.handleSubmit}>
                        <div className={styles.customRow}>
                            <div className={styles.customCol}>
                                <label>Role <span className={styles.labeltag}> . . . . . . . . . . . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="Role" value={Role} placeholder='Enter Role' onChange={this.handleInputChange} />
                            </div>
                            <div className={styles.customCol}>
                                <label>Description <span className={styles.labeltag}> . . . . . . . </span></label>
                                <input className={styles.formcontrol} type="text" name="Description" value={Description} placeholder='Enter Description' onChange={this.handleInputChange} />
                            </div>
                        </div>
                        {this.props.editing && (
                            <div className={styles.customRow}>
                                <div className={styles.customCol}>
                                    <label>Status <span className={styles.labeltag}>. . . . . . . . . . . . </span></label>
                                    <select className={styles.formcontrol} name="Status" value={Status} onChange={this.handleInputChange}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        )}-
                        <div className={styles.buttoncontainer}>
                            <button type="submit">{this.props.editing ? 'Update' : 'Submit'}</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}