import * as React from 'react';
//import { sp } from '@pnp/sp';
import { createListItem } from '../serviceOperation/ProcurementService'; // Import the create function
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import styles from '../Procurement.module.scss';
import { INewRequestFormFields } from './IRequestFields';

const LIST_NAME = 'Procurement List';

interface NewRequestFormState {
    formData: INewRequestFormFields;
}

export class NewRequestForm extends React.Component<{}, NewRequestFormState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            formData: {
                Initiator: '',
                Department: '',
                DeliveryDate: '',
                Supplier: ''
            }
        };
    }

    // async componentDidMount() {
    //     try {
    //         const currentUser: = await sp.web.currentUser.get();
    //         this.setState(prevState => ({
    //             formData: {
    //                 ...prevState.formData,
    //                 initiator: currentUser.Title,
    //                 department: currentUser.Department
    //             }
    //         }));
    //     } catch (error) {
    //         console.error('Error fetching current user information:', error);
    //     }
    // }

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
        try {
            await createListItem(LIST_NAME, this.state.formData);
            this.setState({
                formData: {
                    Initiator: '',
                    Department: '',
                    DeliveryDate: '',
                    Supplier: ''
                }
            });
            alert('Request submitted successfully!');
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Failed to submit request. Please try again later.');
        }
    };

    render() {
        const { Initiator, Department, DeliveryDate, Supplier } = this.state.formData;

        return (
            <div className={styles.maincontainer}>
                <h6 className={styles.mainheader}>New Request</h6>
                <hr />
                <div className={styles.sectioncontainer}>
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className='col'>
                                <label>Initiator <span className={styles.labeltag}>. . . . . . . . . . </span></label>
                                <input type="text" name="Initiator" value={Initiator} onChange={this.handleInputChange} />
                            </div>
                            <div className='col'>
                                <label>Department <span className={styles.labeltag}>. . . . . . </span></label>
                                <input type="text" name="Department" value={Department} onChange={this.handleInputChange} />
                            </div>
                        </div>
                        <div className="row">
                            <div className='col'>
                                <label>Delivery Date <span className={styles.labeltag}>. . . . . </span></label>
                                <input type="date" name="DeliveryDate" value={DeliveryDate} onChange={this.handleInputChange} />
                            </div>
                            <div className='col'>
                                <label>Supplier <span className={styles.labeltag}> . . . . . . . . . </span></label>
                                <input type="text" name="Supplier" value={Supplier} onChange={this.handleInputChange} />
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
