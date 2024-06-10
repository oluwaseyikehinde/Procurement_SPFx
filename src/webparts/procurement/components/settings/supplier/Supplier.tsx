import * as React from 'react';
import { IWebPartProps } from "../../IProcurementProps";
import { NewSupplierForm } from './NewSupplierForm';
import { SuppliersTable } from './ViewSupplier';


export class Supplier extends React.Component<IWebPartProps, {}> {
    constructor(props: IWebPartProps) {
        super(props);
    }

    render() {

        return (
            <div>
                <NewSupplierForm context={this.props.context} />
                <hr />
                <SuppliersTable context={this.props.context} />
            </div>
        );
    }
}
