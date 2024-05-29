import * as React from 'react';
import styles from '../../Procurement.module.scss';
import navstyles from '../../SideNavigation/SideNavigation.module.scss';
import { NewRoleForm } from './NewRoleForm';
import { RolesTable } from './ViewRole';
import { IWebPartProps } from "../../IProcurementProps";

interface RoleState {
    activeScreen: 'new' | 'view';
}

export class Role extends React.Component<IWebPartProps, RoleState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            activeScreen: 'view'
        };
    }

    toggleView = (activeScreen: 'new' | 'view') => {
        this.setState({ activeScreen });
    };

    render() {
        const { activeScreen } = this.state;

        return (
            <div className={styles.maincontainer}>
                <div className={navstyles.subnavcontainer}>
                    <button className={navstyles.subnav} onClick={() => this.toggleView('new')}>New</button>
                    <button className={navstyles.subnav} onClick={() => this.toggleView('view')}>View</button>
                </div>
                {activeScreen === 'new' ? <NewRoleForm context={this.props.context} /> : <RolesTable context={this.props.context} />}
            </div>
        );
    }
}
