import * as React from 'react';
import { NewApproverForm } from './NewApproverForm';
import { ApproversTable } from './ViewApprover';
import { IWebPartProps } from "../../IProcurementProps";


export class Approver extends React.Component<IWebPartProps, {}> {
    constructor(props: IWebPartProps) {
        super(props);
    }

    render() {

        return (
            <div>
                <NewApproverForm context={this.props.context} /> 
                <hr/>
                 <ApproversTable context={this.props.context} />
            </div>
        );
    }
}
