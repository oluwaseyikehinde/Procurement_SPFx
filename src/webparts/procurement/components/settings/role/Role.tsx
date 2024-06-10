import * as React from 'react';
import { IWebPartProps } from "../../IProcurementProps";
import { NewRoleForm } from './NewRoleForm';
import { RolesTable } from './ViewRole';


export class Role extends React.Component<IWebPartProps, {}> {
    constructor(props: IWebPartProps) {
        super(props);
    }

    render() {

        return (
            <div>
                <NewRoleForm context={this.props.context} />
                <hr />
                <RolesTable context={this.props.context} />
            </div>
        );
    }
}
