import * as React from 'react';
import { IWebPartProps } from "../../IProcurementProps";
import { NewItemForm } from './NewItemForm';
import { ItemsTable } from './ViewItem';


export class Item extends React.Component<IWebPartProps, {}> {
    constructor(props: IWebPartProps) {
        super(props);
    }

    render() {

        return (
            <div>
                <NewItemForm context={this.props.context} />
                <hr />
                <ItemsTable context={this.props.context} />
            </div>
        );
    }
}
