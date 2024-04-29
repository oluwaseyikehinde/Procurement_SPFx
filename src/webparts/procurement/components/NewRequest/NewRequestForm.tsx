import * as React from 'react';
import { INewRequestFormFields } from './INewRequestFormFields';

interface NewRequestFormProps {
    onSubmit: (formData: INewRequestFormFields) => void;
}

interface NewRequestFormState {
    formData: INewRequestFormFields;
}

export class NewRequestForm extends React.Component<NewRequestFormProps, NewRequestFormState> {
    constructor(props: NewRequestFormProps) {
        super(props);
        this.state = {
            formData: {
                initiator: '',
                department: '',
                deliveryDate: new Date(),
                supplier: ''
            }
        };
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

    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.onSubmit(this.state.formData);
    };

    render() {
        const { initiator, department, deliveryDate, supplier } = this.state.formData;

        return (
            <div>
                <form onSubmit= { this.handleSubmit }>
                    <div>
                        <label>Initiator: </label>
                        <input type = "text" name = "initiator" value = { initiator } onChange = { this.handleInputChange } />
                    </div>
                    <div>
                        <label>Department: </label>
                        <input type = "text" name = "department" value = { department } onChange = { this.handleInputChange } />
                    </div>
                    <div>
                        <label>Delivery Date: </label>
                        <input type = "date" name = "deliveryDate" value = { deliveryDate.toISOString().split('T')[0] } onChange = { this.handleInputChange } />
                    </div>
                    <div>
                        <label>Supplier: </label>
                        <input type = "text" name = "supplier" value = { supplier } onChange = { this.handleInputChange } />
                    </div>
                        <button type = "submit" > Submit </button>
                </form>
            </div>
    );
    }
}
